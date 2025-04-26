// Helper function to get the backend URL for image paths
export const getBackendImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Get the backend URL from environment variables
  const backendURL = import.meta.env.VITE_BACKEND_URL || '';
  // Remove /api from the backend URL if present
  const baseUrl = backendURL.replace('/api', '');
  
  // If the image path already starts with a slash, remove it to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  return `${baseUrl}/${cleanPath}`;
};

// Get the diamond shape image or provide a fallback
export const getDiamondShapeImage = (shape) => {
  if (!shape) return null;
  
  // If there's an image, try to use it
  if (shape.image) {
    // If it's a full path or URL, use it directly
    if (shape.image.startsWith('http') || shape.image.startsWith('/uploads/')) {
      return getBackendImageUrl(shape.image);
    }
    
    // Otherwise, assume it's a relative path in the uploads folder
    return getBackendImageUrl(`/uploads/diamond-shapes/${shape.image}`);
  }
  
  // If no image, use a fallback based on the shape name
  const shapeName = shape.name?.toLowerCase().replace(/\s+/g, '-') || 'default';
  return `/diamond-shapes/${shapeName}.png`;
}; 