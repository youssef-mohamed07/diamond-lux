import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";

// Default fallback categories moved outside component
const fallbackCategories = [
  { _id: "rings", name: "Rings" },
  { _id: "necklaces", name: "Necklaces" },
  { _id: "bracelets", name: "Bracelets" },
  { _id: "earrings", name: "Earrings" },
  { _id: "pendants", name: "Pendants" }
];

const CategoryShapes = () => {
  const [categories, setCategories] = useState([]);
  const [showAllShapes, setShowAllShapes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Define API endpoints to try
        const endpoints = [
          'http://localhost:3000/api/category',
          'http://localhost:3000/category'
        ];
        
        let categoriesData = null;
        let lastError = null;
        
        // Try each endpoint sequentially
        for (const endpoint of endpoints) {
          try {
            console.log(`Attempting to fetch categories from ${endpoint}...`);
            const response = await axios.get(endpoint);
            
            if (response.data && response.data.categories && response.data.categories.length > 0) {
              console.log(`Categories found at ${endpoint}:`, response.data.categories.length);
              categoriesData = response.data.categories;
              break; // Exit the loop if successful
            } else {
              console.log(`No valid categories in response from ${endpoint}`);
            }
          } catch (err) {
            console.log(`API call to ${endpoint} failed:`, err);
            lastError = err;
          }
        }
        
        // Set categories from API or fallback
        if (categoriesData) {
          setCategories(categoriesData);
        } else {
          console.log('All API attempts failed, using fallback categories');
          setCategories(fallbackCategories);
          setError(lastError ? `API requests failed: ${lastError.message}` : 'No categories found in API responses');
        }
      } catch (error) {
        console.error('Error in category fetching process:', error);
        setCategories(fallbackCategories);
        setError(`Error fetching categories: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Calculate number of items to show
  const visibleCount = showAllShapes ? categories.length : Math.min(5, categories.length);
  
  // Render loading skeleton
  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-gray-200 h-24 w-full rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mt-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Generate category initial for icon
  const getCategoryInitial = (name) => {
    return name && typeof name === 'string' ? name.substring(0, 1).toUpperCase() : '?';
  };
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Discover Diamonds. In Every Shape.</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            The widest choice of diamond shapes, powered by the largest online inventory.
          </p>
          {error && (
            <p className="mt-2 text-xs text-gray-500">
              {error}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-4 sm:gap-6 mb-4">
          {categories.slice(0, visibleCount).map((category, index) => (
            <div key={category._id || `category-${index}`} className="flex flex-col items-center">
              <Link 
                to={`/products?category=${category._id || encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-lg overflow-hidden h-24 w-full transition-all group-hover:shadow-md flex items-center justify-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                    <span className="text-gray-500 text-xl font-medium">
                      {getCategoryInitial(category.name)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-center font-medium text-gray-800">
                  {category.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
        
        {categories.length > 5 && (
          <div className="text-center mt-2">
            <button 
              onClick={() => setShowAllShapes(!showAllShapes)}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              aria-expanded={showAllShapes}
              aria-label={showAllShapes ? "Show fewer categories" : "Show more categories"}
            >
              {showAllShapes ? "Show less" : "Show more"} 
              <FaChevronDown 
                className={`ml-1 transition-transform ${showAllShapes ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryShapes;