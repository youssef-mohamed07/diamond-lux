import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CTAButton from "./ui/CTAButton";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center w-[90%] md:w-[70%] lg:w-[35%] min-h-[200px] mx-auto items-center justify-center flex flex-col shadow-lg p-6 my-4 mt-24">
      <p className="text-xl md:text-2xl font-medium text-gray-800">
        Request a Quote Today!
      </p>
      <p className="text-sm md:text-base text-gray-500 mt-3 px-2 md:px-6">
        Provide your details, and we&apos;ll get back to you with a personalized
        quote tailored to your needs.
      </p>
      <CTAButton buttonText="REQUEST A QUOTE" />
    </div>
  );
};

export default NewsletterBox;
