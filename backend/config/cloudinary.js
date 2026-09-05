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
 * Extract Cloudinary public_id from a URL or public_id string.
 * Handles transformed URLs (e.g. f_auto,q_auto, w_2000, etc.),
 * version strings (e.g. v123456789), and nested folders (pixel_perfect/products/...).
 * @param {string} urlOrId
 * @returns {string|null}
 */
const extractPublicId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  const str = urlOrId.trim();
  if (!str.startsWith("http://") && !str.startsWith("https://")) {
    return str;
  }
  if (!str.includes("res.cloudinary.com") && !str.includes("cloudinary.com")) {
    return null;
  }

  try {
    const parsed = new URL(str);
    const pathname = parsed.pathname;
    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let pathAfterUpload = pathname.substring(uploadIndex + "/upload/".length);

    // Strip out version if present: /v\d+/
    const versionMatch = pathAfterUpload.match(/(?:^|\/)v\d+\/(.+)$/);
    if (versionMatch) {
      pathAfterUpload = versionMatch[1];
    } else {
      const segments = pathAfterUpload.split("/");
      const cleanSegments = [];
      let foundContent = false;
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (!foundContent) {
          if (seg.startsWith("pixel_perfect") || (!seg.includes(",") && !seg.match(/^[a-z]{1,2}_/))) {
            foundContent = true;
            cleanSegments.push(seg);
          }
        } else {
          cleanSegments.push(seg);
        }
      }
      pathAfterUpload = cleanSegments.join("/");
    }

    // Remove file extension
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload || null;
  } catch {
    return null;
  }
};

/**
 * Delete an asset from Cloudinary by public ID or full Cloudinary URL
 * @param {string} publicIdOrUrl
 * @returns {Promise<Object>}
 */
const deleteFromCloudinary = (publicIdOrUrl) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error("Cloudinary credentials are not configured."));
    }

    const publicId = extractPublicId(publicIdOrUrl) || publicIdOrUrl;
    if (!publicId) {
      return resolve({ result: "not_found" });
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
  extractPublicId,
};

