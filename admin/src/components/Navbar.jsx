import React from "react";
import { getUI } from "../api/UIApi";
import { useState, useEffect } from "react";

const Navbar = ({ setToken }) => {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    getUI().then((data) => {
      setLogo(data.logoImage);
    });
  }, []);
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[48px]" src={logo} alt="" />
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
