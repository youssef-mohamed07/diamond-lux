/**
 * Utility functions for handling image URLs
 */

// Default fallback image
export const DEFAULT_FALLBACK_IMAGE = "/images/placeholder-diamond.jpg";

// Backend URL without /api
const BACKEND_URL_WITHOUT_API = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL.replace("/api", "")
  : "http://localhost:3000";

/**
 * Checks if a URL is external (starts with http:// or https://)
 * @param {string} url The URL to check
 * @returns {boolean} True if the URL is external
 */
export const isExternalUrl = (url) => {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
};

/**
 * Gets a URL for an image, handling both local and external URLs
 * @param {string} imageUrl The image URL from the API
 * @param {string} fallbackUrl Optional fallback URL if the image URL is invalid
 * @returns {string} The processed image URL
 */
export const getImageUrl = (imageUrl, fallbackUrl = DEFAULT_FALLBACK_IMAGE) => {
  if (!imageUrl) {
    return fallbackUrl;
  }

  // If it's already an external URL, return it as is
  if (isExternalUrl(imageUrl)) {
    return imageUrl;
  }

  // If the URL already includes /uploads/, assume it's a complete path
  if (imageUrl.startsWith("/uploads/")) {
    // Ensure we don't have double slashes by removing trailing slash from base URL if needed
    const baseUrl = BACKEND_URL_WITHOUT_API.endsWith("/") 
      ? BACKEND_URL_WITHOUT_API.slice(0, -1) 
      : BACKEND_URL_WITHOUT_API;
    return `${baseUrl}${imageUrl}`;
  }

  // For uploaded files that just have the filename
  if (!imageUrl.startsWith("/")) {
    // Ensure we have a proper path separator
    const baseUrl = BACKEND_URL_WITHOUT_API.endsWith("/") 
      ? BACKEND_URL_WITHOUT_API 
      : `${BACKEND_URL_WITHOUT_API}/`;
    return `${baseUrl}uploads/product/${imageUrl}`;
  }

  // Otherwise, it's a local path, return as is (likely a static asset)
  console.log("local path: ", imageUrl);
  console.log("BACKEND_URL_WITHOUT_API: ", BACKEND_URL_WITHOUT_API);
  console.log("BACKEND_URL_WITHOUT_API/uploads/product/: ", `${BACKEND_URL_WITHOUT_API}/uploads/product/`);
  

  return imageUrl;
};

/**
 * Gets a URL for a diamond shape image
 * @param {string} shapeName The name or ID of the diamond shape
 * @returns {string} The diamond shape image URL
 */
export const getDiamondShapeImageUrl = (shapeName) => {
  if (!shapeName) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Handle both shape name and shape ID
  const shapeId = shapeName.includes("_")
    ? shapeName
    : shapeName.toLowerCase().replace(/\s+/g, "_");

  return `${BACKEND_URL_WITHOUT_API}/uploads/diamond-shapes/${shapeId}.webp`;
};
