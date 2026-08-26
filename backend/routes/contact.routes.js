const express = require("express");
const router = express.Router();
const {
  submitContact,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require("../controllers/contact.controller");
const { protect } = require("../middleware/auth.middleware");

// Public route to submit message
router.post("/", submitContact);

// Admin protected routes
router.get("/", protect, getInquiries);
router.patch("/:id/status", protect, updateInquiryStatus);
router.delete("/:id", protect, deleteInquiry);

module.exports = router;
