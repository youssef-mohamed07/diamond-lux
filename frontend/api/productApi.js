import axiosInstance from '../utils/axiosInstance';

export const getProducts = async () => {
    const response = await axiosInstance.get('/product');
    return response.data.Products; // Backend returns "Products"
};

export const getProductById = async (id) => {
    const response = await axiosInstance.get(`/product/${id}`);
    return response.data.product; // Backend returns "product"
};
