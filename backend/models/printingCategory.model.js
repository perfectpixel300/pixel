const mongoose = require("mongoose");

const printingCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Printing category name is required"],
      unique: true,
      trim: true,
      maxlength: [60, "Category name cannot exceed 60 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      trim: true,
      default: "Printer",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PrintingCategory = mongoose.model("PrintingCategory", printingCategorySchema);
module.exports = PrintingCategory;
