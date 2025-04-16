import axiosInstance from "../utils/axiosInstance";

export const getCategories = async () => {
  const response = await axiosInstance.get("/category");
  return response.data.categories; // Backend returns "categories"
};

export const getCategoryById = async (id) => {
  const response = await axiosInstance.get(`/category/${id}`);
  return response.data.category; // Backend returns "category"
};
