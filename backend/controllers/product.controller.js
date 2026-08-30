const Product = require("../models/product.model");

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// @desc    Get all products with filtering, search & pagination
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      isAvailable,
      featured,
      sortBy = "createdAt_desc",
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Search filter (text index or regex on name and description)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { slug: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Availability filter
    if (isAvailable !== undefined && isAvailable !== "") {
      query.isAvailable = isAvailable === "true" || isAvailable === true;
    }

    // Featured filter
    if (featured !== undefined && featured !== "") {
      query.featured = featured === "true" || featured === true;
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (sortBy === "price_asc") sort = { indicativePrice: 1 };
    else if (sortBy === "price_desc") sort = { indicativePrice: -1 };
    else if (sortBy === "name_asc") sort = { name: 1 };
    else if (sortBy === "name_desc") sort = { name: -1 };
    else if (sortBy === "createdAt_asc") sort = { createdAt: 1 };
    else if (sortBy === "createdAt_desc") sort = { createdAt: -1 };

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize) || 1,
      products,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      slug: customSlug,
      category,
      description,
      indicativePrice,
      discountPrice,
      costPrice,
      images,
      isAvailable,
      featured,
      stock,
      specs,
    } = req.body;

    if (!name || !category || !description || indicativePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, category, description, indicativePrice)",
      });
    }

    // Auto-generate slug if not provided
    let slug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    
    // Ensure slug uniqueness
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const stockVal = stock !== undefined ? Number(stock) : 20;
    const isAvailableVal = stockVal === 0 ? false : (isAvailable !== undefined ? Boolean(isAvailable) : true);

    const product = new Product({
      name,
      slug,
      category,
      description,
      indicativePrice: Number(indicativePrice),
      discountPrice: discountPrice !== undefined && discountPrice !== "" ? Number(discountPrice) : 0,
      costPrice: costPrice !== undefined && costPrice !== "" ? Number(costPrice) : 0,
      images: Array.isArray(images) ? images.filter((img) => img && img.trim()) : [],
      isAvailable: isAvailableVal,
      featured: featured !== undefined ? Boolean(featured) : false,
      stock: stockVal,
      specs: specs || {},
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug: customSlug,
      category,
      description,
      indicativePrice,
      discountPrice,
      costPrice,
      images,
      isAvailable,
      featured,
      stock,
      specs,
    } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Slug check if updating slug or name
    let newSlug = product.slug;
    if (customSlug && customSlug !== product.slug) {
      newSlug = generateSlug(customSlug);
      const slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    } else if (name && !customSlug && name !== product.name) {
      newSlug = generateSlug(name);
      const slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    product.name = name !== undefined ? name : product.name;
    product.slug = newSlug;
    product.category = category !== undefined ? category : product.category;
    product.description = description !== undefined ? description : product.description;
    product.indicativePrice = indicativePrice !== undefined ? Number(indicativePrice) : product.indicativePrice;
    if (discountPrice !== undefined) {
      product.discountPrice = discountPrice === "" ? 0 : Number(discountPrice);
    }
    if (costPrice !== undefined && costPrice !== "") {
      product.costPrice = Number(costPrice);
    }
    if (images !== undefined) {
      product.images = Array.isArray(images) ? images.filter((img) => img && img.trim()) : [];
    }
    const updatedStockVal = stock !== undefined ? Number(stock) : product.stock;
    product.isAvailable = updatedStockVal === 0 ? false : (isAvailable !== undefined ? Boolean(isAvailable) : product.isAvailable);
    product.featured = featured !== undefined ? Boolean(featured) : product.featured;
    product.stock = updatedStockVal;
    if (specs !== undefined) {
      product.specs = { ...product.specs, ...specs };
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
      productId: id,
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// @desc    Quick toggle availability status
// @route   PATCH /api/products/:id/toggle-availability
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product status updated to ${product.isAvailable ? "Available" : "Unavailable"}`,
      product,
    });
  } catch (error) {
    console.error("Error in toggleAvailability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle status",
    });
  }
};

// @desc    Quick toggle featured status
// @route   PATCH /api/products/:id/toggle-featured
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.featured = !product.featured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product featured flag set to ${product.featured}`,
      product,
    });
  } catch (error) {
    console.error("Error in toggleFeatured:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
    });
  }
};

// @desc    Get product statistics for admin dashboard
// @route   GET /api/products/stats
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isAvailable: true });
    const inactiveProducts = await Product.countDocuments({ isAvailable: false });
    const featuredProducts = await Product.countDocuments({ featured: true });

    // Category counts
    const categoryStats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, avgPrice: { $avg: "$indicativePrice" } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        featured: featuredProducts,
        categories: categoryStats,
      },
    });
  } catch (error) {
    console.error("Error in getProductStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
