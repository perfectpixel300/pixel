const Product = require("../models/product.model");
const Banner = require("../models/banner.model");
const Service = require("../models/service.model");
const PrintingService = require("../models/printingService.model");

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
      totalPrintingServices,
      activePrintingServices,
      recentProducts,
      recentBanners,
      recentServices,
      recentPrintingServices,
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
      PrintingService.countDocuments(),
      PrintingService.countDocuments({ isAvailable: true }),
      Product.find().sort({ createdAt: -1 }).limit(6),
      Banner.find().sort({ order: 1, createdAt: -1 }).limit(4),
      Service.find().sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 }).limit(6),
      PrintingService.find().sort({ createdAt: -1 }).limit(6),
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

    // Calculate total catalog value and total inventory cost with effective selling price
    const catalogValueAgg = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: {
              $multiply: [
                {
                  $cond: [
                    {
                      $and: [
                        { $gt: ["$discountPrice", 0] },
                        { $lt: ["$discountPrice", "$indicativePrice"] },
                      ],
                    },
                    "$discountPrice",
                    { $ifNull: ["$indicativePrice", 0] },
                  ],
                },
                { $ifNull: ["$stock", 0] },
              ],
            },
          },
          totalCost: {
            $sum: {
              $multiply: [
                { $ifNull: ["$costPrice", 0] },
                { $ifNull: ["$stock", 0] },
              ],
            },
          },
          avgPrice: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$discountPrice", 0] },
                    { $lt: ["$discountPrice", "$indicativePrice"] },
                  ],
                },
                "$discountPrice",
                { $ifNull: ["$indicativePrice", 0] },
              ],
            },
          },
        },
      },
    ]);

    const totalValue = catalogValueAgg.length > 0 ? Math.round(catalogValueAgg[0].totalValue) : 0;
    const totalCost = catalogValueAgg.length > 0 ? Math.round(catalogValueAgg[0].totalCost) : 0;
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
          totalCost,
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
        printingServices: {
          total: totalPrintingServices,
          active: activePrintingServices,
          inactive: totalPrintingServices - activePrintingServices,
        },
        categoryDistribution: categoryStats.map((c) => ({
          category: c._id || "Uncategorized",
          count: c.count,
          avgPrice: Math.round(c.avgPrice * 100) / 100,
        })),
        recentProducts,
        recentBanners,
        recentServices,
        recentPrintingServices,
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
