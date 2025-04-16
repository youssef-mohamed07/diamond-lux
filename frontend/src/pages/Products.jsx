import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import GalleryItem from "../components/Home/GalleryItem";
import { assets } from "../assets/assets";
import { useCategories } from "../../hooks/useCategories";
import NewsletterBox from "../components/NewsletterBox";
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

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Data store
  const { products } = useContext(ShopContext);

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

  // Advanced filter states for diamonds
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [colors, setColors] = useState([]);
  const [clarities, setClarities] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [polishes, setPolishes] = useState([]);
  const [symmetries, setSymmetries] = useState([]);
  const [fluorescences, setFluorescences] = useState([]);
  const [labs, setLabs] = useState([]);

  // Range slider states
  const [caratRange, setCaratRange] = useState([0, 20]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxCarat, setMaxCarat] = useState(20);
  const [maxPrice, setMaxPrice] = useState(100000);

  // Unique values for filter options
  const [uniqueShapes, setUniqueShapes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);
  const [uniqueClarities, setUniqueClarities] = useState([]);
  const [uniqueCuts, setUniqueCuts] = useState([]);
  const [uniquePolishes, setUniquePolishes] = useState([]);
  const [uniqueSymmetries, setUniqueSymmetries] = useState([]);
  const [uniqueFluorescences, setUniqueFluorescences] = useState([]);
  const [uniqueLabs, setUniqueLabs] = useState([]);

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
  };

  const clearFilters = () => {
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

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = [...products];

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply advanced diamond filters
    // Shape filter
    if (shapes.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.shape && shapes.includes(product.shape)
      );
    }

    // Color filter
    if (colors.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.col && colors.includes(product.col)
      );
    }

    // Clarity filter
    if (clarities.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.clar && clarities.includes(product.clar)
      );
    }

    // Cut filter
    if (cuts.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.cut && cuts.includes(product.cut)
      );
    }

    // Polish filter
    if (polishes.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.pol && polishes.includes(product.pol)
      );
    }

    // Symmetry filter
    if (symmetries.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.symm && symmetries.includes(product.symm)
      );
    }

    // Fluorescence filter
    if (fluorescences.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.flo && fluorescences.includes(product.flo)
      );
    }

    // Lab filter
    if (labs.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.lab && labs.includes(product.lab)
      );
    }

    // Carat range filter
    filteredProducts = filteredProducts.filter(
      (product) =>
        !product.carats ||
        (product.carats >= caratRange[0] && product.carats <= caratRange[1])
    );

    // Price range filter
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
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
    products,
    searchQuery,
    selectedCategories,
    sortType,
    shapes,
    colors,
    clarities,
    cuts,
    polishes,
    symmetries,
    fluorescences,
    labs,
    caratRange,
    priceRange,
  ]);

  // Extract unique values for filter options and filter categories
  useEffect(() => {
    if (products && products.length > 0) {
      // Find max price and carat for ranges
      const maxProductPrice = Math.max(...products.map((p) => p.price || 0));
      const maxProductCarat = Math.max(...products.map((p) => p.carats || 0));
      setMaxPrice(maxProductPrice > 0 ? maxProductPrice : 1000000);
      setMaxCarat(maxProductCarat > 0 ? maxProductCarat : 10);
      setPriceRange([0, maxProductPrice > 0 ? maxProductPrice : 1000000]);
      setCaratRange([0, maxProductCarat > 0 ? maxProductCarat : 10]);

      // Extract unique values
      setUniqueShapes([
        ...new Set(products.filter((p) => p.shape).map((p) => p.shape)),
      ]);
      setUniqueColors([
        ...new Set(products.filter((p) => p.col).map((p) => p.col)),
      ]);
      setUniqueClarities([
        ...new Set(products.filter((p) => p.clar).map((p) => p.clar)),
      ]);
      setUniqueCuts([
        ...new Set(products.filter((p) => p.cut).map((p) => p.cut)),
      ]);
      setUniquePolishes([
        ...new Set(products.filter((p) => p.pol).map((p) => p.pol)),
      ]);
      setUniqueSymmetries([
        ...new Set(products.filter((p) => p.symm).map((p) => p.symm)),
      ]);
      setUniqueFluorescences([
        ...new Set(products.filter((p) => p.flo).map((p) => p.flo)),
      ]);
      setUniqueLabs([
        ...new Set(products.filter((p) => p.lab).map((p) => p.lab)),
      ]);

      // Filter categories to only include those with associated products
      if (categories && categories.length > 0) {
        const usedCategoryIds = [...new Set(products.map((p) => p.category))];
        setFilteredCategories(
          categories.filter((category) =>
            usedCategoryIds.includes(category._id)
          )
        );
      }
    }
  }, [products, categories]);

  // Reset form when there are no products or categories to show
  useEffect(() => {
    if (products.length === 0 || filteredCategories.length === 0) {
      setSelectedCategories([]);
    }
  }, [products, filteredCategories]);

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
          Loading exquisite products...
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
                Luxury Collection
              </span>
            </div>
            <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl mb-8 tracking-tight">
              Our Collection
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl leading-relaxed">
              Discover our exquisite selection of premium diamond jewelry, each
              piece crafted with exceptional artistry and precision for those
              who appreciate true luxury.
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
            Our Collection
          </h1>
          <p className="text-lg text-gray-600">
            Explore our curated selection of exquisite diamonds and fine jewelry
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
                placeholder="Search products..."
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
              {/* Diamond Shapes Category Slider - 100% Width */}
              <div className="w-full mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Diamond Shapes
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
                          container.scrollBy({ left: 200, behavior: "smooth" });
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
                            onClick={() => {
                              if (selectedCategories.includes(category._id)) {
                                setSelectedCategories(
                                  selectedCategories.filter(
                                    (id) => id !== category._id
                                  )
                                );
                              } else {
                                setSelectedCategories([
                                  ...selectedCategories,
                                  category._id,
                                ]);
                              }
                            }}
                            className={`cursor-pointer flex flex-col items-center transition-all transform hover:scale-105 ${
                              selectedCategories.includes(category._id)
                                ? "scale-105 opacity-100"
                                : "opacity-80 hover:opacity-100"
                            }`}
                          >
                            <div
                              className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 border-2 shadow-md flex items-center justify-center ${
                                selectedCategories.includes(category._id)
                                  ? "border-gray-900 ring-2 ring-gray-300"
                                  : "border-transparent hover:border-gray-300"
                              }`}
                            >
                              {category.image ? (
                                <img 
                                  src={`http://localhost:3000/uploads/diamond-shapes/${category.image}`} 
                                  alt={category.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    // If image fails to load, show the initial letter
                                    e.target.style.display = 'none';
                                    e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                                  <span className="text-gray-500 text-lg sm:text-xl font-medium">
                                    {category.name ? category.name.substring(0, 1).toUpperCase() : '?'}
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
                      No diamond shapes available for the current products.
                    </p>
                  </div>
                )}
              </div>

              {/* Color Filter - 100% Width */}
              <div className="w-full mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleFilter(color, colors, setColors)}
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
                          step={100}
                          value={priceRange[0]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value)) return;
                            setPriceRange([
                              Math.min(value, priceRange[1] - 100),
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
                          step={100}
                          value={priceRange[1]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value)) return;
                            setPriceRange([
                              priceRange[0],
                              Math.max(value, priceRange[0] + 100),
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
                        step={0.01}
                        value={caratRange[0]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          setCaratRange([
                            Math.min(value, caratRange[1] - 0.01),
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
                        step={0.01}
                        value={caratRange[1]}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (isNaN(value)) return;
                          setCaratRange([
                            caratRange[0],
                            Math.max(value, caratRange[0] + 0.01),
                          ]);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Cut Filter */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Cut
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueCuts.map((cut) => (
                      <button
                        key={cut}
                        onClick={() => toggleFilter(cut, cuts, setCuts)}
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

                {/* Clarity Filter */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Clarity
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueClarities.map((clarity) => (
                      <button
                        key={clarity}
                        onClick={() =>
                          toggleFilter(clarity, clarities, setClarities)
                        }
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
                        <h3 className="text-base font-medium text-gray-900 mb-3">
                          Diamond Shapes
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
                                    onClick={() => {
                                      if (
                                        selectedCategories.includes(
                                          category._id
                                        )
                                      ) {
                                        setSelectedCategories(
                                          selectedCategories.filter(
                                            (id) => id !== category._id
                                          )
                                        );
                                      } else {
                                        setSelectedCategories([
                                          ...selectedCategories,
                                          category._id,
                                        ]);
                                      }
                                    }}
                                    className={`cursor-pointer flex flex-col items-center transition-all transform hover:scale-105 ${
                                      selectedCategories.includes(category._id)
                                        ? "scale-105 opacity-100"
                                        : "opacity-80 hover:opacity-100"
                                    }`}
                                  >
                                    <div
                                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 border-2 shadow-md flex items-center justify-center ${
                                        selectedCategories.includes(
                                          category._id
                                        )
                                          ? "border-gray-900 ring-1 ring-gray-300"
                                          : "border-transparent hover:border-gray-300"
                                      }`}
                                    >
                                      {category.image ? (
                                        <img 
                                          src={`http://localhost:3000/uploads/diamond-shapes/${category.image}`} 
                                          alt={category.name}
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            // If image fails to load, show the initial letter
                                            e.target.style.display = 'none';
                                            e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                                          <span className="text-gray-500 text-md sm:text-lg font-medium">
                                            {category.name ? category.name.substring(0, 1).toUpperCase() : '?'}
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
                              products.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Color Filter */}
                      <div className="mb-6">
                        <h3 className="text-base font-medium text-gray-900 mb-3">
                          Color
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {uniqueColors.map((color) => (
                            <button
                              key={color}
                              onClick={() =>
                                toggleFilter(color, colors, setColors)
                              }
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
                                  step={100}
                                  value={priceRange[0]}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (isNaN(value)) return;
                                    setPriceRange([
                                      Math.min(value, priceRange[1] - 100),
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
                                  step={100}
                                  value={priceRange[1]}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (isNaN(value)) return;
                                    setPriceRange([
                                      priceRange[0],
                                      Math.max(value, priceRange[0] + 100),
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
                                step={0.01}
                                value={caratRange[0]}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (isNaN(value)) return;
                                  setCaratRange([
                                    Math.min(value, caratRange[1] - 0.01),
                                    caratRange[1],
                                  ]);
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
                                  const value = parseFloat(e.target.value);
                                  if (isNaN(value)) return;
                                  setCaratRange([
                                    caratRange[0],
                                    Math.max(value, caratRange[0] + 0.01),
                                  ]);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Cut Filter */}
                        <div className="mb-4">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Cut
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueCuts.map((cut) => (
                              <button
                                key={cut}
                                onClick={() => toggleFilter(cut, cuts, setCuts)}
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

                        {/* Clarity Filter */}
                        <div className="mb-4">
                          <h3 className="text-base font-medium text-gray-900 mb-3">
                            Clarity
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueClarities.map((clarity) => (
                              <button
                                key={clarity}
                                onClick={() =>
                                  toggleFilter(clarity, clarities, setClarities)
                                }
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
                      </div>
                    </div>

                    {/* Mobile Advanced Filters Section */}
                    <div className="border-t border-gray-200 pt-5 mt-5">
                      <h3 className="text-base font-medium text-gray-900 mb-4">
                        Advanced Filters
                      </h3>

                      {/* Clarity Filter */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Clarity
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uniqueClarities.map((clarity) => (
                            <button
                              key={clarity}
                              onClick={() =>
                                toggleFilter(clarity, clarities, setClarities)
                              }
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

                      {/* Cut Filter */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Cut
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uniqueCuts.map((cut) => (
                            <button
                              key={cut}
                              onClick={() => toggleFilter(cut, cuts, setCuts)}
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

                      {/* Polish Filter */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Polish
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uniquePolishes.map((polish) => (
                            <button
                              key={polish}
                              onClick={() =>
                                toggleFilter(polish, polishes, setPolishes)
                              }
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

                      {/* Symmetry Filter */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Symmetry
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uniqueSymmetries.map((symmetry) => (
                            <button
                              key={symmetry}
                              onClick={() =>
                                toggleFilter(
                                  symmetry,
                                  symmetries,
                                  setSymmetries
                                )
                              }
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

                      {/* Certification/Lab Filter */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Certification
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uniqueLabs.map((lab) => (
                            <button
                              key={lab}
                              onClick={() => toggleFilter(lab, labs, setLabs)}
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

                      {/* Fluorescence Filter */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Fluorescence
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uniqueFluorescences.map((fluorescence) => (
                            <button
                              key={fluorescence}
                              onClick={() =>
                                toggleFilter(
                                  fluorescence,
                                  fluorescences,
                                  setFluorescences
                                )
                              }
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
                    </div>

                    {/* Sort Options */}

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

            {/* SECTION 2: Left Sidebar with Advanced Filters - Hidden on Mobile */}
            <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
              <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-y-auto max-h-[calc(100vh-200px)]">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Advanced Filters
                </h2>

                {/* Clarity Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Clarity
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueClarities.map((clarity) => (
                      <button
                        key={clarity}
                        onClick={() =>
                          toggleFilter(clarity, clarities, setClarities)
                        }
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

                {/* Cut Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Cut
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueCuts.map((cut) => (
                      <button
                        key={cut}
                        onClick={() => toggleFilter(cut, cuts, setCuts)}
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

                {/* Polish Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Polish
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniquePolishes.map((polish) => (
                      <button
                        key={polish}
                        onClick={() =>
                          toggleFilter(polish, polishes, setPolishes)
                        }
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

                {/* Symmetry Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Symmetry
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSymmetries.map((symmetry) => (
                      <button
                        key={symmetry}
                        onClick={() =>
                          toggleFilter(symmetry, symmetries, setSymmetries)
                        }
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
                        step={0.1}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* L/W Ratio % Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    L/W Ratio %
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="Max"
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
                        step={0.01}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="Max"
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
                        step={0.01}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="Max"
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
                        step={0.1}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-4 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Certification/Lab Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Certification
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueLabs.map((lab) => (
                      <button
                        key={lab}
                        onClick={() => toggleFilter(lab, labs, setLabs)}
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

                {/* Fluorescence Filter */}
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Fluorescence
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueFluorescences.map((fluorescence) => (
                      <button
                        key={fluorescence}
                        onClick={() =>
                          toggleFilter(
                            fluorescence,
                            fluorescences,
                            setFluorescences
                          )
                        }
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

                {/* Clear Filters Button */}
                {(clarities.length > 0 ||
                  cuts.length > 0 ||
                  polishes.length > 0 ||
                  symmetries.length > 0 ||
                  fluorescences.length > 0 ||
                  labs.length > 0) && (
                  <div className="mt-5">
                    <button
                      onClick={resetAdvancedFilters}
                      className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium"
                    >
                      Clear Advanced Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Products Grid */}
            <div className="lg:w-3/4 xl:w-4/5">
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
                  {colors.length > 0 && (
                    <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      <span className="mr-1">
                        Color{colors.length > 1 ? "s" : ""}: {colors.length}
                      </span>
                      <button
                        onClick={() => setColors([])}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filterProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GalleryItem
                          item={product}
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
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Products;
