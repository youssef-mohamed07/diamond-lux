import React, { useState, useEffect } from "react";

const AdvancedFilters = ({ 
  polishes = [], 
  selectedPolishes = [],
  onPolishChange,
  symmetries = [], 
  selectedSymmetries = [],
  onSymmetryChange,
  labs = [], 
  selectedLabs = [],
  onLabChange,
  fluorescences = [],
  selectedFluorescences = [],
  onFluorescenceChange,
  tableRange = [0, 100],
  onTableChange,
  depthRange = [0, 100],
  onDepthChange,
  lwRatioRange = [0, 10],
  onLwRatioChange,
  lengthRange = [0, 30],
  onLengthChange,
  widthRange = [0, 30],
  onWidthChange,
  onClearFilters
}) => {
  // Local state for controlled inputs
  const [minTable, setMinTable] = useState(tableRange[0] || 0);
  const [maxTable, setMaxTable] = useState(tableRange[1] || 100);
  
  const [minDepth, setMinDepth] = useState(depthRange[0] || 0);
  const [maxDepth, setMaxDepth] = useState(depthRange[1] || 100);
  
  const [minLwRatio, setMinLwRatio] = useState(lwRatioRange[0] || 0);
  const [maxLwRatio, setMaxLwRatio] = useState(lwRatioRange[1] || 10);
  
  const [minLength, setMinLength] = useState(lengthRange[0] || 0);
  const [maxLength, setMaxLength] = useState(lengthRange[1] || 30);
  
  const [minWidth, setMinWidth] = useState(widthRange[0] || 0);
  const [maxWidth, setMaxWidth] = useState(widthRange[1] || 30);

  // Update local state when props change
  useEffect(() => {
    setMinTable(tableRange[0] || 0);
    setMaxTable(tableRange[1] || 100);
  }, [tableRange]);

  useEffect(() => {
    setMinDepth(depthRange[0] || 0);
    setMaxDepth(depthRange[1] || 100);
  }, [depthRange]);

  useEffect(() => {
    setMinLwRatio(lwRatioRange[0] || 0);
    setMaxLwRatio(lwRatioRange[1] || 10);
  }, [lwRatioRange]);

  useEffect(() => {
    setMinLength(lengthRange[0] || 0);
    setMaxLength(lengthRange[1] || 30);
  }, [lengthRange]);

  useEffect(() => {
    setMinWidth(widthRange[0] || 0);
    setMaxWidth(widthRange[1] || 30);
  }, [widthRange]);

  // Handle table change with debounce
  const handleTableChange = (min, max) => {
    setMinTable(min);
    setMaxTable(max);
    
    // Use setTimeout to debounce the API call
    const timer = setTimeout(() => {
      if (onTableChange) onTableChange({ min, max });
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  };

  // Handle depth change with debounce
  const handleDepthChange = (min, max) => {
    setMinDepth(min);
    setMaxDepth(max);
    
    // Use setTimeout to debounce the API call
    const timer = setTimeout(() => {
      if (onDepthChange) onDepthChange({ min, max });
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  };

  // Handle L/W ratio change with debounce
  const handleLwRatioChange = (min, max) => {
    setMinLwRatio(min);
    setMaxLwRatio(max);
    
    // Use setTimeout to debounce the API call
    const timer = setTimeout(() => {
      if (onLwRatioChange) onLwRatioChange({ min, max });
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  };

  // Handle length change with debounce
  const handleLengthChange = (min, max) => {
    setMinLength(min);
    setMaxLength(max);
    
    // Use setTimeout to debounce the API call
    const timer = setTimeout(() => {
      if (onLengthChange) onLengthChange({ min, max });
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  };

  // Handle width change with debounce
  const handleWidthChange = (min, max) => {
    setMinWidth(min);
    setMaxWidth(max);
    
    // Use setTimeout to debounce the API call
    const timer = setTimeout(() => {
      if (onWidthChange) onWidthChange({ min, max });
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  };

  // Custom clear all function for advanced filters
  const handleClearAdvancedFilters = () => {
    console.log('Clearing all advanced filters');
    
    // Reset all local states immediately for UI feedback
    setMinTable(0);
    setMaxTable(100);
    setMinDepth(0);
    setMaxDepth(100);
    setMinLwRatio(0);
    setMaxLwRatio(10);
    setMinLength(0);
    setMaxLength(30);
    setMinWidth(0);
    setMaxWidth(30);
    
    // Add a small delay to ensure local state is updated before making API calls
    setTimeout(() => {
      // Clear all selections by sending empty arrays
      if (onPolishChange) onPolishChange([]);
      if (onSymmetryChange) onSymmetryChange([]);
      if (onLabChange) onLabChange([]);
      if (onFluorescenceChange) onFluorescenceChange([]);
      
      // Reset all ranges with another small delay to avoid race conditions
      setTimeout(() => {
        if (onTableChange) onTableChange({ min: 0, max: 100 });
        if (onDepthChange) onDepthChange({ min: 0, max: 100 });
        if (onLwRatioChange) onLwRatioChange({ min: 0, max: 10 });
        if (onLengthChange) onLengthChange({ min: 0, max: 30 });
        if (onWidthChange) onWidthChange({ min: 0, max: 30 });
      }, 20);
    }, 20);
  };

  return (
    <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
      <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-y-auto max-h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-between">
          <span>Advanced Filters</span>
          {(selectedPolishes.length > 0 || 
            selectedSymmetries.length > 0 || 
            selectedLabs.length > 0 || 
            selectedFluorescences.length > 0 ||
            minTable > 0 || maxTable < 100 ||
            minDepth > 0 || maxDepth < 100 ||
            minLwRatio > 0 || maxLwRatio < 10 ||
            minLength > 0 || maxLength < 30 ||
            minWidth > 0 || maxWidth < 30) && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleClearAdvancedFilters}
                className="text-xs font-normal text-white bg-gray-900 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors flex items-center"
              >
                <span className="mr-1">Clear Advanced</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button 
                onClick={() => onClearFilters && onClearFilters()}
                className="text-xs font-normal text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </h2>

        {/* Polish Filter */}
        {polishes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">
              <span>Polish</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {polishes.map((polish) => (
                <button
                  key={polish}
                  onClick={() => {
                    if (onPolishChange) {
                      if (selectedPolishes.includes(polish)) {
                        // If already selected, remove it (deselect) by sending just the single item
                        // This will toggle it off in the Diamond page handler
                        onPolishChange([polish]);
                      } else {
                        // Add to selection
                        onPolishChange([...selectedPolishes, polish]);
                      }
                    }
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedPolishes.includes(polish)
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
              <span>Symmetry</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {symmetries.map((symmetry) => (
                <button
                  key={symmetry}
                  onClick={() => {
                    if (onSymmetryChange) {
                      if (selectedSymmetries.includes(symmetry)) {
                        // If already selected, remove it (deselect) by sending just the single item
                        // This will toggle it off in the Diamond page handler
                        onSymmetryChange([symmetry]);
                      } else {
                        // Add to selection
                        onSymmetryChange([...selectedSymmetries, symmetry]);
                      }
                    }
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedSymmetries.includes(symmetry)
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
            <span>Table %</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={minTable}
                onChange={(e) => handleTableChange(Number(e.target.value), maxTable)}
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
                value={maxTable}
                onChange={(e) => handleTableChange(minTable, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* L/W Ratio % Filter */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">
            <span>L/W Ratio</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="number"
                min={0}
                max={10}
                step="0.01"
                value={minLwRatio}
                onChange={(e) => handleLwRatioChange(Number(e.target.value), maxLwRatio)}
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
                value={maxLwRatio}
                onChange={(e) => handleLwRatioChange(minLwRatio, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Length (L) in mm Filter */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">
            <span>Length (mm)</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="number"
                min={0}
                max={30}
                step="0.01"
                value={minLength}
                onChange={(e) => handleLengthChange(Number(e.target.value), maxLength)}
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
                value={maxLength}
                onChange={(e) => handleLengthChange(minLength, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Width (W) in mm Filter */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">
            <span>Width (mm)</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="number"
                min={0}
                max={30}
                step="0.01"
                value={minWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value), maxWidth)}
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
                value={maxWidth}
                onChange={(e) => handleWidthChange(minWidth, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Depth % Filter */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">
            <span>Depth %</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={minDepth}
                onChange={(e) => handleDepthChange(Number(e.target.value), maxDepth)}
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
                value={maxDepth}
                onChange={(e) => handleDepthChange(minDepth, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Lab Certification Filter */}
        {labs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">
              <span>Lab Certification</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {labs.map((lab) => (
                <button
                  key={lab}
                  onClick={() => {
                    if (onLabChange) {
                      if (selectedLabs.includes(lab)) {
                        // If already selected, remove it (deselect) by sending just the single item
                        // This will toggle it off in the Diamond page handler
                        onLabChange([lab]);
                      } else {
                        // Add to selection
                        onLabChange([...selectedLabs, lab]);
                      }
                    }
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedLabs.includes(lab)
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
              <span>Fluorescence</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {fluorescences.map((fluorescence) => (
                <button
                  key={fluorescence}
                  onClick={() => {
                    if (onFluorescenceChange) {
                      if (selectedFluorescences.includes(fluorescence)) {
                        // If already selected, remove it (deselect) by sending just the single item
                        // This will toggle it off in the Diamond page handler
                        onFluorescenceChange([fluorescence]);
                      } else {
                        // Add to selection
                        onFluorescenceChange([...selectedFluorescences, fluorescence]);
                      }
                    }
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedFluorescences.includes(fluorescence)
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
    </div>
  );
};

export default AdvancedFilters;
