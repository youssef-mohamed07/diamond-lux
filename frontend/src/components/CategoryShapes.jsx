import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaArrowRight } from "react-icons/fa6";

const CategoryShapes = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [showAllShapes, setShowAllShapes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL_WITHOUT_API = backendURL.replace("/api", "");

  // Get category from URL on component mount and when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get("category");
    setSelectedCategory(categoryId);
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        let categoriesData = null;
        let lastError = null;

        try {
          const response = await axios.get(`${backendURL}/category`);

          if (
            response.data &&
            response.data.categories &&
            response.data.categories.length > 0
          ) {
            categoriesData = response.data.categories;
            setCategories(categoriesData);
          } else {
          }
        } catch (err) {
          lastError = err;
        }
      } catch (error) {
        console.error("Error in category fetching process:", error);
        setCategories([]);
        setError(`Error fetching categories: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [products]);

  // Calculate number of items to show
  const visibleCount = showAllShapes
    ? categories.length
    : Math.min(8, categories.length);

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
    return name && typeof name === "string"
      ? name.substring(0, 1).toUpperCase()
      : "?";
  };

  // Show a message if no categories available
  if (!loading && categories.length === 0) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Categories
          </h2>
          <p className="mt-4 text-gray-600">
            No categories available at the moment.
          </p>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  // Handle category click
  const handleCategoryClick = (categoryId, categoryName) => {
    // Make sure we have a valid category ID
    if (!categoryId) {
      console.error("Invalid category ID", categoryId);
      return;
    }

    setSelectedCategory(categoryId);

    // Navigate to diamond page with the category parameter and reset page to 1
    const searchParams = new URLSearchParams();
    searchParams.set("category", categoryId);
    searchParams.set("page", "1");
    searchParams.set("type", "lab"); // Set default type to lab grown

    navigate({
      pathname: "/products/diamond",
      search: searchParams.toString(),
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Discover Diamonds. In Every Shape.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            The widest choice of diamond shapes, powered by the largest online
            inventory.
          </p>
          {error && <p className="mt-2 text-xs text-gray-500">{error}</p>}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4 sm:gap-6 mb-4">
          {categories.slice(0, visibleCount).map((category, index) => (
            <div
              key={category._id || `category-${index}`}
              className="flex flex-col items-center"
            >
              <div
                onClick={() => handleCategoryClick(category._id, category.name)}
                className={`group cursor-pointer flex flex-col items-center ${
                  selectedCategory === category._id ? "ring-2 ring-black" : ""
                }`}
              >
                <div
                  className={`bg-gray-50 rounded-lg overflow-hidden h-[70px] w-[70px] text-center transition-all group-hover:shadow-md flex items-center justify-center ${
                    selectedCategory === category._id ? "bg-gray-100" : ""
                  }`}
                >
                  {category.image ? (
                    <img
                      src={`${backendURL_WITHOUT_API}/uploads/diamond-shapes/${category.image}`}
                      alt={category.name}
                      className="object-contain h-20 w-20"
                      onError={(e) => {
                        try {
                          e.target.style.display = "none";
                          const parentNode = e.target.parentNode;
                          let fallbackIcon =
                            parentNode.querySelector(".fallback-icon");

                          if (!fallbackIcon) {
                            fallbackIcon = document.createElement("div");
                            fallbackIcon.className =
                              "w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon";

                            const span = document.createElement("span");
                            span.className =
                              "text-gray-500 text-xl font-medium";
                            span.innerText = getCategoryInitial(category.name);

                            fallbackIcon.appendChild(span);
                            parentNode.appendChild(fallbackIcon);
                          }

                          fallbackIcon.style.display = "flex";
                        } catch (err) {
                          console.error(
                            "Error handling image load failure:",
                            err
                          );
                        }
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full fallback-icon">
                      <span className="text-gray-500 text-xl font-medium">
                        {getCategoryInitial(category.name)}
                      </span>
                    </div>
                  )}
                </div>
                <p
                  className={`mt-2 text-xs sm:text-sm text-center font-medium ${
                    selectedCategory === category._id
                      ? "text-black font-bold"
                      : "text-gray-800"
                  }`}
                >
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <a 
            href="https://store.diamondcartel.in/products/diamond?category=emerald&page=1&type=lab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors mt-4"
          >
            Show More <FaArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CategoryShapes;
