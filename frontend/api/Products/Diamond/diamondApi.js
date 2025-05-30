// Paste this in a new file called diamondApi.js in your api folder

import axiosInstance from "../../../utils/axiosInstance.js";

export const getAllDiamondProducts = async (
  page = 1,
  limit = 12,
  filters = {},
  sort = "price:asc"
) => {
  try {
    // Build the query string with page and limit
    let queryString = `/product/diamonds?page=${page}&limit=${limit}`;

    // Add sort parameter if provided
    if (sort) {
      queryString += `&sort=${sort}`;
    }

    // Add filter parameters to the query string
    const cleanFilters = { ...filters };

    // Handle product type filter
    if (cleanFilters.productType) {
      // Map the product type to the correct query parameter
      if (cleanFilters.productType === "lab_diamond") {
        queryString += `&diamondType=lab`;
      } else if (cleanFilters.productType === "natural_diamond") {
        queryString += `&diamondType=natural`;
      }
      delete cleanFilters.productType;
    }

    // Handle search term specifically as a special case
    if (cleanFilters.searchTerm) {
      queryString += `&search=${encodeURIComponent(cleanFilters.searchTerm)}`;
      delete cleanFilters.searchTerm;
    }

    // Map frontend filter names to backend field names
    const fieldMapping = {
      color: "col",
      clarity: "clar",
      polish: "pol",
      symmetry: "symm",
      fluorescence: "flo",
      fluorescenceColor: "floCol",
      minPrice: "minPrice",
      maxPrice: "maxPrice",
      minCarat: "minCarat",
      maxCarat: "maxCarat",
      shape: "shape",
      cut: "cut",
      lab: "lab",
      girdle: "girdle",
      culet: "culet",
      eyeClean: "eyeClean",
      brown: "brown",
      green: "green",
      milky: "milky",
      minLength: "minLength",
      maxLength: "maxLength",
      minWidth: "minWidth",
      maxWidth: "maxWidth",
      minDepth: "minDepth",
      maxDepth: "maxDepth",
      minTable: "minTable",
      maxTable: "maxTable",
      minLwRatio: "minLwRatio",
      maxLwRatio: "maxLwRatio",
      certificateNumber: "certificate_number",
      mineOfOrigin: "mineOfOrigin",
      canadaMarkEligible: "canadaMarkEligible",
      isReturnable: "isReturnable",
      minPricePerCarat: "minPricePerCarat",
      maxPricePerCarat: "maxPricePerCarat",
      minDiscount: "minDiscount",
      maxDiscount: "maxDiscount",
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

    console.log("Processed result:", result);
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

export const getDiamondProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/product/diamonds/${id}`);

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
      "shape",
      "carats",
      "col",
      "clar",
      "cut",
      "pol",
      "symm",
      "flo",
      "floCol",
      "culet",
      "lab",
      "girdle",
      "eyeClean",
      "brown",
      "green",
      "milky",
      "length",
      "width",
      "height",
      "depth",
      "table",
      "productType",
      "certificate_url",
      "stockId",
      "reportNo",
      "mineOfOrigin",
      "canadaMarkEligible",
      "isReturnable",
      "pricePerCarat",
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

// Get diamond shape categories from the backend
export const getDiamondShapes = async () => {
  try {
    const response = await axiosInstance.get("/category");
    // Handle the expected response format where categories are nested in the data
    if (
      response.data &&
      response.data.categories &&
      Array.isArray(response.data.categories)
    ) {
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching diamond shapes:", error);
    throw error;
  }
};
