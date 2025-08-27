import React, { useState, useEffect, useContext, useRef } from "react";

const SalesAdBar = () => {
    const [scrolled, setScrolled] = useState(false);

    const isHomePage = location.pathname === "/";

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

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 text-center py-2 ${
        scrolled
          ? "bg-white shadow-md"
          : isHomePage
          ? "bg-black/30 backdrop-blur-sm text-white"
          : "bg-white shadow-md"
      } transition-all duration-300`}>
      ENDS SOON! Receive up to $1,000+ in Jewelry Value With All Purchases. Use
      Code GIVEAWAY in Cart.
    </div>
  );
};

export default SalesAdBar;
