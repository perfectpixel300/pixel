const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog,
  toggleFeatureBlog,
} = require("../controllers/blog.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes
router.get("/", getBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);

// Admin protected routes
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.patch("/:id/publish", protect, togglePublishBlog);
router.patch("/:id/feature", protect, toggleFeatureBlog);

module.exports = router;
