import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const schema = new Schema(
  {
    // Basic product info
    title: String,
    description: String,
    price: Number,
    category: String,
    imageCover: String,
    images: [String],
    isPopular: { type: Boolean, default: false },

    // Product type
    productType: {
      type: String,
      enum: ["lab_diamond", "natural_diamond", "jewelry"],
      required: true,
    },

    // Jewelry specific
    jewelryType: {
      type: String,
      enum: ["earrings", "necklace", "bracelet","engagement_ring", "wedding_band"],
    },
    metal: String,
    metalColor: String,
    diamondType: {
      type: String,
      enum: ["lab_grown", "natural"],
    },

    // Diamond specific
    stockId: String,
    reportNo: String,
    shape: String,
    carats: Number,
    col: String, // color
    fancyIntensity: String, // fancy color intensity (Light, Very Light, Intense, Deep, Vivid, Dark)
    clar: String, // clarity
    cut: String,
    pol: String, // polish
    symm: String, // symmetry
    flo: String, // fluorescence
    floCol: String, // fluorescence color
    length: Number,
    width: Number,
    height: Number,
    depth: Number,
    table: Number,
    culet: String,
    lab: String,
    certificate_url: String,
    certificate_number: String,
    girdle: String,
    eyeClean: String,
    brown: Boolean,
    green: Boolean,
    milky: Boolean,
    pricePerCarat: Number,
    discount: Number,
    video: String,
    pdf: String,
    mineOfOrigin: String,
    canadaMarkEligible: Boolean,
    isReturnable: Boolean,
    markupPrice: Number,
    markupCurrency: String,
  },
  {
    versionKey: false,
  }
);

schema.post("init", function (doc) {
  const isExternalUrl = (url) => {
    return url && (url.startsWith("http://") || url.startsWith("https://"));
  };

  // Handle imageCover
  if (doc.imageCover) {
    if (!isExternalUrl(doc.imageCover)) {
      // Ensure no double slashes by removing trailing slash from base URL if needed
      const baseUrl = (process.env.BACKEND_URL).replace(/\/$/, "");
      // http://localhost:3000/uploads/product/
      doc.imageCover = `${baseUrl}/uploads/product/${doc.imageCover}`;
    }
  }

  // Handle images array
  if (doc.images) {
    // Ensure no double slashes by removing trailing slash from base URL if needed
    const baseUrl = (process.env.BACKEND_URL).replace(/\/$/, "");
    doc.images = doc.images.map((img) => {
      if (!isExternalUrl(img)) {
        return `${baseUrl}/uploads/product/${img}`;
      }
      return img;
    });
  }
});

export const Product = model("Product", schema);
