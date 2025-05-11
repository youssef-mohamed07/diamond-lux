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
    updateWishlistItem,
  } = useWishlist(token);

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const value = {
    products,
    categories,
    wishlist,
    addItemToWishlist,
    removeItemFromWishlist,
    clearAllWishlist,
    updateWishlistItem,
    currency,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
