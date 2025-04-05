import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBars } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { ShopContext } from "../context/ShopContext";
import Logo from "./Logo";
import WishlistButton from "./ui/WishlistButton";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useContext(ShopContext);

  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setVisible(false);
  }, [location]);

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled
          ? "bg-white shadow-md"
          : isHomePage
          ? "bg-black/30 backdrop-blur-sm"
          : "bg-white shadow-md"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo scrolled={scrolled} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-md ">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "font-medium" : "font-normal"} ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-gray-200"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors duration-200 px-3 py-2  uppercase tracking-wider`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${isActive ? "font-medium" : "font-normal"} ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-gray-200"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors duration-200 px-3 py-2  uppercase tracking-wider`
              }
            >
              Collections
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? "font-medium" : "font-normal"} ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-gray-200"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors duration-200 px-3 py-2  uppercase tracking-wider`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${isActive ? "font-medium" : "font-normal"} ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-gray-200"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors duration-200 px-3 py-2  uppercase tracking-wider`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Wishlist link */}
            <div className="relative">
              <Link
                to="/wishlist"
                className={`relative p-2 rounded-full ${
                  isHomePage && !scrolled
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                aria-label="Wishlist"
              >
                <WishlistButton isHomePage={isHomePage} scrolled={scrolled} />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setVisible(!visible)}
                className={`p-2 rounded-full ${
                  isHomePage && !scrolled
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                aria-label={visible ? "Close menu" : "Open menu"}
              >
                {visible ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden bg-black backdrop-blur-lg  text-white overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link
                to="/"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setVisible(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setVisible(false)}
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setVisible(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setVisible(false)}
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
