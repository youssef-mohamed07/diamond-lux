import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const schema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    category: {
      type: String,
      required: true,
    },
    imageCover: { type: String, required: true },
    images: [String],
    isPopular: { type: Boolean, default: false },

    // Product type (diamond or jewelry)
    productType: {
      type: String,
      enum: ["diamond", "jewelry"],
      required: true,
    },

    // Sub-category for jewelry (earrings, necklace, bracelet)
    jewelryType: {
      type: String,
      enum: ["earrings", "necklace", "bracelet"],
      required: function () {
        return this.productType === "jewelry";
      },
    },

    // Diamond-specific properties
    shape: {
      type: String,
      required: function () {
        return this.productType === "diamond";
      },
    },
    carats: Number,
    col: String, // color
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
    girdle: String,
    eyeClean: String,
    brown: String,
    green: String,
    milky: String,

    // Jewelry-specific properties
    diamondType: {
      type: String,
      enum: ["lab_grown", "natural"],
      required: function () {
        return this.productType === "jewelry";
      },
    },
    metal: {
      type: String,
      required: function () {
        return this.productType === "jewelry";
      },
    },
    metalColor: {
      type: String,
      required: function () {
        return this.productType === "jewelry";
      },
    },
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
      doc.imageCover = `${
        process.env.BACKEND_URL || "http://localhost:3000"
      }/uploads/product/${doc.imageCover}`;
    }
  }

  // Handle images array
  if (doc.images) {
    doc.images = doc.images.map((img) => {
      if (!isExternalUrl(img)) {
        return `${
          process.env.BACKEND_URL || "http://localhost:3000"
        }/uploads/product/${img}`;
      }
      return img;
    });
  }
});

export const Product = model("Product", schema);
