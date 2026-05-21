import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: '' },
    variationId: { type: String, default: null },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    variationLabel: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    isFlashSale: { type: Boolean, default: false },
    qty: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    orderStatus: { type: String, default: 'pending' },
    deliveryStatus: { type: String, default: 'pending' },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderNumber: { type: String, required: true, unique: true, trim: true },
    items: { type: [orderItemSchema], default: [] },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      division: { type: String, default: '' },
      district: { type: String, default: '' },
      thana: { type: String, default: '' },
      address: { type: String, required: true },
    },
    shipping: {
      fullAddress: { type: String, default: '' },
      deliveryCharge: { type: Number, default: 0 },
    },
    pricing: {
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      couponCode: { type: String, default: '' },
      deliveryCharge: { type: Number, default: 0 },
      walletUsed: { type: Number, default: 0 },
      coinDiscount: { type: Number, default: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    payment: {
      method: {
        type: String,
        enum: ['cod', 'bkash', 'nagad', 'wallet', 'card'],
        default: 'cod',
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
        default: 'pending',
      },
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
    },
    delivery: {
      status: {
        type: String,
        enum: [
          'pending',
          'confirmed',
          'processing',
          'ready_for_pickup',
          'in_transit',
          'delivered',
          'cancelled',
          'returned',
        ],
        default: 'pending',
      },
      courier: { type: String, default: '' },
      courierSlug: { type: String, default: '' },
      trackingId: { type: String, default: '' },
      trackingCode: { type: String, default: '' },
      consignmentId: { type: Number, default: null },
      courierStatus: { type: String, default: '' },
      assignedAt: { type: Date, default: null },
      lastSyncedAt: { type: Date, default: null },
      smsSent: { type: Boolean, default: false },
      smsMessage: { type: String, default: '' },
      smsSentAt: { type: Date, default: null },
    },
    source: {
      isFlashSale: { type: Boolean, default: false },
      isLandingPage: { type: Boolean, default: false },
    },
    tags: {
      isVIP: { type: Boolean, default: false },
      isRepeat: { type: Boolean, default: false },
    },
    fraud: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      isFraudulent: { type: Boolean, default: false },
      ipAddress: { type: String, default: '' },
      device: { type: String, default: '' },
    },
    adminNote: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    statusHistory: { type: [statusHistorySchema], default: [] },
    monthlySubscription: { type: Boolean, default: false },
    orderNote: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'pending',
    },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 'text', 'customer.fullName': 'text', 'customer.phone': 'text' });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'delivery.status': 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'customer.district': 1 });

export default mongoose.model('Order', orderSchema);
