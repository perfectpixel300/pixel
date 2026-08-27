const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Checks if Cloudinary credentials are configured in environment variables.
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Upload a file buffer to Cloudinary with automatic optimization.
 * Automatically applies auto-format (f_auto) and auto-quality (q_auto).
 * 
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {Object} options - Custom upload options (folder, tags, etc.)
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          "Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables."
        )
      );
    }

    const folderName = options.folder ? `pixel_perfect/${options.folder}` : "pixel_perfect/products";

    const uploadOptions = {
      folder: folderName,
      resource_type: "auto",
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 2000, crop: "limit" }, // limit max width to 2000px for speed without sacrificing quality
      ],
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      
      // Inject optimization parameters into secure_url if not already present
      let optimizedUrl = result.secure_url;
      if (optimizedUrl && optimizedUrl.includes("/upload/") && !optimizedUrl.includes("/f_auto,q_auto/")) {
        optimizedUrl = optimizedUrl.replace("/upload/", "/upload/f_auto,q_auto/");
      }

      resolve({
        ...result,
        secure_url: optimizedUrl,
        optimized_url: optimizedUrl,
      });
    });

    stream.end(fileBuffer);
  });
};

/**
 * Delete an asset from Cloudinary by public ID
 * @param {string} publicId
 * @returns {Promise<Object>}
 */
const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error("Cloudinary credentials are not configured."));
    }

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
};
