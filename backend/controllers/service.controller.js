const Service = require("../models/service.model");

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// @desc    Get all services with filtering & search
// @route   GET /api/services
exports.getServices = async (req, res) => {
  try {
    const {
      category,
      isWebDevPackage,
      isFeatured,
      isActive,
      search,
      sortBy = "order_asc",
    } = req.query;

    const query = {};

    // Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Web dev package filter
    if (isWebDevPackage !== undefined && isWebDevPackage !== "") {
      query.isWebDevPackage = isWebDevPackage === "true" || isWebDevPackage === true;
    }

    // Featured filter
    if (isFeatured !== undefined && isFeatured !== "") {
      query.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    // Active status filter
    if (isActive !== undefined && isActive !== "") {
      query.isActive = isActive === "true" || isActive === true;
    }

    // Sorting
    let sort = { displayOrder: 1, createdAt: -1 };
    if (sortBy === "price_asc") sort = { price: 1 };
    else if (sortBy === "price_desc") sort = { price: -1 };
    else if (sortBy === "title_asc") sort = { title: 1 };
    else if (sortBy === "title_desc") sort = { title: -1 };
    else if (sortBy === "newest") sort = { createdAt: -1 };
    else if (sortBy === "order_asc") sort = { displayOrder: 1, createdAt: 1 };

    const services = await Service.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error in getServices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// @desc    Get Web Development Packages (3 tiers)
// @route   GET /api/services/web-development
exports.getWebDevPackages = async (req, res) => {
  try {
    const packages = await Service.find({
      isWebDevPackage: true,
    }).sort({ displayOrder: 1, price: 1 });

    res.status(200).json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.error("Error in getWebDevPackages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch web development packages",
      error: error.message,
    });
  }
};

// @desc    Get single service by ID or Slug
// @route   GET /api/services/:id
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error in getServiceById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

// @desc    Create a new IT service or web development tier (Admin Protected)
// @route   POST /api/services
exports.createService = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      category,
      shortDescription,
      description,
      price,
      priceType = "starting_at",
      deliveryTime = "1-2 Weeks",
      icon = "Code",
      bannerImage = "",
      features = [],
      technologies = [],
      isWebDevPackage = false,
      packageTier = "none",
      tierBadge = "",
      isFeatured = false,
      isActive = true,
      displayOrder = 0,
    } = req.body;

    if (!title || !category || !shortDescription || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide required fields (title, category, shortDescription, price)",
      });
    }

    // Auto-generate slug if not provided
    let slug = customSlug ? generateSlug(customSlug) : generateSlug(title);

    // Ensure slug uniqueness
    const existingSlug = await Service.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const service = new Service({
      title: title.trim(),
      slug,
      category: category.trim(),
      shortDescription: shortDescription.trim(),
      description: description ? description.trim() : shortDescription.trim(),
      price: Number(price),
      priceType,
      currency: "NRs.",
      deliveryTime: deliveryTime ? deliveryTime.trim() : "1-2 Weeks",
      icon: icon ? icon.trim() : "Code",
      bannerImage: bannerImage ? bannerImage.trim() : "",
      features: Array.isArray(features) ? features.filter((f) => f && f.trim()) : [],
      technologies: Array.isArray(technologies) ? technologies.filter((t) => t && t.trim()) : [],
      isWebDevPackage: Boolean(isWebDevPackage),
      packageTier: isWebDevPackage ? packageTier : "none",
      tierBadge: tierBadge ? tierBadge.trim() : "",
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      displayOrder: Number(displayOrder) || 0,
    });

    const savedService = await service.save();

    res.status(201).json({
      success: true,
      message: `Service "${savedService.title}" created successfully`,
      service: savedService,
    });
  } catch (error) {
    console.error("Error in createService:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create service",
    });
  }
};

// @desc    Update a service or web development package (Admin Protected)
// @route   PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid Service ID is required",
      });
    }

    const {
      title,
      slug: customSlug,
      category,
      shortDescription,
      description,
      price,
      priceType,
      deliveryTime,
      icon,
      bannerImage,
      features,
      technologies,
      isWebDevPackage,
      packageTier,
      tierBadge,
      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    let service;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Slug check if updating slug or title
    let newSlug = service.slug;
    if (customSlug && customSlug !== service.slug) {
      newSlug = generateSlug(customSlug);
      const slugExists = await Service.findOne({ slug: newSlug, _id: { $ne: service._id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    } else if (title && !customSlug && title !== service.title) {
      newSlug = generateSlug(title);
      const slugExists = await Service.findOne({ slug: newSlug, _id: { $ne: service._id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    service.title = title !== undefined ? title.trim() : service.title;
    service.slug = newSlug;
    service.category = category !== undefined ? category.trim() : service.category;
    service.shortDescription = shortDescription !== undefined ? shortDescription.trim() : service.shortDescription;
    service.description = description !== undefined ? description.trim() : service.description;
    service.price = price !== undefined ? Number(price) : service.price;
    service.priceType = priceType !== undefined ? priceType : service.priceType;
    service.deliveryTime = deliveryTime !== undefined ? deliveryTime.trim() : service.deliveryTime;
    service.icon = icon !== undefined ? icon.trim() : service.icon;
    service.bannerImage = bannerImage !== undefined ? bannerImage.trim() : service.bannerImage;

    if (features !== undefined) {
      service.features = Array.isArray(features) ? features.filter((f) => f && f.trim()) : [];
    }

    if (technologies !== undefined) {
      service.technologies = Array.isArray(technologies) ? technologies.filter((t) => t && t.trim()) : [];
    }

    if (isWebDevPackage !== undefined) service.isWebDevPackage = Boolean(isWebDevPackage);
    if (packageTier !== undefined) service.packageTier = packageTier;
    if (tierBadge !== undefined) service.tierBadge = tierBadge.trim();
    if (isFeatured !== undefined) service.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) service.isActive = Boolean(isActive);
    if (displayOrder !== undefined) service.displayOrder = Number(displayOrder);

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: `Service "${updatedService.title}" updated successfully`,
      service: updatedService,
    });
  } catch (error) {
    console.error("Error in updateService:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update service",
    });
  }
};

// @desc    Delete a service (Admin Protected)
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid Service ID is required",
      });
    }

    let service;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findByIdAndDelete(id);
    } else {
      service = await Service.findOneAndDelete({ slug: id });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Service "${service.title}" deleted successfully`,
      serviceId: id,
    });
  } catch (error) {
    console.error("Error in deleteService:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

// @desc    Toggle service active status (Admin Protected)
// @route   PATCH /api/services/:id/toggle-active
exports.toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid Service ID is required",
      });
    }

    let service;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service status updated to ${service.isActive ? "Active" : "Inactive"}`,
      service,
    });
  } catch (error) {
    console.error("Error in toggleServiceActive:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle status",
    });
  }
};

// @desc    Toggle service featured status (Admin Protected)
// @route   PATCH /api/services/:id/toggle-featured
exports.toggleServiceFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid Service ID is required",
      });
    }

    let service;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    } else {
      service = await Service.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    service.isFeatured = !service.isFeatured;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service featured flag set to ${service.isFeatured}`,
      service,
    });
  } catch (error) {
    console.error("Error in toggleServiceFeatured:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
    });
  }
};

// @desc    Get service statistics for admin dashboard
// @route   GET /api/services/stats
exports.getServiceStats = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const featuredServices = await Service.countDocuments({ isFeatured: true });
    const webDevPackages = await Service.countDocuments({ isWebDevPackage: true });

    const categories = await Service.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, avgPrice: { $avg: "$price" } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalServices,
        active: activeServices,
        featured: featuredServices,
        webDevPackages,
        categories,
      },
    });
  } catch (error) {
    console.error("Error in getServiceStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
