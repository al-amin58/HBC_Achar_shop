import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number },
    minOrderAmount: { type: Number, default: 0 },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
