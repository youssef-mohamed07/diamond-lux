// Paste this in a new file called useDiamonds.js in your hooks folder

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAllDiamondProducts,
  getDiamondProductById,
} from "../../../api/Products/Diamond/diamondApi.js";

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

  // Use a ref for the last request ID to avoid dependency cycle
  const lastRequestIdRef = useRef(0);

  const fetchDiamonds = useCallback(async (page = 1, limit = 12) => {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.max(1, parseInt(limit) || 12);

    setLoading(true);
    setError(null);

    // Generate a unique request ID to track the latest request
    const requestId = Date.now();
    lastRequestIdRef.current = requestId;

    try {
      const data = await getAllDiamondProducts(validPage, validLimit);

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
      } else {
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
  }, []);

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

  // Initial load effect
  useEffect(() => {
    fetchDiamonds(1, pagination.limit);
    // Only run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    diamonds,
    pagination,
    loading,
    error,
    selectedDiamond,
    fetchDiamonds,
    fetchDiamondById,
    changePage,
    changeLimit,
  };
};
