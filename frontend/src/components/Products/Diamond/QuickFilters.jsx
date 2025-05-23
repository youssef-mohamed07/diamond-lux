import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getImageUrl } from "../../../../utils/imageHelper";

const QuickFilters = ({
  categories,
  selectedCategories = [],
  onCategoryChange,
  colors = [],
  selectedColors = [],
  onColorChange,
  priceRange = [0, 99999999],
  onPriceChange,
  caratRange = [0, 1],
  onCaratChange,
  cuts = [],
  selectedCuts = [],
  onCutChange,
  clarities = [],
  selectedClarities = [],
  onClarityChange,
  onClearFilters,
}) => {
  // Local state for controlled inputs
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minCarat, setMinCarat] = useState("");
  const [maxCarat, setMaxCarat] = useState("");

  // Add a ref for the selected category
  const selectedCategoryRef = useRef(null);
  const sliderRef = useRef(null);

  // Update local state when props change
  useEffect(() => {
    setMinPrice(priceRange[0] !== undefined ? priceRange[0] : "");
    setMaxPrice(priceRange[1] !== undefined ? priceRange[1] : "");
  }, [priceRange]);

  useEffect(() => {
    setMinCarat(caratRange[0] !== undefined ? caratRange[0] : "");
    setMaxCarat(caratRange[1] !== undefined ? caratRange[1] : "");
  }, [caratRange]);

  // Scroll selected category into view when component mounts or selection changes
  useEffect(() => {
    if (
      selectedCategoryRef.current &&
      sliderRef.current &&
      selectedCategories.length > 0
    ) {
      // Use a small timeout to ensure DOM is fully rendered
      setTimeout(() => {
        const selectedElement = selectedCategoryRef.current;
        const sliderElement = sliderRef.current;

        // Fix: Check if selectedElement is not null before accessing its properties
        if (selectedElement && sliderElement) {
          // Calculate scroll position to center the element
          const scrollLeft =
            selectedElement.offsetLeft -
            sliderElement.offsetWidth / 2 +
            selectedElement.offsetWidth / 2;

          // Scroll the slider smoothly
          sliderElement.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [selectedCategories, categories]);

  // Handle price change with debounce
  const handlePriceChange = (min, max) => {
    // Update local state without immediate validation
    setMinPrice(min === "" ? "" : Number(min));
    setMaxPrice(max === "" ? "" : Number(max));

    // Use setTimeout to debounce the API call
    const timer = setTimeout(() => {
      // Only validate when actually making the API call
      const finalMin = min === "" ? 0 : Math.max(0, Number(min) || 0);
      const finalMax =
        max === "" ? 99999999 : Math.max(0, Number(max) || 99999999);

      onPriceChange({ min: finalMin, max: finalMax });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  };

  // Handle carat change with debounce
  const handleCaratChange = (min, max) => {
    // Update local state without immediate validation
    setMinCarat(min === "" ? "" : Number(min));
    setMaxCarat(max === "" ? "" : Number(max));

    // Use setTimeout to debounce the API call
    const timer = setTimeout(() => {
      // Only validate when actually making the API call
      const finalMin = min === "" ? 0 : Math.max(0, Number(min) || 0);
      const finalMax = max === "" ? 1 : Math.max(0, Number(max) || 1);

      onCaratChange({ min: finalMin, max: finalMax });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  };

  // Toggle category selection
  const handleCategoryToggle = (categoryId) => {
    // Convert category name to string for consistency
    const categoryIdStr = String(categoryId);

    // Check if already selected
    if (selectedCategories.includes(categoryIdStr)) {
      // If already selected, remove it (deselect) by sending just the single item
      // This will toggle it off in the Diamond page handler
      onCategoryChange([categoryIdStr]);
    } else {
      // Add to selection
      onCategoryChange([...selectedCategories, categoryIdStr]);
    }
  };

  // Toggle color selection
  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      // If already selected, remove it (deselect) by sending just the single item
      // This will toggle it off in the Diamond page handler
      onColorChange([color]);
    } else {
      // Add to selection
      onColorChange([...selectedColors, color]);
    }
  };

  // Toggle cut selection
  const handleCutToggle = (cut) => {
    if (selectedCuts.includes(cut)) {
      // If already selected, remove it (deselect) by sending just the single item
      // This will toggle it off in the Diamond page handler
      onCutChange([cut]);
    } else {
      // Add to selection
      onCutChange([...selectedCuts, cut]);
    }
  };

  // Toggle clarity selection
  const handleClarityToggle = (clarity) => {
    if (selectedClarities.includes(clarity)) {
      // If already selected, remove it (deselect) by sending just the single item
      // This will toggle it off in the Diamond page handler
      onClarityChange([clarity]);
    } else {
      // Add to selection
      onClarityChange([...selectedClarities, clarity]);
    }
  };

  return (
    <div className="w-full mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hidden lg:block">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Quick Filters
      </h2>

      <div className="flex flex-col">
        {/* Diamond Shapes Category Slider - 100% Width */}
        {categories && categories.length > 0 ? (
          <div className="w-full mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
              <span>Diamond Shapes</span>
            </h3>
            {categories.length > 0 ? (
              <div className="relative group">
                {/* Left Arrow Navigation */}
                <button
                  onClick={() => {
                    if (sliderRef.current) {
                      sliderRef.current.scrollBy({
                        left: -200,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -ml-2"
                >
                  <FaChevronLeft className="text-gray-600 w-4 h-4" />
                </button>

                {/* Right Arrow Navigation */}
                <button
                  onClick={() => {
                    if (sliderRef.current) {
                      sliderRef.current.scrollBy({
                        left: 200,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2"
                >
                  <FaChevronRight className="text-gray-600 w-4 h-4" />
                </button>

                {/* Slider Container */}
                <div
                  id="diamond-shapes-slider"
                  ref={sliderRef}
                  className="overflow-x-auto scrollbar-hide py-4 px-2"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className="flex flex-row space-x-4 md:space-x-6 min-w-max">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        ref={
                          selectedCategories.includes(String(category._id))
                            ? selectedCategoryRef
                            : null
                        }
                        onClick={() => handleCategoryToggle(category._id)}
                        className={`cursor-pointer flex flex-col items-center transition-all transform hover:scale-105 active:scale-95 ${
                          selectedCategories.includes(String(category._id))
                            ? "scale-110 opacity-100"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div
                          className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 flex items-center justify-center transition-all relative ${
                            selectedCategories.includes(String(category._id))
                              ? "border-gray-900 ring-4 ring-gray-800 bg-gray-100 shadow-lg"
                              : "border-transparent hover:border-gray-300 hover:bg-gray-50 shadow-md"
                          }`}
                        >
                          {selectedCategories.includes(
                            String(category._id)
                          ) && (
                            <div className="absolute top-0 right-0 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          {category.image ? (
                            <img
                              src={getImageUrl(category.image)}
                              alt={category.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // If image fails to load, replace with a fallback icon
                                e.target.style.display = "none";
                                // Find or create fallback icon
                                let fallbackIcon = e.target.nextElementSibling;
                                if (
                                  !fallbackIcon ||
                                  !fallbackIcon.classList.contains(
                                    "fallback-icon"
                                  )
                                ) {
                                  fallbackIcon = document.createElement("div");
                                  fallbackIcon.className =
                                    "w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full fallback-icon";

                                  const span = document.createElement("span");
                                  span.className =
                                    "text-gray-600 text-lg font-medium";
                                  span.innerText =
                                    category.initial ||
                                    category.name.charAt(0).toUpperCase();

                                  fallbackIcon.appendChild(span);
                                  e.target.parentNode.appendChild(fallbackIcon);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                              <span className="text-gray-600 text-lg font-medium">
                                {category.initial ||
                                  category.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p
                          className={`text-xs sm:text-sm text-center font-medium ${
                            selectedCategories.includes(String(category._id))
                              ? "text-gray-900 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {category.name}
                        </p>
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
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-center mb-4">
            <p className="text-gray-500 text-sm">
              No diamond shapes available for the current diamonds.
            </p>
          </div>
        )}

        {/* Color Filter - 100% Width */}
        {colors.length > 0 && (
          <div className="w-full mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
              <span>Color</span>
            </h3>

            {/* Regular Colors */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Regular Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors
                  .filter((color) => /^[D-M]$/.test(color))
                  .map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedColors.includes(color)
                          ? "bg-gray-900 text-white shadow-md"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
              </div>
            </div>

            {/* Fancy Colors */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Fancy Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors
                  .filter(
                    (color) =>
                      !color.startsWith("Fancy") && !/^[D-M]$/.test(color)
                  )
                  .map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedColors.includes(color)
                          ? "bg-gray-900 text-white shadow-md"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
              </div>
            </div>

            {/* Fancy Intensities - Only show if fancy colors are selected */}
            {(() => {
              // Check if any fancy color is selected
              const hasFancyColorSelected = selectedColors.some(
                (color) => !color.startsWith("Fancy") && !/^[D-M]$/.test(color)
              );

              return (
                <div className="mb-4">
                  <h4
                    className={`text-sm font-medium mb-2 ${
                      hasFancyColorSelected ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    Fancy Intensities
                    {!hasFancyColorSelected && (
                      <span className="ml-2 text-xs italic">
                        (Select a fancy color first)
                      </span>
                    )}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {colors
                      .filter((color) => color.startsWith("Fancy"))
                      .map((intensity) => (
                        <button
                          key={intensity}
                          onClick={() =>
                            hasFancyColorSelected &&
                            handleColorToggle(intensity)
                          }
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedColors.includes(intensity)
                              ? "bg-gray-900 text-white shadow-md"
                              : hasFancyColorSelected
                              ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!hasFancyColorSelected}
                        >
                          {intensity}
                        </button>
                      ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 2x2 Grid for Price/Carat and Cut/Clarity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Price Range
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={minPrice === "" ? "" : minPrice}
                    onChange={(e) =>
                      handlePriceChange(e.target.value, maxPrice)
                    }
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Min"
                  />
                </div>
              </div>
              <div className="text-gray-400">to</div>
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={maxPrice === "" ? "" : maxPrice}
                    onChange={(e) =>
                      handlePriceChange(minPrice, e.target.value)
                    }
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Carat Range */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Carat Range
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  step="0.01"
                  value={minCarat === "" ? "" : minCarat}
                  onChange={(e) => handleCaratChange(e.target.value, maxCarat)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Min"
                />
              </div>
              <div className="text-gray-400">to</div>
              <div className="flex-1">
                <input
                  type="number"
                  step="0.01"
                  value={maxCarat === "" ? "" : maxCarat}
                  onChange={(e) => handleCaratChange(minCarat, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Cut Filter */}
          {cuts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span>Cut</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {cuts.map((cut) => (
                  <button
                    key={cut}
                    onClick={() => handleCutToggle(cut)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedCuts.includes(cut)
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
          {clarities.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span>Clarity</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {clarities.map((clarity) => (
                  <button
                    key={clarity}
                    onClick={() => handleClarityToggle(clarity)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedClarities.includes(clarity)
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

        {/* Clear All Filters */}
        {(selectedCategories.length > 0 ||
          selectedColors.length > 0 ||
          selectedCuts.length > 0 ||
          selectedClarities.length > 0 ||
          minPrice > 0 ||
          maxPrice < 100000 ||
          minCarat > 0 ||
          maxCarat < 10) && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                // Reset local state
                setMinPrice("");
                setMaxPrice("");
                setMinCarat("");
                setMaxCarat("");
                // Call the clearFilters function
                onClearFilters();
              }}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickFilters;
