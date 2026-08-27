/**
 * Optimizes image URLs (Cloudinary, Unsplash, etc.) for fastest delivery and modern formats.
 *
 * For Cloudinary images:
 * - Automatically injects `f_auto,q_auto` (serves AVIF/WebP based on browser support and compresses optimally).
 * - Optionally applies responsive sizing constraints (`w_xxx,c_limit`).
 *
 * @param {string} url - Original image URL
 * @param {Object} options - Optional parameters { width, height, crop, quality }
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return "";

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";

  // Cloudinary image URL optimization
  if (trimmedUrl.includes("res.cloudinary.com") && trimmedUrl.includes("/image/upload/")) {
    const parts = trimmedUrl.split("/image/upload/");
    if (parts.length === 2) {
      const base = parts[0] + "/image/upload/";
      let rest = parts[1];

      // Build transformation string
      const transforms = ["f_auto", "q_auto"];

      if (options.width) {
        transforms.push(`w_${options.width}`);
        transforms.push(options.crop ? `c_${options.crop}` : "c_limit");
      }
      if (options.height) {
        transforms.push(`h_${options.height}`);
      }

      const transformStr = transforms.join(",");

      // If the URL already has some transformation segment, avoid duplication
      if (rest.startsWith("f_auto,q_auto/")) {
        return trimmedUrl;
      }

      return `${base}${transformStr}/${rest}`;
    }
  }

  // Unsplash image URL optimization
  if (trimmedUrl.includes("images.unsplash.com")) {
    try {
      const urlObj = new URL(trimmedUrl);
      if (!urlObj.searchParams.has("auto")) {
        urlObj.searchParams.set("auto", "format");
      }
      if (!urlObj.searchParams.has("fit")) {
        urlObj.searchParams.set("fit", "crop");
      }
      if (!urlObj.searchParams.has("q")) {
        urlObj.searchParams.set("q", "80");
      }
      if (options.width && !urlObj.searchParams.has("w")) {
        urlObj.searchParams.set("w", String(options.width));
      }
      return urlObj.toString();
    } catch {
      return trimmedUrl;
    }
  }

  return trimmedUrl;
}
