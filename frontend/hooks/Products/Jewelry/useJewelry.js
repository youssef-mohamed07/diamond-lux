// useJewelry hook for all jewelry categories

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAllJewelryProducts,
  getEngagementRings,
  getWeddingBands,
  getEarrings,
  getNecklaces,
  getBracelets,
  getJewelryProductById,
} from "../../../api/Products/Jewelry/jewelryApi.js";

// Debounce utility function for improved performance
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useJewelry = (category = "all") => {
  const [jewelry, setJewelry] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJewelry, setSelectedJewelry] = useState(null);
  const [sortOption, setSortOption] = useState("price:asc");

  // Add filters state
  const [filters, setFilters] = useState({});

  // Debounced filters for improved performance
  const debouncedFilters = useDebounce(filters, 400);

  // Use a ref for the last request ID to avoid dependency cycle
  const lastRequestIdRef = useRef(0);
  // Use a ref for current filters to avoid dependency cycle
  const filtersRef = useRef(filters);
  // Use a ref for current sort option
  const sortRef = useRef(sortOption);
  // Use a ref for the current category
  const categoryRef = useRef(category);

  // Update the refs whenever their values change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    sortRef.current = sortOption;
  }, [sortOption]);

  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  // Generic function to fetch jewelry by category
  const fetchJewelryByCategory = useCallback(
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
        let data;

        // Call the appropriate API function based on the category
        switch (categoryRef.current) {
          case "engagement_rings":
            data = await getEngagementRings(
              validPage,
              validLimit,
              currentFilters,
              currentSort
            );
            break;
          case "wedding_bands":
            data = await getWeddingBands(
              validPage,
              validLimit,
              currentFilters,
              currentSort
            );
            break;
          case "earrings":
            data = await getEarrings(
              validPage,
              validLimit,
              currentFilters,
              currentSort
            );
            break;
          case "necklaces":
            data = await getNecklaces(
              validPage,
              validLimit,
              currentFilters,
              currentSort
            );
            break;
          case "bracelets":
            data = await getBracelets(
              validPage,
              validLimit,
              currentFilters,
              currentSort
            );
            break;
          default:
            data = await getAllJewelryProducts(
              validPage,
              validLimit,
              currentFilters,
              currentSort
            );
            break;
        }

        // Only update state if this is still the latest request
        if (requestId === lastRequestIdRef.current) {
          if (Array.isArray(data.products)) {
            setJewelry(data.products);
          } else {
            console.error("Products data is not an array:", data.products);
            setJewelry([]);
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
          console.error(
            `[useJewelry] Error in request ${requestId} for category ${categoryRef.current}:`,
            err
          );
          setError(
            err.message ||
              `Failed to fetch ${categoryRef.current.replace("_", " ")}`
          );
          setLoading(false);
        }
        return null;
      }
    },
    []
  ); // Dependencies removed to avoid dependency cycle

  const updateFilters = useCallback((newFilters) => {
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
          // Case insensitive toggle handling for metal and metalColor filters
          if (key === "metal" || key === "metalColor") {
            // If we're toggling a metal or metalColor
            if (value.length === 1) {
              const itemToToggle = value[0];
              const currentValues = updatedFilters[key] || [];

              // Check if the item exists in a case-insensitive manner
              const existingIndex = currentValues.findIndex(
                (item) => item.toLowerCase() === itemToToggle.toLowerCase()
              );

              if (existingIndex >= 0) {
                // If found, remove it (toggle off)
                const newValues = [...currentValues];
                newValues.splice(existingIndex, 1);

                if (newValues.length === 0) {
                  delete updatedFilters[key]; // Remove the key entirely if empty
                } else {
                  updatedFilters[key] = newValues;
                }
              } else {
                // If not found, add it (toggle on)
                updatedFilters[key] = [...currentValues, itemToToggle];
              }
            } else {
              // For direct replacement (not toggling), simply use the new values
              updatedFilters[key] = value;
            }
          } else {
            // For other array types, simply replace the current value with the new array
            updatedFilters[key] = value;
          }
        }
        // Handle all other filter types
        else {
          updatedFilters[key] = value;
        }
      });

      return updatedFilters;
    });

    // The actual data fetching will be triggered by the debouncedFilters effect
  }, []);

  const updateSortOption = useCallback(
    (newSortOption) => {
      setSortOption(newSortOption);
      // Fetch with the updated sort option
      fetchJewelryByCategory(
        pagination.currentPage,
        pagination.limit,
        filtersRef.current,
        newSortOption
      );
    },
    [fetchJewelryByCategory, pagination.currentPage, pagination.limit]
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
      // Fetch with empty filters - using the appropriate API based on category
      fetchJewelryByCategory(1, pagination.limit, {}, sortRef.current)
        .then((data) => {
          if (data && Array.isArray(data.products)) {
            setJewelry(data.products);
          } else {
            console.error("Products data is not an array:", data?.products);
            setJewelry([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching after filter clear:", err);
          setError(
            err.message || "Failed to fetch jewelry after clearing filters"
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
  }, [pagination.limit, fetchJewelryByCategory]);

  const fetchJewelryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getJewelryProductById(id);
      setSelectedJewelry(data.product);
      return data.product;
    } catch (err) {
      setError(err.message || `Failed to fetch jewelry with ID ${id}`);
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
        fetchJewelryByCategory(pageNumber, pagination.limit);
      } else {
        console.warn(`[useJewelry] Invalid page number: ${pageNumber}`);
      }
    },
    [fetchJewelryByCategory, pagination.limit]
  );

  const changeLimit = useCallback(
    (newLimit) => {
      // Make sure newLimit is a valid number
      const limitNumber = parseInt(newLimit);
      if (isNaN(limitNumber)) {
        console.error("[useDiamonds] Invalid limit:", newLimit);
        return;
      }

      fetchJewelryByCategory(1, limitNumber);
    },
    [fetchJewelryByCategory]
  );

  const searchJewelry = useCallback(
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

  // Effect for debounced filters
  useEffect(() => {
    // Skip the initial render
    if (
      Object.keys(debouncedFilters).length > 0 ||
      Object.keys(filters).length > 0
    ) {
      fetchJewelryByCategory(1, pagination.limit, debouncedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]);

  // Initial load effect - runs when category changes too
  useEffect(() => {
    fetchJewelryByCategory(1, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return {
    jewelry,
    pagination,
    loading,
    error,
    selectedJewelry,
    filters,
    sortOption,
    category,
    fetchJewelryByCategory,
    fetchJewelryById,
    changePage,
    changeLimit,
    updateFilters,
    updateSortOption,
    clearFilters,
    searchJewelry,
  };
};
