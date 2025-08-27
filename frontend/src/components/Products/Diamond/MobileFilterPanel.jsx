import React, { useEffect, useState, useCallback } from "react";
import {
  FaTimes,
  FaCheck,
  FaFilter,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { getImageUrl } from "../../../../utils/imageHelper";
import { isValueSelected, toggleFilterValue } from "../../../utils/filterUtils";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { debounce } from "../../../../utils/debounce";

const MobileFilterPanel = ({
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  categories,
  selectedCategories,
  onCategoryChange,
  colors,
  selectedColors,
  onColorChange,
  priceRange,
  onPriceChange,
  caratRange,
  onCaratChange,
  cuts,
  selectedCuts,
  onCutChange,
  clarities,
  selectedClarities,
  onClarityChange,
  polishes,
  selectedPolishes,
  onPolishChange,
  symmetries,
  selectedSymmetries,
  onSymmetryChange,
  labs,
  selectedLabs,
  onLabChange,
  fluorescences,
  selectedFluorescences,
  onFluorescenceChange,
  depthRange,
  onDepthChange,
  tableRange,
  onTableChange,
  lwRatioRange,
  onLwRatioChange,
  lengthRange,
  onLengthChange,
  widthRange,
  onWidthChange,
  onClearFilters,
  type,
  metals = [],
  selectedMetals = [],
  onMetalChange,
  metalColors = [],
  selectedMetalColors = [],
  onMetalColorChange,
}) => {
  if (!isMobileFilterOpen) return null;

  // Local state for carat values
  const [minCarat, setMinCarat] = useState(caratRange[0] || 0.2);
  const [maxCarat, setMaxCarat] = useState(caratRange[1] || 50);

  // Update local state when props change
  useEffect(() => {
    setMinCarat(caratRange[0] !== undefined ? caratRange[0] : 0.2);
    setMaxCarat(caratRange[1] !== undefined ? caratRange[1] : 50);
  }, [caratRange]);

  // Toggle category selection
  const handleCategoryToggle = (categoryId) => {
    // Convert category ID to string for consistency
    const categoryIdStr = String(categoryId);

    if (selectedCategories.includes(categoryIdStr)) {
      // If already selected, remove it (deselect) by sending just the single item
      // This will toggle it off in the Diamond page handler
      onCategoryChange([categoryIdStr]);
    } else {
      // Add to selection
      onCategoryChange([...selectedCategories, categoryIdStr]);
    }
  };

  // Toggle metal selection - case insensitive
  const handleMetalToggle = (metal) => {
    // Check if the metal is already selected (case insensitive)
    const isSelected = selectedMetals.some(
      (selected) => selected.toLowerCase() === metal.toLowerCase()
    );

    if (isSelected) {
      // If already selected, remove it (deselect) by sending just the single item
      // This will toggle it off in the Diamond page handler
      onMetalChange([metal]);
    } else {
      // Add to selection
      onMetalChange([...selectedMetals, metal]);
    }
  };

  // Toggle metal color selection - case insensitive
  const handleMetalColorToggle = (metalColor) => {
    // Check if the metalColor is already selected (case insensitive)
    const isSelected = selectedMetalColors.some(
      (selected) => selected.toLowerCase() === metalColor.toLowerCase()
    );

    if (isSelected) {
      // If already selected, remove it (deselect) by sending just the single item
      // This will toggle it off in the Diamond page handler
      onMetalColorChange([metalColor]);
    } else {
      // Add to selection
      onMetalColorChange([...selectedMetalColors, metalColor]);
    }
  };

  // Update the filter button click handlers
  const handleMetalClick = (metal) => {
    toggleFilterValue(metal, selectedMetals, onMetalChange);
  };

  const handleMetalColorClick = (color) => {
    toggleFilterValue(color, selectedMetalColors, onMetalColorChange);
  };

  // Convert from linear slider value to logarithmic carat value
  const sliderToCaratValue = (sliderValue) => {
    // Linear mapping from 0.1-25 to 0.2-50
    const result = sliderValue * 2;
    // Ensure we never exceed 50
    return Math.min(50, result);
  };
  
  // Convert from carat value to linear slider value
  const caratToSliderValue = (caratValue) => {
    // Linear mapping from 0.2-50 to 0.1-25
    // Ensure we don't exceed our bounds
    const validCarat = Math.min(50, Math.max(0.2, caratValue));
    // Divide by 2 to get slider value
    return validCarat / 2;
  };
  
  // Format the displayed values for the slider
  const formatCaratValue = (value) => {
    return value.toFixed(2).replace(/\.?0+$/, "");
  };

  const debouncedCaratChange = useCallback(
    debounce((min, max) => {
      onCaratChange({ min, max });
    }, 500),
    [onCaratChange]
  );

  // Handle slider change (values come as array [min, max])
  const handleCaratSliderChange = (values) => {
    const [sliderMin, sliderMax] = values;
    
    // Convert from slider values to actual carat values using the logarithmic scale
    const min = sliderToCaratValue(sliderMin);
    const max = sliderToCaratValue(sliderMax);
    
    console.log('Mobile slider changed to:', sliderMin, sliderMax, '-> Carats:', min, max);
    
    // Update local state immediately for UI feedback
    setMinCarat(min);
    setMaxCarat(max);
    
    // Call the API updates
    debouncedCaratChange(min, max);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden flex justify-center lg:hidden">
      <div className="bg-white w-full max-w-[90%] h-full overflow-y-auto ">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Diamond Shapes */}
          {type === "diamond" && (
            <>
              {categories && categories.length > 0 && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Diamond Shapes</h3>
                  </div>
                  <div
                    className="overflow-x-auto pb-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <div className="inline-flex space-x-2 min-w-max">
                      {categories.map((category) => (
                        <div
                          key={category._id}
                          onClick={() => handleCategoryToggle(category._id)}
                          className={`relative cursor-pointer transition-all transform ${
                            selectedCategories.includes(String(category._id))
                              ? "opacity-100 scale-105"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div
                            className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all relative ${
                              selectedCategories.includes(String(category._id))
                                ? "border-2 border-gray-800 ring-2 ring-gray-300 bg-gray-100 shadow-md"
                                : "border border-gray-200"
                            }`}
                          >
                            {selectedCategories.includes(
                              String(category._id)
                            ) && (
                              <div className="absolute top-0 right-0 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
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
                                      "w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon";

                                    const span = document.createElement("span");
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
                              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                                <span className="text-gray-600 text-lg font-medium">
                                  {category.initial ||
                                    category.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-xs text-center block mt-1 ${
                              selectedCategories.includes(String(category._id))
                                ? "font-semibold"
                                : ""
                            }`}
                          >
                            {category.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors && colors.length > 0 && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-3 sticky top-0 z-10 bg-white pt-2">
                    <h3 className="text-lg font-bold tracking-wide text-gray-900">
                      Color
                    </h3>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 shadow-sm mb-2">
                    {/* Regular Colors */}
                    <div className="mb-4">
                      <h4 className="text-base font-semibold text-gray-700 mb-2">
                        Regular Colors
                      </h4>
                      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {colors
                          .filter((color) => /^[D-M]$/.test(color))
                          .map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                if (selectedColors.includes(color)) {
                                  onColorChange([color]);
                                } else {
                                  onColorChange([...selectedColors, color]);
                                }
                              }}
                              className={`min-w-[44px] px-4 py-2 text-base rounded-full border transition-colors duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                selectedColors.includes(color)
                                  ? "bg-gray-900 text-white border-gray-900 shadow"
                                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Fancy Colors */}
                    <div className="mb-4">
                      <h4 className="text-base font-semibold text-gray-700 mb-2">
                        Fancy Colors
                      </h4>
                      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {colors
                          .filter(
                            (color) =>
                              !color.startsWith("Fancy") &&
                              !/^[D-M]$/.test(color)
                          )
                          .map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                if (selectedColors.includes(color)) {
                                  onColorChange([color]);
                                } else {
                                  onColorChange([...selectedColors, color]);
                                }
                              }}
                              className={`min-w-[80px] px-4 py-2 text-base rounded-full border transition-colors duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                selectedColors.includes(color)
                                  ? "bg-gray-900 text-white border-gray-900 shadow"
                                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Fancy Intensities */}
                    <div className="mb-2">
                      <h4 className="text-base font-semibold text-gray-700 mb-2">
                        Fancy Intensities
                      </h4>
                      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {colors
                          .filter((color) => color.startsWith("Fancy"))
                          .map((intensity) => (
                            <button
                              key={intensity}
                              onClick={() => {
                                if (selectedColors.includes(intensity)) {
                                  onColorChange([intensity]);
                                } else {
                                  onColorChange([...selectedColors, intensity]);
                                }
                              }}
                              className={`min-w-[120px] px-4 py-2 text-base rounded-full border transition-colors duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                selectedColors.includes(intensity)
                                  ? "bg-gray-900 text-white border-gray-900 shadow"
                                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {intensity}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cuts */}
              {cuts && cuts.length > 0 && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Cut</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cuts.map((cut) => (
                      <button
                        key={cut}
                        onClick={() => {
                          if (selectedCuts.includes(cut)) {
                            // If already selected, remove it (deselect) by sending just the single item
                            // This will toggle it off in the Diamond page handler
                            onCutChange([cut]);
                          } else {
                            // Add to selection
                            onCutChange([...selectedCuts, cut]);
                          }
                        }}
                        className={`px-3 py-1 text-xs rounded-full ${
                          selectedCuts.includes(cut)
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {cut}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clarities */}
              {clarities && clarities.length > 0 && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Clarity</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {clarities.map((clarity) => (
                      <button
                        key={clarity}
                        onClick={() => {
                          if (selectedClarities.includes(clarity)) {
                            // If already selected, remove it (deselect) by sending just the single item
                            // This will toggle it off in the Diamond page handler
                            onClarityChange([clarity]);
                          } else {
                            // Add to selection
                            onClarityChange([...selectedClarities, clarity]);
                          }
                        }}
                        className={`px-3 py-1 text-xs rounded-full ${
                          selectedClarities.includes(clarity)
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {clarity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Filters Section */}
              <div className="pb-4">
                <h3 className="text-lg font-medium mb-3">Advanced Filters</h3>

                {/* Polish */}
                {polishes && polishes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Polish</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {polishes.map((polish) => (
                        <button
                          key={polish}
                          onClick={() => {
                            if (selectedPolishes.includes(polish)) {
                              // If already selected, remove it (deselect) by sending just the single item
                              // This will toggle it off in the Diamond page handler
                              onPolishChange([polish]);
                            } else {
                              // Add to selection
                              onPolishChange([...selectedPolishes, polish]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedPolishes.includes(polish)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {polish}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Symmetry */}
                {symmetries && symmetries.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Symmetry</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {symmetries.map((symmetry) => (
                        <button
                          key={symmetry}
                          onClick={() => {
                            if (selectedSymmetries.includes(symmetry)) {
                              // If already selected, remove it (deselect) by sending just the single item
                              // This will toggle it off in the Diamond page handler
                              onSymmetryChange([symmetry]);
                            } else {
                              // Add to selection
                              onSymmetryChange([
                                ...selectedSymmetries,
                                symmetry,
                              ]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedSymmetries.includes(symmetry)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {symmetry}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Table % */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Table %</h4>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        placeholder="Min"
                        defaultValue={tableRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = tableRange[1];
                          onTableChange && onTableChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-2 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        placeholder="Max"
                        defaultValue={tableRange[1] < 100 ? tableRange[1] : ""}
                        onChange={(e) => {
                          const min = tableRange[0];
                          const max = Number(e.target.value);
                          onTableChange && onTableChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* L/W Ratio */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">L/W Ratio</h4>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step="0.01"
                        placeholder="Min"
                        defaultValue={lwRatioRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = lwRatioRange[1];
                          onLwRatioChange && onLwRatioChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-2 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step="0.01"
                        placeholder="Max"
                        defaultValue={
                          lwRatioRange[1] < 10 ? lwRatioRange[1] : ""
                        }
                        onChange={(e) => {
                          const min = lwRatioRange[0];
                          const max = Number(e.target.value);
                          onLwRatioChange && onLwRatioChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Length */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Length (mm)</h4>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        placeholder="Min"
                        defaultValue={lengthRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = lengthRange[1];
                          onLengthChange && onLengthChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-2 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        placeholder="Max"
                        defaultValue={lengthRange[1] < 30 ? lengthRange[1] : ""}
                        onChange={(e) => {
                          const min = lengthRange[0];
                          const max = Number(e.target.value);
                          onLengthChange && onLengthChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Width */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Width (mm)</h4>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        placeholder="Min"
                        defaultValue={widthRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = widthRange[1];
                          onWidthChange && onWidthChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-2 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        step="0.01"
                        placeholder="Max"
                        defaultValue={widthRange[1] < 30 ? widthRange[1] : ""}
                        onChange={(e) => {
                          const min = widthRange[0];
                          const max = Number(e.target.value);
                          onWidthChange && onWidthChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Depth % */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Depth %</h4>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        placeholder="Min"
                        defaultValue={depthRange[0]}
                        onChange={(e) => {
                          const min = Number(e.target.value);
                          const max = depthRange[1];
                          onDepthChange && onDepthChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="mx-2 text-gray-400">to</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        placeholder="Max"
                        defaultValue={depthRange[1] < 100 ? depthRange[1] : ""}
                        onChange={(e) => {
                          const min = depthRange[0];
                          const max = Number(e.target.value);
                          onDepthChange && onDepthChange({ min, max });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Lab */}
                {labs && labs.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Certification</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {labs.map((lab) => (
                        <button
                          key={lab}
                          onClick={() => {
                            if (selectedLabs.includes(lab)) {
                              // If already selected, remove it (deselect) by sending just the single item
                              // This will toggle it off in the Diamond page handler
                              onLabChange([lab]);
                            } else {
                              // Add to selection
                              onLabChange([...selectedLabs, lab]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedLabs.includes(lab)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {lab}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fluorescence */}
                {fluorescences && fluorescences.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Fluorescence</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {fluorescences.map((fluorescence) => (
                        <button
                          key={fluorescence}
                          onClick={() => {
                            if (selectedFluorescences.includes(fluorescence)) {
                              // If already selected, remove it (deselect) by sending just the single item
                              // This will toggle it off in the Diamond page handler
                              onFluorescenceChange([fluorescence]);
                            } else {
                              // Add to selection
                              onFluorescenceChange([
                                ...selectedFluorescences,
                                fluorescence,
                              ]);
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded-full ${
                            selectedFluorescences.includes(fluorescence)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {fluorescence}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {type === "jewelry" && (
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
                          onClick={() => handleMetalClick(metal)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            isValueSelected(metal, selectedMetals)
                              ? "bg-gray-900 text-white"
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
                          onClick={() => handleMetalColorClick(color)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            isValueSelected(color, selectedMetalColors)
                              ? "bg-gray-900 text-white"
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

          {/* Price Range */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-3">Price Range</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={1000000}
                    value={priceRange[0] || ""}
                    onChange={(e) => {
                      const min = Math.max(
                        0,
                        Math.min(Number(e.target.value) || 0, 1000000)
                      );
                      const max = Math.max(
                        0,
                        Math.min(Number(priceRange[1]) || 100000, 1000000)
                      );
                      onPriceChange({ min, max });
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        onPriceChange({ min: 0, max: priceRange[1] });
                      }
                    }}
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
                    min={0}
                    max={1000000}
                    value={priceRange[1] || ""}
                    onChange={(e) => {
                      const min = Math.max(
                        0,
                        Math.min(Number(priceRange[0]) || 0, 1000000)
                      );
                      const max = Math.max(
                        0,
                        Math.min(Number(e.target.value) || 100000, 1000000)
                      );
                      onPriceChange({ min, max });
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        onPriceChange({ min: priceRange[0], max: 100000 });
                      }
                    }}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Carat Range */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-3">Carat Range</h3>
            
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
                max={25}  /* Slider range 0.1-25 maps to 0.2-50 carats */
                step={0.005}
                defaultValue={[0.1, 25]}
                value={[
                  // Convert from actual carat values to slider values
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
            <div className="mt-2 flex justify-between text-xs text-gray-500 px-1 mb-4">
            <span>0.2</span>
              <span>10</span>
              <span>20</span>

              <span>30</span>
              <span>40</span>
              <span>50</span>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (onClearFilters) {
                  // Call clear filters first
                  onClearFilters();

                  // Use a longer timeout to ensure filters are cleared before closing panel
                  setTimeout(() => {
                    setIsMobileFilterOpen(false);
                  }, 500);
                }
              }}
              className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2 mt-2 border border-gray-300 text-gray-800 rounded-lg text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterPanel;
