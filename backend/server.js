const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const bannerRoutes = require("./routes/banner.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const contactRoutes = require("./routes/contact.routes");
const serviceRoutes = require("./routes/service.routes");
const serviceCategoryRoutes = require("./routes/serviceCategory.routes");
const shopStatusRoutes = require("./routes/shopStatus.routes");
const uploadRoutes = require("./routes/upload.routes");
const printingServiceRoutes = require("./routes/printingService.routes");
const printingCategoryRoutes = require("./routes/printingCategory.routes");
const promoBannerRoutes = require("./routes/promoBanner.routes");
const aboutRoutes = require("./routes/about.routes");
const blogRoutes = require("./routes/blog.routes");


const PORT = process.env.PORT || 5000;

// Initialize MongoDB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/promo-banners", promoBannerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/printing-services", printingServiceRoutes);
app.use("/api/printing-categories", printingCategoryRoutes);
app.use("/api/shop-status", shopStatusRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);

// Base route & Health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    brand: "Pixel Perfect",
    version: "2.3.0",
    currency: "NRs.",
    theme: "monochrome",
    endpoints: {
      auth: "/api/auth/login",
      products: "/api/products",
      categories: "/api/categories",
      banners: "/api/banners",
      services: "/api/services",
      serviceCategories: "/api/service-categories",
      shopStatus: "/api/shop-status",
      webDevelopment: "/api/services/web-development",
      contact: "/api/contact",
      dashboard: "/api/dashboard/stats",
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Pixel Perfect Backend running at http://localhost:${PORT}`);
});