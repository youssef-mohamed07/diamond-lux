import { FaFilter } from "react-icons/fa";
import BannerSection from "../../components/Products/BannerSection";
import QuickFilters from "../../components/Products/Diamond/QuickFilters";
import SearchBar from "../../components/Products/SearchBar";
import SubBannerSection from "../../components/Products/SubBannerSection";
import { useEffect, useState, useCallback } from "react";
import MobileFilterPanel from "../../components/Products/Diamond/MobileFilterPanel";
import ProductsPanel from "../../components/Products/ProductsPanel";
import AdvancedFilters from "../../components/Products/Diamond/AdvancedFilters";
import { useDiamonds } from "../../../hooks/Products/Diamond/useDiamonds";
import Pagination from "../../components/Products/Pagination";

const Diamond = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [paginationKey, setPaginationKey] = useState(0); // Key to force pagination component refresh

  const { diamonds, pagination, loading, error, changePage, changeLimit } =
    useDiamonds();

  // This effect reads the page from URL when component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    changePage(page);
    // Only run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update products loading state whenever diamonds or loading state changes
  useEffect(() => {
    setIsProductsLoading(loading);
  }, [loading, diamonds]);

  // Update pagination key whenever pagination changes to force re-render
  useEffect(() => {
    setPaginationKey((prev) => prev + 1);
  }, [pagination]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      // Ensure newPage is an integer
      const pageNumber = parseInt(newPage);
      if (isNaN(pageNumber)) {
        console.error("Invalid page number:", newPage);
        return;
      }

      // Directly set loading state to true for immediate user feedback
      setIsProductsLoading(true);

      // Change page in the hook
      changePage(pageNumber);

      // Update URL for bookmarking/sharing
      const url = new URL(window.location);
      url.searchParams.set("page", pageNumber);
      window.history.pushState({}, "", url);
    },
    [changePage]
  );

  let categories = [];
  let selectedCategories = [];

  let maxPrice = 100;
  let priceRange = [0, maxPrice];

  let maxCarat = 1;
  let caratRange = [0, maxCarat];

  let colors = [];
  let cuts = [];
  let clarities = [];
  let polishes = [];
  let symmetries = [];
  let labs = [];
  let fluorescences = [];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Background Image */}
      <BannerSection productsType={"diamond"} />

      {/* Filters and search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Below Hero Section Text*/}
        <SubBannerSection productsType={"diamond"} />
        {/* Search bar */}
        <SearchBar />

        {/* Main Layout - Three Section Design */}
        <div className="flex flex-col w-full">
          {/* SECTION 1: Quick filters - Full Width on All Screens (hidden on mobile) */}
          <QuickFilters
            categories={categories}
            selectedCategories={selectedCategories}
            colors={colors}
            maxPrice={maxPrice}
            priceRange={priceRange}
            maxCarat={maxCarat}
            caratRange={caratRange}
            cuts={cuts}
            clarities={clarities}
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
              </button>
            </div>

            {/* Mobile Filter Panel */}
            <MobileFilterPanel
              isMobileFilterOpen={isMobileFilterOpen}
              setIsMobileFilterOpen={setIsMobileFilterOpen}
              selectedCategories={selectedCategories}
              categories={categories}
              colors={colors}
              maxPrice={maxPrice}
              priceRange={priceRange}
              maxCarat={maxCarat}
              caratRange={caratRange}
              cuts={cuts}
              clarities={clarities}
              polishes={polishes}
              symmetries={symmetries}
              labs={labs}
              fluorescences={fluorescences}
            />

            {/* Advanced Filters */}
            <AdvancedFilters
              polishes={polishes}
              symmetries={symmetries}
              labs={labs}
              fluorescences={fluorescences}
            />

            {/* Products panel */}
            <div className="flex-1 flex flex-col">
              {error && (
                <div className="text-red-500 p-4 mb-4 bg-red-50 rounded">
                  Error loading diamonds: {error}
                </div>
              )}

              <ProductsPanel
                products={diamonds || []}
                isProductsLoading={isProductsLoading}
                setIsProductsLoading={setIsProductsLoading}
              />

              {/* Pagination - use key to force complete refresh when pagination changes */}
              {!isProductsLoading &&
                Array.isArray(diamonds) &&
                diamonds.length > 0 &&
                pagination.totalPages > 0 && (
                  <Pagination
                    key={paginationKey}
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    loading={isProductsLoading}
                  />
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
                  of {pagination.totalCount} diamonds
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diamond;
