import axiosInstance from "../utils/axios";

export const getProducts = async () => {
  const response = await axiosInstance.get("/product");
  return response.data.Products;
};

export const addProduct = async (formData, token) => {
  const response = await axiosInstance.post("/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.product;
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/category");
    return response.data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const updateProductIsPopular = async (id, isPopular, token) => {
  const response = await axiosInstance.put(
    `/product/${id}`,
    { isPopular },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.product;
};
