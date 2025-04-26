import axiosInstance from "../utils/axiosInstance";

export const getProducts = async () => {
  const response = await axiosInstance.get("/product");
  return response.data.Products; // Backend returns "Products"
};

export const getJewelry = async () => {
  const response = await axiosInstance.get("/product/jewellery");
  return response.data.jewelryProducts; // Backend returns "Products"
};

export const getEarrings = async () => {
  const response = await axiosInstance.get("/product/jewellery/earrings");
  return response.data.earrings; // Backend returns "Products"
};

export const getNecklaces = async () => {
  const response = await axiosInstance.get("/product/jewellery/necklaces");
  return response.data.necklaces; // Backend returns "Products"
};

export const getBracelets = async () => {
  const response = await axiosInstance.get("/product/jewellery/bracelets");
  return response.data.bracelets; // Backend returns "Products"
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/product/${id}`);
  return response.data.product; // Backend returns "product"
};
