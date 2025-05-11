import React, { useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { ShopContext } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

const WishlistButton = ({ className, isHomePage, scrolled }) => {
  const { wishlist, guestWishlist, token } = useContext(ShopContext);
  const count = token ? wishlist.length : guestWishlist.length;

  // Determine text color based on page and scroll state
  const textColor = isHomePage && !scrolled ? "text-white" : "text-gray-700";

  return (
    <div
      className={`relative inline-flex items-center justify-center text-center align-middle ${className}`}
    >
      <FaHeart
        className={`${
          count > 0 ? "text-red-500" : textColor
        } transition-colors duration-200 text-center text-xl`}
      />

      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
          >
            {count > 99 ? "99+" : count}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistButton;
