const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Banner = require("../models/banner.model");
const Category = require("../models/category.model");
const Service = require("../models/service.model");
const ServiceCategory = require("../models/serviceCategory.model");
const ShopStatus = require("../models/shopStatus.model");
const {
  sampleCategories,
  sampleProducts,
  sampleBanners,
  sampleServices,
  sampleServiceCategories,
  defaultShopStatus,
} = require("../config/seedData");

// @desc    Seed database with initial categories, products, banners, services, service categories, and shop status
// @route   POST /api/seed
router.post("/", async (req, res) => {
  try {
    const { overwrite = false } = req.body;

    const productCount = await Product.countDocuments();
    const bannerCount = await Banner.countDocuments();
    const categoryCount = await Category.countDocuments();
    const serviceCount = await Service.countDocuments();
    const serviceCatCount = await ServiceCategory.countDocuments();
    const shopStatusDoc = await ShopStatus.findOne();

    if (
      !overwrite &&
      productCount > 0 &&
      bannerCount > 0 &&
      categoryCount > 0 &&
      serviceCount > 0 &&
      serviceCatCount > 0 &&
      shopStatusDoc
    ) {
      return res.status(200).json({
        success: true,
        message: "Database already populated. Use overwrite=true to reset.",
        categoryCount,
        productCount,
        bannerCount,
        serviceCount,
        serviceCategoryCount: serviceCatCount,
      });
    }

    if (overwrite) {
      await Category.deleteMany({});
      await Product.deleteMany({});
      await Banner.deleteMany({});
      await Service.deleteMany({});
      await ServiceCategory.deleteMany({});
      await ShopStatus.deleteMany({});
    }

    let seededCategories = [];
    let seededProducts = [];
    let seededBanners = [];
    let seededServices = [];
    let seededServiceCategories = [];

    if (categoryCount === 0 || overwrite) {
      seededCategories = await Category.insertMany(sampleCategories);
    }
    if (productCount === 0 || overwrite) {
      seededProducts = await Product.insertMany(sampleProducts);
    }
    if (bannerCount === 0 || overwrite) {
      seededBanners = await Banner.insertMany(sampleBanners);
    }
    if (serviceCount === 0 || overwrite) {
      seededServices = await Service.insertMany(sampleServices);
    }
    if (serviceCatCount === 0 || overwrite) {
      seededServiceCategories = await ServiceCategory.insertMany(sampleServiceCategories);
    }
    if (!shopStatusDoc || overwrite) {
      await ShopStatus.create(defaultShopStatus);
    }

    res.status(200).json({
      success: true,
      message:
        "Curated sample categories, products, banners, IT services, service categories, and shop status seeded successfully in NRs. currency!",
      categoryCount: seededCategories.length || categoryCount,
      productCount: seededProducts.length || productCount,
      bannerCount: seededBanners.length || bannerCount,
      serviceCount: seededServices.length || serviceCount,
      serviceCategoryCount: seededServiceCategories.length || serviceCatCount,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed database",
      error: error.message,
    });
  }
});

module.exports = router;
