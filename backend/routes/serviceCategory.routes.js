const express = require("express");
const router = express.Router();
const {
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} = require("../controllers/serviceCategory.controller");
const { protect } = require("../middleware/auth.middleware");

// Public list
router.get("/", getServiceCategories);

// Protected admin mutations
router.post("/", protect, createServiceCategory);
router.put("/:id", protect, updateServiceCategory);
router.delete("/:id", protect, deleteServiceCategory);

module.exports = router;
