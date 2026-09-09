const express = require("express");
const router = express.Router();
const {
  getHealthStatus,
  getPing,
} = require("../controllers/health.controller");

// Health check endpoint for uptime monitoring
router.get("/", getHealthStatus);
router.head("/", getHealthStatus);

// Fast ping endpoint
router.get("/ping", getPing);
router.head("/ping", getPing);

module.exports = router;
