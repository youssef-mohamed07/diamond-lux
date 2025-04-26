import { useState, useEffect, useRef } from 'react';
import { FaSort, FaChevronDown } from 'react-icons/fa';

/**
 * SortDropdown Component for selecting product sorting options
 * 
 * @param {Object} props Component props
 * @param {Array} props.options Array of sort options with value and label properties
 * @param {string} props.value Current selected sort value
 * @param {Function} props.onChange Function to call when sort option changes
 * @returns {JSX.Element} SortDropdown component
 */
const SortDropdown = ({ options = [], value = '', onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find selected option or use first option as default display text
  const selectedOption = options.find(option => option.value === value) || options[0] || { label: 'Sort by' };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-48 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <FaSort className="mr-2 h-4 w-4 text-gray-500" />
            <span>{selectedOption.label}</span>
          </div>
          <FaChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {options.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  option.value === value
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown; 