import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CTAButton({ buttonText }) {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Link
      to="/contact"
      onClick={handleClick}
      className="mt-4 inline-flex h-12 animate-shimmer items-center justify-center bg-[linear-gradient(110deg,#878c91,45%,#518bed,45%,#000000)] bg-[length:200%_100%] px-6 text-slate-200 font-bold font-noto_sans focus:outline-none uppercase hover:opacity-80 transition-all max-[630px]:px-4 max-[630px]:h-10 max-[630px]:text-[0.9rem] max-[630px]:font-semibold"
    >
      {buttonText}
    </Link>
  );
}

export default CTAButton;
