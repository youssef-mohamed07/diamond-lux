// Paste this in a new file called Pagination.jsx in your components folder

import React, { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  // Ensure currentPage and totalPages are valid numbers
  const validCurrentPage = parseInt(currentPage) || 1;
  const validTotalPages = parseInt(totalPages) || 1;

  // State for the page input value
  const [pageInputValue, setPageInputValue] = useState("");
  const [inputError, setInputError] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setPageInputValue(value);

    // Clear error when user is typing
    if (inputError) {
      setInputError(false);
    }
  };

  // Handle input submission
  const handleInputSubmit = (e) => {
    e.preventDefault();

    const pageNumber = parseInt(pageInputValue);

    // Validate input
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > validTotalPages) {
      setInputError(true);
      return;
    }

    // Only trigger page change if it's different from current page
    if (pageNumber !== validCurrentPage) {
      onPageChange(pageNumber);
    }

    // Clear input after submission
    setPageInputValue("");
  };

  const renderPageNumbers = () => {
    // If we have 7 or fewer pages, show them all
    if (validTotalPages <= 7) {
      return Array.from({ length: validTotalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              validCurrentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            disabled={loading || validCurrentPage === page}
          >
            {page.toString()}
          </button>
        )
      );
    }

    // For more than 7 pages, create a dynamic pagination
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`w-10 h-10 flex items-center justify-center rounded-md ${
          validCurrentPage === 1
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
        disabled={loading || validCurrentPage === 1}
      >
        {"1"}
      </button>
    );

    // Calculate dynamic range
    let startPage, endPage;

    if (validCurrentPage <= 3) {
      // Near the beginning
      startPage = 2;
      endPage = 5;

      pages.push(
        ...Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => i + startPage
        ).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              validCurrentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            disabled={loading || validCurrentPage === page}
          >
            {page.toString()}
          </button>
        ))
      );

      // Add ellipsis
      pages.push(
        <span key="ellipsis1" className="px-2 py-1">
          ...
        </span>
      );
    } else if (validCurrentPage >= validTotalPages - 2) {
      // Near the end
      // Add ellipsis at the beginning
      pages.push(
        <span key="ellipsis1" className="px-2 py-1">
          ...
        </span>
      );

      startPage = validTotalPages - 4;
      endPage = validTotalPages - 1;

      pages.push(
        ...Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => i + startPage
        ).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              validCurrentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            disabled={loading || validCurrentPage === page}
          >
            {page.toString()}
          </button>
        ))
      );
    } else {
      // In the middle
      pages.push(
        <span key="ellipsis1" className="px-2 py-1">
          ...
        </span>
      );

      // Show current page and one page before and after
      startPage = validCurrentPage - 1;
      endPage = validCurrentPage + 1;

      pages.push(
        ...Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => i + startPage
        ).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              validCurrentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            disabled={loading || validCurrentPage === page}
          >
            {page.toString()}
          </button>
        ))
      );

      pages.push(
        <span key="ellipsis2" className="px-2 py-1">
          ...
        </span>
      );
    }

    // Always show last page
    pages.push(
      <button
        key={validTotalPages}
        onClick={() => onPageChange(validTotalPages)}
        className={`w-10 h-10 flex items-center justify-center rounded-md ${
          validCurrentPage === validTotalPages
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
        disabled={loading || validCurrentPage === validTotalPages}
      >
        {validTotalPages.toString()}
      </button>
    );

    return pages;
  };

  // Don't render pagination if there's only one page
  if (validTotalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-center mt-8 space-y-4">
      {/* Page buttons */}
      <div className="flex items-center justify-center space-x-2">
        {renderPageNumbers()}
      </div>

      {/* Page input form */}
      <div className="flex items-center space-x-2">
        <form onSubmit={handleInputSubmit} className="flex items-center">
          <label htmlFor="page-input" className="text-sm text-gray-600 mr-2">
            Go to page:
          </label>
          <input
            id="page-input"
            type="text"
            value={pageInputValue}
            onChange={handleInputChange}
            placeholder={validCurrentPage.toString()}
            className={`w-16 h-10 px-2 border rounded-md text-center ${
              inputError ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          <button
            type="submit"
            className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading || pageInputValue === ""}
          >
            Go
          </button>
        </form>
        {inputError && (
          <p className="text-red-500 text-xs">
            Please enter a valid page (1-{validTotalPages})
          </p>
        )}
      </div>
    </div>
  );
};

export default Pagination;
