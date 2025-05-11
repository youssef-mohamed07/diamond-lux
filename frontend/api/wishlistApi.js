import axiosInstance from "../utils/axiosInstance";

export const sendWishlistEmail = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/wishlist/send-email",
      formData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending wishlist email:", error);
    throw error;
  }
};

export const getWishlist = async () => {
  try {
<<<<<<< HEAD
    console.log("Fetching wishlist from API...");
    const response = await axiosInstance.get("/wishlist", {
      withCredentials: true,
    });
    console.log("Wishlist API response:", response.data);
=======
    const response = await axiosInstance.get("/wishlist", {
      withCredentials: true,
    });
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { wishlist: { wishlistItems: [] } };
    }
    throw error;
  }
};

<<<<<<< HEAD
export const addToWishlist = async (productId) => {
  try {
    console.log("Adding to wishlist:", productId);
    const response = await axiosInstance.post(
      "/wishlist",
      { productId },
      { withCredentials: true }
    );
    console.log("Add to wishlist API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Add to wishlist error:", error);
    throw error;
  }
=======
export const addToWishlist = async (productId, quantity) => {
  const response = await axiosInstance.post(
    "/wishlist",
    {
      wishlistItems: [{ product: productId, quantity }],
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
};

export const removeFromWishlist = async (productId) => {
  try {
<<<<<<< HEAD
    console.log("Removing from wishlist:", productId);
=======
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
    const response = await axiosInstance.delete(
      `/wishlist/item/${productId}/remove`,
      { withCredentials: true }
    );
<<<<<<< HEAD
    console.log("Remove from wishlist API response:", response.data);
=======
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearWishlist = async () => {
<<<<<<< HEAD
  try {
    console.log("Clearing wishlist");
    const response = await axiosInstance.delete("/wishlist/clear", {
      withCredentials: true
    });
    console.log("Clear wishlist API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Clear wishlist error:", error);
    throw error;
  }
};

export const updateWishlistItem = async (itemId, quantity) => {
  try {
    console.log("Updating wishlist item:", itemId, "quantity:", quantity);
    const response = await axiosInstance.patch(
      `/wishlist/item/${itemId}`,
      { quantity },
      { withCredentials: true }
    );
    console.log("Update wishlist item API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update wishlist item error:", error);
    throw error;
  }
=======
  const response = await axiosInstance.delete("/wishlist", {
    withCredentials: true,
  });
  return response.data;
};

export const updateWishlistItem = async (itemId, quantity) => {
  const response = await axiosInstance.put(
    `/wishlist/item/${itemId}/update`,
    {
      quantity,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
>>>>>>> 1f507461e4be5a265347551e65b251c30916c168
};
