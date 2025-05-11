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
    const response = await axiosInstance.get("/wishlist", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { wishlist: { wishlistItems: [] } };
    }
    throw error;
  }
};

export const addToWishlist = async (productId, quantity = 1) => {
  try {
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
  } catch (error) {
    console.error("Add to wishlist error:", error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axiosInstance.delete(
      `/wishlist/item/${productId}/remove`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    throw error;
  }
};

export const clearWishlist = async () => {
  try {
    const response = await axiosInstance.delete("/wishlist", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Clear wishlist error:", error);
    throw error;
  }
};

export const updateWishlistItem = async (itemId, quantity) => {
  try {
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
  } catch (error) {
    console.error("Update wishlist item error:", error);
    throw error;
  }
};
