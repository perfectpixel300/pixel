const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

// Public routes
router.get("/", serviceController.getServices);
router.get("/web-development", serviceController.getWebDevPackages);
router.get("/:id", serviceController.getServiceById);

// Admin protected routes
router.get("/admin/stats", protect, adminOnly, serviceController.getServiceStats);
router.post("/", protect, adminOnly, serviceController.createService);
router.put("/:id", protect, adminOnly, serviceController.updateService);
router.delete("/:id", protect, adminOnly, serviceController.deleteService);
router.patch("/:id/toggle-active", protect, adminOnly, serviceController.toggleServiceActive);
router.patch("/:id/toggle-featured", protect, adminOnly, serviceController.toggleServiceFeatured);

module.exports = router;
