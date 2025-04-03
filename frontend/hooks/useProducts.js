import { useState, useEffect } from "react";
import { getProducts } from "../api/productApi";
import { toast } from "react-toastify";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.reverse());
        setPopularProducts(data.filter((item) => item.isPopular));
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, []);

  return { products };
};
