const {
  uploadToCloudinary,
  deleteFromCloudinary,
  isCloudinaryConfigured,
} = require("../config/cloudinary");

// @desc    Upload single image to Cloudinary
// @route   POST /api/upload
// @access  Protected / Admin
exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided in request. Please upload a file.",
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary credentials are not configured on server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend .env file.",
      });
    }

    const folder = req.body.folder || "products";
    const result = await uploadToCloudinary(req.file.buffer, { folder });

    res.status(200).json({
      success: true,
      message: "Image uploaded and optimized successfully",
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error("Error in uploadSingle:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image to Cloudinary",
    });
  }
};

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload/multiple
// @access  Protected / Admin
exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided in request. Please upload one or more files.",
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary credentials are not configured on server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend .env file.",
      });
    }

    const folder = req.body.folder || "products";

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, { folder })
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${results.length} images uploaded and optimized successfully`,
      count: results.length,
      urls: results.map((r) => r.secure_url),
      images: results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
        format: r.format,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
      })),
    });
  } catch (error) {
    console.error("Error in uploadMultiple:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload images to Cloudinary",
    });
  }
};

// @desc    Delete an image from Cloudinary
// @route   DELETE /api/upload
// @access  Protected / Admin
exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "public_id is required to delete image",
      });
    }

    const result = await deleteFromCloudinary(public_id);

    res.status(200).json({
      success: true,
      message: "Image deleted from Cloudinary successfully",
      result,
    });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete image from Cloudinary",
    });
  }
};
