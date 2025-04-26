import React from "react";

const AdvancedFilters = ({ polishes, symmetries, labs, fluorescences }) => {
  let tableRange = [0, 100];
  let lwRatioRange = [0, 10];
  let lengthRange = [0, 30];
  let widthRange = [0, 30];
  let depthRange = [0, 100];
  return (
    <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
      <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-y-auto max-h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Advanced Filters
        </h2>

        {/* Polish Filter */}
        {polishes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Polish</h3>
            <div className="flex flex-wrap gap-2">
              {polishes.map((polish) => (
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
        {symmetries.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">
              Symmetry
            </h3>
            <div className="flex flex-wrap gap-2">
              {symmetries.map((symmetry) => (
                <button
                  key={symmetry}
                  onClick={() => {
                    if (symmetries.includes(symmetry)) {
                      setSymmetries(symmetries.filter((s) => s !== symmetry));
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
          <h3 className="text-base font-medium text-gray-900 mb-3">Table %</h3>
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
          <h3 className="text-base font-medium text-gray-900 mb-3">Depth %</h3>
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
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">
              Certification
            </h3>
            <div className="flex flex-wrap gap-2">
              {labs.map((lab) => (
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
        {fluorescences.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">
              Fluorescence
            </h3>
            <div className="flex flex-wrap gap-2">
              {fluorescences.map((fluorescence) => (
                <button
                  key={fluorescence}
                  onClick={() => {
                    if (fluorescences.includes(fluorescence)) {
                      setFluorescences(
                        fluorescences.filter((f) => f !== fluorescence)
                      );
                    } else {
                      setFluorescences([...fluorescences, fluorescence]);
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
        {(polishes.length > 0 ||
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
  );
};

export default AdvancedFilters;
