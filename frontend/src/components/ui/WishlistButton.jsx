import React, { useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistButton = ({ className, isHomePage, scrolled }) => {
  const { favorites } = useContext(ShopContext);
  const count = favorites.length;

  // Determine text color based on page and scroll state
  const textColor = isHomePage && !scrolled ? 'text-white' : 'text-gray-700';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <FaHeart 
        className={`${count > 0 ? 'text-red-500' : textColor} transition-colors duration-200`} 
        style={{ width: '1.25rem', height: '1.25rem' }}
      />
      
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-[10px] font-medium rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-md"
          >
            {count > 99 ? '99+' : count}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistButton; 