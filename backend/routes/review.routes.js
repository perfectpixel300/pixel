const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
} = require("../controllers/review.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes (no login required)
router.post("/", createReview);
router.get("/product/:productId", getProductReviews);

// Admin protected routes
router.get("/", protect, getAllReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;
