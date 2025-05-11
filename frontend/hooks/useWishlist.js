import { useState, useEffect } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../api/wishlistApi";
import { toast } from "react-toastify";

export const useWishlist = (token) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
<<<<<<< HEAD
        console.log("No token, skipping wishlist fetch");
=======
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
        setLoading(false);
        return;
      }

      try {
<<<<<<< HEAD
        console.log("Fetching wishlist...");
        const response = await getWishlist();
        console.log("Wishlist response:", response);
        
        if (response && response.wishlist && response.wishlist.wishlistItems) {
          const items = response.wishlist.wishlistItems.map(item => item.product);
          console.log("Setting wishlist items:", items);
          setWishlist(items);
        } else {
          console.log("No wishlist items found in response");
          setWishlist([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
=======
        const response = await getWishlist();
        setWishlist(response.wishlist);
        setLoading(false);
      } catch (error) {
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

<<<<<<< HEAD
  const addItemToWishlist = async (productId) => {
    try {
      if (token) {
        console.log("Adding item to wishlist:", productId);
        const response = await addToWishlist(productId);
        console.log("Add to wishlist response:", response);
        
        if (response && response.wishlist && response.wishlist.wishlistItems) {
          const items = response.wishlist.wishlistItems.map(item => item.product);
          console.log("Setting wishlist items after add:", items);
          setWishlist(items);
        }
        toast.success("Item added to wishlist");
      }
      return wishlist;
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item to wishlist");
=======
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
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
      throw error;
    }
  };

  const removeItemFromWishlist = async (productId) => {
<<<<<<< HEAD
    try {
      if (token) {
        console.log("Removing item from wishlist:", productId);
        const response = await removeFromWishlist(productId);
        console.log("Remove from wishlist response:", response);
        
        if (response && response.wishlist && response.wishlist.wishlistItems) {
          const items = response.wishlist.wishlistItems.map(item => item.product);
          console.log("Setting wishlist items after remove:", items);
          setWishlist(items);
        }
        toast.success("Item removed from wishlist");
      }
      return wishlist;
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
=======
    if (!token) {
      throw new Error("User not authenticated");
    }

    try {
      await removeFromWishlist(productId);
      const response = await getWishlist();
      setWishlist(response.wishlist);
      return response.wishlist;
    } catch (error) {
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
      throw error;
    }
  };

  const clearAllWishlist = async () => {
<<<<<<< HEAD
    try {
      if (token) {
        console.log("Clearing wishlist");
        await clearWishlist();
        setWishlist([]);
        toast.success("Wishlist cleared");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
=======
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
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
      throw error;
    }
  };

  return {
    wishlist,
    loading,
    addItemToWishlist,
    removeItemFromWishlist,
    clearAllWishlist,
  };
};
