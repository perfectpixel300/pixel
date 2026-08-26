const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  toggleFeatured,
  getProductStats,
} = require("../controllers/product.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes for storefront
router.get("/stats", getProductStats);
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Protected mutation routes
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.patch("/:id/toggle-availability", protect, toggleAvailability);
router.patch("/:id/toggle-featured", protect, toggleFeatured);

module.exports = router;
