const mongoose = require("mongoose");
const Contact = require("../models/contact.model");
const { sendInquiryNotification } = require("../utils/emailService");

// Standard email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Allowed name characters: Unicode letters, spaces, dots, hyphens, and apostrophes
const NAME_REGEX = /^[\p{L}\s.'-]+$/u;

// @desc    Submit inquiry (Public)
// @route   POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, productTitle } = req.body;

    // 1. Validate Name
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be text",
      });
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters",
      });
    }
    if (!NAME_REGEX.test(trimmedName) || !/\p{L}/u.test(trimmedName)) {
      return res.status(400).json({
        success: false,
        message: "Name contains invalid characters. Please use letters and spaces only.",
      });
    }

    // 2. Validate Email
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail.length < 5 || trimmedEmail.length > 254 || !EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address (e.g., name@example.com)",
      });
    }

    // 3. Validate Message
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required and must be text",
      });
    }
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 5 characters long",
      });
    }
    if (trimmedMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 5,000 characters",
      });
    }

    // 4. Sanitize optional fields
    const sanitizedSubject = typeof subject === "string" && subject.trim()
      ? subject.trim().slice(0, 200)
      : "General Inquiry";
    const sanitizedProductTitle = typeof productTitle === "string" && productTitle.trim()
      ? productTitle.trim().slice(0, 200)
      : "";

    // 5. Save inquiry to database
    const inquiry = await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      subject: sanitizedSubject,
      message: trimmedMessage,
      productTitle: sanitizedProductTitle,
    });

    // 6. Send email notification via Brevo API
    let emailResult = { success: false };
    try {
      emailResult = await sendInquiryNotification({
        name: inquiry.name,
        email: inquiry.email,
        subject: inquiry.subject,
        message: inquiry.message,
        productTitle: inquiry.productTitle,
        createdAt: inquiry.createdAt,
      });
    } catch (emailErr) {
      console.error("[Contact Controller] Email dispatch caught error:", emailErr);
    }

    res.status(201).json({
      success: true,
      message: "Thank you for your message. The Pixel Perfect team will respond shortly.",
      inquiry,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Submit contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
      error: error.message,
    });
  }
};

// @desc    Get all inquiries (Admin Protected)
// @route   GET /api/contact
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
};

// @desc    Update inquiry status (Admin Protected)
// @route   PATCH /api/contact/:id/status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID format",
      });
    }

    const validStatuses = ["unread", "read", "archived"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
      });
    }

    const inquiry = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated",
      inquiry,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

// @desc    Delete inquiry (Admin Protected)
// @route   DELETE /api/contact/:id
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID format",
      });
    }

    const inquiry = await Contact.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete inquiry",
    });
  }
};
