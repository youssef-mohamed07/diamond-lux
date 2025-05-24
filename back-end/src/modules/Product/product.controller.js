import { catchError } from "../../MiddleWares/CatchError.js";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../DB/models/product.schema.js";
import mongoose from "mongoose";
import { buildJeweleryFilterQuery } from "./Jewelry/jewelery.utils.js";

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
  console.log(product);
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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const filterQuery = buildJeweleryFilterQuery(req.query);
    filterQuery.productType = "jewelry";

    let sortOptions = {};
    if (req.query.sort) {
      const [field, direction] = req.query.sort.split(":");
      sortOptions[field] = direction === "desc" ? -1 : 1;
    } else {
      sortOptions = { price: 1 };
    }

    const [totalProductsCount, products] = await Promise.all([
      Product.countDocuments(filterQuery),
      Product.aggregate([
        { $match: filterQuery },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: limit },
      ]).option({ allowDiskUse: true }),
    ]);

    const totalPages = Math.ceil(totalProductsCount / limit);

    if (page > totalPages && totalProductsCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Page number exceeded the max pages",
        totalPages,
        requestedPage: page,
      });
    }

    res.set({
      "X-Total-Count": totalProductsCount,
      "X-Total-Pages": totalPages,
      "X-Current-Page": page,
    });
    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalProductsCount,
      productsPerPage: limit,
      products,
    });
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
};
