import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUIElement } from "../../api/UIApi";

const Logo = ({ scrolled = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    getUIElement().then((data) => {
      setLogo(data.logoImage);
    });
  }, []);

  // Determine text color based on scroll state and page
  const textColor =
    isHomePage && !scrolled
      ? "text-white"
      : "text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-black";

  return (
    <Link to="/" className="flex items-center">
      <div className="flex items-center justify-center mr-2">
        {/* Logo Image */}
        <img src={logo} className={`h-12 w-auto `} alt="Company Logo" />
      </div>

      <span
        className={`font-serif font-bold text-xl tracking-tight ${textColor}`}
      >
        Diamond
        <span
          className={
            isHomePage && !scrolled
              ? "text-white font-extrabold"
              : "font-extrabold"
          }
        >
          &nbsp;Cartel
        </span>
      </span>
    </Link>
  );
};

export default Logo;
