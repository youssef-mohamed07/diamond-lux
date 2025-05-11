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
  } = useWishlist(token);

<<<<<<< HEAD
=======
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

>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
  const value = {
    products,
    categories,
    wishlist,
    guestWishlist,
    setGuestWishlist,
    addItemToWishlist,
    removeItemFromWishlist,
    clearAllWishlist,
    currency,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
