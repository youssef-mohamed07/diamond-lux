import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { ShopContext } from "../../../context/ShopContext";
import Title from "../../../components/Title";
import GalleryItem from "../../../components/Home/GalleryItem";
import { assets } from "../../../assets/assets";
import { useCategories } from "../../../../hooks/useCategories";
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

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const backendURL_WITHOUT_API = VITE_BACKEND_URL.replace("/api", "");

const Necklaces = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Data store
  const { necklaces } = useContext(ShopContext);
  console.log(necklaces);

  // Core filtering states
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [categoryParam] : []
  );
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [filterProducts, setFilterProducts] = useState([]);
  const [showClearFilter, setShowClearFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState("relevant");

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
  const [uniqueDiamondTypes, setUniqueDiamondTypes] = useState([]);
  const [uniqueMetals, setUniqueMetals] = useState([]);
  const [uniqueMetalColors, setUniqueMetalColors] = useState([]);

  const categories = useCategories();
  // Filter categories to only include those with associated products
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Define sort options
  const sortOptions = [
    { value: "relevant", label: "Relevance" },
    { value: "low-high", label: "Price: Low to High" },
    { value: "high-low", label: "Price: High to Low" },
  ];

  const toggleCategory = (e) => {
    const categoryId = e.target.value;
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Toggle function for diamond property filters
  const toggleFilter = (value, currentValues, setterFunction) => {
    if (currentValues.includes(value)) {
      setterFunction((prev) => prev.filter((item) => item !== value));
    } else {
      setterFunction((prev) => [...prev, value]);
    }
  };

  // Function to reset all advanced filters
  const resetAdvancedFilters = () => {
    setDiamondTypes([]);
    setMetals([]);
    setMetalColors([]);
    setCaratRange([0, maxCarat]);
    setPriceRange([0, maxPrice]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setDiamondTypes([]);
    setMetals([]);
    setMetalColors([]);
    setCaratRange([0, maxCarat]);
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
  };

  // Search and filter handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
    // Implement debounce logic here if needed
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  // Filter and sort bracelets
  useEffect(() => {
    let filteredProducts = [...necklaces];

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((necklace) =>
        necklace.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((necklace) =>
        selectedCategories.includes(necklace.category)
      );
    }

    // Apply advanced diamond filters
    // Shape filter
    if (diamondTypes.length > 0) {
      filteredProducts = filteredProducts.filter(
        (necklace) => necklace.shape && diamondTypes.includes(necklace.shape)
      );
    }

    // Color filter
    if (metalColors.length > 0) {
      filteredProducts = filteredProducts.filter(
        (necklace) => necklace.col && metalColors.includes(necklace.col)
      );
    }

    // Carat range filter
    filteredProducts = filteredProducts.filter(
      (necklace) =>
        !necklace.carats ||
        (necklace.carats >= caratRange[0] && necklace.carats <= caratRange[1])
    );

    // Price range filter
    filteredProducts = filteredProducts.filter(
      (necklace) =>
        necklace.price >= priceRange[0] && necklace.price <= priceRange[1]
    );

    // Apply sorting
    if (sortType === "low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filteredProducts);
    setIsLoading(false);
  }, [
    necklaces,
    searchQuery,
    selectedCategories,
    sortType,
    diamondTypes,
    metalColors,
    caratRange,
    priceRange,
  ]);

  // Extract unique values for filter options and filter categories
  useEffect(() => {
    if (necklaces && necklaces.length > 0) {
      // Find max price and carat for ranges
      const maxProductPrice = Math.max(...necklaces.map((p) => p.price || 0));
      const maxProductCarat = Math.max(...necklaces.map((p) => p.carats || 0));
      setMaxPrice(maxProductPrice > 0 ? maxProductPrice : 1000000);
      setMaxCarat(maxProductCarat > 0 ? maxProductCarat : 10);
      setPriceRange([0, maxProductPrice > 0 ? maxProductPrice : 1000000]);
      setCaratRange([0, maxProductCarat > 0 ? maxProductCarat : 10]);

      // Extract unique values
      setUniqueDiamondTypes([
        ...new Set(necklaces.filter((p) => p.shape).map((p) => p.shape)),
      ]);
      setUniqueMetals([
        ...new Set(necklaces.filter((p) => p.metal).map((p) => p.metal)),
      ]);
      setUniqueMetalColors([
        ...new Set(necklaces.filter((p) => p.col).map((p) => p.col)),
      ]);

      // Filter categories to only include those with associated products
      if (categories && categories.length > 0) {
        const usedCategoryIds = [...new Set(necklaces.map((p) => p.category))];
        setFilteredCategories(
          categories.filter((category) =>
            usedCategoryIds.includes(category._id)
          )
        );
      }
    }
  }, [necklaces, categories]);

  // Reset form when there are no products or categories to show
  useEffect(() => {
    if (necklaces.length === 0 || filteredCategories.length === 0) {
      setSelectedCategories([]);
    }
  }, [necklaces, filteredCategories]);

  // Clear selected categories if they no longer exist in filtered categories
  useEffect(() => {
    if (selectedCategories.length > 0 && filteredCategories.length > 0) {
      const validCategoryIds = filteredCategories.map((cat) => cat._id);
      const validSelectedCategories = selectedCategories.filter((id) =>
        validCategoryIds.includes(id)
      );

      if (validSelectedCategories.length !== selectedCategories.length) {
        setSelectedCategories(validSelectedCategories);
      }
    }
  }, [filteredCategories, selectedCategories]);

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
          <div className="relative flex items-center mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search necklaces..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Layout - Three Section Design */}
        <div className="flex flex-col w-full">
          {/* SECTION 1: Top Filters - Full Width on All Screens (hidden on mobile) */}
          <div className="w-full mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quick Filters
            </h2>

            <div className="flex flex-col">
              {/* Diamond Type Filter */}
              {uniqueDiamondTypes.length > 0 && (
                <div className="w-full mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Diamond Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueDiamondTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleFilter(type, diamondTypes, setDiamondTypes)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          diamondTypes.includes(type)
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                        onClick={() => toggleFilter(metal, metals, setMetals)}
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
                        onClick={() => toggleFilter(color, metalColors, setMetalColors)}
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
                          step={100}
                          value={priceRange[0]}
                          onChange={(e) => {
                            // Parse value and handle empty inputs
                            let value = e.target.value === '' ? 0 : parseInt(e.target.value);
                            
                            // Ensure value is a number and not negative
                            if (isNaN(value) || value < 0) {
                              value = 0;
                            }
                            
                            // Ensure min is less than max with a minimum gap of 100
                            const safeMax = Math.max(priceRange[1], value + 100);
                            
                            // Update state with validated values
                            setPriceRange([value, safeMax]);
                          }}
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
                          step={100}
                          value={priceRange[1]}
                          onChange={(e) => {
                            // Parse value and handle empty inputs
                            let value = e.target.value === '' ? 0 : parseInt(e.target.value);
                            
                            // Ensure value is a number and not below minimum
                            if (isNaN(value) || value <= 0) {
                              value = priceRange[0] + 100;
                            }
                            
                            // Ensure max is greater than min with a minimum gap of 100
                            value = Math.max(value, priceRange[0] + 100);
                            
                            // Ensure max doesn't exceed the maximum allowed price
                            value = Math.min(value, maxPrice);
                            
                            // Update state with validated values
                            setPriceRange([priceRange[0], value]);
                          }}
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
                        step={0.01}
                        value={caratRange[0]}
                        onChange={(e) => {
                          // Parse value and handle empty inputs
                          let value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          
                          // Ensure value is a number and not negative
                          if (isNaN(value) || value < 0) {
                            value = 0;
                          }
                          
                          // Round to 2 decimal places
                          value = Math.round(value * 100) / 100;
                          
                          // Ensure min is less than max with a minimum gap of 0.01
                          const safeMax = Math.max(caratRange[1], value + 0.01);
                          
                          // Update state with validated values
                          setCaratRange([value, safeMax]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400 self-center">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={maxCarat}
                        step={0.01}
                        value={caratRange[1]}
                        onChange={(e) => {
                          // Parse value and handle empty inputs
                          let value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          
                          // Ensure value is a number and not below minimum
                          if (isNaN(value) || value <= 0) {
                            value = caratRange[0] + 0.01;
                          }
                          
                          // Round to 2 decimal places
                          value = Math.round(value * 100) / 100;
                          
                          // Ensure max is greater than min with a minimum gap of 0.01
                          value = Math.max(value, caratRange[0] + 0.01);
                          
                          // Ensure max doesn't exceed the maximum allowed carat
                          value = Math.min(value, maxCarat);
                          
                          // Update state with validated values
                          setCaratRange([caratRange[0], value]);
                        }}
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
                      {/* Diamond Type Filter */}
                      {uniqueDiamondTypes.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Diamond Type
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueDiamondTypes.map((type) => (
                              <button
                                key={type}
                                onClick={() => toggleFilter(type, diamondTypes, setDiamondTypes)}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  diamondTypes.includes(type)
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

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
                                onClick={() => toggleFilter(metal, metals, setMetals)}
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
                                onClick={() => toggleFilter(color, metalColors, setMetalColors)}
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
                                  step={100}
                                  value={priceRange[0]}
                                  onChange={(e) => {
                                    // Parse value and handle empty inputs
                                    let value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    
                                    // Ensure value is a number and not negative
                                    if (isNaN(value) || value < 0) {
                                      value = 0;
                                    }
                                    
                                    // Ensure min is less than max with a minimum gap of 100
                                    const safeMax = Math.max(priceRange[1], value + 100);
                                    
                                    // Update state with validated values
                                    setPriceRange([value, safeMax]);
                                  }}
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
                                  step={100}
                                  value={priceRange[1]}
                                  onChange={(e) => {
                                    // Parse value and handle empty inputs
                                    let value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    
                                    // Ensure value is a number and not below minimum
                                    if (isNaN(value) || value <= 0) {
                                      value = priceRange[0] + 100;
                                    }
                                    
                                    // Ensure max is greater than min with a minimum gap of 100
                                    value = Math.max(value, priceRange[0] + 100);
                                    
                                    // Ensure max doesn't exceed the maximum allowed price
                                    value = Math.min(value, maxPrice);
                                    
                                    // Update state with validated values
                                    setPriceRange([priceRange[0], value]);
                                  }}
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
                                step={0.01}
                                value={caratRange[0]}
                                onChange={(e) => {
                                  // Parse value and handle empty inputs
                                  let value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  
                                  // Ensure value is a number and not negative
                                  if (isNaN(value) || value < 0) {
                                    value = 0;
                                  }
                                  
                                  // Round to 2 decimal places
                                  value = Math.round(value * 100) / 100;
                                  
                                  // Ensure min is less than max with a minimum gap of 0.01
                                  const safeMax = Math.max(caratRange[1], value + 0.01);
                                  
                                  // Update state with validated values
                                  setCaratRange([value, safeMax]);
                                }}
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
                                step={0.01}
                                value={caratRange[1]}
                                onChange={(e) => {
                                  // Parse value and handle empty inputs
                                  let value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  
                                  // Ensure value is a number and not below minimum
                                  if (isNaN(value) || value <= 0) {
                                    value = caratRange[0] + 0.01;
                                  }
                                  
                                  // Round to 2 decimal places
                                  value = Math.round(value * 100) / 100;
                                  
                                  // Ensure max is greater than min with a minimum gap of 0.01
                                  value = Math.max(value, caratRange[0] + 0.01);
                                  
                                  // Ensure max doesn't exceed the maximum allowed carat
                                  value = Math.min(value, maxCarat);
                                  
                                  // Update state with validated values
                                  setCaratRange([caratRange[0], value]);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clear All Filters Button */}
                    <button
                      onClick={clearFilters}
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
                {selectedCategories.map((catId) => {
                  const categoryObj = filteredCategories.find(
                    (cat) => cat._id === catId
                  );
                  return (
                    categoryObj && (
                      <div
                        key={`cat-${catId}`}
                        className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span className="mr-1">
                          Category: {categoryObj.name}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== catId)
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  );
                })}
                {diamondTypes.length > 0 && (
                  <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    <span className="mr-1">
                      Diamond Type{diamondTypes.length > 1 ? "s" : ""}: {diamondTypes.length}
                    </span>
                    <button
                      onClick={() => setDiamondTypes([])}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                )}
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
                      Metal Color{metalColors.length > 1 ? "s" : ""}: {metalColors.length}
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
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                  {filterProducts.map((necklace, index) => (
                    <motion.div
                      key={necklace._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GalleryItem
                        item={necklace}
                        price={true}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {/* Uncomment and implement if pagination is needed */}
            {/* <div className="mt-8 flex justify-center">
                <nav className="flex items-center">
                  <button className="p-2 rounded-md hover:bg-gray-100">
                    <FaChevronLeft className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="mx-1 px-4 py-2 rounded-md bg-gray-900 text-white">
                    1
                  </button>
                  <button className="mx-1 px-4 py-2 rounded-md hover:bg-gray-100">
                    2
                  </button>
                  <button className="p-2 rounded-md hover:bg-gray-100">
                    <FaChevronRight className="h-5 w-5 text-gray-500" />
                  </button>
                </nav>
              </div> */}
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Necklaces;
