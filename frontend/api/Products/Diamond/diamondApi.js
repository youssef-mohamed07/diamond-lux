// Paste this in a new file called diamondApi.js in your api folder

import axiosInstance from "../../../utils/axiosInstance.js";

export const getAllDiamondProducts = async (page = 1, limit = 12) => {
  try {
    const response = await axiosInstance.get(
      `/product/diamonds?page=${page}&limit=${limit}`
    );

    // Extract pagination data from response body instead of headers
    const data = response.data;

    // Extract or set default pagination values
    const currentPage = data.currentPage || page;
    const totalPages = data.totalPages || 1;
    const totalCount = data.totalProductsCount || 0;
    const productsPerPage = data.productsPerPage || limit;

    // Check the shape of the response to determine where products are located
    let products = [];
    if (data.products && Array.isArray(data.products)) {
      products = data.products;
    } else if (Array.isArray(data)) {
      products = data;
    }

    const result = {
      success: data.success !== undefined ? data.success : true,
      products: products,
      pagination: {
        currentPage: parseInt(currentPage),
        totalPages: parseInt(totalPages),
        totalCount: parseInt(totalCount),
        limit: parseInt(productsPerPage) || parseInt(limit),
      },
    };
    return result;
  } catch (error) {
    console.error("Error fetching diamond products:", error);
    throw error;
  }
};

export const getDiamondProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/product/diamonds/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching diamond product with ID ${id}:`, error);
    throw error;
  }
};
