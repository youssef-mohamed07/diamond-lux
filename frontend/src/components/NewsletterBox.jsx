import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CTAButton from "./ui/CTAButton";
import { FaFileInvoiceDollar, FaArrowRight } from "react-icons/fa";

const NewsletterBox = () => {
  const navigate = useNavigate();
  
  const handleQuoteRequest = () => {
    navigate('/request-quote');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-[95%] md:w-[85%] lg:w-[70%] max-w-4xl mx-auto mt-16 md:mt-24 mb-16 overflow-hidden rounded-xl shadow-xl"
    >
      <div className="relative bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-8 md:px-8 md:py-12">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full -ml-12 -mb-12 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0 md:mr-6 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center justify-center md:justify-start mb-2"
            >
              <FaFileInvoiceDollar className="text-gray-800 mr-2 text-xl" />
              <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">Free Quote</span>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
            >
              Request a Quote Today!
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-600 text-sm md:text-base"
            >
              Provide your details, and we'll get back to you with a personalized quote tailored to your needs.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="w-full md:w-auto"
          >
            <button
              onClick={handleQuoteRequest}
              className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 md:px-8 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              REQUEST A QUOTE
              <FaArrowRight className="ml-2" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsletterBox;
