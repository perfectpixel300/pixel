const PromoBanner = require("../models/promoBanner.model");

// @desc    Get all promo/announcement banners
// @route   GET /api/promo-banners
exports.getPromoBanners = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const query = {};

    if (activeOnly === "true" || activeOnly === true) {
      query.isActive = true;
    }

    const promoBanners = await PromoBanner.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: promoBanners.length,
      promoBanners,
    });
  } catch (error) {
    console.error("Error in getPromoBanners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch promo banners",
      error: error.message,
    });
  }
};

// @desc    Get single promo banner by ID
// @route   GET /api/promo-banners/:id
exports.getPromoBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const promoBanner = await PromoBanner.findById(id);

    if (!promoBanner) {
      return res.status(404).json({
        success: false,
        message: "Promo banner not found",
      });
    }

    res.status(200).json({
      success: true,
      promoBanner,
    });
  } catch (error) {
    console.error("Error in getPromoBannerById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch promo banner",
    });
  }
};

// @desc    Create a new promo banner / offer / philosophy strip
// @route   POST /api/promo-banners
exports.createPromoBanner = async (req, res) => {
  try {
    const {
      badge,
      title,
      subtitle,
      imageUrl,
      hasTimer,
      timerEndDate,
      timerTitle,
      ctaText,
      ctaLink,
      alignment,
      style,
      order,
      isActive,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Headline title is required",
      });
    }

    // Determine default order if not provided
    let bannerOrder = order !== undefined ? Number(order) : 0;
    if (order === undefined) {
      const highestOrderBanner = await PromoBanner.findOne().sort({ order: -1 });
      bannerOrder = highestOrderBanner ? (highestOrderBanner.order || 0) + 1 : 0;
    }

    const promoBanner = new PromoBanner({
      badge: badge ? badge.trim() : "Our Philosophy",
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      imageUrl: imageUrl ? imageUrl.trim() : "",
      hasTimer: Boolean(hasTimer),
      timerEndDate: timerEndDate ? new Date(timerEndDate) : null,
      timerTitle: timerTitle ? timerTitle.trim() : "Offer Ends In",
      ctaText: ctaText ? ctaText.trim() : "",
      ctaLink: ctaLink ? ctaLink.trim() : "/products",
      alignment: alignment || "center",
      style: style || "philosophy",
      order: bannerOrder,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    const savedBanner = await promoBanner.save();

    res.status(201).json({
      success: true,
      message: "Promo banner created successfully",
      promoBanner: savedBanner,
    });
  } catch (error) {
    console.error("Error in createPromoBanner:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create promo banner",
    });
  }
};

// @desc    Update an existing promo banner
// @route   PUT /api/promo-banners/:id
exports.updatePromoBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      badge,
      title,
      subtitle,
      imageUrl,
      hasTimer,
      timerEndDate,
      timerTitle,
      ctaText,
      ctaLink,
      alignment,
      style,
      order,
      isActive,
    } = req.body;

    const promoBanner = await PromoBanner.findById(id);
    if (!promoBanner) {
      return res.status(404).json({
        success: false,
        message: "Promo banner not found",
      });
    }

    if (badge !== undefined) promoBanner.badge = badge.trim();
    if (title !== undefined) promoBanner.title = title.trim();
    if (subtitle !== undefined) promoBanner.subtitle = subtitle.trim();
    if (imageUrl !== undefined) promoBanner.imageUrl = imageUrl.trim();
    if (hasTimer !== undefined) promoBanner.hasTimer = Boolean(hasTimer);
    if (timerEndDate !== undefined) {
      promoBanner.timerEndDate = timerEndDate ? new Date(timerEndDate) : null;
    }
    if (timerTitle !== undefined) promoBanner.timerTitle = timerTitle.trim();
    if (ctaText !== undefined) promoBanner.ctaText = ctaText.trim();
    if (ctaLink !== undefined) promoBanner.ctaLink = ctaLink.trim();
    if (alignment !== undefined) promoBanner.alignment = alignment;
    if (style !== undefined) promoBanner.style = style;
    if (order !== undefined) promoBanner.order = Number(order);
    if (isActive !== undefined) promoBanner.isActive = Boolean(isActive);

    const updatedBanner = await promoBanner.save();

    res.status(200).json({
      success: true,
      message: "Promo banner updated successfully",
      promoBanner: updatedBanner,
    });
  } catch (error) {
    console.error("Error in updatePromoBanner:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update promo banner",
    });
  }
};

// @desc    Delete a promo banner
// @route   DELETE /api/promo-banners/:id
exports.deletePromoBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const promoBanner = await PromoBanner.findByIdAndDelete(id);

    if (!promoBanner) {
      return res.status(404).json({
        success: false,
        message: "Promo banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Promo banner "${promoBanner.title}" deleted successfully`,
      promoBannerId: id,
    });
  } catch (error) {
    console.error("Error in deletePromoBanner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete promo banner",
    });
  }
};

// @desc    Toggle promo banner active status
// @route   PATCH /api/promo-banners/:id/toggle-active
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const promoBanner = await PromoBanner.findById(id);

    if (!promoBanner) {
      return res.status(404).json({
        success: false,
        message: "Promo banner not found",
      });
    }

    promoBanner.isActive = !promoBanner.isActive;
    await promoBanner.save();

    res.status(200).json({
      success: true,
      message: `Promo banner status updated to ${promoBanner.isActive ? "Active (Live)" : "Draft (Hidden)"}`,
      promoBanner,
    });
  } catch (error) {
    console.error("Error in toggleActive promo banner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle promo banner status",
    });
  }
};

// @desc    Reorder promo banners in batch
// @route   PATCH /api/promo-banners/reorder
exports.reorderPromoBanners = async (req, res) => {
  try {
    const { orderList } = req.body; // Array of { id, order }

    if (!Array.isArray(orderList)) {
      return res.status(400).json({
        success: false,
        message: "orderList must be an array of { id, order }",
      });
    }

    const updatePromises = orderList.map((item) =>
      PromoBanner.findByIdAndUpdate(item.id, { order: Number(item.order) }, { new: true })
    );

    await Promise.all(updatePromises);
    const updatedBanners = await PromoBanner.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: "Promo banners reordered successfully",
      promoBanners: updatedBanners,
    });
  } catch (error) {
    console.error("Error in reorderPromoBanners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reorder promo banners",
    });
  }
};
