import { useState, useEffect } from "react";
import { getAllDiamondProducts } from "../api/Products/Diamond/diamondApi";
import { getCategories } from "../api/categoryApi";
import { toast } from "react-toastify";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [diamondProducts, setDiamondProducts] = useState([]);
  const [diamondPagination, setDiamondPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  });
  const [diamondLoading, setDiamondLoading] = useState(false);
  const [jewelleryProducts, setJewelleryProducts] = useState([]);
  const [earrings, setEarrings] = useState([]);
  const [necklaces, setNecklaces] = useState([]);
  const [bracelets, setBracelets] = useState([]);
  const [engagementRings, setEngagementRings] = useState([]);
  const [weddingBands, setWeddingBands] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Function to fetch diamond products for a specific page
  const fetchDiamondPage = async (page = 1, retryCount = 0) => {
    // If already loading, don't make another request
    if (diamondLoading) {
      console.log("Skipping diamond fetch - already loading");
      return null;
    }

    try {
      setDiamondLoading(true);

      // Validate page number to ensure it's positive
      const validPage = Math.max(1, page);

      // Add delay between retries
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryCount * 1000));
      }

      const diamondData = await getAllDiamondProducts(validPage);

      // Only update state if we actually got data back
      if (diamondData && diamondData.diamondProducts) {
        setDiamondProducts(diamondData.diamondProducts);
        setDiamondPagination({
          currentPage: Number(validPage),
          totalPages: Number(diamondData.pagination.totalPages) || 1,
          totalItems: Number(diamondData.pagination.totalItems) || 0,
          hasMore: Boolean(diamondData.pagination.hasMore) || false,
        });
      } else {
        throw new Error("Invalid diamond data received");
      }

      setDiamondLoading(false);
      return diamondData;
    } catch (error) {
      console.error(`Error fetching diamond page ${page}:`, error);

      // Determine if this is a network error that might resolve with retry
      const isNetworkError = !error.statusCode || error.isTimeout;

      // Retry logic - maximum 3 retries for network errors
      if (isNetworkError && retryCount < 3) {
        console.log(
          `Retrying fetch for page ${page}, attempt ${retryCount + 1}`
        );

        // Clear diamond loading state so next attempt can proceed
        setDiamondLoading(false);

        // Wait 1 second before retrying (increasing with each retry)
        await new Promise((resolve) =>
          setTimeout(resolve, (retryCount + 1) * 1000)
        );
        return fetchDiamondPage(page, retryCount + 1);
      }

      // If we've exhausted retries or it's a server error, handle gracefully
      if (retryCount >= 3 || !isNetworkError) {
        // Keep the current pagination info but update current page
        setDiamondPagination((prev) => ({
          ...prev,
          currentPage: Number(page),
        }));

        // Keep existing products rather than clearing them
        // This way at least the current page data remains visible

        // Show appropriate error message based on error type
        if (error.isTimeout) {
          toast.error(`Server took too long to respond. Try again later.`);
        } else if (error.statusCode === 404) {
          toast.error(`Page ${page} not found.`);
        } else {
          toast.error(`Could not load diamond page ${page}. Please try again.`);
        }
      }

      setDiamondLoading(false);
      return null; // Return null to indicate failure
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Only fetch categories on initial load
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  return {
    products,
    diamondProducts,
    diamondPagination,
    diamondLoading,
    fetchDiamondPage,
    jewelleryProducts,
    earrings,
    necklaces,
    bracelets,
    engagementRings,
    weddingBands,
    popularProducts,
    categories,
  };
};
