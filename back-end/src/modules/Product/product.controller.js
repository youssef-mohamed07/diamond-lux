import { catchError } from "../../MiddleWares/CatchError.js";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../DB/models/product.schema.js";
import mongoose from "mongoose";

const AddProduct = catchError(async (req, res) => {
  if (req.files?.imageCover) {
    req.body.imageCover = req.files.imageCover[0].filename;
  }

  if (req.files?.images) {
    req.body.images = req.files.images.map((img) => img.filename);
  } else {
    req.body.images = [];
  }

  const product = new Product(req.body);
  await product.save();
  res.status(201).json({ message: "Created..", product });
});

const getProducts = catchError(async (req, res) => {
  const Products = await Product.find();
  res.status(200).json({ message: "All Products:..", Products });
});

const getProduct = catchError(async (req, res, next) => {
  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid product ID format", 400));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product Not Found", 404));
  }

  res.status(200).json({ message: "Product:", product });
});

const updateProduct = catchError(async (req, res, next) => {
  if (req.body.imageCover)
    req.body.imageCover = req.files.imageCover[0].filename;
  if (req.body.images)
    req.body.images = req.files.images.map((img) => img.filename);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  product || next(new AppError("product Not Found", 404));
  !product || res.status(200).json({ message: " Updated:..", product });
});

const deleteProduct = catchError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id, { new: true });
  product || next(new AppError("product Not Found", 404));
  !product || res.status(200).json({ message: " Deleted:..", product });
});

const getJewelryProducts = catchError(async (req, res, next) => {
  try {
    const jewelryProducts = await Product.find({
      productType: "jewelry",
    });
    res.status(200).json({ message: "Jewelry Products:", jewelryProducts });
  } catch (error) {
    next(error);
  }
});

const getBracelets = catchError(async (req, res, next) => {
  try {
    const bracelets = await Product.find({
      productType: "jewelry",
      jewelryType: "bracelet",
    });
    res.status(200).json({ message: "Bracelets:", bracelets });
  } catch (error) {
    next(error);
  }
});

const getNecklaces = catchError(async (req, res, next) => {
  try {
    const necklaces = await Product.find({
      productType: "jewelry",
      jewelryType: "necklace",
    });
    res.status(200).json({ message: "Necklaces:", necklaces });
  } catch (error) {
    next(error);
  }
});

export {
  AddProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getJewelryProducts,
  getBracelets,
  getNecklaces,
};
