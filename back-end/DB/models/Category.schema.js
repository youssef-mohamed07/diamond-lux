import mongoose, { Schema, model } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Too Short']
  },
  image: {
    type: String,
    required: false, // Explicitly marking as not required (optional)
    default: null    // Optional: Set default to null
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true }
});

// Virtual Populate for 'Products'
schema.virtual('Products', {
  ref: "Product",
  localField: "_id",
  foreignField: "category"
});

// Auto-Populate 'Products' on find queries
schema.pre(/^find/, function () {
  this.populate('Products');
});

// Append Base URL to Image Path if 'image' exists
schema.post('init', function (doc) {
  if (doc.image) {
    doc.image = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/category/` + doc.image;
  }
});

export const Category = model('Category', schema);
