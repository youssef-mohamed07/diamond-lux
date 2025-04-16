import { Category } from "../../../DB/models/Category.schema.js";
import { catchError } from "../../MiddleWares/CatchError.js";
import { DIAMOND_CATEGORIES } from "../../utils/staticCategories.js";

// This endpoint is no longer needed but kept for backward compatibility
// It will return static categories instead of allowing creation
const AddCategory = catchError(async (req, res, next) => {
  res.status(200).json({
    message: "Categories are static and cannot be added",
    categories: DIAMOND_CATEGORIES,
  });
});

const getAllCategory = catchError(async (req, res, next) => {
  // Return static categories instead of querying the database
  res
    .status(200)
    .json({ message: "Success..", categories: DIAMOND_CATEGORIES });
});

// This endpoint is no longer needed but kept for backward compatibility
// It will return the static category with the matching ID
const updateCategory = catchError(async (req, res, next) => {
  const category = DIAMOND_CATEGORIES.find((cat) => cat._id === req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res
    .status(200)
    .json({ message: "Categories are static and cannot be updated", category });
});

// This endpoint is no longer needed but kept for backward compatibility
// It will respond that categories cannot be deleted
const deleteCategory = catchError(async (req, res, next) => {
  res
    .status(200)
    .json({ message: "Categories are static and cannot be deleted" });
});

const getCategoryById = catchError(async (req, res, next) => {
  const category = DIAMOND_CATEGORIES.find((cat) => cat._id === req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ message: "Success..", category });
});

export {
  AddCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
