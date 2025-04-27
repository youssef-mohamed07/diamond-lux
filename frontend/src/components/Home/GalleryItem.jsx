// components/GalleryItem.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  getImageUrl,
  DEFAULT_FALLBACK_IMAGE,
} from "../../../utils/imageHelper";

const GalleryItem = ({ item, index, price = false, productType }) => {
  const [imageError, setImageError] = useState(false);

  // Early return if item is null or undefined
  if (!item || !item._id) {
    return null;
  }

  return (
    <Link to={`/product/${item._id}`} className="group">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{
          y: -8,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transition: { duration: 0.3 },
        }}
        className="group relative bg-white overflow-hidden"
      >
        <div className="relative overflow-hidden aspect-square">
          <img
            src={
              imageError ? DEFAULT_FALLBACK_IMAGE : getImageUrl(item.imageCover)
            }
            alt={item.name || "Product"}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              setImageError(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

          {/* Diamond sparkle effect */}
          <div className="absolute top-6 right-6 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full text-white animate-pulse"
            >
              <path
                d="M12 3L20 10L12 21L4 10L12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 10H20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 3V21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-light text-white mb-2">
                {item.name}
              </h3>
              <p className="text-gray-300 mb-6 text-sm uppercase tracking-wider">
                {item.title}
              </p>
              <button className="inline-block py-2 px-6 border border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-md text-sm uppercase tracking-wider text-white">
                Discover
              </button>
            </motion.div>
          </div>
        </div>

        {/* Item details for non-hover state */}
        <div className="p-6 group-hover:bg-gray-50 transition-colors duration-300">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
            {item.title}
          </h3>
          {item.price && (
            <p className="text-gray-900 font-semibold mt-2">
              ${item.price.toLocaleString()}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default GalleryItem;
