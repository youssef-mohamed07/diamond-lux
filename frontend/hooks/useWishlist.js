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
        console.log("No token available, skipping wishlist fetch");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching wishlist...");
        const response = await getWishlist();
        console.log("Wishlist response:", response);
        setWishlist(response.wishlist);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const addItemToWishlist = async (productId, quantity = 1) => {
    if (!token) {
      console.log("No token available, cannot add to wishlist");
      throw new Error("User not authenticated");
    }

    try {
      console.log("Adding item to wishlist:", { productId, quantity });
      await addToWishlist(productId, quantity);
      console.log("Item added successfully, fetching updated wishlist");
      const response = await getWishlist();
      console.log("Updated wishlist response:", response);
      setWishlist(response.wishlist);
      return response.wishlist;
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      throw error;
    }
  };

  const removeItemFromWishlist = async (productId) => {
    if (!token) {
      console.log("No token available, cannot remove from wishlist");
      throw new Error("User not authenticated");
    }

    try {
      console.log("Removing item from wishlist:", productId);
      await removeFromWishlist(productId);
      console.log("Item removed successfully, fetching updated wishlist");
      const response = await getWishlist();
      console.log("Updated wishlist response:", response);
      setWishlist(response.wishlist);
      return response.wishlist;
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      throw error;
    }
  };

  const clearAllWishlist = async () => {
    if (!token) {
      console.log("No token available, cannot clear wishlist");
      throw new Error("User not authenticated");
    }

    try {
      console.log("Clearing wishlist");
      await clearWishlist();
      setWishlist({ wishlistItems: [], totalWishlistprice: 0 });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      throw error;
    }
  };

  const updateWishlistItemQuantity = async (productId, quantity) => {
    if (!token) {
      console.log("No token available, cannot update wishlist item");
      throw new Error("User not authenticated");
    }

    try {
      console.log("Updating wishlist item quantity:", { productId, quantity });
      await updateWishlistItem(productId, quantity);
      console.log("Quantity updated successfully, fetching updated wishlist");
      const response = await getWishlist();
      console.log("Updated wishlist response:", response);
      setWishlist(response.wishlist);
      return response.wishlist;
    } catch (error) {
      console.error("Error updating wishlist item quantity:", error);
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
