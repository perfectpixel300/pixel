const mongoose = require("mongoose");

const printingServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Printing service name is required"],
      trim: true,
      maxlength: [140, "Name cannot exceed 140 characters"],
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
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
      default: "",
    },
    indicativePrice: {
      type: Number,
      required: [true, "Price in NRs. is required"],
      min: [0, "Price must be a positive number"],
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
    priceUnit: {
      type: String,
      trim: true,
      default: "per piece", // e.g. "per piece", "per sq. ft.", "per page", "per 100 units", "starting from"
    },
    currency: {
      type: String,
      default: "NRs.",
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    stock: {
      type: Number,
      default: 100,
      min: [0, "Stock cannot be negative"],
    },
    turnaroundTime: {
      type: String,
      trim: true,
      default: "24-48 Hours",
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: [1, "Minimum order quantity must be at least 1"],
    },
    paperOptions: {
      type: [String],
      default: [],
    },
    finishOptions: {
      type: [String],
      default: [],
    },
    supportedSizes: {
      type: [String],
      default: [],
    },
    specs: {
      paperGsm: { type: String, trim: true, default: "" },
      binding: { type: String, trim: true, default: "" },
      color: { type: String, trim: true, default: "" },
      dimensions: { type: String, trim: true, default: "" },
      printTechnology: { type: String, trim: true, default: "" },
      maxResolution: { type: String, trim: true, default: "" },
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

printingServiceSchema.index({ name: "text", description: "text", category: "text" });

const PrintingService = mongoose.model("PrintingService", printingServiceSchema);
module.exports = PrintingService;
