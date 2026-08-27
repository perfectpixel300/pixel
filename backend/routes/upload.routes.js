const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const {
  uploadSingle,
  uploadMultiple,
  deleteImage,
} = require("../controllers/upload.controller");
const { protect } = require("../middleware/auth.middleware");

// Middleware to normalize single file upload from any field name
const handleSingleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

// Middleware to normalize multiple files upload from any field name
const handleMultipleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// Protected routes for image uploads
router.post("/", protect, handleSingleUpload, uploadSingle);
router.post("/single", protect, handleSingleUpload, uploadSingle);
router.post("/multiple", protect, handleMultipleUpload, uploadMultiple);
router.delete("/", protect, deleteImage);

module.exports = router;
