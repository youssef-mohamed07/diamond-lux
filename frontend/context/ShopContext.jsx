import { createContext, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useWishlist } from "../hooks/useWishlist";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const { products, categories } = useProducts();
  const {
    wishlist,
    addItemToWishlist,
    removeItemFromWishlist,
    clearAllWishlist,
    updateWishlistItem,
  } = useWishlist(token);

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
