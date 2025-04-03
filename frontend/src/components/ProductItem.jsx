import { useContext } from "react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductItem = ({ _id, imageCover, images, title, price, loading = false }) => {
  const { currency } = useContext(ShopContext);

  const productImage = imageCover || (images && images[0]);

  if (loading) {
    return (
      <div className="text-gray-700">
        <div className="cursor-not-allowed">
          <div className="overflow-hidden max-w-[500px] max-h-[500px] bg-gray-100 rounded-lg">
            <div className="w-[300px] h-[300px] bg-gray-300 animate-pulse" />
          </div>
          <div className="pt-3 pb-1 h-5 w-4/5 bg-gray-300 animate-pulse mt-2"></div>
          <div className="h-5 w-1/4 bg-gray-300 animate-pulse mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link
        onClick={() => scrollTo(0, 0)}
        to={`/product/${_id}`}
        className="cursor-pointer block"
      >
        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-white shadow-md transition-all duration-300 group-hover:shadow-xl">
          <div className="relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-[300px] h-[300px] object-scale-down p-4"
              src={productImage}
              alt={title}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm font-bold text-gray-900">
                {currency}{price}
              </p>
              <span className="text-xs px-2 py-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Details
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

ProductItem.propTypes = {
  _id: PropTypes.string.isRequired,
  imageCover: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  loading: PropTypes.bool,
};

export default ProductItem;
