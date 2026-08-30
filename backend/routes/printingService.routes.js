const express = require("express");
const router = express.Router();
const {
  getPrintingServices,
  getPrintingServiceById,
  createPrintingService,
  updatePrintingService,
  deletePrintingService,
  toggleAvailability,
  toggleFeatured,
  getPrintingServiceStats,
} = require("../controllers/printingService.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

// Public storefront routes
router.get("/stats", getPrintingServiceStats);
router.get("/", getPrintingServices);
router.get("/:id", getPrintingServiceById);

// Admin protected mutation routes
router.post("/", protect, createPrintingService);
router.put("/:id", protect, updatePrintingService);
router.delete("/:id", protect, deletePrintingService);
router.patch("/:id/toggle-availability", protect, toggleAvailability);
router.patch("/:id/availability", protect, toggleAvailability);
router.patch("/:id/toggle-featured", protect, toggleFeatured);
router.patch("/:id/featured", protect, toggleFeatured);

module.exports = router;
