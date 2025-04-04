import React from "react";
import { motion } from "framer-motion";
import { FaGem, FaAward, FaLeaf, FaHandshake } from "react-icons/fa";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/about-hero-background.jpg" 
            alt="Luxury jewelry craftsmanship" 
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:max-w-2xl lg:max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-white/70"></div>
              <span className="uppercase tracking-[0.2em] text-sm font-light">Our Heritage</span>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6">About DiamondLux</h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Crafting exquisite jewelry with passion and precision since 1985. Discover the artistry and dedication behind our timeless collections.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto mt-4"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center">
              At DiamondLux, our mission is to create timeless jewelry that celebrates life's most precious moments. 
              We believe that every piece of jewelry tells a story, and we are dedicated to crafting pieces that 
              become cherished heirlooms passed down through generations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-lg shadow-sm text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaGem className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality</h3>
                <p className="text-gray-600">
                  We use only the finest materials and employ skilled artisans to create jewelry of exceptional quality.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-lg shadow-sm text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaAward className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our business, from design to customer service.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-lg shadow-sm text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaLeaf className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  We are committed to ethical sourcing and sustainable practices that respect our planet.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-lg shadow-sm text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaHandshake className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We conduct our business with honesty, transparency, and respect for all our stakeholders.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Collection - New Section with Background Image */}
      <div className="relative py-24 bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/collection-background.jpg" 
            alt="Luxury jewelry collection" 
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="md:w-2/3 lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Collection</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-white to-gray-400 mb-8"></div>
              <p className="text-lg text-gray-200 mb-8">
                Discover our exquisite collection of handcrafted jewelry, featuring rare diamonds and precious gemstones. Each piece is meticulously designed to capture the essence of luxury and timeless elegance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">Diamond Essentials</h3>
                  <p className="text-gray-300">
                    Classic diamond pieces that form the foundation of any sophisticated jewelry collection.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-3">Signature Series</h3>
                  <p className="text-gray-300">
                    Distinctive designs that showcase our unique artistic vision and exceptional craftsmanship.
                  </p>
                </div>
              </div>
              <a 
                href="/products" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-md shadow-sm text-base font-medium text-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                Explore Our Collection
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/images/about-workshop.jpg" 
                  alt="Jewelry workshop" 
                  className="rounded-lg shadow-md w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";
                  }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">From Humble Beginnings</h3>
                <p className="text-gray-600 mb-6">
                  DiamondLux was founded in 1985 by master jeweler Alexander Lux in a small workshop in New York City. 
                  With a passion for craftsmanship and an eye for detail, Alexander began creating custom pieces for 
                  a select clientele who appreciated his artistry and dedication to quality.
                </p>
                <p className="text-gray-600 mb-6">
                  As word of his exceptional work spread, the business grew, and Alexander brought on other skilled 
                  artisans who shared his vision. Together, they expanded the DiamondLux collection while maintaining 
                  the highest standards of craftsmanship.
                </p>
                <p className="text-gray-600">
                  Today, DiamondLux is recognized worldwide for its exquisite designs and impeccable quality. While we 
                  have grown beyond our humble beginnings, we remain true to Alexander's original vision: to create 
                  beautiful jewelry that captures the essence of life's most precious moments.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Experience the DiamondLux Difference</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Visit our showroom or browse our collection online to discover the perfect piece for your special moment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/products" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-900 bg-white hover:bg-gray-100"
              >
                Explore Collection
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-md shadow-sm text-base font-medium text-white hover:bg-white hover:text-gray-900"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
