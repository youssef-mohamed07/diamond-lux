import { assets } from "../assets/assets";
import { getUIElement } from "../../api/UIApi";
import { useState, useEffect } from "react";

const Footer = () => {
  const [logo, setLogo] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    getUIElement().then((data) => {
      setLogo(data.logoImage);
      setDescription(data.footer.description);
    });
  }, []);
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="flex py-[3rem] flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-[7rem] text-sm max-w-[90%] mx-auto">
        <div>
          <img src={logo} className="mb-5 w-48" alt="" />
          <div className="w-full md:w-2/3 text-lg text-gray-300" 
               dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        <div>
          <p className="text-2xl font-medium mb-5 border-b border-gray-600 pb-2">COMPANY</p>
          <ul className="flex flex-col gap-1 text-lg text-gray-300">
            <li className="hover:text-white transition-colors">
              <a href="/">Home</a>
            </li>
            <li className="hover:text-white transition-colors">
              <a href="/about">About us</a>
            </li>
            <li className="hover:text-white transition-colors">
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5 border-b border-gray-600 pb-2">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-lg text-gray-300">
            <li>951-807-4047</li>
            <li>elitefiestarentals@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr className="border-gray-700" />
        <p className="py-5 text-md text-center text-gray-400">
          Copyright 2025@ elitefiestarentals.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
