import mongoose from "mongoose";

const landingRequestSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    products: { type: Number, default: 0, min: 0 },
    template: { type: String, default: "Grid", trim: true, maxlength: 80 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Published", "Under Review", "Rejected"],
      default: "Pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

const LandingRequest = mongoose.model("LandingRequest", landingRequestSchema);

export default LandingRequest;

