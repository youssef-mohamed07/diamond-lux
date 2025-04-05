import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import GalleryItem from "../components/Home/GalleryItem";
import { assets } from "../assets/assets";
import { useCategories } from "../../hooks/useCategories";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import { FaFilter, FaSort, FaChevronDown, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Products = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const categories = useCategories();

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const clearFilters = () => {
    setCategory([]);
    setSortType("relevant");
  };

  const applyFilter = () => {
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    let sortedProducts = [...filterProducts];

    if (sortType === "low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(sortedProducts);
  };

  useEffect(() => {
    if (!categories || categories.length === 0) {
      // Fetch categories logic here if not already handled in useCategories
    }
    applyFilter();

    // Set loading to false when data is available
    if (products.length > 0) {
      setLoading(false);
    }
  }, [category, search, showSearch, products, categories]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black  animate-ping opacity-75"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black  animate-pulse"></div>
        </div>
        <p className="text-lg mt-6 font-medium text-gray-800">
          Loading exquisite products...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="relative bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/products-hero-background.jpg"
            alt="Luxury jewelry collection"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:max-w-2xl lg:max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-16 bg-white/80"></div>
              <span className="uppercase tracking-[0.3em] text-sm font-light text-white/90">
                Luxury Collection
              </span>
            </div>
            <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl mb-8 tracking-tight">
              Our Collection
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl leading-relaxed">
              Discover our exquisite selection of premium diamond jewelry, each
              piece crafted with exceptional artistry and precision for those
              who appreciate true luxury.
            </p>

            {/* Decorative element */}
            <div className="absolute -bottom-6 right-0 hidden lg:block">
              <svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-20"
              >
                <circle cx="80" cy="80" r="79.5" stroke="white" />
                <circle cx="80" cy="80" r="55.5" stroke="white" />
                <circle cx="80" cy="80" r="31.5" stroke="white" />
                <path d="M80 0V160" stroke="white" strokeWidth="0.5" />
                <path d="M160 80L0 80" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/4 xl:w-1/5"
            >
              <div className="bg-white  shadow-lg p-8 sticky top-24">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FaFilter className="mr-3" /> Filters
                  </h2>
                  {category.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-900 flex items-center transition-colors"
                    >
                      <FaTimes className="mr-1" /> Clear
                    </button>
                  )}
                </div>

                <div className="mb-10">
                  <h3 className="font-medium text-gray-900 mb-5 text-lg">
                    Categories
                  </h3>
                  <div className="space-y-4">
                    {categories?.length > 0 ? (
                      categories.map((category) => (
                        <div key={category._id} className="flex items-center">
                          <input
                            id={`category-${category._id}`}
                            type="checkbox"
                            value={category._id}
                            onChange={toggleCategory}
                            className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`category-${category._id}`}
                            className="ml-3 text-gray-700 text-base"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-base text-gray-500">
                        No categories available
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-5 text-lg">
                    Sort By
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="sort-relevant"
                        name="sort-type"
                        type="radio"
                        checked={sortType === "relevant"}
                        onChange={() => setSortType("relevant")}
                        className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300"
                      />
                      <label
                        htmlFor="sort-relevant"
                        className="ml-3 text-gray-700 text-base"
                      >
                        Relevance
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sort-low-high"
                        name="sort-type"
                        type="radio"
                        checked={sortType === "low-high"}
                        onChange={() => setSortType("low-high")}
                        className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300"
                      />
                      <label
                        htmlFor="sort-low-high"
                        className="ml-3 text-gray-700 text-base"
                      >
                        Price: Low to High
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sort-high-low"
                        name="sort-type"
                        type="radio"
                        checked={sortType === "high-low"}
                        onChange={() => setSortType("high-low")}
                        className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300"
                      />
                      <label
                        htmlFor="sort-high-low"
                        className="ml-3 text-gray-700 text-base"
                      >
                        Price: High to Low
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-3/4 xl:w-4/5"
            >
              <div className="bg-white  shadow-lg p-8 mb-6">
                <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center mb-8">
                  <div className="flex items-center mb-4 sm:mb-0 gap-4 opacity-70">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                      Collections
                    </h2>
                    <span className="w-[7px] h-[7px] bg-black rounded-full"></span>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                      {filterProducts.length}{" "}
                      {filterProducts.length === 1 ? "Product" : "Products"}
                    </h2>
                  </div>

                  {/* Mobile Filters Button */}
                  <button
                    className="flex items-center text-base font-medium text-gray-700 bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors lg:hidden"
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <FaFilter className="mr-2" />
                    {showFilter ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>

                {/* Mobile Filters */}
                <div
                  className={`lg:hidden ${
                    showFilter ? "block" : "hidden"
                  } mb-8 border border-gray-200 p-6`}
                >
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-4 text-lg">
                      Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categories?.length > 0 ? (
                        categories.map((category) => (
                          <div key={category._id} className="flex items-center">
                            <input
                              id={`mobile-category-${category._id}`}
                              type="checkbox"
                              value={category._id}
                              onChange={toggleCategory}
                              className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`mobile-category-${category._id}`}
                              className="ml-2 text-base text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-base text-gray-500">
                          No categories available
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 text-lg">
                      Sort By
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <input
                          id="mobile-sort-relevant"
                          name="mobile-sort-type"
                          type="radio"
                          checked={sortType === "relevant"}
                          onChange={() => setSortType("relevant")}
                          className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label
                          htmlFor="mobile-sort-relevant"
                          className="ml-2 text-base text-gray-700"
                        >
                          Relevance
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="mobile-sort-low-high"
                          name="mobile-sort-type"
                          type="radio"
                          checked={sortType === "low-high"}
                          onChange={() => setSortType("low-high")}
                          className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label
                          htmlFor="mobile-sort-low-high"
                          className="ml-2 text-base text-gray-700"
                        >
                          Price: Low to High
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="mobile-sort-high-low"
                          name="mobile-sort-type"
                          type="radio"
                          checked={sortType === "high-low"}
                          onChange={() => setSortType("high-low")}
                          className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label
                          htmlFor="mobile-sort-high-low"
                          className="ml-2 text-base text-gray-700"
                        >
                          Price: High to Low
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {category.map((catId) => {
                      const catName =
                        categories.find((c) => c._id === catId)?.name || catId;
                      return (
                        <div
                          key={catId}
                          className="inline-flex items-center px-4 py-2  text-sm bg-gray-100 text-gray-800 shadow-sm"
                        >
                          {catName}
                          <button
                            onClick={() =>
                              setCategory((prev) =>
                                prev.filter((c) => c !== catId)
                              )
                            }
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      );
                    })}
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2  text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors shadow-sm"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filterProducts.length > 0 ? (
                    filterProducts.map((product, index) => (
                      <GalleryItem
                        key={product._id}
                        item={product}
                        index={index}
                        price={true}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center">
                      <div className="mx-auto w-28 h-28 mb-8 text-gray-300">
                        <svg
                          className="w-full h-full"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-3">
                        No products found
                      </h3>
                      <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Try adjusting your filters or search criteria to find
                        what you're looking for
                      </p>
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="relative bg-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-0.5 bg-gray-300 mb-8"></div>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  delay: 0.5,
                }}
                className="w-2 h-2  bg-gray-900"
              ></motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  delay: 1,
                }}
                className="w-3 h-3  bg-gray-700"
              ></motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  delay: 1.5,
                }}
                className="w-4 h-4  bg-gray-500"
              ></motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  delay: 1,
                }}
                className="w-3 h-3  bg-gray-700"
              ></motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  delay: 0.5,
                }}
                className="w-2 h-2  bg-gray-900"
              ></motion.div>
            </div>
            <div className="flex items-center mb-10">
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <motion.svg
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 20,
                  ease: "linear",
                }}
                viewBox="0 0 24 24"
                fill="none"
                className="w-8 h-8 mx-4 text-gray-800"
              >
                <path
                  d="M12 3L20 10L12 21L4 10L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 10H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
              <div className="w-16 h-0.5 bg-gray-300"></div>
            </div>
            <p className="text-gray-600 italic text-center max-w-xl text-lg font-light">
              "Our diamonds are carefully selected for exceptional quality,
              brilliance, and ethical sourcing. We celebrate the natural beauty
              of each stone in our designs."
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold mb-6">
              Exquisite Craftsmanship
            </h2>
            <p className="max-w-2xl mx-auto mb-10 text-gray-300 text-lg">
              Each piece in our collection is meticulously crafted by master
              artisans, ensuring exceptional quality and timeless elegance.
            </p>
            <Link
              to="/about"
              className="relative group inline-block px-10 py-4 border-2 border-white hover:bg-white hover:text-gray-900 transition-colors text-lg font-medium overflow-hidden"
            >
              <span className="relative z-10">Learn About Our Process</span>
              <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></span>
              <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 delay-100"></span>
            </Link>
          </motion.div>
        </div>
      </div>

      <NewsletterBox />
    </>
  );
};

export default Products;
