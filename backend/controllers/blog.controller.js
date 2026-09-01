const Blog = require("../models/blog.model");

// Helper to generate a URL-friendly slug
const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || `post-${Date.now()}`
  );
};

// Starter sample blogs when collection is empty
const defaultSampleBlogs = [
  {
    title: "The Architecture of Paper: How Cotton & Cellulose Shape Thought",
    slug: "architecture-of-paper-cotton-cellulose",
    excerpt:
      "An exploration into the tactile science of Swedish Munken paper, archival pH neutrality, and why physical resistance fosters deeper cognition.",
    content: `### The Friction of Thought

In an era governed by zero-latency touchscreens and glowing OLED panels, the simple act of putting pen to paper feels increasingly deliberate—almost rebellious. 

When you write on an archival sheet of **120 GSM Swedish Munken paper**, your brain registers immediate physical resistance. Unlike glass, where the stylus slides frictionless across pixels, paper fibers gently grip the nib of a fountain pen. That micro-resistance provides proprioceptive feedback that cements memory and sparks contemplative clarity.

> *"The mind does not think in isolation from the body. The weight of the instrument and the texture of the page are co-authors of our ideas."*

---

### Understanding Fiber Density and Archival Longevity

True archival paper differs dramatically from standard office copy paper. Standard wood-pulp papers contain lignin, a natural polymer that oxidizes over time, turning brittle and yellow within decades.

Our selected paper stocks undergo a strict manufacturing standard:

1. **Acid-Free & pH Neutral (7.5 - 8.5)**: Buffered with calcium carbonate to resist atmospheric acids for 200+ years.
2. **Long Cotton Rag Interlock**: Premium 100% cotton rag fibers interlock tightly, preventing ink feathering and ghosting even with high-flow pigment inks.
3. **FSC Certified Sustainable Forestry**: Sourced from responsibly managed Swedish forests adhering to strict closed-loop water filtration cycles.

Whether you are sketching architectural blueprints, documenting software architecture, or maintaining a private daily logbook, the medium you choose directly influences the depth of your focus.`,
    category: "Craftsmanship",
    tags: ["Paper Atelier", "Cognitive Science", "Design Heritage"],
    author: {
      name: "Avishek Sharma",
      role: "Lead Paper Craftsman",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    },
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
    template: "editorial",
    readTime: "5 min read",
    isPublished: true,
    isFeatured: true,
    views: 142,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    title: "Precision Turning: Inside the 0.01mm Brass Workshop",
    slug: "precision-turning-brass-workshop",
    excerpt:
      "Watch the complete CNC machining process of our solid raw brass writing instruments, from raw cylindrical stock to hand-finished heirloom pens.",
    content: `### Subtractive Engineering at the Micron Scale

Every Pixel Perfect brass instrument begins as a solid, continuous bar of **Lead-Free C36000 Eco-Brass**. 

Rather than stamping or casting liquid metal into cheap molds, each pen barrel is subtractively machined using high-precision 5-axis Swiss-style CNC lathes. This ensures identical grain distribution throughout the alloy, yielding optimal hand balance and thermal conductivity.

### Watch the Workshop Lathe in Action

Watch our master machinist demonstrate the precision single-point threading process and tolerance validation down to ±0.01mm:

\`\`\`
Material: C36000 Solid Brass
Spindle Speed: 3,200 RPM
Tolerance Standard: ISO 2768-m (±0.01mm)
Finish: Hand-brushed Raw Satin (Zero lacquer)
\`\`\`

### The Living Patina

Unlike plated pens that chip or peel, raw brass undergoes continuous natural oxidation. As your skin's natural oils interact with the copper and zinc atoms, the pen develops a custom, dark golden patina unique to your grip and daily habits. It becomes an intimate record of your work.`,
    category: "Workshop & Tools",
    tags: ["Machining", "Brass", "Hardware"],
    author: {
      name: "Siddharth Gautam",
      role: "Precision Machinist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    },
    mediaType: "youtube",
    mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop",
    template: "journal",
    readTime: "4 min read",
    isPublished: true,
    isFeatured: true,
    views: 289,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
  },
  {
    title: "12-Color Pigment Printing: The Science of Color Gamut & Delta E",
    slug: "12-color-pigment-printing-gamut-delta-e",
    excerpt:
      "How Lucia PRO micro-encapsulated pigment inks achieve 100+ year museum archival stability and true delta-E color accuracy.",
    content: `### Beyond Standard CMYK

Standard commercial printers rely on four standard dye colors: Cyan, Magenta, Yellow, and Key Black. While adequate for temporary flyers, 4-color dye printing rapidly fades when exposed to ultraviolet radiation and lacks the deep gamut required for fine art reproduction.

At **Pixel Perfect Fine Art Print Atelier**, we utilize advanced 12-channel Lucia PRO pigment formulation engines.

---

### The 12-Channel Ink Array

- **Primary Gamut**: Cyan, Photo Cyan, Magenta, Photo Magenta, Yellow
- **Expanded Spectrum**: Red, Blue, Chroma Optimizer
- **Monochrome Archival Suite**: Matte Black, Photo Black, Gray, Photo Gray

### Why Chroma Optimizer Matters

One of the biggest issues in archival glossy and semigloss printing is **bronzing** and uneven gloss reflection. Our Chroma Optimizer applies a micro-thin transparent resin coat over the pigment particles, equalizing surface height and ensuring smooth, glare-free light scattering from any viewing angle.

### Archival Wilhelm Imaging Research Rating

Tested under standardized accelerated fluorescent light exposure, our pigment prints mounted behind UV glass achieve **100+ years of lightfastness**, allowing your photographs and architectural renderings to outlive generations.`,
    category: "Printing Technology",
    tags: ["Fine Art", "Pigment Inks", "Color Calibration"],
    author: {
      name: "Anjali Thapa",
      role: "Chief Colorist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    },
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1400&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop",
    template: "magazine",
    readTime: "6 min read",
    isPublished: true,
    isFeatured: false,
    views: 95,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    title: "Designing Minimal Interfaces: Lessons from Analog Craftsmanship",
    slug: "designing-minimal-interfaces-analog-lessons",
    excerpt:
      "Translating the intentionality of physical tool design into clean, high-performance web applications and digital interfaces.",
    content: `### The Analog Blueprint for Digital Simplicity

In digital product design, adding features is almost effortless. A few lines of code can create another button, another modal, another push notification. But in physical product manufacturing, every additional part introduces weight, friction, assembly cost, and points of mechanical failure.

By applying analog discipline to modern software development, we discover what truly matters:

### 1. Zero Visual Clutter
If an element does not serve a deliberate functional purpose or communicate clear feedback, remove it. White space is not empty space—it is breathing room that commands attention.

### 2. Micro-Interactions as Tactile Clicks
When a user clicks a button, the response should feel as crisp and immediate as the solid snap of a brass pen cap. GSAP spring physics and instant UI state transitions mimic the kinetic satisfaction of real-world objects.

### 3. Typography as Architecture
A single well-crafted font family like *Plus Jakarta Sans* or *JetBrains Mono*, paired with strict typographic hierarchy, provides all the structure and elegance a product needs.`,
    category: "Web & Design",
    tags: ["UI/UX", "Minimalism", "Software Craft"],
    author: {
      name: "Pixel Perfect Editorial",
      role: "Studio Collective",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    },
    mediaType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-writing-on-a-notebook-42774-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    template: "cinema",
    readTime: "4 min read",
    isPublished: true,
    isFeatured: false,
    views: 210,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
];

// Helper to auto-seed starter blogs if collection is completely empty
const checkAndSeedBlogs = async () => {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultSampleBlogs);
      console.log("Auto-seeded initial sample blogs for storefront journal.");
    }
  } catch (error) {
    console.error("Error auto-seeding sample blogs:", error);
  }
};

// @desc    Get all blogs with filtering, search & pagination
// @route   GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    await checkAndSeedBlogs();

    const { page = 1, limit = 6, category, search, tag, all } = req.query;

    const query = {};

    // If not admin request (?all=true), only show published blogs
    if (all !== "true") {
      query.isPublished = true;
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Search query
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blog.countDocuments(query),
    ]);

    // Distinct categories for filters
    const categories = await Blog.distinct("category", all !== "true" ? { isPublished: true } : {});

    res.status(200).json({
      success: true,
      blogs,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      categories: ["All", ...categories.filter(Boolean)],
    });
  } catch (error) {
    console.error("Error in getBlogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// @desc    Get single blog by ID or Slug with view increment & related blogs
// @route   GET /api/blogs/:idOrSlug
exports.getBlogByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let query;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: idOrSlug };
    } else {
      query = { slug: idOrSlug };
    }

    // Find blog and increment view count atomically
    const blog = await Blog.findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog article not found",
      });
    }

    // Fetch related blogs (same category or recent)
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
      category: blog.category,
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    res.status(200).json({
      success: true,
      blog,
      relatedBlogs,
    });
  } catch (error) {
    console.error("Error in getBlogByIdOrSlug:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog article",
      error: error.message,
    });
  }
};

// @desc    Create new blog article (Admin Protected)
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      author,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      template,
      readTime,
      isPublished,
      isFeatured,
      publishedAt,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog content is required",
      });
    }

    let finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    // Ensure unique slug
    let slugExists = await Blog.findOne({ slug: finalSlug });
    let counter = 1;
    while (slugExists) {
      finalSlug = `${generateSlug(title)}-${counter}`;
      slugExists = await Blog.findOne({ slug: finalSlug });
      counter++;
    }

    const blog = await Blog.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || "",
      content,
      category: category?.trim() || "General",
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      author: {
        name: author?.name?.trim() || req.user?.username || "Pixel Perfect Editorial",
        role: author?.role?.trim() || "Author",
        avatar: author?.avatar?.trim() || "",
      },
      mediaType: mediaType || "photo",
      mediaUrl: mediaUrl?.trim() || "",
      thumbnailUrl: thumbnailUrl?.trim() || "",
      template: template || "editorial",
      readTime: readTime?.trim() || "4 min read",
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      isFeatured: Boolean(isFeatured),
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Blog article created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error in createBlog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// @desc    Update existing blog article (Admin Protected)
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      author,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      template,
      readTime,
      isPublished,
      isFeatured,
      publishedAt,
    } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (title !== undefined) blog.title = title.trim();
    if (slug !== undefined && slug.trim()) {
      const formattedSlug = generateSlug(slug);
      if (formattedSlug !== blog.slug) {
        const slugExists = await Blog.findOne({ slug: formattedSlug, _id: { $ne: id } });
        if (slugExists) {
          blog.slug = `${formattedSlug}-${Date.now().toString().slice(-4)}`;
        } else {
          blog.slug = formattedSlug;
        }
      }
    }
    if (excerpt !== undefined) blog.excerpt = excerpt.trim();
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category.trim();
    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    }
    if (author !== undefined) {
      blog.author = {
        name: author.name?.trim() || blog.author?.name || "Pixel Perfect Editorial",
        role: author.role?.trim() || blog.author?.role || "Author",
        avatar: author.avatar?.trim() || blog.author?.avatar || "",
      };
    }
    if (mediaType !== undefined) blog.mediaType = mediaType;
    if (mediaUrl !== undefined) blog.mediaUrl = mediaUrl.trim();
    if (thumbnailUrl !== undefined) blog.thumbnailUrl = thumbnailUrl.trim();
    if (template !== undefined) blog.template = template;
    if (readTime !== undefined) blog.readTime = readTime.trim();
    if (isPublished !== undefined) blog.isPublished = Boolean(isPublished);
    if (isFeatured !== undefined) blog.isFeatured = Boolean(isFeatured);
    if (publishedAt !== undefined) blog.publishedAt = new Date(publishedAt);

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog article updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Error in updateBlog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// @desc    Delete a blog article (Admin Protected)
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog article deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

// @desc    Toggle publish status (Admin Protected)
// @route   PATCH /api/blogs/:id/publish
exports.togglePublishBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog article not found",
      });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog is now ${blog.isPublished ? "Published" : "Draft"}`,
      blog,
    });
  } catch (error) {
    console.error("Error in togglePublishBlog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle blog publication status",
      error: error.message,
    });
  }
};

// @desc    Toggle featured status (Admin Protected)
// @route   PATCH /api/blogs/:id/feature
exports.toggleFeatureBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog article not found",
      });
    }

    blog.isFeatured = !blog.isFeatured;
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog is now ${blog.isFeatured ? "Featured" : "Standard"}`,
      blog,
    });
  } catch (error) {
    console.error("Error in toggleFeatureBlog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle blog featured status",
      error: error.message,
    });
  }
};
