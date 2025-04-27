/**
 * Utility functions for handling image URLs in the admin panel
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
    return `${BACKEND_URL_WITHOUT_API}${imageUrl}`;
  }

  // For uploaded files that just have the filename
  if (!imageUrl.startsWith("/")) {
    return `${BACKEND_URL_WITHOUT_API}/uploads/product/${imageUrl}`;
  }

  // Otherwise, it's a local path, return as is (likely a static asset)
  return imageUrl;
};
