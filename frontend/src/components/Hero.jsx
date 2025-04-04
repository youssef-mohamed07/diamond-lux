import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaDiamond, FaArrowRight } from "react-icons/fa6";
import { RiSparklingFill } from "react-icons/ri";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [heroData, setHeroData] = useState({
    images: [
      
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1469&auto=format&fit=crop",
    ],
    title: "Timeless Elegance, Exceptional Craftsmanship",
    description:
      "Discover our exquisite collection of diamond jewelry, where brilliance meets artistry. Each piece tells a story of luxury and sophistication.",
  });
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/hero`
        );
        setHeroData(response.data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        // Fallback data is already set in state
      }
    };

    fetchHeroData();
    
    // Image slider interval
    const interval = setInterval(() => {
      setCurrentImage(prev => 
        prev === (heroData.images.length - 1) ? 0 : prev + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroData.images.length]);

  return (
    <div ref={containerRef} className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          {heroData.images.map((image, index) => (
            index === currentImage && (
              <motion.div
                key={image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <img 
                  src={image} 
                  alt="Luxury Diamond" 
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10"></div>
        
        {/* Diamond particles */}
        <div className="absolute inset-0 z-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.2,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                opacity: [
                  Math.random() * 0.3 + 0.2, 
                  Math.random() * 0.7 + 0.3, 
                  Math.random() * 0.3 + 0.2
                ],
                scale: [
                  Math.random() * 0.5 + 0.5,
                  Math.random() * 0.7 + 0.8,
                  Math.random() * 0.5 + 0.5
                ]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <RiSparklingFill className="text-white/80" style={{ fontSize: `${Math.random() * 10 + 5}px` }} />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <motion.div 
        style={{ opacity, scale, y }}
        className="absolute inset-0 z-30 flex items-center justify-center"
      >
        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-white space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="h-[1px] w-8 sm:w-12 bg-white/70"></div>
              <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm font-light">Luxury Collection</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              {heroData.title.split(' ').map((word, i) => (
                <span key={i} className="inline-block">
                  {word}{' '}
                  {i === 1 && <br className="hidden sm:block" />}
                </span>
              ))}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed"
            >
              {heroData.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 sm:pt-4"
            >
              <Link 
                to="/products"
                className="group relative overflow-hidden rounded-full bg-white px-6 sm:px-8 py-3 sm:py-4 text-black transition-all duration-300 ease-out hover:bg-opacity-90 hover:shadow-lg text-center sm:text-left"
              >
                <span className="relative z-10 flex items-center justify-center font-medium text-sm sm:text-base">
                  Explore Collection
                  <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-gray-900 to-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/contact"
                className="group relative overflow-hidden rounded-full border border-white px-6 sm:px-8 py-3 sm:py-4 text-white transition-all duration-300 ease-out hover:bg-white/10 text-center sm:text-left"
              >
                <span className="relative z-10 flex items-center justify-center font-medium text-sm sm:text-base">
                  Book Consultation
                </span>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          </div>
          
          {/* Right Content - 3D Diamond */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block w-1/2 relative"
          >
            <div className="relative w-[500px] h-[500px] mx-auto">
              {/* Diamond glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
              
              {/* Diamond container */}
              <motion.div
                animate={{ 
                  rotateY: [0, 360],
                  rotateZ: [0, 15, 0, -15, 0],
                }}
                transition={{ 
                  rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                  rotateZ: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 flex items-center justify-center"
                style={{ perspective: "1000px" }}
              >
                {/* Diamond facets */}
                <div className="relative w-64 h-64">
                  <motion.div
                    animate={{ 
                      rotateX: [0, 360],
                      rotateZ: [0, -360],
                    }}
                    transition={{ 
                      duration: 25, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <FaDiamond className="text-white/90 text-[200px]" />
                  </motion.div>
                  
                  {/* Light reflections */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ 
                        opacity: [0, 0.8, 0],
                        scale: [0.8, 1.2, 0.8],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 4, 
                        delay: i * 0.8,
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    >
                      <div className="w-20 h-20 bg-white/30 rounded-full blur-md"></div>
                    </motion.div>
                  ))}
            </div>
              </motion.div>
              
              {/* Light rays */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 h-1 bg-white/20"
                  style={{ 
                    transformOrigin: "0 50%",
                    rotate: `${i * 45}deg`,
                    width: "150px"
                  }}
                  animate={{ 
                    opacity: [0.1, 0.5, 0.1],
                    width: ["150px", "200px", "150px"]
                  }}
                  transition={{ 
                    duration: 3, 
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center hidden xs:flex"
      >
        <span className="text-white/80 text-sm mb-2 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-white/80 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
