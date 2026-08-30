const express = require("express");
const router = express.Router();
const {
  getPrintingCategories,
  createPrintingCategory,
  updatePrintingCategory,
  deletePrintingCategory,
} = require("../controllers/printingCategory.controller");
const { protect } = require("../middleware/auth.middleware");

// Public list
router.get("/", getPrintingCategories);

// Protected admin mutations
router.post("/", protect, createPrintingCategory);
router.put("/:id", protect, updatePrintingCategory);
router.delete("/:id", protect, deletePrintingCategory);

module.exports = router;
