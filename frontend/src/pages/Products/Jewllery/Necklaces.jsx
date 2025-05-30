import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { ShopContext } from "../../../context/ShopContext.jsx";
import Title from "../../../components/Title";
import GalleryItem from "../../../components/Home/GalleryItem";
import { assets } from "../../../assets/assets";
import NewsletterBox from "../../../components/NewsletterBox";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilter,
  FaSort,
  FaChevronDown,
  FaTimes,
  FaSearch,
  FaSpinner,
  FaGem,
  FaCut,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { debounce } from "../../../../utils/debounce";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const backendURL_WITHOUT_API = VITE_BACKEND_URL.replace("/api", "");

const Necklaces = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  // Data store - Get necklaces from ShopContext
  const { necklaces } = useContext(ShopContext);

  const [searchQuery, setSearchQuery] = useState(query || "");
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [showClearFilter, setShowClearFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState("relevant");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(12);

  // Additional UI state
  const [showFilter, setShowFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Mobile menu states
  const [mobileFiltersModal, setMobileFiltersModal] = useState(false);

  // Required filter states
  const [diamondTypes, setDiamondTypes] = useState([]);
  const [metals, setMetals] = useState([]);
  const [metalColors, setMetalColors] = useState([]);
  const [caratRange, setCaratRange] = useState([0, 20]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxCarat, setMaxCarat] = useState(20);
  const [maxPrice, setMaxPrice] = useState(100000);

  // Unique values for filter options
  const [uniqueMetals, setUniqueMetals] = useState([]);
  const [uniqueMetalColors, setUniqueMetalColors] = useState([]);

  // Define sort options
  const sortOptions = [
    { value: "relevant", label: "Relevance" },
    { value: "price:asc", label: "Price: Low to High" },
    { value: "price:desc", label: "Price: High to Low" },
  ];

  // Ref to track first mount
  const isFirstMount = useRef(true);

  // Refs for values that shouldn't trigger fetchProducts recreation
  const currentPageRef = useRef(currentPage);
  const limitRef = useRef(limit);
  const searchQueryRef = useRef(searchQuery);
  const metalsRef = useRef(metals);
  const metalColorsRef = useRef(metalColors);
  const caratRangeRef = useRef(caratRange);
  const priceRangeRef = useRef(priceRange);
  const sortTypeRef = useRef(sortType);
  const maxCaratRef = useRef(maxCarat);
  const maxPriceRef = useRef(maxPrice);

  // Update refs when values change
  useEffect(() => {
    currentPageRef.current = currentPage;
    limitRef.current = limit;
    searchQueryRef.current = searchQuery;
    metalsRef.current = metals;
    metalColorsRef.current = metalColors;
    caratRangeRef.current = caratRange;
    priceRangeRef.current = priceRange;
    sortTypeRef.current = sortType;
    maxCaratRef.current = maxCarat;
    maxPriceRef.current = maxPrice;
  }, [
    currentPage,
    limit,
    searchQuery,
    metals,
    metalColors,
    caratRange,
    priceRange,
    sortType,
    maxCarat,
    maxPrice,
  ]);

  // Function to extract unique filter values from products
  const extractUniqueFilterValues = useCallback(
    (products) => {
      if (!products || products.length === 0) return;

      // Extract unique metals
      const uniqueMetalsSet = new Set();
      products.forEach((product) => {
        if (product.metal) uniqueMetalsSet.add(product.metal);
      });
      setUniqueMetals(Array.from(uniqueMetalsSet));

      // Extract unique metal colors
      const uniqueMetalColorsSet = new Set();
      products.forEach((product) => {
        if (product.metalColor) uniqueMetalColorsSet.add(product.metalColor);
      });
      setUniqueMetalColors(Array.from(uniqueMetalColorsSet));

      // Find max price and carat for ranges
      const maxProductPrice = Math.max(...products.map((p) => p.price || 0));
      const maxProductCarat = Math.max(...products.map((p) => p.carats || 0));

      // Ensure reasonable default values
      const defaultMaxPrice = maxProductPrice > 0 ? maxProductPrice : 100000;
      const defaultMaxCarat = maxProductCarat > 0 ? maxProductCarat : 20;

      setMaxPrice(defaultMaxPrice);
      setMaxCarat(defaultMaxCarat);

      // Only set the range values if they haven't been manually changed
      if (priceRange[0] === 0 && priceRange[1] === 100000) {
        setPriceRange([0, defaultMaxPrice]);
        priceRangeRef.current = [0, defaultMaxPrice];
      }

      if (caratRange[0] === 0 && caratRange[1] === 20) {
        setCaratRange([0, defaultMaxCarat]);
        caratRangeRef.current = [0, defaultMaxCarat];
      }
    },
    [priceRange, caratRange]
  );

  // Fetch products from the API
  const fetchProducts = useCallback(async () => {
    // Save current scroll position before loading
    const scrollPosition = window.scrollY;

    setIsLoading(true);
    try {
      // Prepare query parameters
      const params = new URLSearchParams();

      // Pagination
      params.append("page", currentPageRef.current);
      params.append("limit", limitRef.current);

      // Search query
      if (searchQueryRef.current) {
        params.append("search", searchQueryRef.current);
      }

      // Metals
      if (metalsRef.current.length > 0) {
        params.append("metal", metalsRef.current.join(","));
      }

      // Metal Colors
      if (metalColorsRef.current.length > 0) {
        params.append("metalColor", metalColorsRef.current.join(","));
      }

      // Carat Range
      if (caratRangeRef.current[0] > 0) {
        params.append("minCarat", caratRangeRef.current[0]);
      }
      if (caratRangeRef.current[1] < maxCaratRef.current) {
        params.append("maxCarat", caratRangeRef.current[1]);
      }

      // Price Range
      if (priceRangeRef.current[0] > 0) {
        params.append("minPrice", priceRangeRef.current[0]);
      }
      if (priceRangeRef.current[1] < maxPriceRef.current) {
        params.append("maxPrice", priceRangeRef.current[1]);
      }

      // Sort
      if (sortTypeRef.current !== "relevant") {
        params.append("sort", sortTypeRef.current);
      }

      const response = await axios.get(
        `${VITE_BACKEND_URL}/product/jewelery/necklaces`,
        { params }
      );

      // Update state with the response data
      setProducts(response.data.products);
      setFilterProducts(response.data.products);
      setTotalCount(response.data.totalProductsCount);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);

      // Extract unique filter values from the products
      extractUniqueFilterValues(response.data.products);
    } catch (error) {
      console.error("Error fetching necklace products:", error);
      // Use the necklaces from context as fallback if API call fails
      if (necklaces && necklaces.length > 0) {
        setProducts(necklaces);
        setFilterProducts(necklaces);
        setTotalPages(Math.ceil(necklaces.length / limit));
        setTotalCount(necklaces.length);
        extractUniqueFilterValues(necklaces);
      }
    } finally {
      setIsLoading(false);

      // Restore scroll position after loading completes
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto", // Use 'auto' instead of 'smooth' to prevent visible scrolling
        });
      }, 0);
    }
  }, [extractUniqueFilterValues, necklaces, limit]);

  // Create debounced fetch function for range inputs
  const debouncedFetch = useCallback(
    debounce(() => {
      fetchProducts();
    }, 500),
    [fetchProducts]
  );

  // Input change handlers for range inputs
  const handlePriceMinChange = (value) => {
    if (isNaN(value)) return;
    // Calculate a safe maximum that ensures we don't exceed the max value
    const safeMin = Math.min(value, priceRange[1] - 1);
    const newRange = [safeMin, priceRange[1]];
    setPriceRange(newRange);
    priceRangeRef.current = newRange;
    debouncedFetch();
  };

  const handlePriceMaxChange = (value) => {
    if (isNaN(value)) return;
    // Calculate a safe minimum that ensures we're at least 1 more than the min value
    const newRange = [priceRange[0], Math.max(value, priceRange[0] + 1)];
    setPriceRange(newRange);
    priceRangeRef.current = newRange;
    debouncedFetch();
  };

  const handleCaratMinChange = (value) => {
    if (isNaN(value)) return;
    // Set minimum carat to 0.1 if not specified
    const safeMin = Math.max(0.1, Math.min(value, caratRange[1] - 0.001));
    const newRange = [parseFloat(safeMin.toFixed(2)), caratRange[1]];
    setCaratRange(newRange);
    caratRangeRef.current = newRange;
    debouncedFetch();
  };

  const handleCaratMaxChange = (value) => {
    if (isNaN(value)) return;
    // Set maximum carat to 10 if not specified
    const safeMax = Math.min(10, Math.max(value, caratRange[0] + 0.001));
    const newRange = [caratRange[0], parseFloat(safeMax.toFixed(2))];
    setCaratRange(newRange);
    caratRangeRef.current = newRange;
    debouncedFetch();
  };

  // Initial fetch on component mount
  useEffect(() => {
    // If necklaces are already available in context, use them initially
    if (necklaces && necklaces.length > 0) {
      setProducts(necklaces);
      setFilterProducts(necklaces);
      setTotalPages(Math.ceil(necklaces.length / limit));
      setTotalCount(necklaces.length);
      extractUniqueFilterValues(necklaces);
      setIsLoading(false);
    }

    // Only fetch from API on first mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchProducts();
    }
  }, [fetchProducts, necklaces, limit]);

  // Toggle function for diamond property filters
  const toggleFilter = (value, currentValues, setterFunction, refValue) => {
    // Save scroll position
    const scrollPosition = window.scrollY;

    // Update filter values
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    // Update state
    setterFunction(newValues);

    // Update ref directly for immediate use
    if (refValue) {
      refValue.current = newValues;
    }

    // Reset to page 1 when filtering
    setCurrentPage(1);
    currentPageRef.current = 1;

    // Fetch updated results
    setTimeout(() => fetchProducts(), 100);
  };

  // Apply filters immediately when they change
  useEffect(() => {
    // Don't fetch on initial mount, as it will be handled by the main useEffect
    if (!isLoading) {
      // Use a short timeout to avoid multiple rapid fetches when multiple filters change together
      const timer = setTimeout(() => {
        fetchProducts();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [diamondTypes, metals, metalColors, sortType]);

  // Update URL with current filter state for shareable links
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("q", searchQuery);
    }

    // Only update URL if we have filter parameters
    if (params.toString()) {
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else if (location.search) {
      // Clear search parameters if we don't have any
      navigate(location.pathname, { replace: true });
    }
  }, [searchQuery, navigate, location.pathname]);

  // Handle page change
  const handlePageChange = (newPage) => {
    // Save current scroll position
    const scrollPosition = window.scrollY;

    // Update page number
    setCurrentPage(newPage);
    currentPageRef.current = newPage;

    // Fetch new data
    fetchProducts().then(() => {
      // After fetching, scroll to products section instead of top
      const productsSection = document.querySelector(".products-grid-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      } else {
        // If products section not found, maintain current position
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto",
        });
      }
    });
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 when searching
    currentPageRef.current = 1;
    fetchProducts();
  };

  // Clear all filters and reload results
  const clearFilters = () => {
    setMetals([]);
    setMetalColors([]);
    setCaratRange([0, maxCarat]);
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
    setSortType("relevant");
    setCurrentPage(1);

    // Update refs immediately to avoid stale data
    metalsRef.current = [];
    metalColorsRef.current = [];
    caratRangeRef.current = [0, maxCarat];
    priceRangeRef.current = [0, maxPrice];
    searchQueryRef.current = "";
    sortTypeRef.current = "relevant";
    currentPageRef.current = 1;

    // Use timeout to ensure state updates have propagated
    setTimeout(() => fetchProducts(), 100);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setMetals([]);
    setMetalColors([]);
    setCaratRange([0, maxCarat]);
    setPriceRange([0, maxPrice]);

    // Update refs immediately
    metalsRef.current = [];
    metalColorsRef.current = [];
    caratRangeRef.current = [0, maxCarat];
    priceRangeRef.current = [0, maxPrice];

    // Fetch updated results
    setTimeout(() => fetchProducts(), 100);
  };

  // Search handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    searchQueryRef.current = e.target.value;
    setIsSearching(true);
    // Implement debounce logic here if needed
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery("");
    searchQueryRef.current = "";
    setIsSearching(false);

    // If search was active, reload results
    if (searchQuery) {
      setTimeout(() => fetchProducts(), 100);
    }
  };

  // Add CSS for range sliders
  const rangeSliderStyles = `
      .multi-range {
        position: relative;
        height: 30px;
      }
      
      .multi-range input[type="range"] {
        position: absolute;
        width: 100%;
        height: 5px;
        top: 10px;
        background: none;
        pointer-events: none;
      }
      
      .multi-range input[type="range"]::-webkit-slider-thumb {
        pointer-events: auto;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #000;
        cursor: pointer;
        margin-top: -6px;
        z-index: 50;
        position: relative;
      }
      
      .multi-range input[type="range"]::-moz-range-thumb {
        pointer-events: auto;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #000;
        cursor: pointer;
        border: none;
        z-index: 50;
        position: relative;
      }
      
      .multi-range .range-track {
        position: absolute;
        width: 100%;
        height: 5px;
        top: 12px;
        background: #e5e7eb;
        z-index: 1;
      }
      
      .multi-range .min-slider {
        z-index: 2;
      }
      
      .multi-range .max-slider {
        z-index: 3;
      }
  
      /* Hide scrollbar styles */
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-ping opacity-75"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-pulse"></div>
        </div>
        <p className="text-lg mt-6 font-medium text-gray-800">
          Loading exquisite necklaces...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: rangeSliderStyles }} />
      {/* Hero Section with Background Image */}
      <div className="relative bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/products-hero-background.jpg"
            alt="Luxury earrings collection"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:max-w-2xl lg:max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-16 bg-white/80"></div>
              <span className="uppercase tracking-[0.3em] text-sm font-light text-white/90">
                Luxury Necklaces Collection
              </span>
            </div>
            <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl mb-8 tracking-tight">
              Our Necklaces Collection
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl leading-relaxed">
              Discover our exquisite selection of premium necklaces, each piece
              crafted with exceptional artistry and precision for those who
              appreciate true luxury.
            </p>

            {/* Decorative element */}
            <div className="absolute -bottom-6 right-0 hidden lg:block">
              <svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-20"
              >
                <circle cx="80" cy="80" r="79.5" stroke="white" />
                <circle cx="80" cy="80" r="55.5" stroke="white" />
                <circle cx="80" cy="80" r="31.5" stroke="white" />
                <path d="M80 0V160" stroke="white" strokeWidth="0.5" />
                <path d="M160 80L0 80" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Necklaces Collection
          </h1>
          <p className="text-lg text-gray-600">
            Explore our curated selection of exquisite necklaces
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center mb-4"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, description, or report number..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 px-6 py-3 bg-gray-900 text-white rounded-lg hidden sm:block"
            >
              Search
            </button>
          </form>
        </div>

        {/* Main Layout - Three Section Design */}
        <div className="flex flex-col w-full">
          {/* SECTION 1: Top Filters - Full Width on All Screens (hidden on mobile) */}
          <div className="w-full mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Filters
            </h2>

            <div className="flex flex-col">
              {/* Metal Filter */}
              {uniqueMetals.length > 0 && (
                <div className="w-full mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Metal
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueMetals.map((metal) => (
                      <button
                        key={metal}
                        onClick={(e) =>
                          toggleFilter(metal, metals, setMetals, metalsRef)
                        }
                        className={`px-3 py-1 text-xs rounded-full ${
                          metals.includes(metal)
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {metal}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Metal Color Filter */}
              {uniqueMetalColors.length > 0 && (
                <div className="w-full mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Metal Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueMetalColors.map((color) => (
                      <button
                        key={color}
                        onClick={(e) =>
                          toggleFilter(
                            color,
                            metalColors,
                            setMetalColors,
                            metalColorsRef
                          )
                        }
                        className={`px-3 py-1 text-xs rounded-full ${
                          metalColors.includes(color)
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2x2 Grid for Price/Carat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                {/* Price Range Inputs */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Price Range
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={maxPrice}
                          value={priceRange[0]}
                          onChange={(e) =>
                            handlePriceMinChange(parseInt(e.target.value))
                          }
                          className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="mx-4 text-gray-400 self-center">to</div>
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) =>
                            handlePriceMaxChange(parseInt(e.target.value))
                          }
                          className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carat Range Inputs - Desktop */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Carat Range
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={maxCarat}
                        step="0.01"
                        value={caratRange[0]}
                        onChange={(e) =>
                          handleCaratMinChange(parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400 self-center">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={maxCarat}
                        step="0.01"
                        value={caratRange[1]}
                        onChange={(e) =>
                          handleCaratMaxChange(parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button - Only show on mobile */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="w-full py-2 bg-gray-900 text-white rounded-lg flex justify-center items-center space-x-2"
              >
                <FaFilter />
                <span>{isMobileFilterOpen ? "Hide Filters" : "Filters"}</span>
              </button>
            </div>

            {/* Mobile Filter Panel */}
            <AnimatePresence>
              {isMobileFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden overflow-hidden mb-6"
                >
                  <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        All Filters
                      </h2>
                      <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    {/* Mobile Quick Filters Section */}
                    <div className="mb-5">
                      {/* Metal Filter */}
                      {uniqueMetals.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Metal
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueMetals.map((metal) => (
                              <button
                                key={metal}
                                onClick={(e) =>
                                  toggleFilter(
                                    metal,
                                    metals,
                                    setMetals,
                                    metalsRef
                                  )
                                }
                                className={`px-3 py-1 text-xs rounded-full ${
                                  metals.includes(metal)
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {metal}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metal Color Filter */}
                      {uniqueMetalColors.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Metal Color
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueMetalColors.map((color) => (
                              <button
                                key={color}
                                onClick={(e) =>
                                  toggleFilter(
                                    color,
                                    metalColors,
                                    setMetalColors,
                                    metalColorsRef
                                  )
                                }
                                className={`px-3 py-1 text-xs rounded-full ${
                                  metalColors.includes(color)
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2x2 Grid for Other Quick Filters */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Price Range - Mobile */}
                        <div className="mb-4">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Price Range
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  $
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  max={maxPrice}
                                  value={priceRange[0]}
                                  onChange={(e) =>
                                    handlePriceMinChange(
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                            </div>
                            <div className="mx-2 text-gray-400 self-center">
                              to
                            </div>
                            <div className="flex-1">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  $
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  max={maxPrice}
                                  value={priceRange[1]}
                                  onChange={(e) =>
                                    handlePriceMaxChange(
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Carat Range - Mobile */}
                        <div className="mb-4">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Carat Range
                          </h3>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                min={0}
                                max={maxCarat}
                                step="0.01"
                                value={caratRange[0]}
                                onChange={(e) =>
                                  handleCaratMinChange(
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div className="mx-2 text-gray-400 self-center">
                              to
                            </div>
                            <div className="flex-1">
                              <input
                                type="number"
                                min={0}
                                max={maxCarat}
                                step="0.01"
                                value={caratRange[1]}
                                onChange={(e) =>
                                  handleCaratMaxChange(
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clear All Filters Button */}
                    <button
                      onClick={() => {
                        clearFilters();
                        setTimeout(() => fetchProducts(), 100);
                      }}
                      className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 3: Products Grid - Full Width */}
          <div className="w-full">
            {/* Product Count and Active Filters */}
            <div className="mb-6 flex flex-wrap justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {isLoading
                  ? "Loading products..."
                  : `${filterProducts.length} products`}
              </h2>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                {metals.length > 0 && (
                  <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    <span className="mr-1">
                      Metal{metals.length > 1 ? "s" : ""}: {metals.length}
                    </span>
                    <button
                      onClick={() => setMetals([])}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {metalColors.length > 0 && (
                  <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    <span className="mr-1">
                      Metal Color{metalColors.length > 1 ? "s" : ""}:{" "}
                      {metalColors.length}
                    </span>
                    <button
                      onClick={() => setMetalColors([])}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sort Options - Added as dropdown in product section */}
            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <FaSort className="h-4 w-4" />
                  <span>
                    Sort:{" "}
                    {sortOptions.find((opt) => opt.value === sortType)?.label}
                  </span>
                  <FaChevronDown className="h-3 w-3 ml-2" />
                </button>

                {showSortOptions && (
                  <div className="absolute z-10 mt-1 w-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortType(option.value);
                          setShowSortOptions(false);
                          setCurrentPage(1);
                          setTimeout(() => fetchProducts(), 100);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          sortType === option.value
                            ? "bg-gray-100 font-medium"
                            : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : filterProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaGem className="text-gray-300 text-5xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  We couldn't find any products that match your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    clearFilters();
                    setTimeout(() => fetchProducts(), 100);
                  }}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 products-grid-section">
                <AnimatePresence>
                  {filterProducts.map((necklace, index) => (
                    <motion.div
                      key={necklace._id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GalleryItem item={necklace} price={true} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center">
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FaChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Generate page numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;

                    // Only show a limited number of pages to avoid clutter
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            handlePageChange(pageNum);
                          }}
                          className={`mx-1 px-4 py-2 rounded-md ${
                            currentPage === pageNum
                              ? "bg-gray-900 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    // Add ellipsis for skipped pages
                    if (
                      (pageNum === currentPage - 2 && pageNum > 1) ||
                      (pageNum === currentPage + 2 && pageNum < totalPages)
                    ) {
                      return (
                        <span key={`ellipsis-${pageNum}`} className="mx-1">
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  <button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Necklaces;
