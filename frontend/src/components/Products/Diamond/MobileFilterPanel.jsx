import React from "react";
import { FaTimes } from "react-icons/fa";

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
}) => {
  if (!isMobileFilterOpen) return null;

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
                        {selectedCategories.includes(String(category._id)) && (
                          <div className="absolute top-0 right-0 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                        {category.image ? (
                          <img
                            src={category.image}
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
                                  "w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon";

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

          {/* Price Range */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-3">Price Range</h3>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    defaultValue={priceRange[0]}
                    onChange={(e) => {
                      const min = Number(e.target.value);
                      const max = priceRange[1];
                      onPriceChange({ min, max });
                    }}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="mx-2 text-gray-400">to</div>
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    defaultValue={priceRange[1] < 100000 ? priceRange[1] : ""}
                    onChange={(e) => {
                      const min = priceRange[0];
                      const max = Number(e.target.value);
                      onPriceChange({ min, max });
                    }}
                    className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Carat Range */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-3">Carat Range</h3>
            <div className="flex items-center">
              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Min"
                  defaultValue={caratRange[0]}
                  onChange={(e) => {
                    const min = Number(e.target.value);
                    const max = caratRange[1];
                    onCaratChange({ min, max });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mx-2 text-gray-400">to</div>
              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Max"
                  defaultValue={caratRange[1] < 10 ? caratRange[1] : ""}
                  onChange={(e) => {
                    const min = caratRange[0];
                    const max = Number(e.target.value);
                    onCaratChange({ min, max });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          {colors && colors.length > 0 && (
            <div className="pb-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Color</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedColors.includes(color)) {
                        // If already selected, remove it (deselect) by sending just the single item
                        // This will toggle it off in the Diamond page handler
                        onColorChange([color]);
                      } else {
                        // Add to selection
                        onColorChange([...selectedColors, color]);
                      }
                    }}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedColors.includes(color)
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {color}
                  </button>
                ))}
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
                          onSymmetryChange([...selectedSymmetries, symmetry]);
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
                    defaultValue={lwRatioRange[1] < 10 ? lwRatioRange[1] : ""}
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
