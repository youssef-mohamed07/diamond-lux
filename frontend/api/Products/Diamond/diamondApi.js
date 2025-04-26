// Paste this in a new file called diamondApi.js in your api folder

import axiosInstance from "../../../utils/axiosInstance.js";

export const getAllDiamondProducts = async (page = 1, limit = 12, filters = {}, sort = "price:asc") => {
  try {
    // Build the query string with page and limit
    let queryString = `/product/diamonds?page=${page}&limit=${limit}`;
    
    // Add sort parameter if provided
    if (sort) {
      queryString += `&sort=${sort}`;
    }
    
    // Add filter parameters to the query string
    // Ensure we're working with a clean filters object
    const cleanFilters = { ...filters };
    
    // Handle search term specifically as a special case
    if (cleanFilters.searchTerm) {
      queryString += `&search=${encodeURIComponent(cleanFilters.searchTerm)}`;
      delete cleanFilters.searchTerm; // Remove from normal filters
    }
    
    // Remove any empty or null filters
    Object.keys(cleanFilters).forEach(key => {
      if (cleanFilters[key] === null || 
          cleanFilters[key] === undefined || 
          cleanFilters[key] === '' || 
          (Array.isArray(cleanFilters[key]) && cleanFilters[key].length === 0) ||
          (typeof cleanFilters[key] === 'object' && !Array.isArray(cleanFilters[key]) && Object.keys(cleanFilters[key]).length === 0)) {
        delete cleanFilters[key];
      }
    });
    
    // Add remaining filters to query string
    Object.entries(cleanFilters).forEach(([key, value]) => {
      // Skip empty values
      if (value === undefined || value === null || value === '') return;
      
      // Handle arrays by joining with commas
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryString += `&${key}=${value.join(',')}`;
        }
      } 
      // Handle range objects with min/max properties
      else if (typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
        if (value.min !== undefined) {
          queryString += `&min${key.charAt(0).toUpperCase() + key.slice(1)}=${value.min}`;
        }
        if (value.max !== undefined) {
          queryString += `&max${key.charAt(0).toUpperCase() + key.slice(1)}=${value.max}`;
        }
      }
      // Special handling for range filter names with prefixes already (min/max)
      else if (key.startsWith('min') || key.startsWith('max')) {
        // These are already formatted properly, just add to query
        queryString += `&${key}=${encodeURIComponent(value)}`;
      }
      // Handle boolean values
      else if (typeof value === 'boolean') {
        queryString += `&${key}=${value}`;
      }
      // Handle simple string/number values
      else {
        queryString += `&${key}=${encodeURIComponent(value)}`;
      }
    });

    console.log('Making API request with URL:', queryString);
    
    const response = await axiosInstance.get(queryString);

    // Extract pagination data from response body instead of headers
    const data = response.data;
    console.log('Response received with items:', data.products?.length || 0);

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
    console.error("Error details:", error.response?.data || error.message);
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

// Get diamond shape categories from the backend
export const getDiamondShapes = async () => {
  try {
    const response = await axiosInstance.get('/category');
    // Handle the expected response format where categories are nested in the data
    if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching diamond shapes:', error);
    throw error;
  }
};
