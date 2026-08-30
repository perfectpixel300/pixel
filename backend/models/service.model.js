const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: [140, "Title cannot exceed 140 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short summary is required"],
      maxlength: [300, "Short description cannot exceed 300 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Detailed service description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Service price in NRs is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"],
    },
    costPrice: {
      type: Number,
      default: 0,
      min: [0, "Cost price cannot be negative"],
    },
    priceType: {
      type: String,
      enum: ["starting_at", "fixed", "hourly", "custom_quote"],
      default: "starting_at",
    },
    currency: {
      type: String,
      default: "NRs.",
    },
    deliveryTime: {
      type: String,
      trim: true,
      default: "1-2 Weeks",
    },
    icon: {
      type: String,
      trim: true,
      default: "Code",
    },
    bannerImage: {
      type: String,
      trim: true,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    isWebDevPackage: {
      type: Boolean,
      default: false,
      index: true,
    },
    packageTier: {
      type: String,
      enum: ["starter", "professional", "enterprise", "none"],
      default: "none",
    },
    tierBadge: {
      type: String,
      trim: true,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

serviceSchema.index({ title: "text", shortDescription: "text", description: "text" });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
