import { useState, useEffect } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  sendWishlistEmail,
  updateWishlistItem,
} from "../api/wishlistApi";
import { toast } from "react-toastify";

const emailWishlist = async (email) => {
  try {
    await sendWishlistEmail(email);
    toast.success("Wishlist sent to email!");
  } catch (error) {
    toast.error("Failed to send wishlist");
  }
};

export const useWishlist = (token) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getWishlist();
        setWishlist(response.wishlist);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const addItemToWishlist = async (productId, quantity = 1) => {
    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      await addToWishlist(productId, quantity);
      const response = await getWishlist();
      setWishlist(response.wishlist);
      return response.wishlist;
    } catch (error) {
      throw error;
    }
  };

  const removeItemFromWishlist = async (productId) => {
    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      await removeFromWishlist(productId);
      const response = await getWishlist();
      setWishlist(response.wishlist);
      return response.wishlist;
    } catch (error) {
      throw error;
    }
  };

  const clearAllWishlist = async () => {
    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      await clearWishlist();
      setWishlist({ wishlistItems: [], totalWishlistprice: 0 });
    } catch (error) {
      throw error;
    }
  };

  const updateWishlistItemQuantity = async (productId, quantity) => {
    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      await updateWishlistItem(productId, quantity);
      const response = await getWishlist();
      setWishlist(response.wishlist);
      return response.wishlist;
    } catch (error) {
      throw error;
    }
  };

  return {
    wishlist,
    loading,
    addItemToWishlist,
    removeItemFromWishlist,
    clearAllWishlist,
    updateWishlistItemQuantity,
  };
};
