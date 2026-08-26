const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [240, "Subtitle cannot exceed 240 characters"],
      default: "",
    },
    badge: {
      type: String,
      trim: true,
      maxlength: [40, "Badge cannot exceed 40 characters"],
      default: "",
    },
    imageUrl: {
      type: String,
      required: [true, "Banner image URL is required"],
      trim: true,
    },
    ctaText: {
      type: String,
      trim: true,
      maxlength: [50, "CTA text cannot exceed 50 characters"],
      default: "Shop Collection",
    },
    ctaLink: {
      type: String,
      trim: true,
      default: "/products",
    },
    alignment: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    accentColor: {
      type: String,
      default: "#e11d48", // refined accent or custom color
    },
    overlayDarkness: {
      type: Number,
      default: 45, // percentage 0-100 for gradient darkness overlay
      min: 0,
      max: 90,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
