import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const MobileFilterPanel = ({
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  selectedCategories,
  categories,
  colors,
  maxPrice,
  priceRange,
  maxCarat,
  caratRange,
  cuts,
  clarities,
  polishes,
  symmetries,
  labs,
  fluorescences,
}) => {
  let tableRange = [0, 100];
  let lwRatioRange = [0, 10];
  let lengthRange = [0, 30];
  let widthRange = [0, 30];
  let depthRange = [0, 100];

  return (
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
                    <button className="text-xs font-normal text-white bg-gray-900 hover:bg-gray-700 px-2 py-1 rounded-full transition-colors">
                      Clear
                    </button>
                  )}
                </h3>
                {categories.length > 0 ? (
                  <div className="relative group">
                    {/* Left Arrow Navigation */}
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-1 flex items-center justify-center -ml-1">
                      <FaChevronLeft className="text-gray-600 w-3 h-3" />
                    </button>

                    {/* Right Arrow Navigation */}
                    <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-1 flex items-center justify-center -mr-1">
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
                        {categories.map((category) => (
                          <div
                            key={category._id}
                            className={`cursor-pointer flex flex-col items-center transition-all transform hover:scale-105 active:scale-95 ${
                              categories.includes(category._id)
                                ? "scale-105 opacity-100"
                                : "opacity-80 hover:opacity-100"
                            }`}
                          >
                            <div
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 border-2 shadow-md flex items-center justify-center transition-all ${
                                selectedCategories.includes(category._id)
                                  ? "border-gray-900 ring-1 ring-gray-300 hover:bg-gray-100"
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
                                  src={getDiamondShapeImageUrl(category._id)}
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
                  <div className="p-4 bg-gray-50 rounded-lg text-center mb-4">
                    <p className="text-gray-500 text-sm">
                      No diamond shapes available for the current diamonds.
                    </p>
                  </div>
                )}
              </div>

              {/* Color Filter */}
              {colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
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
                          className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div className="mx-2 text-gray-400 self-center">to</div>
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
                  <div className="mb-4">
                    <h3 className="text-base font-medium text-gray-900 mb-3">
                      Cut
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueCuts.map((cut) => (
                        <button
                          key={cut}
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
                {clarities.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-base font-medium text-gray-900 mb-3">
                      Clarity
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueClarities.map((clarity) => (
                        <button
                          key={clarity}
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
              {polishes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Polish
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {polishes.map((polish) => (
                      <button
                        key={polish}
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
              {symmetries.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Symmetry
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {symmetries.map((symmetry) => (
                      <button
                        key={symmetry}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Certification/Lab Filter */}
              {labs.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Certification
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {labs.map((lab) => (
                      <button
                        key={lab}
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
              {fluorescences.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Fluorescence
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {fluorescences.map((fluorescence) => (
                      <button
                        key={fluorescence}
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

            {/* Clear All Filters Button */}
            <button className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium">
              Clear All Filters
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterPanel;
