import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const schema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    imageCover: { type: String, required: true },
    images: [String],
    isPopular: { type: Boolean, default: false },
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
