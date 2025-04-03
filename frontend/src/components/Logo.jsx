import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Logo = ({ scrolled = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Determine text color based on scroll state and page
  const textColor = (isHomePage && !scrolled) ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-black";

  return (
    <Link to="/" className="flex items-center">
      <svg 
        width="35" 
        height="40" 
        viewBox="0 0 35 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M29.4554 2.43478V0H35V22.4348C35 32.1358 27.165 40 17.5 40C8.24271 40 0.664262 32.7853 0.0413736 23.6522H0V0H5.54455V2.43478L14.901 2.43478V0H20.4455V2.43478L29.4554 2.43478ZM29.4554 22.4348V19.0202C28.8318 19.6656 28.1633 20.2785 27.4539 20.8558C25.1121 22.7615 22.3612 24.2503 19.369 25.2589C16.3764 26.2677 13.1833 26.7826 9.96797 26.7826H6.35343C8.08848 31.2608 12.425 34.4348 17.5 34.4348C24.1028 34.4348 29.4554 29.0622 29.4554 22.4348ZM15.4269 18.2435C14.3706 19.3674 13.18 20.3419 11.8852 21.1425C13.8545 20.9882 15.7827 20.5971 17.6038 19.9833C20.013 19.1712 22.1698 17.9913 23.9621 16.5329C25.7535 15.075 27.136 13.3757 28.0645 11.5515C28.6507 10.3998 29.0518 9.20727 29.2674 8H20.2671C20.0641 9.47968 19.6891 10.9319 19.1475 12.3231C18.2893 14.5274 17.0275 16.5405 15.4269 18.2435ZM5.54455 17.8146V8H14.6483C14.4948 8.78546 14.2724 9.55482 13.9832 10.2975C13.3786 11.8506 12.4962 13.2517 11.3938 14.4246C10.2918 15.5971 8.99228 16.518 7.57404 17.143C6.91535 17.4333 6.23601 17.6576 5.54455 17.8146Z" 
          fill={isHomePage && !scrolled ? "white" : "url(#logo-gradient)"}
        />
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="35" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#333333" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-serif font-bold text-xl tracking-tight ${textColor}`}>
        Diamond<span className={isHomePage && !scrolled ? "text-white font-extrabold" : "font-extrabold"}>Lux</span>
      </span>
    </Link>
  );
};

export default Logo; 