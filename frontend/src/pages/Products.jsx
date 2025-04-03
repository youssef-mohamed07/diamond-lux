import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { assets } from "../assets/assets";
import { useCategories } from "../../hooks/useCategories";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import { FaFilter, FaSort, FaChevronDown, FaTimes } from "react-icons/fa";

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
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full animate-pulse"></div>
        </div>
        <p className="text-lg mt-6 font-medium text-gray-800">Loading exquisite products...</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1469&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Our Collection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Discover our exquisite selection of premium diamond jewelry
            </motion.p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-[90%] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/4 xl:w-1/5"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaFilter className="mr-2" /> Filters
                  </h2>
                  {category.length > 0 && (
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <FaTimes className="mr-1" /> Clear
                    </button>
                  )}
                </div>
                
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories?.length > 0 ? (
                      categories.map((category) => (
                        <div key={category._id} className="flex items-center">
                          <input
                            id={`category-${category._id}`}
                            type="checkbox"
                            value={category._id}
                            onChange={toggleCategory}
                            className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`category-${category._id}`} className="ml-3 text-sm text-gray-700">
                            {category.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No categories available</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Sort By</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="sort-relevant"
                        name="sort-type"
                        type="radio"
                        checked={sortType === "relevant"}
                        onChange={() => setSortType("relevant")}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                      />
                      <label htmlFor="sort-relevant" className="ml-3 text-sm text-gray-700">
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
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                      />
                      <label htmlFor="sort-low-high" className="ml-3 text-sm text-gray-700">
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
                        className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                      />
                      <label htmlFor="sort-high-low" className="ml-3 text-sm text-gray-700">
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
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                    {filterProducts.length} {filterProducts.length === 1 ? 'Product' : 'Products'}
                  </h2>
                  
                  {/* Mobile Filters Button */}
                  <button 
                    className="flex items-center text-sm font-medium text-gray-700 lg:hidden"
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <FaFilter className="mr-2" />
                    {showFilter ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
                
                {/* Mobile Filters */}
                <div className={`lg:hidden ${showFilter ? 'block' : 'hidden'} mb-6 border-t border-b border-gray-200 py-4`}>
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
              {categories?.length > 0 ? (
                categories.map((category) => (
                          <div key={category._id} className="flex items-center">
                    <input
                              id={`mobile-category-${category._id}`}
                      type="checkbox"
                      value={category._id}
                      onChange={toggleCategory}
                              className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                    />
                            <label htmlFor={`mobile-category-${category._id}`} className="ml-2 text-sm text-gray-700">
                    {category.name}
                            </label>
                          </div>
                ))
              ) : (
                        <p className="text-sm text-gray-500">No categories available</p>
              )}
            </div>
          </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Sort By</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <input
                          id="mobile-sort-relevant"
                          name="mobile-sort-type"
                          type="radio"
                          checked={sortType === "relevant"}
                          onChange={() => setSortType("relevant")}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label htmlFor="mobile-sort-relevant" className="ml-2 text-sm text-gray-700">
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
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label htmlFor="mobile-sort-low-high" className="ml-2 text-sm text-gray-700">
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
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label htmlFor="mobile-sort-high-low" className="ml-2 text-sm text-gray-700">
                          Price: High to Low
                        </label>
                      </div>
            </div>
          </div>
        </div>

                {/* Active Filters */}
                {category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.map((catId) => {
                      const catName = categories.find(c => c._id === catId)?.name || catId;
                      return (
                        <div 
                          key={catId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {catName}
                          <button 
                            onClick={() => setCategory(prev => prev.filter(c => c !== catId))}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      );
                    })}
                    <button 
                      onClick={clearFilters}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-800 text-white hover:bg-gray-700"
                    >
                      Clear All
                    </button>
                  </div>
                )}
                
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterProducts.length > 0 ? (
                    filterProducts.map((product) => (
              <ProductItem key={product._id} {...product} />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
                      <button 
                        onClick={clearFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
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
      
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
        <div className="max-w-[90%] mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Exquisite Craftsmanship</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Each piece in our collection is meticulously crafted by master artisans, 
            ensuring exceptional quality and timeless elegance.
          </p>
          <button className="px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-colors">
            Learn About Our Process
          </button>
        </div>
      </div>
      
      <NewsletterBox />
    </>
  );
};

export default Products;
