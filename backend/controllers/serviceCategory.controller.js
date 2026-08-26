const ServiceCategory = require("../models/serviceCategory.model");
const Service = require("../models/service.model");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// @desc    Get all service categories with service count (Public)
// @route   GET /api/service-categories
exports.getServiceCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({ displayOrder: 1, name: 1 });

    // Aggregate services counts per category
    const serviceCounts = await Service.aggregate([
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
      serviceCount: countMap[cat.name] || 0,
      createdAt: cat.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Error in getServiceCategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service categories",
      error: error.message,
    });
  }
};

// @desc    Create a new service category (Admin Protected)
// @route   POST /api/service-categories
exports.createServiceCategory = async (req, res) => {
  try {
    const { name, description, icon, displayOrder, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service category name is required",
      });
    }

    const trimmedName = name.trim();
    let slug = generateSlug(trimmedName);

    const existing = await ServiceCategory.findOne({
      $or: [{ name: new RegExp(`^${trimmedName}$`, "i") }, { slug }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Service category "${trimmedName}" already exists`,
      });
    }

    const category = await ServiceCategory.create({
      name: trimmedName,
      slug,
      description: description ? description.trim() : "",
      icon: icon ? icon.trim() : "Code",
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: `Service category "${category.name}" created successfully`,
      category: {
        ...category.toObject(),
        serviceCount: 0,
      },
    });
  } catch (error) {
    console.error("Error in createServiceCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create service category",
    });
  }
};

// @desc    Update a service category (Admin Protected)
// @route   PUT /api/service-categories/:id
exports.updateServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, displayOrder, isActive } = req.body;

    const category = await ServiceCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found",
      });
    }

    const oldName = category.name;
    const newName = name ? name.trim() : oldName;

    if (name && name.trim() !== oldName) {
      const duplicate = await ServiceCategory.findOne({
        name: new RegExp(`^${newName}$`, "i"),
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Service category "${newName}" already exists`,
        });
      }
      category.name = newName;
      category.slug = generateSlug(newName);

      // Cascade rename to existing services
      await Service.updateMany({ category: oldName }, { category: newName });
    }

    if (description !== undefined) category.description = description.trim();
    if (icon !== undefined) category.icon = icon.trim();
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    const updatedCategory = await category.save();

    // Get current count
    const serviceCount = await Service.countDocuments({ category: updatedCategory.name });

    res.status(200).json({
      success: true,
      message: `Service category updated to "${updatedCategory.name}"`,
      category: {
        ...updatedCategory.toObject(),
        serviceCount,
      },
    });
  } catch (error) {
    console.error("Error in updateServiceCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update service category",
    });
  }
};

// @desc    Delete a service category (Admin Protected)
// @route   DELETE /api/service-categories/:id
exports.deleteServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ServiceCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found",
      });
    }

    const categoryName = category.name;
    await ServiceCategory.findByIdAndDelete(id);

    // Reassign affected services to "General IT" or leave as is
    await Service.updateMany({ category: categoryName }, { category: "General IT" });

    res.status(200).json({
      success: true,
      message: `Service category "${categoryName}" deleted. Associated services moved to "General IT".`,
      categoryId: id,
    });
  } catch (error) {
    console.error("Error in deleteServiceCategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service category",
    });
  }
};
