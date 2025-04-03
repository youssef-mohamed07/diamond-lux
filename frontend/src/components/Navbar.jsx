import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaHeart, FaSearch, FaTimes, FaBars } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import Logo from "./Logo";
import WishlistButton from './ui/WishlistButton';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { 
    token, 
    user, 
    logout, 
    favorites,
    search,
    setSearch,
    showSearch,
    setShowSearch
  } = useContext(ShopContext);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const authDropdownRef = useRef(null);
  
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

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle clicks outside of auth dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAuthDropdown && authDropdownRef.current && !authDropdownRef.current.contains(event.target)) {
        setShowAuthDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAuthDropdown]);

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close mobile menu when route changes
  useEffect(() => {
    setVisible(false);
    setShowSearch(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setShowSearch(false);
      navigate('/products');
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // Reset search when opening
      setSearch("");
    }
  };

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto", 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      } 
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const searchOverlayVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.95,
      transition: { 
        duration: 0.15,
        ease: "easeIn"
      }
    }
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
      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={searchOverlayVariants}
            className="absolute inset-0 bg-white z-10 p-4"
          >
            <div className="max-w-7xl mx-auto flex items-center h-full">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative w-full">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for exquisite jewelry..."
                    className="w-full py-3 pl-12 pr-10 border-b-2 border-gray-300 focus:border-gray-900 outline-none text-lg bg-transparent"
                  />
                  <FaSearch className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label="Close search"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo scrolled={scrolled} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) => `${
                isActive ? 'font-medium' : 'font-normal'
              } ${
                isHomePage && !scrolled ? "text-white hover:text-gray-200" : "text-gray-700 hover:text-gray-900"
              } transition-colors duration-200 px-3 py-2 text-sm uppercase tracking-wider`}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `${
                isActive ? 'font-medium' : 'font-normal'
              } ${
                isHomePage && !scrolled ? "text-white hover:text-gray-200" : "text-gray-700 hover:text-gray-900"
              } transition-colors duration-200 px-3 py-2 text-sm uppercase tracking-wider`}
            >
              Collection
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `${
                isActive ? 'font-medium' : 'font-normal'
              } ${
                isHomePage && !scrolled ? "text-white hover:text-gray-200" : "text-gray-700 hover:text-gray-900"
              } transition-colors duration-200 px-3 py-2 text-sm uppercase tracking-wider`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `${
                isActive ? 'font-medium' : 'font-normal'
              } ${
                isHomePage && !scrolled ? "text-white hover:text-gray-200" : "text-gray-700 hover:text-gray-900"
              } transition-colors duration-200 px-3 py-2 text-sm uppercase tracking-wider`}
            >
              Contact
            </NavLink>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Search button */}
            <button
              onClick={toggleSearch}
              className={`p-2 rounded-full ${
                isHomePage && !scrolled 
                  ? "text-white hover:bg-white/10" 
                  : "text-gray-700 hover:bg-gray-100"
              } transition-colors`}
              aria-label="Search"
            >
              <FaSearch className="h-5 w-5" />
            </button>
            
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
            
            {/* User account */}
            <div className="relative" ref={authDropdownRef}>
              <button
                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                className={`p-2 rounded-full ${
                  isHomePage && !scrolled 
                    ? "text-white hover:bg-white/10" 
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                aria-label="Account"
              >
                <FaUser className="h-5 w-5" />
              </button>
              
              <AnimatePresence>
                {showAuthDropdown && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 origin-top-right"
                  >
                    {token ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          Hello, <span className="font-medium">{user?.name || 'User'}</span>
                        </div>
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          My Profile
                        </Link>
                        <Link 
                          to="/wishlist" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          My Wishlist
                        </Link>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            logout();
                            setShowAuthDropdown(false);
                          }}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          Sign In
                        </Link>
                        <Link 
                          to="/register" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
            className="md:hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden"
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
                Collection
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
              
              <div className="pt-4 mt-4 border-t border-gray-700">
                <div className="px-4 py-2 text-sm text-gray-300 uppercase tracking-wider">Account</div>
                <div className="mt-2 space-y-2">
                  {token ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-300 bg-white/5 rounded-lg">
                        Hello, {user?.name || 'User'}
                      </div>
                      <Link 
                        to="/profile" 
                        className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setVisible(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setVisible(false)}
                      >
                        Wishlist
                      </Link>
                      <button 
                        className="block w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => {
                          logout();
                          setVisible(false);
                        }}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setVisible(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setVisible(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
