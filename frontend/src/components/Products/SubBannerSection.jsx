import React from "react";

const SubBannerSection = ({ productsType }) => {
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
  }
  return (
    <div className="flex flex-col mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Our {itemTypeText} Collection
      </h1>
      <p className="text-lg text-gray-600">
        Explore our curated selection of exquisite {itemTypeText}
      </p>
    </div>
  );
};

export default SubBannerSection;
