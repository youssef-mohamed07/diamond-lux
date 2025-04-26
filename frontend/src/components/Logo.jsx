import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUIContext } from "../context/UIContext";

const Logo = ({ scrolled = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { uiElement } = useUIContext();

  // Determine text color based on scroll state and page
  const textColor =
    isHomePage && !scrolled
      ? "text-white"
      : "text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-black";

  return (
    <Link to="/" className="flex items-center">
      <div className="flex items-center justify-center mr-2">
        {/* Logo Image */}
        {uiElement && (
          <img
            src={uiElement.logoImage}
            className={`h-12 w-auto `}
            alt="Company Logo"
          />
        )}
      </div>

      <span className={`text-xl tracking-tight ${textColor}`}>
        Diamond
        <span className="text-xl tracking-tight">&nbsp;Cartel</span>
      </span>
    </Link>
  );
};

export default Logo;
