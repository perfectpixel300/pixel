const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

// Helper to ensure default admin user exists
const ensureDefaultAdmin = async () => {
  const adminCount = await User.countDocuments();
  if (adminCount === 0) {
    const defaultAdmin = new User({
      name: "Pixel Perfect Admin",
      email: "admin@pixelperfect.com",
      password: "admin123",
      role: "admin",
    });
    await defaultAdmin.save();
    console.log("[Auth] Default admin account seeded: admin@pixelperfect.com / admin123");
  }
};

// @desc    Admin Login
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Auto-seed default admin if database is brand new
    await ensureDefaultAdmin();

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication server error",
      error: error.message,
    });
  }
};

// @desc    Register initial or new admin
// @route   POST /api/auth/register


// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
    });
  }
};
