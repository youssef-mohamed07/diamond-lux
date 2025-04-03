import { catchError } from "../../MiddleWares/CatchError.js";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../DB/models/product.schema.js";

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
  const product = await Product.findById(req.params.id);
  product || next(new AppError("product Not Found", 404));
  !product || res.status(200).json({ message: " product:..", product });
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

export { AddProduct, getProducts, getProduct, updateProduct, deleteProduct };
