// Paste this in a new file called useDiamonds.js in your hooks folder

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAllDiamondProducts,
  getDiamondProductById,
  getDiamondShapes,
} from "../../../api/Products/Diamond/diamondApi.js";
import { getDiamondShapeImage } from "../../../utils/imageHelpers.js";

// Helper function to get category initial for fallback icons
const getCategoryInitial = (name) => {
  return name && typeof name === "string"
    ? name.substring(0, 1).toUpperCase()
    : "?";
};

export const useDiamonds = () => {
  const [diamonds, setDiamonds] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDiamond, setSelectedDiamond] = useState(null);
  const [sortOption, setSortOption] = useState("price:asc");
  const [diamondShapes, setDiamondShapes] = useState([]);
  const [shapesLoading, setShapesLoading] = useState(false);

  // Add filters state
  const [filters, setFilters] = useState({});

  // Use a ref for the last request ID to avoid dependency cycle
  const lastRequestIdRef = useRef(0);
  // Use a ref for current filters to avoid dependency cycle
  const filtersRef = useRef(filters);
  // Use a ref for current sort option
  const sortRef = useRef(sortOption);

  // Update the refs whenever their values change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    sortRef.current = sortOption;
  }, [sortOption]);

  // Fetch diamond shapes from backend
  const fetchDiamondShapes = useCallback(async () => {
    try {
      setShapesLoading(true);
      const data = await getDiamondShapes();

      // Process the shapes data based on the API response format
      let shapes = [];

      if (data && data.categories && Array.isArray(data.categories)) {
        shapes = data.categories.map((shape) => ({
          _id: shape._id || shape.name,
          name: shape.name,
          image: getDiamondShapeImage(shape),
          initial: getCategoryInitial(shape.name),
        }));
      } else if (Array.isArray(data)) {
        shapes = data.map((shape) => ({
          _id: shape._id || shape.name,
          name: shape.name,
          image: getDiamondShapeImage(shape),
          initial: getCategoryInitial(shape.name),
        }));
      }

      setDiamondShapes(shapes);
    } catch (err) {
      console.error("Error fetching diamond shapes:", err);
      // Provide fallback shapes if API fails
      const fallbackShapes = [
        {
          _id: "round",
          name: "Round",
          image: "/diamond-shapes/round.png",
          initial: "R",
        },
        {
          _id: "princess",
          name: "Princess",
          image: "/diamond-shapes/princess.png",
          initial: "P",
        },
        {
          _id: "cushion",
          name: "Cushion",
          image: "/diamond-shapes/cushion.png",
          initial: "C",
        },
        {
          _id: "oval",
          name: "Oval",
          image: "/diamond-shapes/oval.png",
          initial: "O",
        },
        {
          _id: "emerald",
          name: "Emerald",
          image: "/diamond-shapes/emerald.png",
          initial: "E",
        },
        {
          _id: "pear",
          name: "Pear",
          image: "/diamond-shapes/pear.png",
          initial: "P",
        },
        {
          _id: "marquise",
          name: "Marquise",
          image: "/diamond-shapes/marquise.png",
          initial: "M",
        },
        {
          _id: "radiant",
          name: "Radiant",
          image: "/diamond-shapes/radiant.png",
          initial: "R",
        },
        {
          _id: "heart",
          name: "Heart",
          image: "/diamond-shapes/heart.png",
          initial: "H",
        },
        {
          _id: "asscher",
          name: "Asscher",
          image: "/diamond-shapes/asscher.png",
          initial: "A",
        },
      ];
      setDiamondShapes(fallbackShapes);
    } finally {
      setShapesLoading(false);
    }
  }, []);

  const fetchDiamonds = useCallback(
    async (page = 1, limit = 12, filterParams = null, sortParam = null) => {
      // Ensure page and limit are valid numbers
      const validPage = Math.max(1, parseInt(page) || 1);
      const validLimit = Math.max(1, parseInt(limit) || 12);

      // Use provided filters or current state from the ref
      const currentFilters = filterParams || filtersRef.current;
      // Use provided sort or current state from the ref
      const currentSort = sortParam || sortRef.current;

      setLoading(true);
      setError(null);

      // Generate a unique request ID to track the latest request
      const requestId = Date.now();
      lastRequestIdRef.current = requestId;

      try {
        const data = await getAllDiamondProducts(
          validPage,
          validLimit,
          currentFilters,
          currentSort
        );

        // Only update state if this is still the latest request
        if (requestId === lastRequestIdRef.current) {
          if (Array.isArray(data.products)) {
            setDiamonds(data.products);
          } else {
            console.error("Products data is not an array:", data.products);
            setDiamonds([]);
          }

          setPagination({
            currentPage: validPage,
            totalPages: data.pagination.totalPages || 1,
            totalCount: data.pagination.totalCount || 0,
            limit: validLimit,
          });

          setLoading(false);
        }

        return data;
      } catch (err) {
        // Only update error state if this is still the latest request
        if (requestId === lastRequestIdRef.current) {
          console.error(`[useDiamonds] Error in request ${requestId}:`, err);
          setError(err.message || "Failed to fetch diamonds");
          setLoading(false);
        }
        return null;
      }
    },
    []
  ); // Remove filters dependency to avoid dependency cycle

  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };

        // Handle all filters including shape
        Object.entries(newFilters).forEach(([key, value]) => {
          // Handle empty values - delete those filters
          if (
            value === undefined ||
            value === null ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "object" &&
              !Array.isArray(value) &&
              Object.keys(value).length === 0)
          ) {
            delete updatedFilters[key];
          }
          // Handle array filter types (categories, attributes)
          else if (Array.isArray(value)) {
            // Simply replace the current value with the new array
            updatedFilters[key] = value;
          }
          // Handle all other filter types
          else {
            updatedFilters[key] = value;
          }
        });

        // Use setTimeout to ensure this runs after the state update
        setTimeout(() => {
          fetchDiamonds(1, pagination.limit, updatedFilters);
        }, 0);

        return updatedFilters;
      });
    },
    [fetchDiamonds, pagination.limit]
  );

  const updateSortOption = useCallback(
    (newSortOption) => {
      setSortOption(newSortOption);
      // Fetch with the updated sort option
      fetchDiamonds(
        pagination.currentPage,
        pagination.limit,
        filtersRef.current,
        newSortOption
      );
    },
    [fetchDiamonds, pagination.currentPage, pagination.limit]
  );

  const clearFilters = useCallback(() => {
    // Immediately reset the filters state to an empty object
    setFilters({});

    // Reset pagination to first page
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));

    // Create a new clean request to fetch data with no filters
    try {
      // Make direct API call with empty filters object
      getAllDiamondProducts(1, pagination.limit, {}, sortRef.current)
        .then((data) => {
          if (Array.isArray(data.products)) {
            setDiamonds(data.products);
          } else {
            console.error("Products data is not an array:", data.products);
            setDiamonds([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching after filter clear:", err);
          setError(
            err.message || "Failed to fetch diamonds after clearing filters"
          );
          setLoading(false);
        });

      // Set loading to true for immediate feedback
      setLoading(true);

      // Clear URL parameters except page
      const url = new URL(window.location);
      Array.from(url.searchParams.keys()).forEach((key) => {
        if (key !== "page") {
          url.searchParams.delete(key);
        }
      });
      url.searchParams.set("page", "1");
      window.history.pushState({}, "", url);
    } catch (e) {
      console.error("Error in clearFilters function:", e);
    }
  }, [pagination.limit, getAllDiamondProducts]);

  const fetchDiamondById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDiamondProductById(id);
      setSelectedDiamond(data.product);
      return data.product;
    } catch (err) {
      setError(err.message || `Failed to fetch diamond with ID ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = useCallback(
    (newPage) => {
      // Make sure newPage is a valid number
      const pageNumber = parseInt(newPage);
      if (isNaN(pageNumber)) {
        console.error("[useDiamonds] Invalid page number:", newPage);
        return;
      }

      if (pageNumber > 0) {
        fetchDiamonds(pageNumber, pagination.limit);
      } else {
        console.warn(`[useDiamonds] Invalid page number: ${pageNumber}`);
      }
    },
    [fetchDiamonds, pagination.limit]
  );

  const changeLimit = useCallback(
    (newLimit) => {
      // Make sure newLimit is a valid number
      const limitNumber = parseInt(newLimit);
      if (isNaN(limitNumber)) {
        console.error("[useDiamonds] Invalid limit:", newLimit);
        return;
      }

      fetchDiamonds(1, limitNumber);
    },
    [fetchDiamonds]
  );

  const searchDiamonds = useCallback(
    (searchTerm) => {
      if (!searchTerm) {
        // If search term is empty, simply remove the search filter
        const updatedFilters = { ...filters };
        delete updatedFilters.searchTerm;
        updateFilters(updatedFilters);
        return;
      }

      // Create updated filters with the search term
      const searchFilters = {
        ...filters,
        searchTerm: searchTerm,
      };

      // Set loading state for better UX
      setLoading(true);

      // Update filters state which will trigger a fetch automatically
      updateFilters(searchFilters);

      // Reset to page 1 when performing a search
      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    },
    [filters, updateFilters]
  );

  // Initial load effect
  useEffect(() => {
    fetchDiamonds(1, pagination.limit);
    fetchDiamondShapes();
    // Only run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    diamonds,
    pagination,
    loading,
    error,
    selectedDiamond,
    filters,
    sortOption,
    diamondShapes,
    shapesLoading,
    fetchDiamonds,
    fetchDiamondById,
    changePage,
    changeLimit,
    updateFilters,
    updateSortOption,
    clearFilters,
    searchDiamonds,
  };
};
