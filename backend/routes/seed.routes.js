const express = require("express");
const router = express.Router();

// Seed route disabled / removed - catalog is dynamically managed via Admin Studio & MongoDB
router.post("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Seed route disabled. Manage all records directly in Admin Studio.",
  });
});

module.exports = router;
