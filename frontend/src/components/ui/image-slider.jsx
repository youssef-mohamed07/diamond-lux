"use client";
import { cn } from "../../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    const loadPromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve(image);
        img.onerror = reject;
      });
    });

    Promise.all(loadPromises)
      .then((loadedImages) => {
        setLoadedImages(loadedImages);
      })
      .catch((error) => console.error("Failed to load images", error));
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // autoplay
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  const slideVariants = {
    initial: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8, // Smooth fade duration
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8, // Smooth fade duration
        ease: "easeInOut",
      },
    },
  };
  

  const areImagesLoaded = loadedImages.length > 0;

  return (
    (<div
      className={cn(
        "overflow-hidden h-full w-full relative flex items-center justify-center",
        className
      )}
      style={{
        perspective: "1000px",
      }}>
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && (
        <div className={cn("absolute inset-0 bg-black/5 z-40", overlayClassName)} />
      )}
      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="image h-full w-full absolute inset-0 object-cover object-center"
          />
        </AnimatePresence>
      )}
    </div>)
  );
};

ImagesSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
  overlay: PropTypes.bool,
  overlayClassName: PropTypes.string,
  className: PropTypes.string,
  autoplay: PropTypes.bool,
  direction: PropTypes.oneOf(['up', 'down'])
};
