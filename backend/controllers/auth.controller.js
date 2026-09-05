const crypto = require("crypto");
const User = require("../models/user.model");
const Customer = require("../models/customer.model");
const generateToken = require("../utils/generateToken");
const {
  sendActivationEmail,
  sendDeletionRequestedEmail,
  sendDeletionApprovedEmail,
} = require("../utils/emailService");

// Helper to ensure default admin user exists
const ensureDefaultAdmin = async () => {
  const adminCount = await User.countDocuments({ role: "admin" });
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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ==========================================
// 1. ADMIN AUTHENTICATION (Restricted)
// Users CANNOT register for admin!
// ==========================================

// @desc    Admin Studio Login
// @route   POST /api/auth/admin/login  (also POST /api/auth/login)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both administrative email and password.",
      });
    }

    await ensureDefaultAdmin();

    const cleanEmail = email.toLowerCase().trim();
    const admin = await User.findOne({ email: cleanEmail }).select("+password");

    if (!admin || (admin.role !== "admin" && admin.role !== "editor")) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrative credentials.",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrative credentials.",
      });
    }

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: "Admin authenticated successfully.",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Login error:", error);
    res.status(500).json({
      success: false,
      message: "Administrative authentication server error.",
      error: error.message,
    });
  }
};

// @desc    Get logged in admin
// @route   GET /api/auth/admin/me (also GET /api/auth/me)
exports.adminGetMe = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Admin GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve administrative profile.",
    });
  }
};

// ==========================================
// 2. NORMAL USER / CUSTOMER AUTHENTICATION
// Users register strictly as normal customers.
// They CANNOT register as admin.
// ==========================================

// @desc    Customer Register (Sends email activation link)
// @route   POST /api/auth/customer/register (also POST /api/auth/register)
exports.customerRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: cleanEmail });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
    const activationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    if (existingCustomer) {
      if (existingCustomer.isEmailVerified && existingCustomer.isProfileComplete) {
        return res.status(400).json({
          success: false,
          message: "An account with this email address already exists. Please log in.",
        });
      }

      // Customer exists but unverified: refresh token and password
      existingCustomer.password = password;
      existingCustomer.emailVerificationToken = verificationToken;
      existingCustomer.emailVerificationExpires = tokenExpires;
      await existingCustomer.save();

      await sendActivationEmail({
        toEmail: cleanEmail,
        activationLink,
      });

      return res.status(200).json({
        success: true,
        message: "A verification email has been resent to your inbox. Please click the link to activate your account.",
        email: cleanEmail,
      });
    }

    // Create new customer (STRICTLY in Customer collection, NEVER admin)
    const newCustomer = new Customer({
      email: cleanEmail,
      password,
      isEmailVerified: false,
      isProfileComplete: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: tokenExpires,
    });

    await newCustomer.save();

    // Send activation email
    await sendActivationEmail({
      toEmail: cleanEmail,
      activationLink,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful! We have sent an activation link to your email. Please check your inbox.",
      email: cleanEmail,
    });
  } catch (error) {
    console.error("Customer Registration error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
      error: error.message,
    });
  }
};

// @desc    Resend Customer email verification link
// @route   POST /api/auth/customer/resend-verification
exports.customerResendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const customer = await Customer.findOne({ email: cleanEmail });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    if (customer.isEmailVerified && customer.isProfileComplete) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified and active. Please log in directly.",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    customer.emailVerificationToken = verificationToken;
    customer.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await customer.save({ validateBeforeSave: false });

    const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
    const activationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    await sendActivationEmail({
      toEmail: cleanEmail,
      activationLink,
    });

    res.status(200).json({
      success: true,
      message: "A new activation link has been sent to your email. Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email.",
      error: error.message,
    });
  }
};

// @desc    Verify Customer email activation token
// @route   POST /api/auth/customer/verify-email
exports.customerVerifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const customer = await Customer.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Activation link is invalid or has expired. Please request a new verification email.",
      });
    }

    customer.isEmailVerified = true;
    await customer.save({ validateBeforeSave: false });

    const sessionToken = generateToken(customer);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Please complete your profile to activate your account.",
      token: sessionToken,
      email: customer.email,
      isProfileComplete: customer.isProfileComplete,
      user: {
        id: customer._id,
        email: customer.email,
        isEmailVerified: true,
        isProfileComplete: customer.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      success: false,
      message: "Email verification failed.",
      error: error.message,
    });
  }
};

// @desc    Complete Customer account onboarding/profile setup
// @route   POST /api/auth/customer/setup-profile
exports.customerSetupProfile = async (req, res) => {
  try {
    const {
      fullName,
      countryCode,
      contactNumber,
      secondaryCountryCode,
      secondaryContactNumber,
      currentAddress,
      nearbyLandmark,
      dateOfBirth,
    } = req.body;

    if (!fullName || !contactNumber || !currentAddress || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Primary Contact Number, Current Address, and Date of Birth are all required.",
      });
    }

    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found.",
      });
    }

    if (!customer.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before setting up your profile.",
      });
    }

    customer.fullName = fullName.trim();
    customer.countryCode = (countryCode || "+977").trim();
    customer.contactNumber = contactNumber.trim();
    customer.secondaryCountryCode = (secondaryCountryCode || "+977").trim();
    customer.secondaryContactNumber = (secondaryContactNumber || "").trim();
    customer.currentAddress = currentAddress.trim();
    customer.nearbyLandmark = (nearbyLandmark || "").trim();
    customer.dateOfBirth = dateOfBirth.trim();
    customer.isProfileComplete = true;
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpires = undefined;

    await customer.save({ validateBeforeSave: false });

    const token = generateToken(customer, "customer");

    res.status(200).json({
      success: true,
      message: "Account setup successfully completed! Welcome to Pixel Perfect.",
      token,
      user: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        countryCode: customer.countryCode || "+977",
        contactNumber: customer.contactNumber,
        secondaryCountryCode: customer.secondaryCountryCode || "+977",
        secondaryContactNumber: customer.secondaryContactNumber || "",
        currentAddress: customer.currentAddress,
        nearbyLandmark: customer.nearbyLandmark,
        dateOfBirth: customer.dateOfBirth,
        isEmailVerified: customer.isEmailVerified,
        isProfileComplete: customer.isProfileComplete,
      },
    });
  } catch (error) {
    console.error("Setup profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete account profile setup.",
      error: error.message,
    });
  }
};

// @desc    Customer Login
// @route   POST /api/auth/customer/login
exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const customer = await Customer.findOne({ email: cleanEmail }).select("+password");

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!customer.isEmailVerified) {
      return res.status(403).json({
        success: false,
        unverified: true,
        email: customer.email,
        message: "Your email has not been verified yet. Please check your inbox for the activation link.",
      });
    }

    if (!customer.isProfileComplete) {
      const setupToken = generateToken(customer);
      return res.status(403).json({
        success: false,
        incompleteProfile: true,
        setupToken,
        email: customer.email,
        message: "Your account profile setup is not complete. Please finish setting up your account.",
      });
    }

    customer.lastLogin = new Date();
    await customer.save({ validateBeforeSave: false });

    const token = generateToken(customer);

    res.status(200).json({
      success: true,
      message: "Authenticated successfully.",
      token,
      user: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        countryCode: customer.countryCode || "+977",
        contactNumber: customer.contactNumber,
        secondaryCountryCode: customer.secondaryCountryCode || "+977",
        secondaryContactNumber: customer.secondaryContactNumber || "",
        currentAddress: customer.currentAddress,
        nearbyLandmark: customer.nearbyLandmark,
        dateOfBirth: customer.dateOfBirth,
        isEmailVerified: customer.isEmailVerified,
        isProfileComplete: customer.isProfileComplete,
        deletionRequested: customer.deletionRequested || false,
        deletionRequestedAt: customer.deletionRequestedAt || null,
      },
    });
  } catch (error) {
    console.error("Customer Login error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication server error.",
      error: error.message,
    });
  }
};

// @desc    Get logged in Customer profile
// @route   GET /api/auth/customer/me
exports.customerGetMe = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        countryCode: customer.countryCode || "+977",
        contactNumber: customer.contactNumber,
        secondaryCountryCode: customer.secondaryCountryCode || "+977",
        secondaryContactNumber: customer.secondaryContactNumber || "",
        currentAddress: customer.currentAddress,
        nearbyLandmark: customer.nearbyLandmark,
        dateOfBirth: customer.dateOfBirth,
        isEmailVerified: customer.isEmailVerified,
        isProfileComplete: customer.isProfileComplete,
        deletionRequested: customer.deletionRequested || false,
        deletionRequestedAt: customer.deletionRequestedAt || null,
        lastLogin: customer.lastLogin,
        createdAt: customer.createdAt,
      },
    });
  } catch (error) {
    console.error("Customer GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customer profile.",
    });
  }
};

// @desc    Update Customer profile
// @route   PUT /api/auth/customer/profile
exports.customerUpdateProfile = async (req, res) => {
  try {
    const {
      fullName,
      countryCode,
      contactNumber,
      secondaryCountryCode,
      secondaryContactNumber,
      currentAddress,
      nearbyLandmark,
      dateOfBirth,
    } = req.body;

    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    if (fullName) customer.fullName = fullName.trim();
    if (countryCode) customer.countryCode = countryCode.trim();
    if (contactNumber) customer.contactNumber = contactNumber.trim();
    if (secondaryCountryCode !== undefined) customer.secondaryCountryCode = secondaryCountryCode.trim();
    if (secondaryContactNumber !== undefined) customer.secondaryContactNumber = secondaryContactNumber.trim();
    if (currentAddress) customer.currentAddress = currentAddress.trim();
    if (nearbyLandmark !== undefined) customer.nearbyLandmark = nearbyLandmark.trim();
    if (dateOfBirth) customer.dateOfBirth = dateOfBirth.trim();

    await customer.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        countryCode: customer.countryCode || "+977",
        contactNumber: customer.contactNumber,
        secondaryCountryCode: customer.secondaryCountryCode || "+977",
        secondaryContactNumber: customer.secondaryContactNumber || "",
        currentAddress: customer.currentAddress,
        nearbyLandmark: customer.nearbyLandmark,
        dateOfBirth: customer.dateOfBirth,
        isEmailVerified: customer.isEmailVerified,
        isProfileComplete: customer.isProfileComplete,
        deletionRequested: customer.deletionRequested || false,
        deletionRequestedAt: customer.deletionRequestedAt || null,
      },
    });
  } catch (error) {
    console.error("Customer Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

// @desc    Customer requests account deletion
// @route   POST /api/auth/customer/delete-request
exports.customerRequestDeletion = async (req, res) => {
  try {
    const { password } = req.body;

    const customer = await Customer.findById(req.customer.id).select("+password");
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your password to confirm account deletion request.",
      });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Verification failed.",
      });
    }

    customer.deletionRequested = true;
    customer.deletionRequestedAt = new Date();
    await customer.save({ validateBeforeSave: false });

    // Send confirmation email to customer
    await sendDeletionRequestedEmail({
      toEmail: customer.email,
      name: customer.fullName,
    });

    res.status(200).json({
      success: true,
      message:
        "Your account deletion request has been submitted. It will take approximately 24 hours to process and finalize. A confirmation email has been sent.",
      deletionRequested: true,
      deletionRequestedAt: customer.deletionRequestedAt,
    });
  } catch (error) {
    console.error("Customer Request Deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit account deletion request.",
      error: error.message,
    });
  }
};

// @desc    Customer cancels account deletion request
// @route   POST /api/auth/customer/cancel-delete-request
exports.customerCancelDeletion = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found.",
      });
    }

    customer.deletionRequested = false;
    customer.deletionRequestedAt = null;
    await customer.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Your account deletion request has been cancelled.",
      deletionRequested: false,
    });
  } catch (error) {
    console.error("Customer Cancel Deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel deletion request.",
      error: error.message,
    });
  }
};

// @desc    Admin: Get all registered customers / users
// @route   GET /api/auth/admin/customers
exports.adminGetCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .select("-password -emailVerificationToken -emailVerificationExpires")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Admin Get Customers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve registered users.",
      error: error.message,
    });
  }
};

// @desc    Admin: Approve and permanently delete customer account
// @route   DELETE /api/auth/admin/customers/:id
exports.adminApproveDeleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found.",
      });
    }

    const email = customer.email;
    const name = customer.fullName;

    // Send final deletion approved notification email to customer
    await sendDeletionApprovedEmail({
      toEmail: email,
      name,
    });

    // Permanently remove customer from database
    await Customer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Customer account for ${email} has been permanently deleted and confirmed via email.`,
      deletedId: id,
    });
  } catch (error) {
    console.error("Admin Approve Delete Customer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to permanently delete customer account.",
      error: error.message,
    });
  }
};

