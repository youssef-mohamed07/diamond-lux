import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBars, FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { ShopContext } from "../context/ShopContext";
import Logo from "./Logo";
import WishlistButton from "./ui/WishlistButton";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [showJewellery, setShowJewellery] = useState(false);
  const shopContext = useContext(ShopContext);

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

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: "easeOut",
      },
    }),
    exit: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const handleBack = () => {
    setShowJewellery(false);
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
          <div className="hidden md:flex items-center space-x-8 text-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "font-medium" : "font-normal"} ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-gray-200"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors duration-200 px-3 py-2 uppercase tracking-wider`
              }
            >
              Home
            </NavLink>

            {/* Collections Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCollections(!showCollections)}
                className={`${
                  isHomePage && !scrolled
                    ? "text-white hover:text-gray-200"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors duration-200 px-3 py-2 uppercase tracking-wider flex items-center gap-2`}
              >
                Collections
                <FaChevronDown
                  className={`text-sm transition-transform duration-300 ${
                    showCollections ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {showCollections && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute top-full left-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-md shadow-lg py-2 overflow-hidden"
                  >
                    {showJewellery ? (
                      <>
                        <motion.button
                          custom={0}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          onClick={handleBack}
                          className="w-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
                        >
                          <FaChevronLeft className="text-xs" />
                        </motion.button>
                        <div className="border-t border-white/10 my-1"></div>
                        <motion.div
                          custom={1}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/products/jewellery/earrings"
                            className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                            onClick={() => {
                              setShowCollections(false);
                              setShowJewellery(false);
                            }}
                          >
                            Earrings
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={2}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/products/jewellery/bracelets"
                            className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                            onClick={() => {
                              setShowCollections(false);
                              setShowJewellery(false);
                            }}
                          >
                            Bracelets
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={3}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/products/jewellery/necklaces"
                            className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                            onClick={() => {
                              setShowCollections(false);
                              setShowJewellery(false);
                            }}
                          >
                            Necklaces
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={3}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/products/jewellery/wedding-bands"
                            className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                            onClick={() => {
                              setShowCollections(false);
                              setShowJewellery(false);
                            }}
                          >
                            Wedding Bands
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={3}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/products/jewellery/engagement-rings"
                            className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                            onClick={() => {
                              setShowCollections(false);
                              setShowJewellery(false);
                            }}
                          >
                            Engagement Rings
                          </Link>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          custom={0}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/products/diamond"
                            className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
                            onClick={() => setShowCollections(false)}
                          >
                            Diamond
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={1}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <button
                            onClick={() => setShowJewellery(true)}
                            className="w-full text-left px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-between"
                          >
                            Jewellery
                            <FaChevronDown className="text-xs rotate-[-90deg] transition-transform duration-300" />
                          </button>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? "font-medium" : "font-normal"} ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-gray-200"
                    : "text-gray-700 hover:text-gray-900"
                } transition-colors duration-200 px-3 py-2 uppercase tracking-wider`
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
                } transition-colors duration-200 px-3 py-2 uppercase tracking-wider`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Right Section - Cart and Wishlist */}
          <div className="flex items-center space-x-6">
            <Link
              to="/wishlist"
              className={`${
                isHomePage && !scrolled
                  ? "text-white hover:text-gray-200"
                  : "text-gray-700 hover:text-gray-900"
              } transition-colors duration-200`}
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

      {/* Mobile menu */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden bg-black backdrop-blur-lg text-white overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link
                to="/"
                className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setVisible(false)}
              >
                Home
              </Link>

              {/* Mobile Collections Dropdown */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowCollections(!showCollections)}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-between"
                >
                  Collections
                  <FaChevronDown
                    className={`text-sm transition-transform duration-300 ${
                      showCollections ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {showCollections && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="pl-4 space-y-2"
                    >
                      {showJewellery ? (
                        <>
                          <motion.button
                            custom={0}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={handleBack}
                            className="w-full text-left py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                          >
                            <FaChevronLeft className="text-xs" />
                          </motion.button>
                          <div className="border-t border-white/10 my-1"></div>
                          <motion.div
                            custom={1}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Link
                              to="/products/jewellery/earrings"
                              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setVisible(false)}
                            >
                              Earrings
                            </Link>
                          </motion.div>
                          <motion.div
                            custom={2}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Link
                              to="/products/jewellery/bracelets"
                              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setVisible(false)}
                            >
                              Bracelets
                            </Link>
                          </motion.div>
                          <motion.div
                            custom={3}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Link
                              to="/products/jewellery/necklaces"
                              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setVisible(false)}
                            >
                              Necklaces
                            </Link>
                          </motion.div>
                          <motion.div
                            custom={4}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Link
                              to="/products/jewellery/wedding-bands"
                              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setVisible(false)}
                            >
                              Wedding Bands
                            </Link>
                          </motion.div>
                          <motion.div
                            custom={5}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Link
                              to="/products/jewellery/engagement-rings"
                              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setVisible(false)}
                            >
                              Engagement Rings
                            </Link>
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            custom={0}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Link
                              to="/products/diamond"
                              className="block py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                              onClick={() => setVisible(false)}
                            >
                              Diamond
                            </Link>
                          </motion.div>
                          <motion.div
                            custom={1}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <button
                              onClick={() => setShowJewellery(true)}
                              className="w-full text-left py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-between"
                            >
                              Jewellery
                              <FaChevronDown className="text-sm rotate-[-90deg] transition-transform duration-300" />
                            </button>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
