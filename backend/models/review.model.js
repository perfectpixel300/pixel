const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [60, "First name cannot exceed 60 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
      maxlength: [60, "Last name cannot exceed 60 characters"],
    },
    emailOrContact: {
      type: String,
      required: [true, "Email or contact number is required"],
      trim: true,
      maxlength: [120, "Contact information cannot exceed 120 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Star rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
      index: true,
    },
    comment: {
      type: String,
      required: [true, "Review description is required"],
      trim: true,
      maxlength: [2000, "Review description cannot exceed 2000 characters"],
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
