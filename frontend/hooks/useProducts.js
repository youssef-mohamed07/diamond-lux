import { useState, useEffect } from "react";
import {
  getDiamonds,
  getProducts,
  getEarrings,
  getNecklaces,
  getBracelets,
} from "../api/productApi";
import { toast } from "react-toastify";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [diamondProducts, setDiamondProducts] = useState([]);
  const [jewelleryProducts, setJewelleryProducts] = useState([]);
  const [earrings, setEarrings] = useState([]);
  const [necklaces, setNecklaces] = useState([]);
  const [bracelets, setBracelets] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.reverse());

        const diamondProducts = await getDiamonds();
        setDiamondProducts(diamondProducts.reverse());

        const earringProducts = await getEarrings();
        setEarrings(earringProducts.reverse());

        const necklaceProducts = await getNecklaces();
        setNecklaces(necklaceProducts.reverse());

        const braceletProducts = await getBracelets();
        setBracelets(braceletProducts.reverse());

        setPopularProducts(data.filter((item) => item.isPopular));
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    diamondProducts,
    jewelleryProducts,
    earrings,
    necklaces,
    bracelets,
    popularProducts,
  };
};
