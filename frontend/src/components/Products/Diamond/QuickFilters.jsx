import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const QuickFilters = ({
  categories,
  selectedCategories,
  colors,
  maxPrice,
  priceRange,
  maxCarat,
  caratRange,
  cuts,
  clarities,
}) => {
  return (
    <div className="w-full mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hidden lg:block">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Quick Filters
      </h2>

      <div className="flex flex-col">
        {/* Diamond Shapes Category Slider - 100% Width */}
        {categories.length > 0 ? (
          <div className="w-full mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
              <span>Diamond Shapes</span>
              {selectedCategories.length > 0 && (
                <button className="text-xs font-normal text-white bg-gray-900 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors">
                  Clear Selection
                </button>
              )}
            </h3>
            {categories.length > 0 ? (
              <div className="relative group">
                {/* Left Arrow Navigation */}
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -ml-2">
                  <FaChevronLeft className="text-gray-600 w-4 h-4" />
                </button>

                {/* Right Arrow Navigation */}
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
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
                    {categories.map((category) => (
                      <div
                        key={category._id}
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
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          {category.image ? (
                            <img
                              src={`${backendURL_WITHOUT_API}/uploads/diamond-shapes/${category.image}`}
                              alt={category.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                              <span className="text-gray-500 text-lg sm:text-xl font-medium">
                                {category.name
                                  ? category.name.substring(0, 1).toUpperCase()
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Cut Filter */}
          {cuts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cut</h3>
              <div className="flex flex-wrap gap-2">
                {cuts.map((cut) => (
                  <button
                    key={cut}
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
          {clarities.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Clarity
              </h3>
              <div className="flex flex-wrap gap-2">
                {clarities.map((clarity) => (
                  <button
                    key={clarity}
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
  );
};

export default QuickFilters;
