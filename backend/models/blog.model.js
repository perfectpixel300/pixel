const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      default: "",
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    category: {
      type: String,
      trim: true,
      default: "Studio & Craft",
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      name: {
        type: String,
        trim: true,
        default: "Pixel Perfect Studio",
      },
      role: {
        type: String,
        trim: true,
        default: "Editorial Team",
      },
      avatar: {
        type: String,
        trim: true,
        default: "",
      },
    },
    mediaType: {
      type: String,
      enum: ["photo", "video", "youtube", "embed"],
      default: "photo",
    },
    mediaUrl: {
      type: String,
      trim: true,
      default: "",
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },
    template: {
      type: String,
      enum: ["editorial", "magazine", "journal", "cinema"],
      default: "editorial",
    },
    readTime: {
      type: String,
      trim: true,
      default: "4 min read",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before saving
blogSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    if (!this.slug) {
      this.slug = `post-${Date.now()}`;
    }
  }

  // Auto-estimate read time if not set
  if (this.isModified("content") && (!this.readTime || this.readTime === "4 min read")) {
    const wordCount = (this.content || "").replace(/<[^>]*>?/gm, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }
});

module.exports = mongoose.model("Blog", blogSchema);
