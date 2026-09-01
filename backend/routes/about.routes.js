const express = require("express");
const router = express.Router();
const { getAbout, updateAbout } = require("../controllers/about.controller");
const { protect } = require("../middleware/auth.middleware");

// Public route to get About page content
router.get("/", getAbout);

// Protected admin route to update About page content
router.put("/", protect, updateAbout);

module.exports = router;
