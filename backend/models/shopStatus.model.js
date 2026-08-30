const mongoose = require("mongoose");

const shopStatusSchema = new mongoose.Schema(
  {
    isOpen: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "partial"],
      default: "open",
    },
    title: {
      type: String,
      trim: true,
      default: "Pixel Perfect is Open",
    },
    partialTitle: {
      type: String,
      trim: true,
      default: "Partial Service Availability",
    },
    closedMessage: {
      type: String,
      trim: true,
      default:
        "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
    },
    partialMessage: {
      type: String,
      trim: true,
      default:
        "Some particular services are currently undergoing maintenance or unavailable, while other services and catalog items remain active and operational with their scheduled timings.",
    },
    openMessage: {
      type: String,
      trim: true,
      default: "We are currently open and taking orders and consulting inquiries.",
    },
    bannerNotice: {
      type: String,
      trim: true,
      default: "",
    },
    timerEnabled: {
      type: Boolean,
      default: false,
    },
    timerTarget: {
      type: Date,
      default: null,
    },
    timerLabel: {
      type: String,
      trim: true,
      default: "Reopening In",
    },
    timerAction: {
      type: String,
      enum: ["reopen", "close", "custom"],
      default: "reopen",
    },
    showPopupWhenClosed: {
      type: Boolean,
      default: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "+977 9845991878",
    },
    contactEmail: {
      type: String,
      trim: true,
      default: "perfectpixel300@gmail.com",
    },
    updatedBy: {
      type: String,
      trim: true,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const ShopStatus = mongoose.model("ShopStatus", shopStatusSchema);
module.exports = ShopStatus;
