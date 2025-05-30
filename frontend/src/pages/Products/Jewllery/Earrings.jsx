import { FaFilter } from "react-icons/fa";
import BannerSection from "../../../components/Products/BannerSection";
import QuickFilters from "../../../components/Products/Diamond/QuickFilters";
import SearchBar from "../../../components/Products/SearchBar";
import SubBannerSection from "../../../components/Products/SubBannerSection";
import { debounce } from "../../../../utils/debounce";
import { useEffect, useState, useCallback } from "react";
import MobileFilterPanel from "../../../components/Products/Diamond/MobileFilterPanel";
import ProductsPanel from "../../../components/Products/ProductsPanel";
import AdvancedFilters from "../../../components/Products/Diamond/AdvancedFilters";
import { useJewelry } from "../../../../hooks/Products/Jewelry/useJewelry";
import Pagination from "../../../components/Products/Pagination";
import SortDropdown from "../../../components/Products/SortDropdown";

const Earrings = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [paginationKey, setPaginationKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [selectedMetalColors, setSelectedMetalColors] = useState([]);
  const [error, setError] = useState(null);

  // Get data and functions from useDiamonds hook
  const {
    jewelry,
    pagination,
    loading,
    error: hookError,
    filters,
    sortOption,
    changePage,
    changeLimit,
    updateFilters,
    updateSortOption,
    clearFilters,
    searchJewelry,
  } = useJewelry("earrings");

  // Synchronize the local state with the filter state
  useEffect(() => {
    // Update selectedMetals from filters
    if (filters.metal) {
      const currentMetals = Array.isArray(filters.metal)
        ? filters.metal
        : filters.metal.split(",");
      setSelectedMetals(currentMetals);
    } else {
      setSelectedMetals([]);
    }

    // Update selectedMetalColors from filters
    if (filters.metalColor) {
      const currentColors = Array.isArray(filters.metalColor)
        ? filters.metalColor
        : filters.metalColor.split(",");
      setSelectedMetalColors(currentColors);
    } else {
      setSelectedMetalColors([]);
    }
  }, [filters]);

  const metalOptions = ["14K GOLD", "18K GOLD", "950 PLAT"];
  const metalColorOptions = ["WHITE GOLD", "YELLOW GOLD", "ROSE GOLD"];

  // Sort options
  const sortOptions = [
    { value: "price:asc", label: "Price: L to H" },
    { value: "price:desc", label: "Price: H to L" },
    { value: "carats:asc", label: "Carat: L to H" },
    { value: "carats:desc", label: "Carat: H to L" },
  ];

  // Filter handlers
  const handlePriceChange = ({ min, max }) => {
    const updatedFilters = { ...filters };

    // Only update if the values are different from default
    if (min !== 0) {
      updatedFilters.minPrice = min;
    } else {
      delete updatedFilters.minPrice;
    }

    if (max !== 9999999) {
      updatedFilters.maxPrice = max;
    } else {
      delete updatedFilters.maxPrice;
    }

    // Force a page reset when price changes
    changePage(1);
    updateFilters(updatedFilters);
  };

  const handleCaratChange = ({ min, max }) => {
    const updatedFilters = { ...filters };

    // Set minimum carat to 0.1 if not specified
    if (min >= 0.1) {
      updatedFilters.minCarat = min;
    } else {
      delete updatedFilters.minCarat;
    }

    // Set maximum carat to 10 if not specified
    if (max <= 10) {
      updatedFilters.maxCarat = max;
    } else {
      delete updatedFilters.maxCarat;
    }

    // Force a page reset when carat changes
    changePage(1);
    updateFilters(updatedFilters);
  };

  const handleMetalChange = (selectedMetal) => {
    if (selectedMetal.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.metal;
      updateFilters(updatedFilters);
    } else if (selectedMetal.length === 1) {
      // Check if this is a toggle operation on an already selected metal
      const metalValue = selectedMetal[0];

      // Create an array from the current metal filter for consistent handling
      const currentMetals = Array.isArray(filters.metal)
        ? filters.metal
        : filters.metal
        ? filters.metal.split(",")
        : [];

      if (currentMetals.includes(metalValue)) {
        // If the metal is already selected and it's the only one, remove the filter
        if (currentMetals.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.metal;
          updateFilters(updatedFilters);
        } else {
          // If multiple metals are selected, remove just this one
          const newMetals = currentMetals.filter(
            (metal) => metal !== metalValue
          );
          updateFilters({ ...filters, metal: newMetals });
        }
      } else {
        // If it's a new metal, add it to existing selections
        const newMetals = [...currentMetals, metalValue];
        updateFilters({ ...filters, metal: newMetals });
      }
    } else {
      // Multiple metals were passed, use as is
      updateFilters({ ...filters, metal: selectedMetal });
    }
  };

  const handleMetalColorChange = (selectedMetalColors) => {
    if (selectedMetalColors.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.metalColor;
      updateFilters(updatedFilters);
    } else if (selectedMetalColors.length === 1) {
      // Check if this is a toggle operation on an already selected color
      const colorValue = selectedMetalColors[0];

      // Create arrays from the current color filters for consistent handling
      const currentColors = Array.isArray(filters.metalColor)
        ? filters.metalColor
        : filters.metalColor
        ? filters.metalColor.split(",")
        : [];

      const currentMetalColors = Array.isArray(filters.metalColor)
        ? filters.metalColor
        : filters.metalColor
        ? filters.metalColor.split(",")
        : [];

      if (
        currentColors.includes(colorValue) ||
        currentMetalColors.includes(colorValue)
      ) {
        // If the color is already selected and it's the only one, remove the filter
        if (currentColors.length === 1 || currentMetalColors.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.metalColor;
          updateFilters(updatedFilters);
        } else {
          // If multiple colors are selected, remove just this one
          const newColors = currentColors.filter(
            (color) => color !== colorValue
          );
          const newMetalColors = currentMetalColors.filter(
            (color) => color !== colorValue
          );

          const updatedFilters = { ...filters };
          if (newColors.length > 0) updatedFilters.metalColor = newColors;
          if (newMetalColors.length > 0)
            updatedFilters.metalColor = newMetalColors;
          updateFilters(updatedFilters);
        }
      } else {
        // If it's a new color, add it to existing selections
        const updatedFilters = { ...filters };
        updatedFilters.metalColor = [...currentColors, colorValue];
        updatedFilters.metalColor = [...currentMetalColors, colorValue];
        updateFilters(updatedFilters);
      }
    } else {
      // Multiple colors were passed, use as is
      const updatedFilters = { ...filters };
      updatedFilters.metalColor = selectedMetalColors || [];
      updateFilters(updatedFilters);
    }
  };

  const handleSortChange = (newSortValue) => {
    updateSortOption(newSortValue);
  };

  const handleClearFilters = () => {
    clearFilters();
    // Force refresh the pagination component
    setPaginationKey((prevKey) => prevKey + 1);
    // Scroll to top of the page for better UX
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setError(null);
    }, 300),
    []
  );

  const handleSearch = (term) => {
    debouncedSearch(term);
    const updatedFilters = { ...filters, searchTerm: term };

    if (!term) {
      delete updatedFilters.searchTerm;
    }

    updateFilters(updatedFilters);
    changePage(1);

    const url = new URL(window.location);
    if (term) {
      url.searchParams.set("search", term);
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.set("page", "1");
    window.history.pushState({}, "", url);
  };

  // Update error state when hook error changes
  useEffect(() => {
    if (hookError) {
      setError(hookError);
      setIsProductsLoading(false);
    }
  }, [hookError]);

  // Update loading state
  useEffect(() => {
    setIsProductsLoading(loading);
  }, [loading]);

  // Update pagination key whenever pagination changes to force re-render
  useEffect(() => {
    setPaginationKey((prev) => prev + 1);
  }, [pagination]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      const pageNumber = parseInt(newPage);
      if (isNaN(pageNumber)) {
        console.error("Invalid page number:", newPage);
        return;
      }

      setIsProductsLoading(true);
      changePage(pageNumber);

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set("page", pageNumber);
      window.history.pushState({}, "", url);
    },
    [changePage]
  );

  // Handle limit change
  const handleLimitChange = useCallback(
    (newLimit) => {
      const limitNumber = parseInt(newLimit);
      if (isNaN(limitNumber)) {
        console.error("Invalid limit number:", newLimit);
        return;
      }

      setIsProductsLoading(true);
      changeLimit(limitNumber);
      changePage(1); // Reset to first page when changing limit

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set("limit", limitNumber);
      url.searchParams.set("page", "1");
      window.history.pushState({}, "", url);
    },
    [changeLimit, changePage]
  );

  // Initialize from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    const limit = parseInt(params.get("limit")) || 12;
    const search = params.get("search");

    if (search) {
      setSearchTerm(search);
      handleSearch(search);
    }

    // Set initial pagination
    changePage(page);
    changeLimit(limit);
  }, []);

  const priceRange = [
    filters.minPrice !== undefined ? Number(filters.minPrice) : 0,
    filters.maxPrice !== undefined ? Number(filters.maxPrice) : 99999999,
  ];

  const caratRange = [
    filters.minCarat !== undefined ? Number(filters.minCarat) : 0,
    filters.maxCarat !== undefined ? Number(filters.maxCarat) : 1,
  ];

  const onMetalChange = (metals) => {
    updateFilters({ ...filters, metals });
    changePage(1);
  };

  const onMetalColorChange = (metalColors) => {
    updateFilters({ ...filters, metalColors });
    changePage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Background Image */}
      <BannerSection productsType={"diamond"} />

      {/* Filters and search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Below Hero Section Text*/}
        <SubBannerSection productsType={"diamond"} />
        {/* Search bar */}
        <SearchBar onSearch={handleSearch} initialSearchTerm={searchTerm} />

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Main Layout - Three Section Design */}
        <div className="flex flex-col w-full">
          {/* SECTION 1: Quick filters - Full Width on All Screens (hidden on mobile) */}
          <QuickFilters
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            caratRange={caratRange}
            onCaratChange={handleCaratChange}
            metals={metalOptions}
            selectedMetals={selectedMetals}
            onMetalChange={onMetalChange}
            metalColors={metalColorOptions}
            selectedMetalColors={selectedMetalColors}
            onMetalColorChange={onMetalColorChange}
            products={jewelry}
            type="jewelry"
          />

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
                {Object.keys(filters).length > 0 && (
                  <span className="bg-white text-gray-900 text-xs rounded-full px-2 py-0.5 ml-2">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filter Panel */}
            <MobileFilterPanel
              isMobileFilterOpen={isMobileFilterOpen}
              setIsMobileFilterOpen={setIsMobileFilterOpen}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              caratRange={caratRange}
              onCaratChange={handleCaratChange}
              onClearFilters={handleClearFilters}
              type="jewelry"
              metals={metalOptions}
              selectedMetals={selectedMetals}
              onMetalChange={onMetalChange}
              metalColors={metalColorOptions}
              selectedMetalColors={selectedMetalColors}
              onMetalColorChange={onMetalColorChange}
              products={jewelry}
            />

            {/* Products panel */}
            <div className="flex-1 flex flex-col">
              {/* Sort and Count Information */}
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <div className="text-sm text-gray-500">
                  {!isProductsLoading && pagination.totalCount > 0 && (
                    <span>
                      Showing {jewelry.length} of {pagination.totalCount}{" "}
                      jewelry
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center space-x-3">
                  {/* Clear All Filters Button */}
                  {Object.keys(filters).length > 0 && (
                    <div>
                      <button
                        onClick={handleClearFilters}
                        className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium flex items-center"
                      >
                        <span className="mr-1">Clear All Filters</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <SortDropdown
                    options={sortOptions}
                    value={sortOption}
                    onChange={handleSortChange}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 p-4 mb-4 bg-red-50 rounded">
                  Error loading jewelry: {error}
                </div>
              )}

              <ProductsPanel
                products={jewelry || []}
                isProductsLoading={isProductsLoading}
                setIsProductsLoading={setIsProductsLoading}
              />

              {/* No Diamonds Found Message */}
              {!isProductsLoading && (!jewelry || jewelry.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 mb-4 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Jewelry Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    We couldn't find any jewelry matching your criteria. Try
                    adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-300"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}

              {!isProductsLoading &&
                Array.isArray(jewelry) &&
                jewelry.length > 0 &&
                pagination.totalPages > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      key={paginationKey}
                      loading={isProductsLoading}
                    />
                  </div>
                )}

              {/* Items per page selector */}
              {!isProductsLoading && jewelry.length > 0 && (
                <div className="mt-4 flex justify-end items-center space-x-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="80">80</option>
                  </select>
                </div>
              )}

              {/* Summary */}
              {!isProductsLoading && pagination.totalCount > 0 && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalCount
                  )}{" "}
                  of {pagination.totalCount} jewelry
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earrings;
