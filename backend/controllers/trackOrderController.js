import Order from '../models/Order.js';
import { phonesMatch } from '../utils/phoneHelper.js';
import { mapOrderToTrackView } from '../utils/trackOrderFormatter.js';
import { refreshCourierStatus } from '../services/couriers/courierDispatcher.js';

/** POST /api/track/search */
export const searchTrackOrder = async (req, res) => {
  try {
    const orderNumber = String(req.body.orderNumber || req.body.orderId || '').trim();
    const phone = String(req.body.phone || '').trim();

    if (!orderNumber && !phone) {
      return res.status(400).json({ message: 'Order ID or phone number is required' });
    }

    let order = null;

    if (orderNumber) {
      order = await Order.findOne({
        orderNumber: new RegExp(`^${orderNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      });
    }

    if (!order && phone) {
      const digits = phone.replace(/\D/g, '');
      const pattern = digits.length >= 10 ? digits.slice(-10) : digits;
      order = await Order.findOne({
        'customer.phone': new RegExp(`${pattern}$`),
      }).sort({ createdAt: -1 });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found. Check Order ID and phone number.' });
    }

    if (phone && !phonesMatch(phone, order.customer?.phone)) {
      return res.status(403).json({
        message: 'Phone number does not match this order. Please use the phone used at checkout.',
      });
    }

    // Refresh live courier status when available
    if (order.delivery?.courierSlug || order.delivery?.trackingCode || order.delivery?.trackingId) {
      try {
        const live = await refreshCourierStatus(order);
        if (live) {
          order.delivery.courierStatus = live.courierStatus;
          order.delivery.lastSyncedAt = new Date();
          if (live.orderStatus) order.status = live.orderStatus;
          if (live.deliveryStatus) order.delivery.status = live.deliveryStatus;
          order.statusHistory = order.statusHistory || [];
          order.statusHistory.push({
            orderStatus: order.status,
            deliveryStatus: order.delivery.status,
            note: `Courier live status: ${live.courierStatus}`,
            at: new Date(),
          });
          await order.save();
        }
      } catch (syncErr) {
        console.warn('Courier status sync skipped:', syncErr.message);
      }
    }

    return res.json({ order: mapOrderToTrackView(order.toObject()) });
  } catch (error) {
    console.error('searchTrackOrder error:', error);
    return res.status(500).json({ message: error.message || 'Failed to track order' });
  }
};
