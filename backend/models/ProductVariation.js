import mongoose from "mongoose";

const combinationItemSchema = new mongoose.Schema(
  {
    attributeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductAttribute",
      required: true,
    },
    attributeName: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const productVariationSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    combination: {
      type: [combinationItemSchema],
      required: true,
      validate: [(c) => Array.isArray(c) && c.length > 0, "Combination cannot be empty."],
    },
    price: { type: String, default: "" },
    discountPrice: { type: String, default: "" },
    stock: { type: String, default: "" },
    flashSale: { type: Boolean, default: false },
    cashback: { type: String, default: "" },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

productVariationSchema.index({ sku: 1 }, { unique: true });

const ProductVariation = mongoose.model("ProductVariation", productVariationSchema);

export default ProductVariation;
