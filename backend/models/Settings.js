import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: "default",
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    featuredProducts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    newArrivals: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    bestSelling: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    webConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        heroSlides: [],
        campaignBanner: {
          title: "",
          subtitle: "",
          emoji: "🎉",
          link: "",
          linkText: "",
          isActive: false,
        },
        ads: [],
      }),
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
