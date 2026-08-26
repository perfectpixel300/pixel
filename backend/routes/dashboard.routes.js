const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth.middleware");

// Protected dashboard stats endpoint
router.get("/stats", protect, getDashboardStats);

module.exports = router;
