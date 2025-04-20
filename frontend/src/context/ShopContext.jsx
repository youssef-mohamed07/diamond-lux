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

  // Diamond filter states
  const [selectedDiamondCategory, setSelectedDiamondCategory] = useState("");
  const [diamondShapes, setDiamondShapes] = useState([]);

  // Currency
  const [currency, setCurrency] = useState("$");

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
      jewelleryProducts,
      popularProducts,
      earrings,
      necklaces,
      bracelets,
      products,
      productsLoading,
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
    }),
    [
      products,
      diamondProducts,
      jewelleryProducts,
      popularProducts,
      earrings,
      necklaces,
      bracelets,
      productsLoading,
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
    ]
  );

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
