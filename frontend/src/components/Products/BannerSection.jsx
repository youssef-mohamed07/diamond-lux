import { motion, AnimatePresence } from "framer-motion";

const BannerSection = ({ productsType }) => {
  let itemTypeText = "";

  switch (productsType) {
    case "diamond":
      itemTypeText = "Diamond";
      break;
    case "necklace":
      itemTypeText = "Necklace";
      break;
    case "earring":
      itemTypeText = "Earring";
      break;
    case "bracelet":
      itemTypeText = "Bracelet";
      break;
    case "engagement_rings":
      itemTypeText = "Engagement Ring";
      break;
    case "wedding_rings":
      itemTypeText = "Wedding Ring";
      break;
  }

  return (
    <div className="relative bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/products-hero-background.jpg"
          alt="Luxury jewelry collection"
          className="w-full h-full object-cover opacity-40"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="md:max-w-2xl lg:max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-16 bg-white/80"></div>
            <span className="uppercase tracking-[0.3em] text-sm font-light text-white/90">
              Luxury Collection
            </span>
          </div>
          <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl mb-8 tracking-tight">
            Our {itemTypeText} Collection
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl leading-relaxed">
            Discover our exquisite selection of premium {itemTypeText}, each
            piece crafted with exceptional artistry and precision for those who
            appreciate true luxury.
          </p>

          {/* Decorative element */}
          <div className="absolute -bottom-6 right-0 hidden lg:block">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-20"
            >
              <circle cx="80" cy="80" r="79.5" stroke="white" />
              <circle cx="80" cy="80" r="55.5" stroke="white" />
              <circle cx="80" cy="80" r="31.5" stroke="white" />
              <path d="M80 0V160" stroke="white" strokeWidth="0.5" />
              <path d="M160 80L0 80" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BannerSection;
