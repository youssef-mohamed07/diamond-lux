import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import React, { useState, useEffect } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  // State for window width to handle responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update windowWidth when window is resized
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine how many page buttons to show based on screen size
  const getMaxVisibleButtons = () => {
    if (windowWidth < 400) return 3;
    if (windowWidth < 640) return 5;
    return 7;
  };
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
    const maxVisibleButtons = getMaxVisibleButtons();

    // If we have fewer pages than the max visible buttons, show them all
    if (validTotalPages <= maxVisibleButtons) {
      return Array.from({ length: validTotalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              validCurrentPage === page
                ? "bg-black text-white"
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
            ? "bg-black text-white"
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
                ? "bg-black text-white"
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
                ? "bg-black text-white"
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
                ? "bg-black text-white"
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
            ? "bg-black text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
        disabled={loading || validCurrentPage === validTotalPages}
      >
        {validTotalPages.toString()}
      </button>
    );

    return pages;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-center mt-8 space-y-4"
    >
      {/* Page buttons */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(validCurrentPage - 1)}
          disabled={loading || validCurrentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200
            ${
              validCurrentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            }
          `}
          aria-label="Previous page"
        >
          <IoChevronBack className="w-5 h-5" />
        </button>

        {renderPageNumbers()}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(validCurrentPage + 1)}
          disabled={loading || validCurrentPage === validTotalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200
            ${
              validCurrentPage === validTotalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            }
          `}
          aria-label="Next page"
        >
          <IoChevronForward className="w-5 h-5" />
        </button>
      </div>

      {/* Page input form */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4">
        <div className="text-sm text-gray-500">
          Page {validCurrentPage} of {validTotalPages}
        </div>
        <form onSubmit={handleInputSubmit} className="flex items-center">
          <div className="relative">
            <input
              id="page-input"
              type="text"
              value={pageInputValue}
              onChange={handleInputChange}
              className={`w-32 h-10 px-4 py-2 border rounded-l-md  text-sm  ${
                inputError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            />
            <button
              type="submit"
              className={`absolute right-0 top-0 h-10 px-4 bg-black text-white rounded-r-md
                ${
                  loading || pageInputValue === ""
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
              disabled={loading || pageInputValue === ""}
              aria-label="Go to specified page"
            >
              Go
            </button>
          </div>
        </form>
        {inputError && (
          <p className="text-red-500 text-xs" role="alert">
            Please enter a valid page number between 1 and {validTotalPages}
          </p>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
