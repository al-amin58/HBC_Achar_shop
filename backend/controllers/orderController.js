import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { incrementCouponUsage } from './backend/couponController.js';
import { formatCustomerOrder } from '../utils/orderFormatters.js';
import { notifyNewOrder } from '../utils/notificationHelper.js';

const makeOrderNumber = () => {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ACH-${y}${m}${day}-${rand}`;
};

const formatOrder = (order) => formatCustomerOrder(order);

const mapCartLine = (item) => {
  const price = Number(item.price) || 0;
  const qty = Number(item.qty) || 1;
  return {
    productId: String(item.productId),
    variationId: item.variationId || null,
    name: item.name,
    image: item.image || '',
    variationLabel: item.variationLabel || '',
    price,
    oldPrice: item.oldPrice ?? null,
    isFlashSale: Boolean(item.isFlashSale),
    qty,
    lineTotal: price * qty,
  };
};

/** POST /api/orders */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      buyNow = false,
      items: bodyItems = [],
      customer,
      paymentMethod = 'cod',
      orderNote = '',
      couponCode = '',
      discount = 0,
      deliveryCharge = 85,
      walletUsed = 0,
      coinDiscount = 0,
      monthlySubscription = false,
      isLandingPage = false,
      transactionId = '',
    } = req.body;

    if (!customer?.fullName || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: 'Customer name, phone and address are required' });
    }

    let orderItems = [];
    let monthlyFlag = Boolean(monthlySubscription);

    if (buyNow && Array.isArray(bodyItems) && bodyItems.length > 0) {
      orderItems = bodyItems.map((it) => {
        const price = Number(it.price) || 0;
        const qty = Number(it.qty) || 1;
        return {
          productId: String(it.productId || it.id || ''),
          variationId: it.variationId || null,
          name: it.name || 'Product',
          image: it.image || '',
          variationLabel: it.variation || it.variationLabel || '',
          price,
          oldPrice: it.oldPrice ?? null,
          isFlashSale: Boolean(it.isFlashSale),
          qty,
          lineTotal: price * qty,
        };
      });
    } else {
      const cart = await Cart.findOne({ user: userId });
      if (!cart?.items?.length) {
        return res.status(400).json({ message: 'Your cart is empty' });
      }
      orderItems = cart.items.map(mapCartLine);
      monthlyFlag = Boolean(monthlySubscription || cart.monthlySubscription);
    }

    const subtotal = orderItems.reduce((s, i) => s + i.lineTotal, 0);
    const disc = Math.max(0, Number(discount) || 0);
    const delivery = Math.max(0, Number(deliveryCharge) || 0);
    const wallet = Math.max(0, Number(walletUsed) || 0);
    const coins = Math.max(0, Number(coinDiscount) || 0);
    const total = Math.max(0, subtotal + delivery - disc - wallet - coins);
    const isFlashSale = orderItems.some((i) => i.isFlashSale);
    const userDoc = await User.findById(userId).select('totalOrders totalSpend').lean();

    const fullAddress = [
      customer.address,
      customer.thana,
      customer.district,
      customer.division,
    ]
      .filter(Boolean)
      .join(', ');

    const order = await Order.create({
      user: userId,
      orderNumber: makeOrderNumber(),
      items: orderItems,
      customer: {
        fullName: String(customer.fullName).trim(),
        phone: String(customer.phone).trim(),
        email: customer.email ? String(customer.email).trim() : '',
        division: customer.division || '',
        district: customer.district || '',
        thana: customer.thana || '',
        address: String(customer.address).trim(),
      },
      shipping: {
        fullAddress,
        deliveryCharge: delivery,
      },
      pricing: {
        subtotal,
        discount: disc,
        couponCode: couponCode || '',
        deliveryCharge: delivery,
        walletUsed: wallet,
        coinDiscount: coins,
        total,
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'paid',
        paid: paymentMethod === 'cod' ? 0 : total,
        due: paymentMethod === 'cod' ? total : 0,
      },
      delivery: {
        status: 'pending',
        courier: '',
        trackingId: '',
      },
      source: {
        isFlashSale,
        isLandingPage: Boolean(isLandingPage),
      },
      tags: {
        isVIP: (userDoc?.totalSpend || 0) >= 5000,
        isRepeat: (userDoc?.totalOrders || 0) >= 1,
      },
      fraud: {
        score: paymentMethod === 'cod' && total > 3000 ? 25 : 10,
        isFraudulent: false,
        ipAddress: req.ip || '',
        device: req.headers['user-agent'] || '',
      },
      adminNote: '',
      transactionId: transactionId || '',
      statusHistory: [
        {
          orderStatus: 'pending',
          deliveryStatus: 'pending',
          note: 'Order placed',
          at: new Date(),
        },
      ],
      monthlySubscription: monthlyFlag,
      orderNote: orderNote || '',
      status: 'pending',
    });

    if (!buyNow) {
      await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [], monthlySubscription: false } }
      );
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { totalOrders: 1, totalSpend: total },
    });

    if (couponCode) {
      await incrementCouponUsage(couponCode);
    }

    // Trigger notification for new order
    await notifyNewOrder({
      _id: order._id,
      orderId: order.orderNumber,
      totalAmount: order.pricing.total,
      customerName: order.customer.fullName
    });

    return res.status(201).json(formatOrder(order));
  } catch (error) {
    console.error('createOrder error:', error);
    if (error.code === 11000) {
      return res.status(500).json({ message: 'Order number conflict, please try again' });
    }
    return res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

/** GET /api/orders/my */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(orders.map(formatOrder));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load orders' });
  }
};

/** PATCH /api/orders/:id/cancel */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const cancellable = ['pending', 'confirmed', 'processing'];
    if (!cancellable.includes(order.status)) {
      return res.status(400).json({
        message: 'এই অর্ডারটি আর বাতিল করা যাবে না',
      });
    }

    order.status = 'cancelled';
    if (order.payment) {
      order.payment.status = 'cancelled';
    }
    await order.save();

    return res.json(formatOrder(order.toObject()));
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to cancel order' });
  }
};

/** GET /api/orders/:id */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(formatOrder(order));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load order' });
  }
};
