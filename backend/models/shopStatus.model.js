const mongoose = require("mongoose");

const shopStatusSchema = new mongoose.Schema(
  {
    isOpen: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Pixel Perfect Atelier is Open",
    },
    closedMessage: {
      type: String,
      trim: true,
      default:
        "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
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
      default: "atelier@pixelperfect.com",
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
