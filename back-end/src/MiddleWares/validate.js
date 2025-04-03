import { AppError } from "../utils/appError.js";

export const Validate = (schema) => {
  return (req, res, next) => {
    // Only include req.body in the validation object
    const validationObject = { ...req.body };
    // Remove 'id' from validationObject if it's not part of the schema
    if (!schema.describe().keys.id) {
      delete validationObject.id;
    }

    // Handle file uploads based on schema
    if (schema.describe().keys.logo) {
      validationObject.logo = req.file;
    } else if (schema.describe().keys.image) {
      validationObject.image = req.file;
    } else if (schema.describe().keys.imageCover) {
      validationObject.imageCover = req.files;
    } else if (schema.describe().keys.images) {
      validationObject.images = req.files;
    }

    // For UI module, skip params validation
    if (req.originalUrl.includes("/ui/")) {
      Object.assign(validationObject, { ...req.params, ...req.query });
    }

    const { error } = schema.validate(validationObject, { abortEarly: true });
    if (!error) {
      // Check if file is present when required
      if (schema.describe().keys.logoImage && !req.file) {
        return next(new AppError('"logoImage" is required', 400));
      }
      next();
    } else {
      let errMsgs = error.details.map((err) => err.message);
      next(new AppError(errMsgs, 401));
    }
  };
};
