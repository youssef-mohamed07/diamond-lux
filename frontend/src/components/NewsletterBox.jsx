import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CTAButton from "./ui/CTAButton";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <motion.div
      className="relative w-full md:w-3/4 lg:w-2/5 mx-auto my-12  overflow-hidden shadow-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background gradient element */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Request Your Diamond Quote
        </h2>

        <p className="text-base md:text-lg text-gray-300 mt-4 px-4 md:px-8 leading-relaxed">
          Let our diamond experts help you find the perfect gem for your special
          occasion
        </p>

        <div className="mt-8">
          <CTAButton
            buttonText="GET YOUR QUOTE"
            className="px-8 py-3 bg-white text-gray-900 font-bold rounded-md shadow-lg transition-all duration-300"
          />
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Expert consultation • Premium selection • Certificate of authenticity
        </p>
      </div>
    </motion.div>
  );
};

export default NewsletterBox;
