const mongoose = require("mongoose");

const promoBannerSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      trim: true,
      default: "Our Philosophy",
      maxlength: [60, "Badge cannot exceed 60 characters"],
    },
    title: {
      type: String,
      required: [true, "Headline title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Subtitle cannot exceed 500 characters"],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    hasTimer: {
      type: Boolean,
      default: false,
    },
    timerEndDate: {
      type: Date,
      default: null,
    },
    timerTitle: {
      type: String,
      trim: true,
      default: "Offer Ends In",
      maxlength: [60, "Timer title cannot exceed 60 characters"],
    },
    ctaText: {
      type: String,
      trim: true,
      default: "",
      maxlength: [50, "CTA text cannot exceed 50 characters"],
    },
    ctaLink: {
      type: String,
      trim: true,
      default: "/products",
    },
    alignment: {
      type: String,
      enum: ["left", "center", "right"],
      default: "center",
    },
    style: {
      type: String,
      enum: ["philosophy", "offer", "advertisement", "minimal"],
      default: "philosophy",
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
  },
  {
    timestamps: true,
  }
);

const PromoBanner = mongoose.model("PromoBanner", promoBannerSchema);
module.exports = PromoBanner;
