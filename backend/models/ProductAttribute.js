import mongoose from "mongoose";

const productAttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120,
    },
    values: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const ProductAttribute = mongoose.model("ProductAttribute", productAttributeSchema);

export default ProductAttribute;
