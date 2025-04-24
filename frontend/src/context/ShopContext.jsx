import { createContext, useState, useEffect, useMemo } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useWishlist } from "../../hooks/useWishlist";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Products
  const {
    products,
    loading: productsLoading,
    diamondProducts,
    diamondPagination,
    diamondLoading,
    fetchDiamondPage,
    jewelleryProducts,
    popularProducts,
    earrings,
    necklaces,
    bracelets,
  } = useProducts();

  // Auth
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  // Cart/Wishlist
  const {
    wishlist,
    wishlistItemsCount,
    loading: wishlistLoading,
  } = useWishlist(token);

  // Guest cart/wishlist
  const [guestWishlist, setGuestWishlist] = useState(() => {
    const saved = localStorage.getItem("guestWishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [guestWishlistCount, setGuestWishlistCount] = useState(0);

  // Favorites (wishlist)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Search
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Global product filtering
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [globalSelectedCategories, setGlobalSelectedCategories] = useState([]);
  const [globalDiamondTypes, setGlobalDiamondTypes] = useState([]);
  const [globalMetals, setGlobalMetals] = useState([]);
  const [globalMetalColors, setGlobalMetalColors] = useState([]);
  const [globalCaratRange, setGlobalCaratRange] = useState([0, 100]);
  const [globalPriceRange, setGlobalPriceRange] = useState([0, 1000000]);
  const [globalSortType, setGlobalSortType] = useState("relevant");
  
  // Filtered product results
  const [filteredProducts, setFilteredProducts] = useState({
    all: [],
    diamonds: [],
    jewellery: [],
    earrings: [],
    necklaces: [],
    bracelets: [],
  });

  // Global filter values for metadata
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueDiamondTypes, setUniqueDiamondTypes] = useState([]);
  const [uniqueMetals, setUniqueMetals] = useState([]);
  const [uniqueMetalColors, setUniqueMetalColors] = useState([]);
  const [maxCarat, setMaxCarat] = useState(20);
  const [maxPrice, setMaxPrice] = useState(100000);

  // Diamond filter states
  const [selectedDiamondCategory, setSelectedDiamondCategory] = useState("");
  const [diamondShapes, setDiamondShapes] = useState([]);

  // Currency
  const [currency, setCurrency] = useState("$");

  // Extract unique filter values when products load
  useEffect(() => {
    if (products && products.length > 0) {
      // Find max price and carat for ranges
      const maxProductPrice = Math.max(...products.map((p) => p.price || 0));
      const maxProductCarat = Math.max(...products.map((p) => p.carats || 0));
      
      setMaxPrice(maxProductPrice > 0 ? maxProductPrice : 100000);
      setMaxCarat(maxProductCarat > 0 ? maxProductCarat : 20);
      setGlobalPriceRange([0, maxProductPrice > 0 ? maxProductPrice : 100000]);
      setGlobalCaratRange([0, maxProductCarat > 0 ? maxProductCarat : 20]);

      // Extract unique values
      setUniqueDiamondTypes([
        ...new Set(products.filter((p) => p.shape || p.diamondType)
          .map((p) => p.shape || p.diamondType))
      ]);
      
      setUniqueMetals([
        ...new Set(products.filter((p) => p.metal).map((p) => p.metal))
      ]);
      
      setUniqueMetalColors([
        ...new Set(products.filter((p) => p.col || p.metalColor)
          .map((p) => p.col || p.metalColor))
      ]);
      
      const categoryIds = [...new Set(products.map((p) => p.category))];
      setUniqueCategories(categoryIds);
    }
  }, [products]);

  // Apply global filters to all product types
  useEffect(() => {
    if (products.length === 0) return;
    
    // Filter function for any product type
    const applyFilters = (productList) => {
      let filtered = [...productList];
      
      // Apply search filter
      if (globalSearchQuery) {
        filtered = filtered.filter((product) =>
          product.title?.toLowerCase().includes(globalSearchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (globalSelectedCategories.length > 0) {
        filtered = filtered.filter((product) =>
          globalSelectedCategories.includes(product.category)
        );
      }
      
      // Apply diamond type/shape filter
      if (globalDiamondTypes.length > 0) {
        filtered = filtered.filter((product) =>
          (product.shape && globalDiamondTypes.includes(product.shape)) ||
          (product.diamondType && globalDiamondTypes.includes(product.diamondType))
        );
      }
      
      // Apply metal filter
      if (globalMetals.length > 0) {
        filtered = filtered.filter((product) =>
          product.metal && globalMetals.includes(product.metal)
        );
      }
      
      // Apply metal color filter
      if (globalMetalColors.length > 0) {
        filtered = filtered.filter((product) =>
          (product.col && globalMetalColors.includes(product.col)) ||
          (product.metalColor && globalMetalColors.includes(product.metalColor))
        );
      }
      
      // Carat range filter
      filtered = filtered.filter((product) => {
        if (!product.carats) return true;
        const caratValue = parseFloat(product.carats);
        if (isNaN(caratValue)) return true;
        return caratValue >= globalCaratRange[0] && caratValue <= globalCaratRange[1];
      });
      
      // Price range filter
      filtered = filtered.filter((product) => {
        if (!product.price) return true;
        const priceValue = parseFloat(product.price);
        if (isNaN(priceValue)) return true;
        return priceValue >= globalPriceRange[0] && priceValue <= globalPriceRange[1];
      });
      
      // Apply sorting
      if (globalSortType === "low-high") {
        filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
      } else if (globalSortType === "high-low") {
        filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
      }
      
      return filtered;
    };
    
    // Apply filters to all product types
    setFilteredProducts({
      all: applyFilters(products),
      diamonds: applyFilters(diamondProducts),
      jewellery: applyFilters(jewelleryProducts),
      earrings: applyFilters(earrings),
      necklaces: applyFilters(necklaces),
      bracelets: applyFilters(bracelets),
    });
    
  }, [
    products,
    diamondProducts,
    jewelleryProducts,
    earrings,
    necklaces,
    bracelets,
    globalSearchQuery,
    globalSelectedCategories,
    globalDiamondTypes,
    globalMetals,
    globalMetalColors,
    globalCaratRange,
    globalPriceRange,
    globalSortType,
  ]);

  // Clear all global filters
  const clearGlobalFilters = () => {
    setGlobalSearchQuery("");
    setGlobalSelectedCategories([]);
    setGlobalDiamondTypes([]);
    setGlobalMetals([]);
    setGlobalMetalColors([]);
    setGlobalCaratRange([0, maxCarat]);
    setGlobalPriceRange([0, maxPrice]);
    setGlobalSortType("relevant");
  };

  // Toggle a filter value (add or remove)
  const toggleGlobalFilter = (value, currentArray, setterFunction) => {
    if (currentArray.includes(value)) {
      setterFunction(currentArray.filter(item => item !== value));
    } else {
      setterFunction([...currentArray, value]);
    }
  };

  // Update guest wishlist count
  useEffect(() => {
    if (guestWishlist.length > 0) {
      const count = guestWishlist.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setGuestWishlistCount(count);
    } else {
      setGuestWishlistCount(0);
    }

    localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
  }, [guestWishlist]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Get user data if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${backendUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          // If token is invalid, clear it
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }
    };

    fetchUser();
  }, [token, backendUrl]);

  // Add to wishlist (cart)
  const addToWishlist = async (productId, quantity) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/wishlist`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  };

  // Add item to wishlist (cart)
  const addItemToWishlist = async (productId, quantity) => {
    try {
      if (token) {
        // If logged in, add to server wishlist
        const updatedWishlist = await addToWishlist(productId, quantity);
        return updatedWishlist;
      } else {
        // If guest, add to local storage wishlist
        const existingItem = guestWishlist.find(
          (item) => item.productId === productId
        );

        if (existingItem) {
          // Update quantity if item exists
          setGuestWishlist((prev) =>
            prev.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          );
        } else {
          // Add new item
          setGuestWishlist((prev) => [...prev, { productId, quantity }]);
        }

        toast.success("Item added to cart");
        return guestWishlist;
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item to cart");
      throw error;
    }
  };

  // Add to favorites (wishlist)
  const addToFavorites = (productId) => {
    if (!favorites.includes(productId)) {
      setFavorites([...favorites, productId]);
    }
  };

  // Remove from favorites (wishlist)
  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter((id) => id !== productId));
  };

  // Check if product is in favorites
  const isInFavorites = (productId) => {
    return favorites.includes(productId);
  };

  // Login
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);

    // If there are guest items, merge them with user's wishlist
    if (guestWishlist.length > 0) {
      Promise.all(
        guestWishlist.map((item) =>
          addToWishlist(item.productId, item.quantity)
        )
      )
        .then(() => {
          // Clear guest wishlist after merging
          setGuestWishlist([]);
          toast.success("Your cart items have been saved to your account");
        })
        .catch((error) => {
          console.error("Error merging guest cart:", error);
        });
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      diamondProducts,
      diamondPagination,
      diamondLoading,
      fetchDiamondPage,
      jewelleryProducts,
      popularProducts,
      earrings,
      necklaces,
      bracelets,
      products,
      productsLoading,
      
      // Global filtered products
      filteredProducts,
      
      // Global filter states
      globalSearchQuery,
      setGlobalSearchQuery,
      globalSelectedCategories,
      setGlobalSelectedCategories,
      globalDiamondTypes,
      setGlobalDiamondTypes,
      globalMetals,
      setGlobalMetals,
      globalMetalColors,
      setGlobalMetalColors,
      globalCaratRange,
      setGlobalCaratRange,
      globalPriceRange,
      setGlobalPriceRange,
      globalSortType,
      setGlobalSortType,
      
      // Global filter metadata
      uniqueCategories,
      uniqueDiamondTypes,
      uniqueMetals,
      uniqueMetalColors,
      maxCarat,
      maxPrice,
      
      // Global filter functions
      clearGlobalFilters,
      toggleGlobalFilter,
      
      wishlist,
      wishlistItemsCount: token ? wishlistItemsCount : guestWishlistCount,
      wishlistLoading,
      token,
      user,
      login,
      logout,
      favorites,
      addToFavorites,
      removeFromFavorites,
      isInFavorites,
      currency,
      setCurrency,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      selectedDiamondCategory,
      setSelectedDiamondCategory,
      diamondShapes,
      setDiamondShapes,
      addItemToWishlist,
    }),
    [
      products,
      diamondProducts,
      diamondPagination,
      diamondLoading,
      fetchDiamondPage,
      jewelleryProducts,
      popularProducts,
      earrings,
      necklaces,
      bracelets,
      productsLoading,
      filteredProducts,
      globalSearchQuery,
      globalSelectedCategories,
      globalDiamondTypes,
      globalMetals,
      globalMetalColors,
      globalCaratRange,
      globalPriceRange,
      globalSortType,
      uniqueCategories,
      uniqueDiamondTypes,
      uniqueMetals,
      uniqueMetalColors,
      maxCarat,
      maxPrice,
      wishlist,
      wishlistItemsCount,
      guestWishlistCount,
      wishlistLoading,
      token,
      user,
      favorites,
      currency,
      search,
      showSearch,
      selectedDiamondCategory,
      diamondShapes,
    ]);

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
