const PrintingService = require("../models/printingService.model");

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// @desc    Get all printing services with filtering, search & pagination
// @route   GET /api/printing-services
exports.getPrintingServices = async (req, res) => {
  try {
    const {
      search,
      category,
      isAvailable,
      featured,
      sortBy = "displayOrder_asc",
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { category: searchRegex },
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
    let sort = { displayOrder: 1, createdAt: -1 };
    if (sortBy === "price_asc") sort = { indicativePrice: 1 };
    else if (sortBy === "price_desc") sort = { indicativePrice: -1 };
    else if (sortBy === "name_asc") sort = { name: 1 };
    else if (sortBy === "name_desc") sort = { name: -1 };
    else if (sortBy === "createdAt_asc") sort = { createdAt: 1 };
    else if (sortBy === "createdAt_desc") sort = { createdAt: -1 };
    else if (sortBy === "displayOrder_asc") sort = { displayOrder: 1, createdAt: -1 };

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNumber - 1) * pageSize;

    const total = await PrintingService.countDocuments(query);
    const services = await PrintingService.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize) || 1,
      printingServices: services,
      services, // convenience alias
    });
  } catch (error) {
    console.error("Error in getPrintingServices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch printing services",
      error: error.message,
    });
  }
};

// @desc    Get single printing service by ID or Slug
// @route   GET /api/printing-services/:id
exports.getPrintingServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let service;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await PrintingService.findById(id);
    } else {
      service = await PrintingService.findOne({ slug: id });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Printing service not found",
      });
    }

    res.status(200).json({
      success: true,
      printingService: service,
      service,
    });
  } catch (error) {
    console.error("Error in getPrintingServiceById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch printing service",
      error: error.message,
    });
  }
};

// @desc    Create a new printing service
// @route   POST /api/printing-services
exports.createPrintingService = async (req, res) => {
  try {
    const {
      name,
      slug: customSlug,
      category,
      description,
      shortDescription,
      indicativePrice,
      discountPrice,
      costPrice,
      priceUnit,
      images,
      isAvailable,
      featured,
      stock,
      turnaroundTime,
      minOrderQuantity,
      paperOptions,
      finishOptions,
      supportedSizes,
      specs,
      displayOrder,
    } = req.body;

    if (!name || !category || !description || indicativePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, category, description, indicativePrice)",
      });
    }

    // Auto-generate slug
    let slug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    const existingSlug = await PrintingService.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const stockVal = stock !== undefined ? Number(stock) : 100;
    const isAvailableVal = isAvailable !== undefined ? Boolean(isAvailable) : true;

    const printingService = new PrintingService({
      name,
      slug,
      category,
      description,
      shortDescription: shortDescription || description.slice(0, 160),
      indicativePrice: Number(indicativePrice),
      discountPrice: discountPrice !== undefined && discountPrice !== "" ? Number(discountPrice) : 0,
      costPrice: costPrice !== undefined && costPrice !== "" ? Number(costPrice) : 0,
      priceUnit: priceUnit || "per piece",
      images: Array.isArray(images) ? images.filter((img) => img && img.trim()) : [],
      isAvailable: isAvailableVal,
      featured: featured !== undefined ? Boolean(featured) : false,
      stock: stockVal,
      turnaroundTime: turnaroundTime || "24-48 Hours",
      minOrderQuantity: minOrderQuantity ? Number(minOrderQuantity) : 1,
      paperOptions: Array.isArray(paperOptions) ? paperOptions : [],
      finishOptions: Array.isArray(finishOptions) ? finishOptions : [],
      supportedSizes: Array.isArray(supportedSizes) ? supportedSizes : [],
      specs: specs || {},
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
    });

    const savedService = await printingService.save();

    res.status(201).json({
      success: true,
      message: "Printing service created successfully",
      printingService: savedService,
    });
  } catch (error) {
    console.error("Error in createPrintingService:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create printing service",
    });
  }
};

// @desc    Update a printing service
// @route   PUT /api/printing-services/:id
exports.updatePrintingService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug: customSlug,
      category,
      description,
      shortDescription,
      indicativePrice,
      discountPrice,
      costPrice,
      priceUnit,
      images,
      isAvailable,
      featured,
      stock,
      turnaroundTime,
      minOrderQuantity,
      paperOptions,
      finishOptions,
      supportedSizes,
      specs,
      displayOrder,
    } = req.body;

    let service = await PrintingService.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Printing service not found",
      });
    }

    // Slug check
    let newSlug = service.slug;
    if (customSlug && customSlug !== service.slug) {
      newSlug = generateSlug(customSlug);
      const slugExists = await PrintingService.findOne({ slug: newSlug, _id: { $ne: id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    } else if (name && !customSlug && name !== service.name) {
      newSlug = generateSlug(name);
      const slugExists = await PrintingService.findOne({ slug: newSlug, _id: { $ne: id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    service.name = name !== undefined ? name : service.name;
    service.slug = newSlug;
    service.category = category !== undefined ? category : service.category;
    service.description = description !== undefined ? description : service.description;
    if (shortDescription !== undefined) service.shortDescription = shortDescription;
    if (indicativePrice !== undefined) service.indicativePrice = Number(indicativePrice);
    if (discountPrice !== undefined) service.discountPrice = discountPrice === "" ? 0 : Number(discountPrice);
    if (costPrice !== undefined) service.costPrice = costPrice === "" ? 0 : Number(costPrice);
    if (priceUnit !== undefined) service.priceUnit = priceUnit;
    if (images !== undefined) {
      service.images = Array.isArray(images) ? images.filter((img) => img && img.trim()) : [];
    }
    if (isAvailable !== undefined) service.isAvailable = Boolean(isAvailable);
    if (featured !== undefined) service.featured = Boolean(featured);
    if (stock !== undefined) service.stock = Number(stock);
    if (turnaroundTime !== undefined) service.turnaroundTime = turnaroundTime;
    if (minOrderQuantity !== undefined) service.minOrderQuantity = Number(minOrderQuantity);
    if (paperOptions !== undefined) service.paperOptions = Array.isArray(paperOptions) ? paperOptions : [];
    if (finishOptions !== undefined) service.finishOptions = Array.isArray(finishOptions) ? finishOptions : [];
    if (supportedSizes !== undefined) service.supportedSizes = Array.isArray(supportedSizes) ? supportedSizes : [];
    if (specs !== undefined) service.specs = { ...service.specs, ...specs };
    if (displayOrder !== undefined) service.displayOrder = Number(displayOrder);

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: "Printing service updated successfully",
      printingService: updatedService,
    });
  } catch (error) {
    console.error("Error in updatePrintingService:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update printing service",
    });
  }
};

// @desc    Delete a printing service
// @route   DELETE /api/printing-services/:id
exports.deletePrintingService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await PrintingService.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Printing service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Printing service "${service.name}" deleted successfully`,
      serviceId: id,
    });
  } catch (error) {
    console.error("Error in deletePrintingService:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete printing service",
      error: error.message,
    });
  }
};

// @desc    Toggle availability status
// @route   PATCH /api/printing-services/:id/toggle-availability
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await PrintingService.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Printing service not found",
      });
    }

    service.isAvailable = !service.isAvailable;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Printing service status updated to ${service.isAvailable ? "Available" : "Unavailable"}`,
      printingService: service,
    });
  } catch (error) {
    console.error("Error in toggleAvailability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle status",
    });
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/printing-services/:id/toggle-featured
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await PrintingService.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Printing service not found",
      });
    }

    service.featured = !service.featured;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Printing service featured status set to ${service.featured}`,
      printingService: service,
    });
  } catch (error) {
    console.error("Error in toggleFeatured:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
    });
  }
};

// @desc    Get printing service statistics for admin dashboard
// @route   GET /api/printing-services/stats
exports.getPrintingServiceStats = async (req, res) => {
  try {
    const total = await PrintingService.countDocuments();
    const active = await PrintingService.countDocuments({ isAvailable: true });
    const inactive = await PrintingService.countDocuments({ isAvailable: false });
    const featured = await PrintingService.countDocuments({ featured: true });

    // Category counts
    const categoryStats = await PrintingService.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, avgPrice: { $avg: "$indicativePrice" } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        inactive,
        featured,
        categories: categoryStats,
      },
    });
  } catch (error) {
    console.error("Error in getPrintingServiceStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
