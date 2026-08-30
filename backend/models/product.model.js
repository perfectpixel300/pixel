const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [140, "Product name cannot exceed 140 characters"],
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
      required: [true, "Please select or enter a category"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [4000, "Description cannot exceed 4000 characters"],
    },
    indicativePrice: {
      type: Number,
      required: [true, "Indicative price in NRs is required"],
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
      default: 20,
      min: [0, "Stock cannot be negative"],
    },
    specs: {
      paperGsm: { type: String, trim: true, default: "" },
      binding: { type: String, trim: true, default: "" },
      color: { type: String, trim: true, default: "" },
      dimensions: { type: String, trim: true, default: "" },
      origin: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;