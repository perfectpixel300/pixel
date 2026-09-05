const mongoose = require("mongoose");
const Review = require("../models/review.model");
const Product = require("../models/product.model");
const { sendReviewConfirmationEmail } = require("../utils/emailService");

/**
 * Mask email or contact with stars (*) to prevent public exposure
 * Example:
 *  "john.doe@example.com" -> "j******e@e*****e.com"
 *  "al@gmail.com" -> "a*@g***l.com"
 *  "9801234567" -> "98******67"
 */
function maskContact(contact) {
  if (!contact) return "";
  const str = String(contact).trim();

  if (str.includes("@")) {
    const parts = str.split("@");
    const user = parts[0] || "";
    const domain = parts[1] || "";
    const domainParts = domain.split(".");
    const ext = domainParts.length > 1 ? "." + domainParts.pop() : "";
    const domName = domainParts.join(".");

    const maskedUser =
      user.length <= 2
        ? user[0] + "*".repeat(Math.max(1, user.length - 1))
        : user[0] + "*".repeat(Math.max(3, user.length - 2)) + user[user.length - 1];

    const maskedDomain =
      domName.length <= 2
        ? (domName[0] || "*") + "*"
        : domName[0] + "*".repeat(Math.max(3, domName.length - 2)) + domName[domName.length - 1];

    return `${maskedUser}@${maskedDomain}${ext}`;
  }

  // Non-email phone/contact
  if (str.length > 4) {
    return str.slice(0, 2) + "*".repeat(Math.max(2, str.length - 4)) + str.slice(-2);
  }
  return "*".repeat(str.length);
}

// @desc    Submit a new product review (Public, no login required)
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { product: prodId, productId, firstName, lastName, emailOrContact, rating, comment } = req.body;
    const targetProductId = prodId || productId;

    if (!targetProductId || !mongoose.Types.ObjectId.isValid(targetProductId)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({
        success: false,
        message: "First name is required",
      });
    }

    if (!emailOrContact || !emailOrContact.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email or contact information is required",
      });
    }

    const numRating = Number(rating);
    if (!numRating || isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid rating between 1 and 5 stars",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review description is required",
      });
    }

    // Verify product exists
    const productDoc = await Product.findById(targetProductId).select("name slug");
    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = new Review({
      product: targetProductId,
      firstName: firstName.trim(),
      lastName: (lastName || "").trim(),
      emailOrContact: emailOrContact.trim(),
      rating: Math.round(numRating),
      comment: comment.trim(),
    });

    const savedReview = await review.save();

    // Trigger async email confirmation if valid email address provided
    if (emailOrContact.includes("@")) {
      sendReviewConfirmationEmail({
        toEmail: emailOrContact.trim(),
        firstName: firstName.trim(),
        lastName: (lastName || "").trim(),
        rating: Math.round(numRating),
        comment: comment.trim(),
        productName: productDoc.name,
      }).catch((err) => {
        console.error("Failed to send review confirmation email:", err.message);
      });
    }

    const maskedOutput = {
      ...savedReview.toObject(),
      emailOrContact: maskContact(savedReview.emailOrContact),
    };

    res.status(201).json({
      success: true,
      message: "Your review has been submitted successfully!",
      review: maskedOutput,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit review",
    });
  }
};

// @desc    Get public reviews for a product (with masked email & summary stats)
// @route   GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    let targetProductId = productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      // Look up by slug
      const foundProduct = await Product.findOne({ slug: productId }).select("_id");
      if (!foundProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      targetProductId = foundProduct._id;
    }

    const reviews = await Review.find({
      product: targetProductId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;

    reviews.forEach((r) => {
      const rScore = Math.min(5, Math.max(1, Math.round(r.rating)));
      ratingDistribution[rScore] = (ratingDistribution[rScore] || 0) + 1;
      ratingSum += r.rating;
    });

    const averageRating = totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : 0;

    // Mask user contact / email for public display
    const maskedReviews = reviews.map((r) => ({
      _id: r._id,
      product: r.product,
      firstName: r.firstName,
      lastName: r.lastName,
      emailOrContact: maskContact(r.emailOrContact),
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      success: true,
      reviews: maskedReviews,
      stats: {
        totalReviews,
        averageRating,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews",
      error: error.message,
    });
  }
};

// @desc    Get all reviews for Admin Panel (Unmasked emails, populated products)
// @route   GET /api/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { search, rating, productId } = req.query;
    const filter = {};

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      filter.product = productId;
    }

    if (rating && !isNaN(Number(rating))) {
      filter.rating = Number(rating);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { emailOrContact: searchRegex },
        { comment: searchRegex },
      ];
    }

    const reviews = await Review.find(filter)
      .populate("product", "name slug images category indicativePrice")
      .sort({ createdAt: -1 });

    const total = reviews.length;
    let sum = 0;
    reviews.forEach((r) => (sum += r.rating));
    const averageRating = total > 0 ? Number((sum / total).toFixed(1)) : 0;

    res.status(200).json({
      success: true,
      reviews,
      stats: {
        total,
        averageRating,
      },
    });
  } catch (error) {
    console.error("Error in getAllReviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// @desc    Delete a review (Admin protected)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
