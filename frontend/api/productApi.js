import axiosInstance from "../utils/axiosInstance";

export const getProducts = async () => {
  const response = await axiosInstance.get("/product");
  return response.data.Products; // Backend returns "Products"
};

export const getDiamonds = async (page = 1, limit = 20) => {
  try {
    // Set a longer timeout for diamond requests (10 seconds instead of default)
    const response = await axiosInstance.get(`/product/diamond?page=${page}&limit=${limit}`, {
      timeout: 10000, // 10 seconds
      timeoutErrorMessage: `Timeout fetching diamonds for page ${page}`,
      // Adding a cancelable request token would also help, but that's more complex
    });
    return response.data; // Return full response with pagination info
  } catch (error) {
    console.error("API Error - getDiamonds:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    
    // Create a more helpful error to help with debugging
    const enhancedError = new Error(`Diamond API Error: ${error.message} for page ${page}`);
    enhancedError.originalError = error;
    enhancedError.isTimeout = error.code === 'ECONNABORTED';
    enhancedError.statusCode = error.response?.status;
    throw enhancedError;
  }
};

export const getJewelry = async () => {
  const response = await axiosInstance.get("/product/jewellery");
  return response.data.jewelryProducts; // Backend returns "Products"
};

export const getEarrings = async () => {
  const response = await axiosInstance.get("/product/jewellery/earrings");
  return response.data.earrings; // Backend returns "Products"
};

export const getNecklaces = async () => {
  const response = await axiosInstance.get("/product/jewellery/necklaces");
  return response.data.necklaces; // Backend returns "Products"
};

export const getBracelets = async () => {
  const response = await axiosInstance.get("/product/jewellery/bracelets");
  return response.data.bracelets; // Backend returns "Products"
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/product/${id}`);
  return response.data.product; // Backend returns "product"
};
