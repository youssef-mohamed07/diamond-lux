import { Router } from "express";
import {
  addOrUpdateUIElement,
  getUIElement,
  updateUIElement,
} from "./UI.controller.js";
import { uploadSinleFile } from "../../fileUpload/fileUpload.js";
import { addUIElementVal } from "./UI.validation.js";
import { Validate } from "../../MiddleWares/validate.js";
import adminAuth from "../../MiddleWares/adminAuth.js";
import { AppError } from "../../utils/appError.js";

const UIRouter = Router();

UIRouter.route("/")
  .post(
    adminAuth,
    uploadSinleFile("logoImage", "ui"),
    (req, res, next) => {
      if (!req.file) {
        return next(new AppError('"logoImage" is required', 400));
      }
      next();
    },
    Validate(addUIElementVal),
    addOrUpdateUIElement
  )
  .get(getUIElement);

UIRouter.route("/:id").patch(
  adminAuth,
  uploadSinleFile("logoImage", "ui"),
  Validate(addUIElementVal),
  updateUIElement
);

export default UIRouter;
