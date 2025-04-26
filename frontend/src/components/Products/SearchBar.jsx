import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch, initialSearchTerm = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="w-full mb-8">
      <form onSubmit={handleSearch} className="relative flex items-center mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search diamonds by ID, certificate, etc."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
