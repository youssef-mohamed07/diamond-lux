import { assets } from "../assets/assets";
import { getUIElement } from "../../api/UIApi";
import { useState, useEffect } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <img src={logo} className="h-12 w-auto" alt="Company Logo" />
            <p
              className="text-gray-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaPinterest className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FaPhone className="text-gray-400 h-4 w-4" />
                <span className="text-gray-300 text-sm">+1 437-361-4188</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-400 h-4 w-4" />
                <span className="text-gray-300 text-sm">
                  Diamondcartel07@gmail.com
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gray-400 h-4 w-4" />
                <span className="text-gray-300 text-sm">
                  55 Queen St, Torronto, ON, CA
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gray-400 h-4 w-4" />
                <span className="text-gray-300 text-sm">
                  47th St, New York, NY, USA
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-white">
              Newsletter
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Elite Fiesta Rentals. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
