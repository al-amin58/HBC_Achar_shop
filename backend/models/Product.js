import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    variant: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ["active", "flash", "outstock", "draft"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    seoTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
    seoDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

productSchema.index({ sku: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
