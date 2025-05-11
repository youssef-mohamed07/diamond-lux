import { createContext, useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useWishlist } from "../hooks/useWishlist";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const [token, setToken] = useState(() => {
    // Initialize token from localStorage
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      // Ensure token is set in localStorage
      localStorage.setItem("token", savedToken);
      return savedToken;
    }
    return "";
  });

  const { products, categories } = useProducts();
  const {
    wishlist,
    addItemToWishlist,
    removeItemFromWishlist,
    clearAllWishlist,
    updateWishlistItemQuantity,
  } = useWishlist(token);

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Initialize guestWishlist in state
  const [guestWishlist, setGuestWishlist] = useState(() => {
    if (!token) {
      const savedGuestWishlist = localStorage.getItem("guestWishlist");
      return savedGuestWishlist ? JSON.parse(savedGuestWishlist) : [];
    }
    return [];
  });

  // Update localStorage when guestWishlist changes
  useEffect(() => {
    if (!token && guestWishlist.length > 0) {
      localStorage.setItem("guestWishlist", JSON.stringify(guestWishlist));
    }
  }, [guestWishlist, token]);

  const value = {
    products,
    categories,
    wishlist,
    guestWishlist,
    setGuestWishlist,
    addItemToWishlist,
    removeItemFromWishlist,
    clearAllWishlist,
    updateWishlistItem: updateWishlistItemQuantity,
    currency,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
