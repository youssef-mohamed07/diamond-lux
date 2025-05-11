import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import GalleryItem from "./Home/GalleryItem";

const PopularProducts = () => {
  const { products } = useContext(ShopContext);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    setPopularProducts(products.filter((item) => item.isPopular));
  }, [products]);

  return (
    <div className="my-10 max-w-[90%] mx-auto">
      <div className="text-center py-8 text-3xl">
        <Title text1={"POPULAR"} text2={"PRODUCTS"} />
      </div>

      <div className=" mx-auto grid grid-cols-2 align-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {popularProducts.map((item, index) => (
          <GalleryItem index={index} item={popularProducts[index]} />
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
