import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaSearch, FaGem } from "react-icons/fa";
import NewsletterBox from "../components/NewsletterBox";

const NotFound = () => {
  return (
    <div className="bg-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
            <FaGem className="w-full h-full" />
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Looking for something specific?
            </h2>
            <p className="text-gray-700 mb-6">
              You might find what you're looking for in one of these sections:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link
                to="/products/diamond"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-3 rounded-full mr-4">
                  <FaSearch className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Browse Products</h3>
                  <p className="text-sm text-gray-500">
                    Explore our exquisite jewelry collection
                  </p>
                </div>
              </Link>

              <Link
                to="/contact"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-3 rounded-full mr-4">
                  <FaSearch className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Contact Us</h3>
                  <p className="text-sm text-gray-500">
                    Get in touch with our customer service team
                  </p>
                </div>
              </Link>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700 transition-all"
            >
              <FaHome className="mr-2" />
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6">Discover Diamond Cartel</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Explore our collection of exquisite jewelry pieces, crafted with
              precision and elegance.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-colors"
            >
              Browse Collection
            </Link>
          </motion.div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default NotFound;
