import axiosInstance from "../utils/axiosInstance";

export const sendWishlistEmail = async (formData) => {
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
    console.log("Making GET request to /wishlist");
    const response = await axiosInstance.get("/wishlist", {
      withCredentials: true,
    });
    console.log("GET /wishlist response:", response.data);
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
  console.log("Making POST request to /wishlist with:", { productId, quantity });
  const response = await axiosInstance.post(
    "/wishlist",
    {
      wishlistItems: [{ product: productId, quantity }],
    },
    {
      withCredentials: true,
    }
  );
  console.log("POST /wishlist response:", response.data);
  return response.data;
};

export const removeFromWishlist = async (itemId) => {
  try {
    console.log("Making DELETE request to /wishlist/item/", itemId);
    const response = await axiosInstance.delete(
      `/wishlist/item/${itemId}/remove`,
      {
        withCredentials: true,
      }
    );
    console.log("DELETE /wishlist/item response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Remove item error:", error);
    throw error;
  }
};

export const clearWishlist = async () => {
  console.log("Making DELETE request to /wishlist");
  const response = await axiosInstance.delete("/wishlist", {
    withCredentials: true,
  });
  console.log("DELETE /wishlist response:", response.data);
  return response.data;
};

export const updateWishlistItem = async (itemId, quantity) => {
  console.log("Making PUT request to /wishlist/item/", itemId, "with quantity:", quantity);
  const response = await axiosInstance.put(
    `/wishlist/item/${itemId}/update`,
    {
      quantity,
    },
    {
      withCredentials: true,
    }
  );
  console.log("PUT /wishlist/item response:", response.data);
  return response.data;
};
