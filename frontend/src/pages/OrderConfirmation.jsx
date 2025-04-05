import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight, FaGem } from "react-icons/fa";
import NewsletterBox from "../components/NewsletterBox";

const OrderConfirmation = () => {
  // Generate a random order number
  const orderNumber = `DL-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="bg-white pt-16 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8 sm:py-16"
        >
          <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 text-green-500">
            <FaCheckCircle className="w-full h-full" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Your order has been received and is being processed.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-8 mb-6 sm:mb-8 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Order Details
            </h2>
            <div className="border-t border-b border-gray-200 py-3 sm:py-4 mb-3 sm:mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base text-gray-600">
                  Order Number:
                </span>
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  {orderNumber}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base text-gray-600">
                  Date:
                </span>
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-gray-600">
                  Status:
                </span>
                <span className="text-sm sm:text-base font-medium text-green-600">
                  Confirmed
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              We've sent a confirmation email with all the details of your
              order. If you have any questions, please contact our customer
              service team.
            </p>

            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <FaGem className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-bold">
                  Diamond Cartel Premium Service
                </h3>
              </div>
              <p className="text-sm sm:text-base mb-3 sm:mb-4">
                Your exquisite jewelry will be carefully packaged in our
                signature gift box and delivered with the utmost care. Each
                piece includes a certificate of authenticity.
              </p>
              <p className="text-xs sm:text-sm">
                Estimated delivery: 3-5 business days
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700 transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              to="/contact"
              className="mt-3 sm:mt-0 inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-md text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-16">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            What Happens Next?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-gray-200 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  1
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                Order Processing
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our team will verify your order and prepare your items for
                shipment.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  2
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                Shipping
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your jewelry will be carefully packaged and shipped to your
                address.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  3
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                Delivery
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Receive your exquisite Diamond Cartel jewelry and enjoy your new
                piece.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-10 sm:py-16 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Join Our Community
            </h2>
            <p className="text-base sm:text-xl max-w-2xl mx-auto mb-6 sm:mb-8">
              Follow us on social media for styling tips, new collection
              announcements, and exclusive offers.
            </p>
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <span className="sr-only">Pinterest</span>
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default OrderConfirmation;
