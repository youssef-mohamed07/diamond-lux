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

    // New fields from diamond data
    shape: String,
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
  },
  {
    versionKey: false,
  }
);

schema.post("init", function (doc) {
  if (doc.imageCover)
    doc.imageCover = `${
      process.env.BACKEND_URL || "http://localhost:3000"
    }/uploads/product/${doc.imageCover}`;
  if (doc.images)
    doc.images = doc.images.map(
      (img) =>
        `${
          process.env.BACKEND_URL || "http://localhost:3000"
        }/uploads/product/${img}`
    );
});

export const Product = model("Product", schema);
