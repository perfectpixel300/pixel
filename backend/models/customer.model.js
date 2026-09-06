const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    countryCode: {
      type: String,
      trim: true,
      default: "+977",
    },
    contactNumber: {
      type: String,
      trim: true,
      maxlength: [30, "Contact number cannot exceed 30 characters"],
    },
    secondaryCountryCode: {
      type: String,
      trim: true,
      default: "+977",
    },
    secondaryContactNumber: {
      type: String,
      trim: true,
      default: "",
      maxlength: [30, "Secondary contact number cannot exceed 30 characters"],
    },
    currentAddress: {
      type: String,
      trim: true,
      maxlength: [200, "Current address cannot exceed 200 characters"],
    },
    province: {
      type: String,
      trim: true,
      default: "",
      maxlength: [80, "Province cannot exceed 80 characters"],
    },
    district: {
      type: String,
      trim: true,
      default: "",
      maxlength: [80, "District cannot exceed 80 characters"],
    },
    city: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "City cannot exceed 100 characters"],
    },
    streetAddress: {
      type: String,
      trim: true,
      default: "",
      maxlength: [150, "Street address cannot exceed 150 characters"],
    },
    deliveryAddress: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Delivery address cannot exceed 200 characters"],
    },
    deliveryProvince: {
      type: String,
      trim: true,
      default: "",
      maxlength: [80, "Delivery province cannot exceed 80 characters"],
    },
    deliveryDistrict: {
      type: String,
      trim: true,
      default: "",
      maxlength: [80, "Delivery district cannot exceed 80 characters"],
    },
    deliveryCity: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Delivery city cannot exceed 100 characters"],
    },
    deliveryStreetAddress: {
      type: String,
      trim: true,
      default: "",
      maxlength: [150, "Delivery street address cannot exceed 150 characters"],
    },
    nearbyLandmark: {
      type: String,
      trim: true,
      maxlength: [120, "Nearby landmark cannot exceed 120 characters"],
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    deletionRequested: {
      type: Boolean,
      default: false,
    },
    deletionRequestedAt: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
customerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
customerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
