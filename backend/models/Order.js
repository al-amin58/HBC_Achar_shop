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
      method: { type: String, default: 'cod' },
      status: { type: String, default: 'pending' },
      paid: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
    },
    monthlySubscription: { type: Boolean, default: false },
    orderNote: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
