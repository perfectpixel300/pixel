const express = require("express");
const router = express.Router();
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleActive,
  reorderBanners,
} = require("../controllers/banner.controller");
const { protect } = require("../middleware/auth.middleware");

// Public route for storefront hero banner
router.get("/", getBanners);
router.get("/:id", getBannerById);

// Admin Protected mutation routes
router.post("/", protect, createBanner);
router.put("/:id", protect, updateBanner);
router.delete("/:id", protect, deleteBanner);
router.patch("/reorder", protect, reorderBanners);
router.patch("/:id/toggle-active", protect, toggleActive);

module.exports = router;
