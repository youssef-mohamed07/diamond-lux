// Jewelry API integration for all jewelry types

import axiosInstance from "../../../utils/axiosInstance.js";

// Helper function to build the query string with filters
const buildQueryStringWithFilters = (baseUrl, page, limit, filters, sort) => {
  // Build the query string with page and limit
  let queryString = `${baseUrl}?page=${page}&limit=${limit}`;

  // Add sort parameter if provided
  if (sort) {
    queryString += `&sort=${sort}`;
  }

  // Add filter parameters to the query string
  const cleanFilters = { ...filters };

  // Handle search term specifically as a special case
  if (cleanFilters.searchTerm) {
    queryString += `&search=${encodeURIComponent(cleanFilters.searchTerm)}`;
    delete cleanFilters.searchTerm;
  }

  // Map frontend filter names to backend field names
  const fieldMapping = {
    metal: "metal",
    metalColor: "metalColor",
    minPrice: "minPrice",
    maxPrice: "maxPrice",
    minCarat: "minCarat",
    maxCarat: "maxCarat",
  };

  // Add all other filters to the query string with proper field mapping
  Object.entries(cleanFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      const backendField = fieldMapping[key] || key;
      if (Array.isArray(value)) {
        // For metal and metalColor, pass an additional parameter to indicate case insensitive matching
        if (key === "metal" || key === "metalColor") {
          queryString += `&${backendField}=${value.join(
            ","
          )}&${backendField}CaseInsensitive=true`;
        } else {
          queryString += `&${backendField}=${value.join(",")}`;
        }
      } else {
        queryString += `&${backendField}=${value}`;
      }
    }
  });

  return queryString;
};

// Helper function to process API response
const processJewelryResponse = (data, page, limit) => {
  let products = [];
  let currentPage = page;
  let totalPages = 1;
  let totalCount = 0;
  let productsPerPage = limit;

  // Handle different response formats
  if (data.products && Array.isArray(data.products)) {
    products = data.products;
  } else if (Array.isArray(data)) {
    products = data;
  } else if (data.data && Array.isArray(data.data)) {
    products = data.data;
  }

  // Handle pagination data
  if (data.pagination) {
    currentPage = data.pagination.currentPage || page;
    totalPages = data.pagination.totalPages || 1;
    totalCount = data.pagination.totalCount || 0;
    productsPerPage = data.pagination.limit || limit;
  } else if (data.meta) {
    currentPage = data.meta.currentPage || page;
    totalPages = data.meta.totalPages || 1;
    totalCount = data.meta.totalCount || 0;
    productsPerPage = data.meta.limit || limit;
  } else if (data.totalPages && data.totalProductsCount) {
    // Handle pagination data at the root level of the response
    currentPage = data.currentPage || page;
    totalPages = data.totalPages || 1;
    totalCount = data.totalProductsCount || 0;
    productsPerPage = data.productsPerPage || limit;
  }

  return {
    success: data.success !== undefined ? data.success : true,
    products: products,
    pagination: {
      currentPage: parseInt(currentPage),
      totalPages: parseInt(totalPages),
      totalCount: parseInt(totalCount),
      limit: parseInt(productsPerPage),
    },
  };
};

export const getAllJewelryProducts = async (
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  try {
    // Build the query string with page and limit
    let queryString = `/product/jewelery?page=${page}&limit=${limit}`;

    // Add sort parameter if provided
    if (sort) {
      queryString += `&sort=${sort}`;
    }

    // Add filter parameters to the query string
    const cleanFilters = { ...filters };

    // Handle search term specifically as a special case
    if (cleanFilters.searchTerm) {
      queryString += `&search=${encodeURIComponent(cleanFilters.searchTerm)}`;
      delete cleanFilters.searchTerm;
    }

    // Map frontend filter names to backend field names
    const fieldMapping = {
      metal: "metal",
      metalColor: "metalColor",
      minPrice: "minPrice",
      maxPrice: "maxPrice",
      minCarat: "minCarat",
      maxCarat: "maxCarat",
    };

    // Add all other filters to the query string with proper field mapping
    Object.entries(cleanFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const backendField = fieldMapping[key] || key;
        if (Array.isArray(value)) {
          queryString += `&${backendField}=${value.join(",")}`;
        } else {
          queryString += `&${backendField}=${value}`;
        }
      }
    });

    const response = await axiosInstance.get(queryString);

    if (!response.data) {
      throw new Error("No data received from the server");
    }

    const data = response.data;
    let products = [];
    let currentPage = page;
    let totalPages = 1;
    let totalCount = 0;
    let productsPerPage = limit;

    // Handle different response formats
    if (data.products && Array.isArray(data.products)) {
      products = data.products;
    } else if (Array.isArray(data)) {
      products = data;
    } else if (data.data && Array.isArray(data.data)) {
      products = data.data;
    }

    // Handle pagination data
    if (data.pagination) {
      currentPage = data.pagination.currentPage || page;
      totalPages = data.pagination.totalPages || 1;
      totalCount = data.pagination.totalCount || 0;
      productsPerPage = data.pagination.limit || limit;
    } else if (data.meta) {
      currentPage = data.meta.currentPage || page;
      totalPages = data.meta.totalPages || 1;
      totalCount = data.meta.totalCount || 0;
      productsPerPage = data.meta.limit || limit;
    } else if (data.totalPages && data.totalProductsCount) {
      // Handle pagination data at the root level of the response
      currentPage = data.currentPage || page;
      totalPages = data.totalPages || 1;
      totalCount = data.totalProductsCount || 0;
      productsPerPage = data.productsPerPage || limit;
      console.log("Found pagination data at root level:", {
        currentPage,
        totalPages,
        totalCount,
        productsPerPage,
      });
    }

    const result = {
      success: data.success !== undefined ? data.success : true,
      products: products,
      pagination: {
        currentPage: parseInt(currentPage),
        totalPages: parseInt(totalPages),
        totalCount: parseInt(totalCount),
        limit: parseInt(productsPerPage),
      },
    };

    return result;
  } catch (error) {
    console.error("Error in getAllDiamondProducts:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

// Generic function to fetch jewelry by category
const getJewelryByCategory = async (
  category,
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  try {
    // Build the query string with page, limit, and filters
    const baseUrl = `/product/jewelery/${category}`;
    const queryString = buildQueryStringWithFilters(
      baseUrl,
      page,
      limit,
      filters,
      sort
    );

    const response = await axiosInstance.get(queryString);

    if (!response.data) {
      throw new Error("No data received from the server");
    }

    return processJewelryResponse(response.data, page, limit);
  } catch (error) {
    console.error(
      `Error in get${category.charAt(0).toUpperCase() + category.slice(1)}:`,
      error
    );
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

export const getEngagementRings = async (
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  return getJewelryByCategory("engagement_rings", page, limit, filters, sort);
};

export const getWeddingBands = async (
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  return getJewelryByCategory("wedding_bands", page, limit, filters, sort);
};

export const getEarrings = async (
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  return getJewelryByCategory("earrings", page, limit, filters, sort);
};

export const getNecklaces = async (
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  return getJewelryByCategory("necklaces", page, limit, filters, sort);
};

export const getBracelets = async (
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  return getJewelryByCategory("bracelets", page, limit, filters, sort);
};

// Get jewelry product by ID
export const getJewelryProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/product/jewelry/${id}`);

    // Ensure we have a valid response
    if (!response.data) {
      throw new Error("No data received from the server");
    }

    // Handle different response formats
    let productData;
    if (response.data.product) {
      productData = response.data.product;
    } else if (response.data) {
      productData = response.data;
    } else {
      throw new Error("Invalid response format");
    }

    // Ensure all fields are present
    const requiredFields = [
      "_id",
      "title",
      "price",
      "description",
      "images",
      "imageCover",
      "metal",
      "metalColor",
      "gemstone",
      "carats",
      "style",
      "setting",
      "collection",
      "length",
      "width",
      "productType",
      "stockId",
      "isReturnable",
      "discount",
    ];

    // Add any missing fields with null values
    requiredFields.forEach((field) => {
      if (!(field in productData)) {
        productData[field] = null;
      }
    });

    return {
      success: true,
      product: productData,
    };
  } catch (error) {
    console.error(`Error fetching diamond product with ID ${id}:`, error);
    throw error;
  }
};
