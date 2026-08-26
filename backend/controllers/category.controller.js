const Category = require("../models/category.model");
const Product = require("../models/product.model");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// @desc    Get all categories with product counts (Public)
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });

    // Aggregate product counts per category
    const productCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    productCounts.forEach((pc) => {
      if (pc._id) countMap[pc._id] = pc.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      displayOrder: cat.displayOrder,
      productCount: countMap[cat.name] || 0,
      createdAt: cat.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// @desc    Create a category (Admin Protected)
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, displayOrder } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();
    let slug = generateSlug(trimmedName);

    const existing = await Category.findOne({
      $or: [{ name: new RegExp(`^${trimmedName}$`, "i") }, { slug }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category "${trimmedName}" already exists`,
      });
    }

    const category = await Category.create({
      name: trimmedName,
      slug,
      description: description ? description.trim() : "",
      imageUrl: imageUrl ? imageUrl.trim() : "",
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    });

    res.status(201).json({
      success: true,
      message: `Category "${category.name}" created successfully`,
      category,
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};

// @desc    Update an existing category (Admin Protected)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, displayOrder } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const oldName = category.name;
    const newName = name ? name.trim() : oldName;

    if (name && name.trim() !== oldName) {
      const duplicate = await Category.findOne({
        name: new RegExp(`^${newName}$`, "i"),
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Category "${newName}" already exists`,
        });
      }
      category.name = newName;
      category.slug = generateSlug(newName);

      // Cascade rename to existing products
      await Product.updateMany({ category: oldName }, { category: newName });
    }

    if (description !== undefined) category.description = description.trim();
    if (imageUrl !== undefined) category.imageUrl = imageUrl.trim();
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: `Category updated to "${updatedCategory.name}"`,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};

// @desc    Delete a category (Admin Protected)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoryName = category.name;
    await Category.findByIdAndDelete(id);

    // Update associated products to 'General' or keep their category intact
    await Product.updateMany({ category: categoryName }, { category: "General" });

    res.status(200).json({
      success: true,
      message: `Category "${categoryName}" deleted. Associated products moved to "General".`,
      categoryId: id,
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};
