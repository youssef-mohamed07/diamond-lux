import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import GalleryItem from "./Home/GalleryItem";

const RelatedProducts = ({ category }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category]);

  return (
    <div className="my-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          Discover more exquisite pieces from our collection that complement
          your selection
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {related.length > 0 ? (
          related.map((item, index) => (
            <GalleryItem item={item} index={index} price={false} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No related products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

RelatedProducts.propTypes = {
  category: PropTypes.string.isRequired,
};

export default RelatedProducts;
