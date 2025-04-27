import { Router } from "express";
import {
  AddProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  getJewelryProducts,
} from "./product.controller.js";
import { uploadMixOFFiles } from "../../fileUpload/fileUpload.js";
import { AddProductVal } from "./product.validation.js";
import { Validate } from "../../MiddleWares/validate.js";

const ProductRouter = Router();

// Specific routes first
ProductRouter.get("/jewelery", getJewelryProducts);

// Generic routes after specific ones
ProductRouter.route("/")
  .post(
    uploadMixOFFiles(
      [
        { name: "imageCover", maxCount: 1 },
        { name: "images", maxCount: 6 },
      ],
      "product"
    ),
    Validate(AddProductVal),
    AddProduct
  )
  .get(getProducts);

ProductRouter.route("/:id([a-fA-F0-9]{24})")
  .get(getProduct)
  .put(
    uploadMixOFFiles(
      [
        { name: "imageCover", maxCount: 1 },
        { name: "images", maxCount: 6 },
      ],
      "product"
    ),
    updateProduct
  )
  .delete(deleteProduct);

export default ProductRouter;
