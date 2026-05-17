import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, trim: true },
    variationId: { type: String, default: null, trim: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    variationLabel: { type: String, default: '' },
    isFlashSale: { type: Boolean, default: false },
    qty: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: { type: [cartItemSchema], default: [] },
    monthlySubscription: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
