const Product = require("../models/product.model");
const Banner = require("../models/banner.model");
const Service = require("../models/service.model");

// @desc    Get aggregated dashboard stats and recent data
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      totalBanners,
      activeBanners,
      totalServices,
      activeServices,
      featuredServices,
      recentProducts,
      recentBanners,
      recentServices,
      categoryStats,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isAvailable: true }),
      Product.countDocuments({ isAvailable: false }),
      Product.countDocuments({ featured: true }),
      Banner.countDocuments(),
      Banner.countDocuments({ isActive: true }),
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Service.countDocuments({ isFeatured: true }),
      Product.find().sort({ createdAt: -1 }).limit(6),
      Banner.find().sort({ order: 1, createdAt: -1 }).limit(4),
      Service.find().sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 }).limit(6),
      Product.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$indicativePrice" },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Calculate total catalog value
    const catalogValueAgg = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$indicativePrice", { $ifNull: ["$stock", 1] }] } },
          avgPrice: { $avg: "$indicativePrice" },
        },
      },
    ]);

    const totalValue = catalogValueAgg.length > 0 ? Math.round(catalogValueAgg[0].totalValue) : 0;
    const averagePrice = catalogValueAgg.length > 0 ? Math.round(catalogValueAgg[0].avgPrice * 100) / 100 : 0;

    res.status(200).json({
      success: true,
      stats: {
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
          featured: featuredProducts,
          totalValue,
          averagePrice,
        },
        banners: {
          total: totalBanners,
          active: activeBanners,
          inactive: totalBanners - activeBanners,
        },
        services: {
          total: totalServices,
          active: activeServices,
          inactive: totalServices - activeServices,
          featured: featuredServices,
        },
        categoryDistribution: categoryStats.map((c) => ({
          category: c._id || "Uncategorized",
          count: c.count,
          avgPrice: Math.round(c.avgPrice * 100) / 100,
        })),
        recentProducts,
        recentBanners,
        recentServices,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
