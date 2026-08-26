const Banner = require("../models/banner.model");

// @desc    Get all banners
// @route   GET /api/banners
exports.getBanners = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const query = {};

    if (activeOnly === "true" || activeOnly === true) {
      query.isActive = true;
    }

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    console.error("Error in getBanners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
      error: error.message,
    });
  }
};

// @desc    Get single banner by ID
// @route   GET /api/banners/:id
exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Error in getBannerById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banner",
    });
  }
};

// @desc    Create a new banner
// @route   POST /api/banners
exports.createBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      badge,
      imageUrl,
      ctaText,
      ctaLink,
      alignment,
      order,
      isActive,
      accentColor,
      overlayDarkness,
    } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Banner title and image URL are required",
      });
    }

    // Determine default order if not provided
    let bannerOrder = order !== undefined ? Number(order) : 0;
    if (order === undefined) {
      const highestOrderBanner = await Banner.findOne().sort({ order: -1 });
      bannerOrder = highestOrderBanner ? (highestOrderBanner.order || 0) + 1 : 0;
    }

    const banner = new Banner({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      badge: badge ? badge.trim() : "",
      imageUrl: imageUrl.trim(),
      ctaText: ctaText ? ctaText.trim() : "Shop Collection",
      ctaLink: ctaLink ? ctaLink.trim() : "/products",
      alignment: alignment || "left",
      order: bannerOrder,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      accentColor: accentColor || "#e11d48",
      overlayDarkness: overlayDarkness !== undefined ? Number(overlayDarkness) : 45,
    });

    const savedBanner = await banner.save();

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner: savedBanner,
    });
  } catch (error) {
    console.error("Error in createBanner:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create banner",
    });
  }
};

// @desc    Update an existing banner
// @route   PUT /api/banners/:id
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      badge,
      imageUrl,
      ctaText,
      ctaLink,
      alignment,
      order,
      isActive,
      accentColor,
      overlayDarkness,
    } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    if (title !== undefined) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (badge !== undefined) banner.badge = badge.trim();
    if (imageUrl !== undefined) banner.imageUrl = imageUrl.trim();
    if (ctaText !== undefined) banner.ctaText = ctaText.trim();
    if (ctaLink !== undefined) banner.ctaLink = ctaLink.trim();
    if (alignment !== undefined) banner.alignment = alignment;
    if (order !== undefined) banner.order = Number(order);
    if (isActive !== undefined) banner.isActive = Boolean(isActive);
    if (accentColor !== undefined) banner.accentColor = accentColor;
    if (overlayDarkness !== undefined) banner.overlayDarkness = Number(overlayDarkness);

    const updatedBanner = await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner,
    });
  } catch (error) {
    console.error("Error in updateBanner:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update banner",
    });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Banner "${banner.title}" deleted successfully`,
      bannerId: id,
    });
  } catch (error) {
    console.error("Error in deleteBanner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
    });
  }
};

// @desc    Quick toggle banner active status
// @route   PATCH /api/banners/:id/toggle-active
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      message: `Banner status updated to ${banner.isActive ? "Active (Live)" : "Draft (Hidden)"}`,
      banner,
    });
  } catch (error) {
    console.error("Error in toggleActive banner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle banner status",
    });
  }
};

// @desc    Reorder banners in batch
// @route   PATCH /api/banners/reorder
exports.reorderBanners = async (req, res) => {
  try {
    const { orderList } = req.body; // Array of { id, order }

    if (!Array.isArray(orderList)) {
      return res.status(400).json({
        success: false,
        message: "orderList must be an array of { id, order }",
      });
    }

    const updatePromises = orderList.map((item) =>
      Banner.findByIdAndUpdate(item.id, { order: Number(item.order) }, { new: true })
    );

    await Promise.all(updatePromises);
    const updatedBanners = await Banner.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: "Banners reordered successfully",
      banners: updatedBanners,
    });
  } catch (error) {
    console.error("Error in reorderBanners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reorder banners",
    });
  }
};
