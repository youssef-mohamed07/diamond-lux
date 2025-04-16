import axiosInstance from "../utils/axiosInstance";

export const sendWishlistEmail = async (formData) => {
  // 🔥 Auto-transform dynamic form fields
  const transformedData = {
    ...formData,
  };

  const response = await axiosInstance.post(
    "/wishlist/send-email",
    transformedData,
    { withCredentials: true }
  );

  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response.data?.message || "Failed to send email");
};

export const getWishlist = async () => {
  try {
    const response = await axiosInstance.get("/wishlist", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Wishlist API error:", error);
    if (error.response && error.response.status === 404) {
      return {
        wishlist: { wishlistItems: [], totalWishlistprice: 0 },
        message: "No wishlist found",
      };
    }
    throw error;
  }
};

export const addToWishlist = async (productId, quantity) => {
  await axiosInstance.post(
    "/wishlist",
    {
      wishlistItems: [{ product: productId, quantity }],
    },
    {
      withCredentials: true,
    }
  );
};

export const removeFromWishlist = async (itemId) => {
  try {
    const response = await axiosInstance.delete(
      `/wishlist/item/${itemId}/remove`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Remove item error:", error);
    throw error;
  }
};

export const clearWishlist = async () => {
  await axiosInstance.delete("/wishlist", {
    withCredentials: true,
  });
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
};
