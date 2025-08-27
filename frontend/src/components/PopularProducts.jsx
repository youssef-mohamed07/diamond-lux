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

      <div className="mx-auto flex flex-wrap justify-center gap-4 gap-y-6">
        {popularProducts.map((item, index) => (
          <div className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] flex">
            <GalleryItem index={index} item={popularProducts[index]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
