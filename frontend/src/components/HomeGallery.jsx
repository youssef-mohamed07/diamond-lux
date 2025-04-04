import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomeGallery = () => {
  // Diamond-focused gallery items
  const galleryItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      name: "Brilliant Solitaire",
      category: "Diamond Rings"
    },
  
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1589674781759-c21c37956a44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      name: "Radiant Cascade",
      category: "Diamond Necklaces"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      name: "Marquise Brilliance",
      category: "Diamond Pendants"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      name: "Princess Cut Elegance",
      category: "Diamond Earrings"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      name: "Diamond Tennis",
      category: "Diamond Bracelets"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight text-gray-900 leading-tight">
            Timeless <span className="font-semibold italic">Diamond</span> Collection
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-gray-300 via-gray-900 to-gray-300 mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg md:text-xl font-light">
            Where light meets perfection in each meticulously crafted piece, capturing moments that last forever.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.3 } 
              }}
              className="group relative bg-white rounded-xl overflow-hidden"
            >
              <div className="relative overflow-hidden rounded-xl aspect-square">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                
                {/* Diamond sparkle effect */}
                <div className="absolute top-6 right-6 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white animate-pulse">
                    <path d="M12 3L20 10L12 21L4 10L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M4 10H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 3V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-light text-white mb-2">{item.name}</h3>
                    <p className="text-gray-300 mb-6 text-sm uppercase tracking-wider">{item.category}</p>
                    <Link 
                      to="/products"
                      className="inline-block py-2 px-6 border border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-md text-sm uppercase tracking-wider text-white"
                    >
                      Discover
                    </Link>
                  </motion.div>
                </div>
              </div>
              
              {/* Item details for non-hover state */}
              <div className="p-6 group-hover:bg-gray-50 transition-colors duration-300">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-300">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link 
            to="/products" 
            className="inline-block py-4 px-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-full shadow-xl hover:shadow-2xl hover:translate-y-1 transition-all duration-300 group"
          >
            <span className="text-lg tracking-wide flex items-center font-light">
              View Complete Diamond Collection
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeGallery; 