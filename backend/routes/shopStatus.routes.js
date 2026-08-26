const express = require("express");
const router = express.Router();
const {
  getShopStatus,
  updateShopStatus,
} = require("../controllers/shopStatus.controller");
const { protect } = require("../middleware/auth.middleware");

// Public route to get shop open/closed status & timer
router.get("/", getShopStatus);

// Protected admin route to update shop status & timer
router.put("/", protect, updateShopStatus);

module.exports = router;
