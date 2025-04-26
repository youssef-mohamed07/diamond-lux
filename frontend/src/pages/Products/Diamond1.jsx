import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { ShopContext } from "../../context/ShopContext";
import Title from "../../components/Title";
import GalleryItem from "../../components/Home/GalleryItem";
import { assets } from "../../assets/assets";
import { useCategories } from "../../../hooks/useCategories";
import NewsletterBox from "../../components/NewsletterBox";
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
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getImageUrl,
  getDiamondShapeImageUrl,
} from "../../../utils/imageHelper";
import { toast } from "react-toastify";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const backendURL_WITHOUT_API = VITE_BACKEND_URL.replace("/api", "");

const Diamond = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;

  // Data store
  const {
    diamondProducts,
    productsLoading,
    diamondPagination,
    diamondLoading,
    fetchDiamondPage,
  } = useContext(ShopContext);

  // Core states
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [categoryParam] : []
  );
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState("relevant");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Additional UI state
  const [showFilter, setShowFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Mobile menu states
  const [mobileFiltersModal, setMobileFiltersModal] = useState(false);

  // Shape states (only for UI display purposes)
  const [shapes, setShapes] = useState([]);
  const [colors, setColors] = useState([]);
  const [clarities, setClarities] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [polishes, setPolishes] = useState([]);
  const [symmetries, setSymmetries] = useState([]);
  const [fluorescences, setFluorescences] = useState([]);
  const [labs, setLabs] = useState([]);

  // Range slider states for UI purposes
  const [caratRange, setCaratRange] = useState([0, 20]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxCarat, setMaxCarat] = useState(20);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [tableRange, setTableRange] = useState([0, 100]);
  const [lwRatioRange, setLwRatioRange] = useState([0, 10]);
  const [lengthRange, setLengthRange] = useState([0, 30]);
  const [widthRange, setWidthRange] = useState([0, 30]);
  const [depthRange, setDepthRange] = useState([0, 100]);

  // Placeholder arrays for UI
  const [uniqueShapes, setUniqueShapes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);
  const [uniqueClarities, setUniqueClarities] = useState([]);
  const [uniqueCuts, setUniqueCuts] = useState([]);
  const [uniquePolishes, setUniquePolishes] = useState([]);
  const [uniqueSymmetries, setUniqueSymmetries] = useState([]);
  const [uniqueFluorescences, setUniqueFluorescences] = useState([]);
  const [uniqueLabs, setUniqueLabs] = useState([]);

  const categories = useCategories();
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Define sort options
  const sortOptions = [
    { value: "low-high", label: "Price: Low to High" },
    { value: "high-low", label: "Price: High to Low" },
  ];

  // Load diamond products
  useEffect(() => {
    // When navigating directly to a page via URL, ensure proper loading
    const initializePage = async () => {
      try {
        setIsLoading(true);

        // If no diamond products have been loaded yet, fetch the first page
        if (!diamondProducts || diamondProducts.length === 0) {
          console.log("No diamond products found, fetching page 1");
          await fetchDiamondPage(1);
        }
        // If a specific page is requested and it's different from current page
        else if (pageParam > 1 && pageParam !== diamondPagination.currentPage) {
          console.log(`Fetching requested page: ${pageParam}`);
          const result = await fetchDiamondPage(pageParam);

          // If page fetch failed but URL still has the page parameter
          if (result === null) {
            console.warn(
              "Failed to load requested page, staying on current page"
            );
          }
        }
      } catch (error) {
        console.error("Error initializing page:", error);
        toast.error("Failed to load the diamond products");
      } finally {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }
    };

    initializePage();
  }, [
    pageParam,
    fetchDiamondPage,
    diamondPagination.currentPage,
    diamondProducts,
  ]);

  // Initialize the category selection once on component mount
  useEffect(() => {
    const initialCategoryParam = searchParams.get("category") || "";
    if (initialCategoryParam) {
      setSelectedCategories([initialCategoryParam]);
    } else {
      setSelectedCategories([]);
    }

    // Setup placeholder UI data when mounting
    if (diamondProducts && diamondProducts.length > 0) {
      // Get unique values for display purposes only
      const getUnique = (key) => [
        ...new Set(diamondProducts.filter((p) => p[key]).map((p) => p[key])),
      ];

      setUniqueColors(getUnique("color") || []);
      setUniqueClarities(getUnique("clarity") || []);
      setUniqueCuts(getUnique("cut") || []);
      setUniquePolishes(getUnique("polish") || []);
      setUniqueSymmetries(getUnique("symmetry") || []);
      setUniqueFluorescences(getUnique("fluorescence") || []);
      setUniqueLabs(getUnique("lab") || []);

      // Set filtered categories for UI
      setFilteredCategories(categories || []);
    }
  }, [diamondProducts, categories, searchParams]);

  // Clear all filters UI function
  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setShapes([]);
    setColors([]);
    setClarities([]);
    setCuts([]);
    setPolishes([]);
    setSymmetries([]);
    setFluorescences([]);
    setLabs([]);
    setCaratRange([0, maxCarat]);
    setPriceRange([0, maxPrice]);
    setTableRange([0, 100]);
    setLwRatioRange([0, 10]);
    setLengthRange([0, 30]);
    setWidthRange([0, 30]);
    setDepthRange([0, 100]);
    setSearchQuery("");
    navigate({ search: "" }, { replace: true });
  }, [maxCarat, maxPrice, navigate]);

  // Toggle category selection UI function
  const toggleCategorySelection = useCallback(
    (categoryId) => {
      if (selectedCategories.includes(categoryId)) {
        // If this category is already selected, deselect it
        setSelectedCategories([]);

        // Update URL directly
        const params = new URLSearchParams(location.search);
        params.delete("category");
        navigate(`${location.pathname}?${params.toString()}`, {
          replace: true,
        });
      } else {
        // Otherwise select this category (replacing any existing selection)
        setSelectedCategories([categoryId]);

        // Update URL directly
        const params = new URLSearchParams(location.search);
        params.set("category", categoryId);
        navigate(`${location.pathname}?${params.toString()}`, {
          replace: true,
        });
      }
    },
    [selectedCategories, location.search, location.pathname, navigate]
  );

  // Handle page change UI function
  const handlePageChange = useCallback(
    async (page) => {
      // Validate the page number is within range
      if (
        page < 1 ||
        page > diamondPagination.totalPages ||
        isLoading ||
        diamondLoading ||
        page === diamondPagination.currentPage
      ) {
        return;
      }

      try {
        setIsLoading(true);

        // Update URL with the page number before attempting to load
        // This ensures consistent state even if load fails
        const params = new URLSearchParams(location.search);
        params.set("page", page);
        navigate(`${location.pathname}?${params.toString()}`, {
          replace: true,
        });

        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Attempt to fetch the page
        const result = await fetchDiamondPage(page);

        // If fetch failed (returns null), handle gracefully
        if (result === null) {
          console.log(
            "Page change fetch returned null - keeping existing data"
          );
        }
      } catch (error) {
        console.error("Error changing page:", error);
        toast.error("Failed to load page. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    },
    [
      location.search,
      location.pathname,
      navigate,
      fetchDiamondPage,
      isLoading,
      diamondLoading,
      diamondPagination,
    ]
  );

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-ping opacity-75"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-pulse"></div>
        </div>
        <p className="text-lg mt-6 font-medium text-gray-800">
          Loading exquisite products...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/products-hero-background.jpg"
            alt="Luxury jewelry collection"
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
                Luxury Diamond Collection
              </span>
            </div>
            <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl mb-8 tracking-tight">
              Our Diamond Collection
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl leading-relaxed">
              Discover our exquisite selection of premium diamond, each piece
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
        {/* Below Hero Section Text*/}
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Diamond Collection
          </h1>
          <p className="text-lg text-gray-600">
            Explore our curated selection of exquisite diamonds
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full mb-8">
          <div className="relative flex items-center mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                  setTimeout(() => {
                    setIsSearching(false);
                  }, 500);
                }}
                placeholder="Search diamonds..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearching(false);
                  }}
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
              {/* Diamond Shapes Category Slider - 100% Width */}
              {categories.length > 0 && (
                <div className="w-full mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                    <span>Diamond Shapes</span>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={() =>
                          toggleCategorySelection(selectedCategories[0])
                        }
                        className="text-xs font-normal text-white bg-gray-900 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors"
                      >
                        Clear Selection
                      </button>
                    )}
                  </h3>
                  {filteredCategories.length > 0 ? (
                    <div className="relative group">
                      {/* Left Arrow Navigation */}
                      <button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -ml-2"
                        onClick={() => {
                          const container = document.getElementById(
                            "diamond-shapes-slider"
                          );
                          if (container) {
                            container.scrollBy({
                              left: -200,
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        <FaChevronLeft className="text-gray-600 w-4 h-4" />
                      </button>

                      {/* Right Arrow Navigation */}
                      <button
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                        onClick={() => {
                          const container = document.getElementById(
                            "diamond-shapes-slider"
                          );
                          if (container) {
                            container.scrollBy({
                              left: 200,
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        <FaChevronRight className="text-gray-600 w-4 h-4" />
                      </button>

                      {/* Slider Container */}
                      <div
                        id="diamond-shapes-slider"
                        className="overflow-x-auto scrollbar-hide py-4 px-2"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <div className="flex flex-row space-x-4 md:space-x-6 min-w-max">
                          {filteredCategories.map((category) => (
                            <div
                              key={category._id}
                              onClick={() =>
                                toggleCategorySelection(category._id)
                              }
                              className={`cursor-pointer flex flex-col items-center transition-all transform hover:scale-105 active:scale-95 ${
                                selectedCategories.includes(category._id)
                                  ? "scale-105 opacity-100"
                                  : "opacity-80 hover:opacity-100"
                              }`}
                            >
                              <div
                                className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 shadow-md flex items-center justify-center transition-all relative ${
                                  selectedCategories.includes(category._id)
                                    ? "border-gray-900 ring-2 ring-gray-300 hover:bg-gray-100"
                                    : "border-transparent hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {selectedCategories.includes(category._id) && (
                                  <div className="absolute top-0 right-0 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                      ✓
                                    </span>
                                  </div>
                                )}
                                {category.image ? (
                                  <img
                                    src={`${backendURL_WITHOUT_API}/uploads/diamond-shapes/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      // If image fails to load, show the initial letter
                                      e.target.style.display = "none";
                                      e.target.parentNode.querySelector(
                                        ".fallback-icon"
                                      ).style.display = "flex";
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                                    <span className="text-gray-500 text-lg sm:text-xl font-medium">
                                      {category.name
                                        ? category.name
                                            .substring(0, 1)
                                            .toUpperCase()
                                        : "?"}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-xs sm:text-sm text-center ${
                                  selectedCategories.includes(category._id)
                                    ? "font-semibold"
                                    : "font-normal"
                                }`}
                              >
                                {category.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-500">
                        No diamond shapes available for the current diamonds.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Color Filter - 100% Width */}
              {uniqueColors.length > 0 && (
                <div className="w-full mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          if (colors.includes(color)) {
                            setColors(colors.filter((c) => c !== color));
                          } else {
                            setColors([...colors, color]);
                          }
                        }}
                        className={`px-3 py-1 text-xs rounded-full ${
                          colors.includes(color)
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

              {/* 2x2 Grid for Price/Carat and Cut/Clarity */}
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
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value)) return;
                            setPriceRange([
                              Math.min(value, priceRange[1] - 1),
                              priceRange[1],
                            ]);
                          }}
                          className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="mx-4 text-gray-400 self-end mb-2">to</div>
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
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value)) return;
                            setPriceRange([
                              priceRange[0],
                              Math.max(value, priceRange[0] + 1),
                            ]);
                          }}
                          className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carat Range Inputs */}
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
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Calculate a safe maximum that ensures we don't exceed the max value
                          const safeMax = Math.min(
                            value,
                            caratRange[1] - 0.001
                          );
                          setCaratRange([
                            parseFloat(safeMax.toFixed(2)),
                            caratRange[1],
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400 self-end mb-2">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={maxCarat}
                        step="0.01"
                        value={caratRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Calculate a safe minimum that ensures we're at least 0.001 more than the min value
                          setCaratRange([
                            caratRange[0],
                            parseFloat(
                              Math.max(value, caratRange[0] + 0.001).toFixed(2)
                            ),
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Cut Filter */}
                {uniqueCuts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Cut
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueCuts.map((cut) => (
                        <button
                          key={cut}
                          onClick={() => {
                            if (cuts.includes(cut)) {
                              setCuts(cuts.filter((c) => c !== cut));
                            } else {
                              setCuts([...cuts, cut]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            cuts.includes(cut)
                              ? "bg-gray-900 text-white shadow-md"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {cut}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clarity Filter */}
                {uniqueClarities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Clarity
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueClarities.map((clarity) => (
                        <button
                          key={clarity}
                          onClick={() => {
                            if (clarities.includes(clarity)) {
                              setClarities(
                                clarities.filter((c) => c !== clarity)
                              );
                            } else {
                              setClarities([...clarities, clarity]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            clarities.includes(clarity)
                              ? "bg-gray-900 text-white shadow-md"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {clarity}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2 & 3: Main Content Area with Left Sidebar and Product Grid */}
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
                      {/* Diamond Shapes */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center justify-between">
                          <span>Diamond Shapes</span>
                          {selectedCategories.length > 0 && (
                            <button
                              onClick={() =>
                                toggleCategorySelection(selectedCategories[0])
                              }
                              className="text-xs font-normal text-white bg-gray-900 hover:bg-gray-700 px-2 py-1 rounded-full transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </h3>
                        {filteredCategories.length > 0 ? (
                          <div className="relative group">
                            {/* Left Arrow Navigation */}
                            <button
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-1 flex items-center justify-center -ml-1"
                              onClick={() => {
                                const container = document.getElementById(
                                  "mobile-diamond-shapes-slider"
                                );
                                if (container) {
                                  container.scrollBy({
                                    left: -150,
                                    behavior: "smooth",
                                  });
                                }
                              }}
                            >
                              <FaChevronLeft className="text-gray-600 w-3 h-3" />
                            </button>

                            {/* Right Arrow Navigation */}
                            <button
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-1 flex items-center justify-center -mr-1"
                              onClick={() => {
                                const container = document.getElementById(
                                  "mobile-diamond-shapes-slider"
                                );
                                if (container) {
                                  container.scrollBy({
                                    left: 150,
                                    behavior: "smooth",
                                  });
                                }
                              }}
                            >
                              <FaChevronRight className="text-gray-600 w-3 h-3" />
                            </button>

                            {/* Slider Container */}
                            <div
                              id="mobile-diamond-shapes-slider"
                              className="overflow-x-auto scrollbar-hide py-3 px-2"
                              style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                              }}
                            >
                              <div className="flex flex-row space-x-3 sm:space-x-4 min-w-max">
                                {filteredCategories.map((category) => (
                                  <div
                                    key={category._id}
                                    onClick={() =>
                                      toggleCategorySelection(category._id)
                                    }
                                    className={`cursor-pointer flex flex-col items-center transition-all transform hover:scale-105 active:scale-95 ${
                                      selectedCategories.includes(category._id)
                                        ? "scale-105 opacity-100"
                                        : "opacity-80 hover:opacity-100"
                                    }`}
                                  >
                                    <div
                                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 border-2 shadow-md flex items-center justify-center transition-all ${
                                        selectedCategories.includes(
                                          category._id
                                        )
                                          ? "border-gray-900 ring-1 ring-gray-300 hover:bg-gray-100"
                                          : "border-transparent hover:border-gray-300 hover:bg-gray-50"
                                      }`}
                                    >
                                      {selectedCategories.includes(
                                        category._id
                                      ) && (
                                        <div className="absolute top-0 right-0 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                          <span className="text-white text-xs">
                                            ✓
                                          </span>
                                        </div>
                                      )}
                                      {category.image ? (
                                        <img
                                          src={getDiamondShapeImageUrl(
                                            category._id
                                          )}
                                          alt={category.name}
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            // If image fails to load, show the initial letter
                                            e.target.style.display = "none";
                                            e.target.parentNode.querySelector(
                                              ".fallback-icon"
                                            ).style.display = "flex";
                                          }}
                                        />
                                      ) : (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                                          <span className="text-gray-500 text-md sm:text-lg font-medium">
                                            {category.name
                                              ? category.name
                                                  .substring(0, 1)
                                                  .toUpperCase()
                                              : "?"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <span
                                      className={`text-xs text-center max-w-[60px] sm:max-w-[80px] truncate ${
                                        selectedCategories.includes(
                                          category._id
                                        )
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {category.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg text-center mb-4">
                            <p className="text-gray-500 text-sm">
                              No diamond shapes available for the current
                              diamonds.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Color Filter */}
                      {uniqueColors.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Color
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => {
                                  if (colors.includes(color)) {
                                    setColors(
                                      colors.filter((c) => c !== color)
                                    );
                                  } else {
                                    setColors([...colors, color]);
                                  }
                                }}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  colors.includes(color)
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
                        {/* Price Range */}
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
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (isNaN(value)) return;
                                    setPriceRange([
                                      Math.min(value, priceRange[1] - 1),
                                      priceRange[1],
                                    ]);
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
                                  value={priceRange[1]}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (isNaN(value)) return;
                                    setPriceRange([
                                      priceRange[0],
                                      Math.max(value, priceRange[0] + 1),
                                    ]);
                                  }}
                                  className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Carat Range */}
                        <div className="mb-4">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
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
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (isNaN(value)) return;
                                  // Calculate a safe maximum that ensures we don't exceed the max value
                                  const safeMax = Math.min(
                                    value,
                                    caratRange[1] - 0.001
                                  );
                                  setCaratRange([
                                    parseFloat(safeMax.toFixed(2)),
                                    caratRange[1],
                                  ]);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div className="mx-4 text-gray-400 self-end mb-2">
                              to
                            </div>
                            <div className="flex-1">
                              <input
                                type="number"
                                min={0}
                                max={maxCarat}
                                step="0.01"
                                value={caratRange[1]}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (isNaN(value)) return;
                                  // Calculate a safe minimum that ensures we're at least 0.001 more than the min value
                                  setCaratRange([
                                    caratRange[0],
                                    parseFloat(
                                      Math.max(
                                        value,
                                        caratRange[0] + 0.001
                                      ).toFixed(2)
                                    ),
                                  ]);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Cut Filter */}
                        {uniqueCuts.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-3">
                              Cut
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {uniqueCuts.map((cut) => (
                                <button
                                  key={cut}
                                  onClick={() => {
                                    if (cuts.includes(cut)) {
                                      setCuts(cuts.filter((c) => c !== cut));
                                    } else {
                                      setCuts([...cuts, cut]);
                                    }
                                  }}
                                  className={`px-3 py-1 text-xs rounded-full ${
                                    cuts.includes(cut)
                                      ? "bg-gray-900 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }`}
                                >
                                  {cut}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Clarity Filter */}
                        {uniqueClarities.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-3">
                              Clarity
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {uniqueClarities.map((clarity) => (
                                <button
                                  key={clarity}
                                  onClick={() => {
                                    if (clarities.includes(clarity)) {
                                      setClarities(
                                        clarities.filter((c) => c !== clarity)
                                      );
                                    } else {
                                      setClarities([...clarities, clarity]);
                                    }
                                  }}
                                  className={`px-3 py-1 text-xs rounded-full ${
                                    clarities.includes(clarity)
                                      ? "bg-gray-900 text-white"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  }`}
                                >
                                  {clarity}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Advanced Filters Section */}
                    <div className="border-t border-gray-200 pt-5 mt-5">
                      <h3 className="text-base font-medium text-gray-900 mb-4">
                        Advanced Filters
                      </h3>

                      {/* Polish Filter */}
                      {uniquePolishes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Polish
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {uniquePolishes.map((polish) => (
                              <button
                                key={polish}
                                onClick={() => {
                                  if (polishes.includes(polish)) {
                                    setPolishes(
                                      polishes.filter((p) => p !== polish)
                                    );
                                  } else {
                                    setPolishes([...polishes, polish]);
                                  }
                                }}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  polishes.includes(polish)
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {polish}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Symmetry Filter */}
                      {uniqueSymmetries.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Symmetry
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {uniqueSymmetries.map((symmetry) => (
                              <button
                                key={symmetry}
                                onClick={() => {
                                  if (symmetries.includes(symmetry)) {
                                    setSymmetries(
                                      symmetries.filter((s) => s !== symmetry)
                                    );
                                  } else {
                                    setSymmetries([...symmetries, symmetry]);
                                  }
                                }}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  symmetries.includes(symmetry)
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {symmetry}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Table % Filter */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3">
                          Table %
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.1"
                              value={tableRange[0]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 100)
                                );
                                // Ensure min doesn't exceed max
                                const safeValue = Math.min(
                                  boundedValue,
                                  tableRange[1] - 0.1
                                );
                                setTableRange([
                                  parseFloat(safeValue.toFixed(1)),
                                  tableRange[1],
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="mx-4 text-gray-400">to</div>
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.1"
                              value={tableRange[1]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 100)
                                );
                                // Ensure max is greater than min
                                const safeValue = Math.max(
                                  boundedValue,
                                  tableRange[0] + 0.1
                                );
                                setTableRange([
                                  tableRange[0],
                                  parseFloat(safeValue.toFixed(1)),
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* L/W Ratio % Filter */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3">
                          L/W Ratio
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step="0.01"
                              value={lwRatioRange[0]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 10)
                                );
                                // Ensure min doesn't exceed max
                                const safeValue = Math.min(
                                  boundedValue,
                                  lwRatioRange[1] - 0.01
                                );
                                setLwRatioRange([
                                  parseFloat(safeValue.toFixed(2)),
                                  lwRatioRange[1],
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="mx-4 text-gray-400">to</div>
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step="0.01"
                              value={lwRatioRange[1]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 10)
                                );
                                // Ensure max is greater than min
                                const safeValue = Math.max(
                                  boundedValue,
                                  lwRatioRange[0] + 0.01
                                );
                                setLwRatioRange([
                                  lwRatioRange[0],
                                  parseFloat(safeValue.toFixed(2)),
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Length (L) in mm Filter */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3">
                          Length (mm)
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={30}
                              step="0.01"
                              value={lengthRange[0]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 30)
                                );
                                // Ensure min doesn't exceed max
                                const safeValue = Math.min(
                                  boundedValue,
                                  lengthRange[1] - 0.01
                                );
                                setLengthRange([
                                  parseFloat(safeValue.toFixed(2)),
                                  lengthRange[1],
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="mx-4 text-gray-400 self-end mb-2">
                            to
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={30}
                              step="0.01"
                              value={lengthRange[1]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 30)
                                );
                                // Ensure max is greater than min
                                const safeValue = Math.max(
                                  boundedValue,
                                  lengthRange[0] + 0.01
                                );
                                setLengthRange([
                                  lengthRange[0],
                                  parseFloat(safeValue.toFixed(2)),
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Width (W) in mm Filter */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3">
                          Width (mm)
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={30}
                              step="0.01"
                              value={widthRange[0]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 30)
                                );
                                // Ensure min doesn't exceed max
                                const safeValue = Math.min(
                                  boundedValue,
                                  widthRange[1] - 0.01
                                );
                                setWidthRange([
                                  parseFloat(safeValue.toFixed(2)),
                                  widthRange[1],
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="mx-4 text-gray-400 self-center">
                            to
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={30}
                              step="0.01"
                              value={widthRange[1]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 30)
                                );
                                // Ensure max is greater than min
                                const safeValue = Math.max(
                                  boundedValue,
                                  widthRange[0] + 0.01
                                );
                                setWidthRange([
                                  widthRange[0],
                                  parseFloat(safeValue.toFixed(2)),
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Depth % Filter */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3">
                          Depth %
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.1"
                              value={depthRange[0]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 100)
                                );
                                // Ensure min doesn't exceed max
                                const safeValue = Math.min(
                                  boundedValue,
                                  depthRange[1] - 0.1
                                );
                                setDepthRange([
                                  parseFloat(safeValue.toFixed(1)),
                                  depthRange[1],
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="mx-4 text-gray-400 self-center">
                            to
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.1"
                              value={depthRange[1]}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) return;
                                // Ensure value is within bounds
                                const boundedValue = Math.max(
                                  0,
                                  Math.min(value, 100)
                                );
                                // Ensure max is greater than min
                                const safeValue = Math.max(
                                  boundedValue,
                                  depthRange[0] + 0.1
                                );
                                setDepthRange([
                                  depthRange[0],
                                  parseFloat(safeValue.toFixed(1)),
                                ]);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Certification/Lab Filter */}
                      {uniqueLabs.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Certification
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {uniqueLabs.map((lab) => (
                              <button
                                key={lab}
                                onClick={() => {
                                  if (labs.includes(lab)) {
                                    setLabs(labs.filter((l) => l !== lab));
                                  } else {
                                    setLabs([...labs, lab]);
                                  }
                                }}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  labs.includes(lab)
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {lab}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fluorescence Filter */}
                      {uniqueFluorescences.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Fluorescence
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {uniqueFluorescences.map((fluorescence) => (
                              <button
                                key={fluorescence}
                                onClick={() => {
                                  if (fluorescences.includes(fluorescence)) {
                                    setFluorescences(
                                      fluorescences.filter(
                                        (f) => f !== fluorescence
                                      )
                                    );
                                  } else {
                                    setFluorescences([
                                      ...fluorescences,
                                      fluorescence,
                                    ]);
                                  }
                                }}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  fluorescences.includes(fluorescence)
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {fluorescence}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sort Options */}

                    {/* Clear All Filters Button */}
                    <button
                      onClick={clearAllFilters}
                      className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SECTION 2: Left Sidebar with Advanced Filters - Hidden on Mobile */}
            <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
              <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-y-auto max-h-[calc(100vh-200px)]">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Advanced Filters
                </h2>

                {/* Polish Filter */}
                {uniquePolishes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-base font-medium text-gray-900 mb-3">
                      Polish
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniquePolishes.map((polish) => (
                        <button
                          key={polish}
                          onClick={() => {
                            if (polishes.includes(polish)) {
                              setPolishes(polishes.filter((p) => p !== polish));
                            } else {
                              setPolishes([...polishes, polish]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            polishes.includes(polish)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {polish}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Symmetry Filter */}
                {uniqueSymmetries.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-base font-medium text-gray-900 mb-3">
                      Symmetry
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSymmetries.map((symmetry) => (
                        <button
                          key={symmetry}
                          onClick={() => {
                            if (symmetries.includes(symmetry)) {
                              setSymmetries(
                                symmetries.filter((s) => s !== symmetry)
                              );
                            } else {
                              setSymmetries([...symmetries, symmetry]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            symmetries.includes(symmetry)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {symmetry}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Table % Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Table %
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        value={tableRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(
                            0,
                            Math.min(value, 100)
                          );
                          // Ensure min doesn't exceed max
                          const safeValue = Math.min(
                            boundedValue,
                            tableRange[1] - 0.1
                          );
                          setTableRange([
                            parseFloat(safeValue.toFixed(1)),
                            tableRange[1],
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        value={tableRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(
                            0,
                            Math.min(value, 100)
                          );
                          // Ensure max is greater than min
                          const safeValue = Math.max(
                            boundedValue,
                            tableRange[0] + 0.1
                          );
                          setTableRange([
                            tableRange[0],
                            parseFloat(safeValue.toFixed(1)),
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* L/W Ratio % Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    L/W Ratio
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step="0.01"
                        value={lwRatioRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(0, Math.min(value, 10));
                          // Ensure min doesn't exceed max
                          const safeValue = Math.min(
                            boundedValue,
                            lwRatioRange[1] - 0.01
                          );
                          setLwRatioRange([
                            parseFloat(safeValue.toFixed(2)),
                            lwRatioRange[1],
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step="0.01"
                        value={lwRatioRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(0, Math.min(value, 10));
                          // Ensure max is greater than min
                          const safeValue = Math.max(
                            boundedValue,
                            lwRatioRange[0] + 0.01
                          );
                          setLwRatioRange([
                            lwRatioRange[0],
                            parseFloat(safeValue.toFixed(2)),
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Length (L) in mm Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Length (mm)
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        value={lengthRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(0, Math.min(value, 30));
                          // Ensure min doesn't exceed max
                          const safeValue = Math.min(
                            boundedValue,
                            lengthRange[1] - 0.01
                          );
                          setLengthRange([
                            parseFloat(safeValue.toFixed(2)),
                            lengthRange[1],
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400 self-end mb-2">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        value={lengthRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(0, Math.min(value, 30));
                          // Ensure max is greater than min
                          const safeValue = Math.max(
                            boundedValue,
                            lengthRange[0] + 0.01
                          );
                          setLengthRange([
                            lengthRange[0],
                            parseFloat(safeValue.toFixed(2)),
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Width (W) in mm Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Width (mm)
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        value={widthRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(0, Math.min(value, 30));
                          // Ensure min doesn't exceed max
                          const safeValue = Math.min(
                            boundedValue,
                            widthRange[1] - 0.01
                          );
                          setWidthRange([
                            parseFloat(safeValue.toFixed(2)),
                            widthRange[1],
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400 self-center">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        value={widthRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(0, Math.min(value, 30));
                          // Ensure max is greater than min
                          const safeValue = Math.max(
                            boundedValue,
                            widthRange[0] + 0.01
                          );
                          setWidthRange([
                            widthRange[0],
                            parseFloat(safeValue.toFixed(2)),
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Depth % Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Depth %
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        value={depthRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(
                            0,
                            Math.min(value, 100)
                          );
                          // Ensure min doesn't exceed max
                          const safeValue = Math.min(
                            boundedValue,
                            depthRange[1] - 0.1
                          );
                          setDepthRange([
                            parseFloat(safeValue.toFixed(1)),
                            depthRange[1],
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400 self-center">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        value={depthRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          // Ensure value is within bounds
                          const boundedValue = Math.max(
                            0,
                            Math.min(value, 100)
                          );
                          // Ensure max is greater than min
                          const safeValue = Math.max(
                            boundedValue,
                            depthRange[0] + 0.1
                          );
                          setDepthRange([
                            depthRange[0],
                            parseFloat(safeValue.toFixed(1)),
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Certification/Lab Filter */}
                {uniqueLabs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-base font-medium text-gray-900 mb-3">
                      Certification
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueLabs.map((lab) => (
                        <button
                          key={lab}
                          onClick={() => {
                            if (labs.includes(lab)) {
                              setLabs(labs.filter((l) => l !== lab));
                            } else {
                              setLabs([...labs, lab]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            labs.includes(lab)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {lab}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fluorescence Filter */}
                {uniqueFluorescences.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-base font-medium text-gray-900 mb-3">
                      Fluorescence
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueFluorescences.map((fluorescence) => (
                        <button
                          key={fluorescence}
                          onClick={() => {
                            if (fluorescences.includes(fluorescence)) {
                              setFluorescences(
                                fluorescences.filter((f) => f !== fluorescence)
                              );
                            } else {
                              setFluorescences([
                                ...fluorescences,
                                fluorescence,
                              ]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            fluorescences.includes(fluorescence)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {fluorescence}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters Button */}
                {(clarities.length > 0 ||
                  cuts.length > 0 ||
                  polishes.length > 0 ||
                  symmetries.length > 0 ||
                  fluorescences.length > 0 ||
                  labs.length > 0) && (
                  <div className="mt-5">
                    <button
                      onClick={clearAllFilters}
                      className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium"
                    >
                      Clear Advanced Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Diamonds Grid */}
            <div className="lg:w-3/4 xl:w-4/5">
              {/* Product Count and Active Filters */}
              <div className="mb-6 flex flex-wrap justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isLoading
                    ? "Loading diamonds..."
                    : `Diamonds should be displayed here`}
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
                            onClick={() => toggleCategorySelection(catId)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    );
                  })}
                  {colors.length > 0 && (
                    <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      <span className="mr-1">
                        Color{colors.length > 1 ? "s" : ""}: {colors.length}
                      </span>
                      <button
                        onClick={() => {
                          setColors([]);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {/* Add badges for other active filters as needed */}
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
              ) : (
                // filterProducts.length === 0 ? (
                //   <div className="flex flex-col items-center justify-center h-64 text-center">
                //     <FaGem className="text-gray-300 text-5xl mb-4" />
                //     <h3 className="text-xl font-semibold text-gray-700 mb-2">
                //       No diamonds found
                //     </h3>
                //     <p className="text-gray-500 max-w-md mb-6">
                //       We couldn't find any diamonds that match your criteria. Try
                //       adjusting your filters or search terms.
                //     </p>
                //     <button
                //       onClick={clearAllFilters}
                //       className="px-6 py-2 bg-gray-900 text-white rounded-lg"
                //     >
                //       Clear All Filters
                //     </button>
                //   </div>
                // ) : (
                //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                //     <AnimatePresence>
                //       {filterProducts.map((diamond, index) => (
                //         <motion.div
                //           key={diamond._id}
                //           initial={{ opacity: 0 }}
                //           animate={{ opacity: 1 }}
                //           exit={{ opacity: 0 }}
                //           transition={{ duration: 0.3 }}
                //         >
                //           <GalleryItem
                //             item={diamond}
                //             price={true}
                //             index={index}
                //             productType={diamond.productType}
                //           />
                //         </motion.div>
                //       ))}
                //     </AnimatePresence>
                //   </div>
                // )
                <div>"Products should be here"</div>
              )}

              {/* Pagination */}
              {/* {filterProducts.length > 0 &&
                diamondPagination.totalPages > 1 && (
                  <div className="flex justify-center mt-12 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          handlePageChange(diamondPagination.currentPage - 1)
                        }
                        disabled={
                          diamondPagination.currentPage === 1 ||
                          diamondLoading ||
                          isLoading
                        }
                        className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                          diamondPagination.currentPage === 1 ||
                          diamondLoading ||
                          isLoading
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label="Previous page"
                      >
                        <FaChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from(
                        { length: diamondPagination.totalPages },
                        (_, i) => i + 1
                      )
                        .filter((page) => {
                          return (
                            page === 1 ||
                            page === diamondPagination.totalPages ||
                            Math.abs(page - diamondPagination.currentPage) <= 1
                          );
                        })
                        .map((page, index, array) => {
                          const showEllipsisBefore =
                            index > 0 && array[index - 1] !== page - 1;
                          const showEllipsisAfter =
                            index < array.length - 1 &&
                            array[index + 1] !== page + 1;

                          return (
                            <React.Fragment key={page}>
                              {showEllipsisBefore && (
                                <span className="w-10 h-10 flex items-center justify-center text-gray-500">
                                  ...
                                </span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                disabled={
                                  page === diamondPagination.currentPage ||
                                  diamondLoading ||
                                  isLoading
                                }
                                className={`w-10 h-10 flex items-center justify-center rounded-md ${
                                  page === diamondPagination.currentPage
                                    ? "bg-gray-900 text-white"
                                    : diamondLoading || isLoading
                                    ? "text-gray-400 border border-gray-200 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                }`}
                                aria-label={`Page ${page}`}
                                aria-current={
                                  page === diamondPagination.currentPage
                                    ? "page"
                                    : undefined
                                }
                              >
                                {page}
                              </button>
                              {showEllipsisAfter && (
                                <span className="w-10 h-10 flex items-center justify-center text-gray-500">
                                  ...
                                </span>
                              )}
                            </React.Fragment>
                          );
                        })}

                      <button
                        onClick={() =>
                          handlePageChange(diamondPagination.currentPage + 1)
                        }
                        disabled={
                          diamondPagination.currentPage ===
                            diamondPagination.totalPages ||
                          diamondLoading ||
                          isLoading
                        }
                        className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                          diamondPagination.currentPage ===
                            diamondPagination.totalPages ||
                          diamondLoading ||
                          isLoading
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label="Next page"
                      >
                        <FaChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )} */}

              {/* Loading indicator */}
              {(diamondLoading || isLoading) && (
                <div className="flex justify-center mt-6 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <FaSpinner className="animate-spin h-5 w-5 text-gray-600" />
                    <span className="text-gray-600 font-medium">
                      Loading page {diamondPagination.currentPage}...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
        {diamondProducts && diamondProducts.length > 0 ? (
          <>
            {diamondProducts.map((product, index) => (
              <GalleryItem
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                description={product.description}
                imageUrl={product.image}
                category={product.category}
                product={product}
                type="diamond"
                index={index}
              />
            ))}
          </>
        ) : initialLoadComplete && !isLoading ? (
          <div className="col-span-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-lg p-10">
            <FaExclamationTriangle className="text-4xl text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-800 mb-1">
              No diamonds found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {searchQuery ? (
                <>
                  No diamonds match your search for "
                  <span className="font-semibold">{searchQuery}</span>".
                </>
              ) : selectedCategories.length > 0 ? (
                <>No diamonds found in the selected category.</>
              ) : (
                <>No diamond products are available at this time.</>
              )}
            </p>
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full shadow hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Pagination Controls */}
      {diamondPagination && diamondPagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-12 pb-8">
          <button
            onClick={() => handlePageChange(diamondPagination.currentPage - 1)}
            disabled={
              diamondPagination.currentPage === 1 || isLoading || diamondLoading
            }
            className={`px-4 py-2 rounded-md ${
              diamondPagination.currentPage === 1 || isLoading || diamondLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
          {/* Page numbers */}
          {[...Array(diamondPagination.totalPages)].map((_, i) => {
            // Simplified pagination display
            if (
              i === 0 ||
              i === diamondPagination.totalPages - 1 ||
              (i >= diamondPagination.currentPage - 2 &&
                i <= diamondPagination.currentPage + 2)
            ) {
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  disabled={isLoading || diamondLoading}
                  className={`min-w-[2.5rem] px-3 py-2 rounded-md ${
                    i + 1 === diamondPagination.currentPage
                      ? "bg-gray-900 text-white"
                      : isLoading || diamondLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              );
            } else if (i === 1 || i === diamondPagination.totalPages - 2) {
              // Show ellipsis for pagination gaps
              return (
                <button
                  key={i}
                  disabled
                  className="px-3 py-2 rounded-md bg-gray-100 text-gray-400"
                >
                  ...
                </button>
              );
            }
            return null;
          })}
          <button
            onClick={() => handlePageChange(diamondPagination.currentPage + 1)}
            disabled={
              diamondPagination.currentPage === diamondPagination.totalPages ||
              isLoading ||
              diamondLoading
            }
            className={`px-4 py-2 rounded-md ${
              diamondPagination.currentPage === diamondPagination.totalPages ||
              isLoading ||
              diamondLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default Diamond;
