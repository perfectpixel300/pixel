const express = require("express");
const router = express.Router();
const {
  getPromoBanners,
  getPromoBannerById,
  createPromoBanner,
  updatePromoBanner,
  deletePromoBanner,
  toggleActive,
  reorderPromoBanners,
} = require("../controllers/promoBanner.controller");
const { protect } = require("../middleware/auth.middleware");

// Public route for storefront
router.get("/", getPromoBanners);
router.get("/:id", getPromoBannerById);

// Admin Protected mutation routes
router.post("/", protect, createPromoBanner);
router.put("/:id", protect, updatePromoBanner);
router.delete("/:id", protect, deletePromoBanner);
router.patch("/reorder", protect, reorderPromoBanners);
router.patch("/:id/toggle-active", protect, toggleActive);

module.exports = router;
