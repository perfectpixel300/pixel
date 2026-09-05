const express = require("express");
const router = express.Router();
const {
  adminLogin,
  adminGetMe,
  customerRegister,
  customerResendVerification,
  customerVerifyEmail,
  customerSetupProfile,
  customerLogin,
  customerGetMe,
  customerUpdateProfile,
} = require("../controllers/auth.controller");
const { protect, protectCustomer } = require("../middleware/auth.middleware");

// ==========================================
// 1. ADMIN ROUTES (Admin Studio Only)
// Normal users CANNOT register for admin!
// ==========================================
router.post("/admin/login", adminLogin);
router.post("/login", adminLogin); // Admin portal login
router.get("/admin/me", protect, adminGetMe);
router.get("/me", protect, adminGetMe); // Admin identity check

// ==========================================
// 2. CUSTOMER ROUTES (Normal Storefront Users)
// ==========================================
router.post("/customer/register", customerRegister);
router.post("/register", customerRegister);
router.post("/customer/verify-email", customerVerifyEmail);
router.post("/verify-email", customerVerifyEmail);
router.post("/customer/resend-verification", customerResendVerification);
router.post("/resend-verification", customerResendVerification);
router.post("/customer/setup-profile", protectCustomer, customerSetupProfile);
router.post("/setup-profile", protectCustomer, customerSetupProfile);
router.post("/customer/login", customerLogin);
router.get("/customer/me", protectCustomer, customerGetMe);
router.put("/customer/profile", protectCustomer, customerUpdateProfile);

module.exports = router;
