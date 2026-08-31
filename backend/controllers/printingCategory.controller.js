const PrintingCategory = require("../models/printingCategory.model");
const PrintingService = require("../models/printingService.model");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// @desc    Get all printing categories with printing service count (Public)
// @route   GET /api/printing-categories
exports.getPrintingCategories = async (req, res) => {
  try {
    const categories = await PrintingCategory.find().sort({ displayOrder: 1, name: 1 });

    // Aggregate printing services counts per category
    const serviceCounts = await PrintingService.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    serviceCounts.forEach((sc) => {
      if (sc._id) countMap[sc._id] = sc.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
      printingServiceCount: countMap[cat.name] || 0,
      createdAt: cat.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Error in getPrintingCategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch printing categories",
      error: error.message,
    });
  }
};

// @desc    Create a new printing category (Admin Protected)
// @route   POST /api/printing-categories
exports.createPrintingCategory = async (req, res) => {
  try {
    const { name, description, icon, displayOrder, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Printing category name is required",
      });
    }

    const trimmedName = name.trim();
    let slug = generateSlug(trimmedName);

    const existing = await PrintingCategory.findOne({
      $or: [{ name: new RegExp(`^${trimmedName}$`, "i") }, { slug }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Printing category "${trimmedName}" already exists`,
      });
    }

    const category = await PrintingCategory.create({
      name: trimmedName,
      slug,
      description: description ? description.trim() : "",
      icon: icon ? icon.trim() : "Printer",
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: `Printing category "${category.name}" created successfully`,
      category: {
        ...category.toObject(),
        printingServiceCount: 0,
      },
    });
  } catch (error) {
    console.error("Error in createPrintingCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create printing category",
    });
  }
};

// @desc    Update a printing category (Admin Protected)
// @route   PUT /api/printing-categories/:id
exports.updatePrintingCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, displayOrder, isActive } = req.body;

    const category = await PrintingCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Printing category not found",
      });
    }

    const oldName = category.name;
    const newName = name ? name.trim() : oldName;

    if (name && name.trim() !== oldName) {
      const duplicate = await PrintingCategory.findOne({
        name: new RegExp(`^${newName}$`, "i"),
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Printing category "${newName}" already exists`,
        });
      }
      category.name = newName;
      category.slug = generateSlug(newName);

      // Cascade rename to existing printing services
      await PrintingService.updateMany({ category: oldName }, { category: newName });
    }

    if (description !== undefined) category.description = description.trim();
    if (icon !== undefined) category.icon = icon.trim();
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    const updatedCategory = await category.save();

    const printingServiceCount = await PrintingService.countDocuments({ category: updatedCategory.name });

    res.status(200).json({
      success: true,
      message: `Printing category updated to "${updatedCategory.name}"`,
      category: {
        ...updatedCategory.toObject(),
        printingServiceCount,
      },
    });
  } catch (error) {
    console.error("Error in updatePrintingCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update printing category",
    });
  }
};

// @desc    Delete a printing category (Admin Protected)
// @route   DELETE /api/printing-categories/:id
exports.deletePrintingCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await PrintingCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Printing category not found",
      });
    }

    const categoryName = category.name;
    await PrintingCategory.findByIdAndDelete(id);

    // Reassign affected printing services
    await PrintingService.updateMany({ category: categoryName }, { category: "General Printing" });

    res.status(200).json({
      success: true,
      message: `Printing category "${categoryName}" deleted. Associated services moved to "General Printing".`,
      categoryId: id,
    });
  } catch (error) {
    console.error("Error in deletePrintingCategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete printing category",
    });
  }
};
