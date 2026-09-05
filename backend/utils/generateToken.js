const jwt = require("jsonwebtoken");

const generateToken = (user, explicitType) => {
  const secret = process.env.JWT_SECRET || "pixel_perfect_fallback_secret_key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const accountType =
    explicitType ||
    (user.role === "admin" || user.role === "editor" ? "admin" : "customer");

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name || user.fullName,
      role: user.role || "customer",
      accountType,
    },
    secret,
    { expiresIn }
  );
};

module.exports = generateToken;
