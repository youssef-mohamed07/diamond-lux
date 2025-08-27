import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaDiamond, FaArrowRight } from "react-icons/fa6";
import { RiSparklingFill } from "react-icons/ri";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [homeData, setHomeData] = useState(null);
  const [heroTitle, setHeroTitle] = useState("Discover Timeless Elegance");
  const [heroSubtitle, setSubtitle] = useState(
    "Explore our exquisite collection of diamonds"
  );
  const [heroButtonText, setButtonText] = useState("Explore Collection");
  const [heroImages, setHeroImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/home`
        );

        if (!response.data || !response.data.home) {
          throw new Error("Invalid data format received from server");
        }

        const { home } = response.data;

        setHeroTitle(home.Title || "Discover Timeless Elegance");
        setSubtitle(
          home.subtitle || "Explore our exquisite collection of diamonds"
        );
        setButtonText(home.buttonText || "Explore Collection");
        setHeroImages(home.imagesCover || []);
        setHomeData(response.data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        setError("Failed to load hero content. Please try again later.");
        // Set default values in case of error
        setHeroTitle("Discover Timeless Elegance");
        setSubtitle("Explore our exquisite collection of diamonds");
        setButtonText("Explore Collection");
        setHeroImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Separate useEffect for image rotation
  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="relative h-[90vh] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative h-[90vh] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[90vh] w-full overflow-hidden"
    >
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        {heroImages.length > 0 ? (
          heroImages.map((image, index) => (
            <motion.div
              key={image}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentImage ? 1 : 0 
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut"
              }}
              className="absolute inset-0"
            >
              <img
                src={image}
                alt="Luxury Diamond"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        )}

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
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                opacity: [
                  Math.random() * 0.3 + 0.2,
                  Math.random() * 0.7 + 0.3,
                  Math.random() * 0.3 + 0.2,
                ],
                scale: [
                  Math.random() * 0.5 + 0.5,
                  Math.random() * 0.7 + 0.8,
                  Math.random() * 0.5 + 0.5,
                ],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <RiSparklingFill
                className="text-white/80"
                style={{ fontSize: `${Math.random() * 10 + 5}px` }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="absolute inset-0 z-30 flex items-center justify-center"
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-center">
          {/* Centered Content */}
          <div className="w-full max-w-4xl text-white space-y-6 sm:space-y-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 justify-center"
            >
              <div className="h-[1px] w-8 sm:w-12 bg-white/70"></div>
              <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm font-light">
                Luxury Collection
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-center"
            >
              {heroTitle.split(" ").map((word, i) => (
                <span key={i} className="inline-block">
                  {word} {i === 1 && <br className="hidden sm:block" />}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mx-auto text-center"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 sm:pt-4 justify-center"
            >
              <Link
                to="/products/diamond"
                className="group relative overflow-hidden bg-white px-6 sm:px-8 py-3 sm:py-4 text-black transition-all duration-300 ease-out hover:bg-opacity-90 hover:shadow-lg text-center sm:text-left"
              >
                <span className="relative z-10 flex items-center justify-center font-medium text-sm sm:text-base">
                  {heroButtonText}
                  <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex-col items-center xs:flex hidden"
      >
        <span className="text-white/80 text-sm mb-2 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/50 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-white/80 mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
