const Contact = require("../models/contact.model");

// @desc    Submit inquiry (Public)
// @route   POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, productTitle } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Email, Message)",
      });
    }

    const inquiry = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : "General Inquiry",
      message: message.trim(),
      productTitle: productTitle || "",
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your message. The Pixel Perfect team will respond shortly.",
      inquiry,
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
