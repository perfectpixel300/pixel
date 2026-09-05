const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");

// Protect middleware for Administrative Studio routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access administrative routes. Please log in as admin.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "pixel_perfect_fallback_secret_key";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return res.status(401).json({
        success: false,
        message: "Administrative privileges required.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin privileges required.",
    });
  }
};

// Protect middleware for Customer (Normal User) routes
exports.protectCustomer = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in to your account.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "pixel_perfect_fallback_secret_key";
    const decoded = jwt.verify(token, secret);

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer account not found.",
      });
    }

    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};
