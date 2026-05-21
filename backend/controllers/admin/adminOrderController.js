import Order from '../../models/Order.js';
import User from '../../models/User.js';
import {
  formatAdminOrder,
  normalizeDeliveryStatus,
  normalizeOrderStatus,
  normalizePaymentStatus,
} from '../../utils/orderFormatters.js';
import { dispatchOrderToCourier, resolveCourierSlug } from '../../services/couriers/courierDispatcher.js';
import { sendOrderTrackingSms } from '../../services/smsService.js';

const pushStatusHistory = (order, note = '') => {
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({
    orderStatus: order.status,
    deliveryStatus: order.delivery?.status || 'pending',
    note,
    at: new Date(),
  });
};

const syncDeliveryWithOrderStatus = (order) => {
  const map = {
    pending: 'pending',
    confirmed: 'confirmed',
    processing: 'processing',
    packed: 'ready_for_pickup',
    shipped: 'in_transit',
    delivered: 'delivered',
    cancelled: 'cancelled',
    returned: 'returned',
  };
  if (order.delivery) {
    order.delivery.status = map[order.status] || order.delivery.status;
  }
};

const computeFraudScore = (order, user) => {
  let score = 0;
  const total = order.pricing?.total || 0;

  if (order.payment?.method === 'cod' && total > 3000) score += 25;
  if (!user || user.totalOrders <= 1) score += 15;
  if (order.fraud?.isFraudulent) score = Math.max(score, 80);
  return Math.min(100, score);
};

const loadUsersMap = async (orders) => {
  const userIds = [...new Set(orders.map((o) => String(o.user)).filter(Boolean))];
  const users = await User.find({ _id: { $in: userIds } })
    .select('image totalOrders totalSpend')
    .lean();
  return new Map(users.map((u) => [String(u._id), u]));
};

const buildFilterQuery = (query) => {
  const filter = {};

  if (query.search) {
    const term = String(query.search).trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { orderNumber: regex },
      { 'customer.fullName': regex },
      { 'customer.phone': regex },
    ];
  }

  if (query.orderId) {
    filter.orderNumber = new RegExp(
      String(query.orderId).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    );
  }

  if (query.phone) {
    filter['customer.phone'] = new RegExp(
      String(query.phone).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
  }

  if (query.status && query.status !== 'All Status') {
    filter.status = normalizeOrderStatus(query.status);
  }

  if (query.deliveryStatus && query.deliveryStatus !== 'All Delivery') {
    filter['delivery.status'] = normalizeDeliveryStatus(query.deliveryStatus);
  }

  if (query.paymentStatus && query.paymentStatus !== 'All Payment') {
    filter['payment.status'] = normalizePaymentStatus(query.paymentStatus);
  }

  if (query.paymentMethod && query.paymentMethod !== 'All Methods') {
    const methodMap = {
      COD: 'cod',
      bKash: 'bkash',
      Nagad: 'nagad',
      Wallet: 'wallet',
      Card: 'card',
    };
    filter['payment.method'] = methodMap[query.paymentMethod] || query.paymentMethod.toLowerCase();
  }

  if (query.district && query.district !== 'All Districts') {
    filter['customer.district'] = String(query.district).trim();
  }

  if (query.flashSale === 'yes') filter['source.isFlashSale'] = true;
  if (query.flashSale === 'no') filter['source.isFlashSale'] = false;

  if (query.landingPage === 'yes') filter['source.isLandingPage'] = true;
  if (query.landingPage === 'no') filter['source.isLandingPage'] = false;

  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) {
      const end = new Date(query.dateTo);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  return filter;
};

/** GET /api/admin/orders */
export const getAdminOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = buildFilterQuery(req.query);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    const usersMap = await loadUsersMap(orders);

    return res.json({
      orders: orders.map((o) => formatAdminOrder(o, usersMap.get(String(o.user)))),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('getAdminOrders error:', error);
    return res.status(500).json({ message: 'Failed to load orders' });
  }
};

/** GET /api/admin/orders/:id */
export const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const user = await User.findById(order.user)
      .select('image totalOrders totalSpend')
      .lean();

    return res.json({ order: formatAdminOrder(order, user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load order' });
  }
};

/** PATCH /api/admin/orders/:id */
export const updateAdminOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const {
      orderStatus,
      deliveryStatus,
      paymentStatus,
      adminNote,
      courier,
      trackingId,
      transactionId,
    } = req.body;

    let changed = false;

    if (orderStatus) {
      order.status = normalizeOrderStatus(orderStatus);
      syncDeliveryWithOrderStatus(order);
      changed = true;
    }

    if (deliveryStatus && order.delivery) {
      order.delivery.status = normalizeDeliveryStatus(deliveryStatus);
      changed = true;
    }

    if (paymentStatus && order.payment) {
      order.payment.status = normalizePaymentStatus(paymentStatus);
      changed = true;
    }

    if (adminNote !== undefined) {
      order.adminNote = String(adminNote);
    }

    if (courier !== undefined && order.delivery) {
      order.delivery.courier = String(courier);
    }

    if (trackingId !== undefined && order.delivery) {
      order.delivery.trackingId = String(trackingId);
    }

    if (transactionId !== undefined) {
      order.transactionId = String(transactionId);
    }

    if (changed) {
      pushStatusHistory(order, 'Order updated by admin');
    }

    const user = await User.findById(order.user)
      .select('image totalOrders totalSpend')
      .lean();
    order.fraud.score = computeFraudScore(order, user);

    await order.save();

    return res.json({
      message: 'Order updated successfully',
      order: formatAdminOrder(order.toObject(), user),
    });
  } catch (error) {
    console.error('updateAdminOrder error:', error);
    return res.status(500).json({ message: error.message || 'Failed to update order' });
  }
};

/** PATCH /api/admin/orders/bulk/status */
export const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds = [], status } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: 'orderIds array is required' });
    }
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const normalized = normalizeOrderStatus(status);
    const orders = await Order.find({ _id: { $in: orderIds } });

    for (const order of orders) {
      order.status = normalized;
      syncDeliveryWithOrderStatus(order);
      pushStatusHistory(order, `Bulk status → ${normalized}`);
      await order.save();
    }

    return res.json({
      message: `${orders.length} order(s) updated`,
      updated: orders.length,
    });
  } catch (error) {
    console.error('bulkUpdateOrderStatus error:', error);
    return res.status(500).json({ message: error.message || 'Bulk update failed' });
  }
};

/** DELETE /api/admin/orders/bulk */
export const bulkDeleteOrders = async (req, res) => {
  try {
    const { orderIds = [] } = req.body;
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: 'orderIds array is required' });
    }

    const result = await Order.deleteMany({ _id: { $in: orderIds } });
    return res.json({
      message: `${result.deletedCount} order(s) deleted`,
      deleted: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Bulk delete failed' });
  }
};

/** DELETE /api/admin/orders/:id */
export const deleteAdminOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete order' });
  }
};

/** POST /api/admin/orders/:id/courier */
export const assignCourier = async (req, res) => {
  try {
    const { courier, courierSlug, trackingId } = req.body;
    if (!courier && !courierSlug) {
      return res.status(400).json({ message: 'courier is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const slug = courierSlug || resolveCourierSlug(courier);

    // Call courier company API (Steadfast, etc.)
    const dispatch = await dispatchOrderToCourier(order.toObject(), slug);

    order.delivery = order.delivery || {};
    order.delivery.courier = dispatch.courierName || String(courier);
    order.delivery.courierSlug = dispatch.courierSlug;
    order.delivery.consignmentId = dispatch.consignmentId;
    order.delivery.trackingCode = dispatch.trackingCode;
    order.delivery.trackingId = trackingId || dispatch.trackingId || dispatch.trackingCode;
    order.delivery.courierStatus = dispatch.courierStatus;
    order.delivery.assignedAt = new Date();
    order.delivery.lastSyncedAt = new Date();
    order.status = dispatch.orderStatus || 'shipped';
    order.delivery.status = dispatch.deliveryStatus || 'in_transit';

    pushStatusHistory(
      order,
      `Courier booked via API: ${dispatch.courierName} — Tracking ${order.delivery.trackingId}`
    );

    // Send tracking SMS to customer phone
    let smsInfo = { sent: false };
    try {
      smsInfo = await sendOrderTrackingSms(
        order.toObject(),
        order.delivery.trackingId,
        dispatch.courierName
      );
      order.delivery.smsSent = true;
      order.delivery.smsMessage = smsInfo.message;
      order.delivery.smsSentAt = new Date();
    } catch (smsErr) {
      console.warn('Tracking SMS failed:', smsErr.message);
      order.delivery.smsSent = false;
      order.delivery.smsMessage = smsErr.message;
    }

    await order.save();

    const user = await User.findById(order.user)
      .select('image totalOrders totalSpend')
      .lean();

    return res.json({
      message: smsInfo.sent
        ? `Courier booked. Tracking SMS sent to ${order.customer?.phone}`
        : `Courier booked. Tracking ID: ${order.delivery.trackingId}`,
      order: formatAdminOrder(order.toObject(), user),
      courier: {
        trackingId: order.delivery.trackingId,
        trackingCode: order.delivery.trackingCode,
        consignmentId: order.delivery.consignmentId,
        courierStatus: order.delivery.courierStatus,
        smsSent: order.delivery.smsSent,
      },
    });
  } catch (error) {
    console.error('assignCourier error:', error);
    return res.status(500).json({ message: error.message || 'Failed to assign courier' });
  }
};

/** POST /api/admin/orders/:id/fraud */
export const updateFraudStatus = async (req, res) => {
  try {
    const { action } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.fraud = order.fraud || {};

    if (action === 'flag') {
      order.fraud.isFraudulent = true;
      order.fraud.score = Math.max(order.fraud.score || 0, 85);
    } else if (action === 'clear') {
      order.fraud.isFraudulent = false;
      order.fraud.score = Math.min(order.fraud.score || 0, 20);
    } else {
      return res.status(400).json({ message: 'action must be "flag" or "clear"' });
    }

    await order.save();

    const user = await User.findById(order.user)
      .select('image totalOrders totalSpend')
      .lean();

    return res.json({
      message: action === 'flag' ? 'Order flagged as fraudulent' : 'Fraud flag cleared',
      order: formatAdminOrder(order.toObject(), user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to update fraud status' });
  }
};

/** POST /api/admin/orders/:id/sms */
export const sendOrderSms = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Stub — integrate SMS gateway (SSL Wireless, etc.) when ready
    return res.json({
      message: `SMS queued for ${order.customer?.phone}`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to send SMS' });
  }
};

/** GET /api/admin/orders/meta/districts */
export const getOrderDistricts = async (req, res) => {
  try {
    const districts = await Order.distinct('customer.district', {
      'customer.district': { $ne: '' },
    });
    return res.json({ districts: districts.filter(Boolean).sort() });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load districts' });
  }
};
