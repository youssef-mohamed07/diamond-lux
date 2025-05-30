import { createContext, useState, useEffect, useMemo } from "react";
import { useProducts } from "../../hooks/useProducts";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
  // Ensure backendUrl doesn't end with a slash
  const backendUrl = (
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

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
    engagementRings,
    weddingBands,
  } = useProducts();

  // Guest wishlist
  const [guestWishlist, setGuestWishlist] = useState(() => {
    const saved = localStorage.getItem("guestWishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate wishlist items count
  const wishlistItemsCount = guestWishlist.length;

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

  // Load all products when component mounts
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/product`);
        if (response.data && response.data.Products) {
          setFilteredProducts((prev) => ({
            ...prev,
            all: response.data.Products,
          }));
        }
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products. Please try again later.");
      }
    };

    loadAllProducts();
  }, [backendUrl]);

  // Save guest wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
  }, [guestWishlist]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

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
        ...new Set(
          products
            .filter((p) => p.shape || p.diamondType)
            .map((p) => p.shape || p.diamondType)
        ),
      ]);

      setUniqueMetals([
        ...new Set(products.filter((p) => p.metal).map((p) => p.metal)),
      ]);

      setUniqueMetalColors([
        ...new Set(
          products
            .filter((p) => p.col || p.metalColor)
            .map((p) => p.col || p.metalColor)
        ),
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
          globalSelectedCategories.some(category => 
            product.category?.toLowerCase() === category.toLowerCase()
          )
        );
      }

      // Apply diamond type/shape filter
      if (globalDiamondTypes.length > 0) {
        filtered = filtered.filter(
          (product) =>
            (product.shape && globalDiamondTypes.some(type => 
              product.shape.toLowerCase() === type.toLowerCase()
            )) ||
            (product.diamondType && globalDiamondTypes.some(type => 
              product.diamondType.toLowerCase() === type.toLowerCase()
            ))
        );
      }

      // Apply metal filter
      if (globalMetals.length > 0) {
        filtered = filtered.filter(
          (product) => product.metal && globalMetals.some(metal => 
            product.metal.toLowerCase() === metal.toLowerCase()
          )
        );
      }

      // Apply metal color filter
      if (globalMetalColors.length > 0) {
        filtered = filtered.filter(
          (product) =>
            (product.col && globalMetalColors.some(color => 
              product.col.toLowerCase() === color.toLowerCase()
            )) ||
            (product.metalColor && globalMetalColors.some(color => 
              product.metalColor.toLowerCase() === color.toLowerCase()
            ))
        );
      }

      // Carat range filter
      filtered = filtered.filter((product) => {
        if (!product.carats) return true;
        const caratValue = parseFloat(product.carats);
        if (isNaN(caratValue)) return true;
        return (
          caratValue >= globalCaratRange[0] && caratValue <= globalCaratRange[1]
        );
      });

      // Price range filter
      filtered = filtered.filter((product) => {
        if (!product.price) return true;
        const priceValue = parseFloat(product.price);
        if (isNaN(priceValue)) return true;
        return (
          priceValue >= globalPriceRange[0] && priceValue <= globalPriceRange[1]
        );
      });

      // Apply sorting
      if (globalSortType === "low-high") {
        filtered.sort(
          (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)
        );
      } else if (globalSortType === "high-low") {
        filtered.sort(
          (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)
        );
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
      setterFunction(currentArray.filter((item) => item !== value));
    } else {
      setterFunction([...currentArray, value]);
    }
  };

  // Add item to wishlist
  const addItemToWishlist = async (productId, quantity = 1) => {
    try {
      if (!isInWishlist(productId)) {
        setGuestWishlist([...guestWishlist, { productId, quantity }]);
      }
      toast.success("Item added to wishlist");
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item to wishlist");
    }
  };

  // Remove item from wishlist
  const removeItemFromWishlist = async (productId) => {
    try {
      setGuestWishlist(
        guestWishlist.filter((item) => item.productId !== productId)
      );
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  // Update wishlist item quantity
  const updateWishlistQuantity = async (productId, quantity) => {
    try {
      setGuestWishlist((prevWishlist) =>
        prevWishlist.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating wishlist quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      setGuestWishlist([]);
      toast.success("Wishlist cleared");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return guestWishlist.some((item) => item.productId === productId);
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
      products: filteredProducts.all, // Use the filtered products
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

      // Wishlist management
      guestWishlist,
      wishlistItemsCount,
      addItemToWishlist,
      removeItemFromWishlist,
      updateWishlistQuantity,
      clearWishlist,
      isInWishlist,

      // Favorites
      favorites,
      addToFavorites,
      removeFromFavorites,
      isInFavorites,

      // UI settings
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
      guestWishlist,
      wishlistItemsCount,
      favorites,
      currency,
      search,
      showSearch,
      selectedDiamondCategory,
      diamondShapes,
    ]
  );

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
