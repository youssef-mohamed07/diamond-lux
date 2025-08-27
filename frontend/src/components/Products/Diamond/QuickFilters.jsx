import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getImageUrl } from "../../../../utils/imageHelper";
import { debounce } from "../../../../utils/debounce";
import { isValueSelected, toggleFilterValue } from "../../../utils/filterUtils";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const QuickFilters = ({
  type = "diamond" | "jewelry",
  categories,
  selectedCategories = [],
  onCategoryChange,
  colors = [],
  selectedColors = [],
  onColorChange,
  priceRange = [0, 99999999],
  onPriceChange,
  caratRange = [0.2, 50],
  onCaratChange,
  cuts = [],
  selectedCuts = [],
  onCutChange,
  clarities = [],
  selectedClarities = [],
  onClarityChange,
  metals = [],
  selectedMetals = [],
  onMetalChange,
  metalColors = [],
  selectedMetalColors = [],
  onMetalColorChange,
  products,
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

  // Debounced price change handler
  const debouncedPriceChange = useCallback(
    debounce((min, max) => {
      // Only validate when actually making the API call
      const finalMin = min === "" ? 0 : Math.max(0, Number(min) || 0);
      const finalMax =
        max === "" ? 99999999 : Math.max(0, Number(max) || 99999999);

      onPriceChange({ min: finalMin, max: finalMax });
    }, 500),
    [onPriceChange]
  );

  // Handle price change
  const handlePriceChange = (min, max) => {
    // Update local state immediately for UI feedback
    setMinPrice(min === "" ? "" : Number(min));
    setMaxPrice(max === "" ? "" : Number(max));

    // Call the debounced function for API updates
    debouncedPriceChange(min, max);
  };

  // Debounced carat change handler
  const debouncedCaratChange = useCallback(
    debounce((min, max) => {
      // Handle empty inputs
      let finalMin;
      if (min === "" || min === null) {
        finalMin = null;
      } else {
        const numMin = Number(min);
        finalMin = isNaN(numMin) ? null : Math.min(50, Math.max(0.2, numMin));
      }

      let finalMax;
      if (max === "" || max === null) {
        finalMax = null;
      } else {
        const numMax = Number(max);
        const minValue = finalMin !== null ? finalMin : 0.2;
        finalMax = isNaN(numMax) ? null : Math.min(50, Math.max(minValue, numMax));
      }

      onCaratChange({ min: finalMin, max: finalMax });
    }, 200),
    [onCaratChange]
  );

  // Handle slider change (values come as array [min, max])
  const handleCaratSliderChange = (values) => {
    const [sliderMin, sliderMax] = values;
    
    // Convert from slider values to actual carat values
    const min = sliderToCaratValue(sliderMin);
    const max = sliderToCaratValue(sliderMax);
    
    // Update local state immediately for UI feedback
    setMinCarat(min.toFixed(2));
    setMaxCarat(max.toFixed(2));
    
    // Call the debounced function for API updates
    debouncedCaratChange(min, max);
  };
  
  // Convert from linear slider value to logarithmic carat value
  const sliderToCaratValue = (sliderValue) => {
    // Linear mapping from 0.1-25 to 0.2-50
    const result = sliderValue * 2;
    return Math.min(50, result);
  };
  
  // Convert from carat value to linear slider value
  const caratToSliderValue = (caratValue) => {
    // Linear mapping from 0.2-50 to 0.1-25
    const validCarat = Math.min(50, Math.max(0.2, caratValue));
    return validCarat / 2;
  };
  
  // Format the displayed values for the slider
  const formatCaratValue = (value) => {
    // Convert to string with 2 decimal places
    return Number(value).toFixed(2);
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

  // Toggle metal selection - case insensitive
  const handleMetalToggle = (metal) => {
    toggleFilterValue(metal, selectedMetals, onMetalChange);
  };

  // Toggle metal color selection - case insensitive
  const handleMetalColorToggle = (metalColor) => {
    toggleFilterValue(metalColor, selectedMetalColors, onMetalColorChange);
  };

  return (
    <div className="w-full mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hidden lg:block">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Quick Filters
      </h2>

      <div className="flex flex-col">
        {type === "diamond" && (
          <>
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
                                selectedCategories.includes(
                                  String(category._id)
                                )
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
                                    let fallbackIcon =
                                      e.target.nextElementSibling;
                                    if (
                                      !fallbackIcon ||
                                      !fallbackIcon.classList.contains(
                                        "fallback-icon"
                                      )
                                    ) {
                                      fallbackIcon =
                                        document.createElement("div");
                                      fallbackIcon.className =
                                        "w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full fallback-icon";

                                      const span =
                                        document.createElement("span");
                                      span.className =
                                        "text-gray-600 text-lg font-medium";
                                      span.innerText =
                                        category.initial ||
                                        category.name.charAt(0).toUpperCase();

                                      fallbackIcon.appendChild(span);
                                      e.target.parentNode.appendChild(
                                        fallbackIcon
                                      );
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
                                selectedCategories.includes(
                                  String(category._id)
                                )
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
                    (color) =>
                      !color.startsWith("Fancy") && !/^[D-M]$/.test(color)
                  );

                  return (
                    <div className="mb-4">
                      <h4
                        className={`text-sm font-medium mb-2 ${
                          hasFancyColorSelected
                            ? "text-gray-700"
                            : "text-gray-400"
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
          </>
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
            {/* Display Current Range */}
            <div className="mb-4 flex justify-between">
              <div className="text-center">
                <span className="block text-sm font-medium text-gray-700">Min</span>
                <span className="text-lg font-semibold">{formatCaratValue(minCarat || 0.2)}</span>
                <span className="text-xs text-gray-500 ml-1">ct</span>
              </div>
              <div className="text-center">
                <span className="block text-sm font-medium text-gray-700">Max</span>
                <span className="text-lg font-semibold">{formatCaratValue(maxCarat || 50)}</span>
                <span className="text-xs text-gray-500 ml-1">ct</span>
              </div>
            </div>
            
            {/* Range Slider */}
            <div className="px-1">
              <Slider
                range
                min={0.1}
                max={25}
                step={0.005}
                defaultValue={[0.1, 25]}
                value={[
                  caratToSliderValue(parseFloat(minCarat) || 0.2), 
                  caratToSliderValue(parseFloat(maxCarat) || 50)
                ]}
                allowCross={false}
                pushable={0.01}
                onChange={handleCaratSliderChange}
                railStyle={{ backgroundColor: '#e5e7eb', height: 10 }}
                trackStyle={[{ backgroundColor: '#111827', height: 10 }]}
                handleStyle={[
                  {
                    backgroundColor: 'white',
                    border: '2px solid #111827',
                    height: 22,
                    width: 22,
                    marginTop: -6,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  },
                  {
                    backgroundColor: 'white',
                    border: '2px solid #111827',
                    height: 22,
                    width: 22,
                    marginTop: -6,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }
                ]}
              />
            </div>
            
            {/* Carat Range Markers */}
            <div className="mt-2 flex justify-between text-xs text-gray-500 px-1">
              <span>0.2</span>
              <span>10</span>
              <span>20</span>

              <span>30</span>
              <span>40</span>
              <span>50</span>
            </div>
          </div>

          {type === "diamond" && (
            <>
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
            </>
          )}

          {type === "jewelry" && products && (
            <>
              {/* Metal Filter */}
              {metals.length > 0 && metals && (
                <div className="w-full mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Metal
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {metals.map((metal) => {
                      return (
                        <button
                          key={metal}
                          onClick={() => handleMetalToggle(metal)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            isValueSelected(metal, selectedMetals)
                              ? "bg-gray-900 text-white shadow-md"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {metal}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Metal Color Filter */}
              {metalColors.length > 0 && metalColors && (
                <div className="w-full mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Metal Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {metalColors.map((color) => {
                      return (
                        <button
                          key={color}
                          onClick={() => handleMetalColorToggle(color)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            isValueSelected(color, selectedMetalColors)
                              ? "bg-gray-900 text-white shadow-md"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickFilters;
