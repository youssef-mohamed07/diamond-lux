import { Category } from "../../../DB/models/Category.schema.js";
import { catchError } from "../../MiddleWares/CatchError.js";
import { DIAMOND_CATEGORIES } from "../../utils/staticCategories.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// New endpoint to update a diamond shape image
const updateDiamondShapeImage = catchError(async (req, res, next) => {
  // Check if category exists in static categories
  const categoryId = req.params.id;
  const categoryIndex = DIAMOND_CATEGORIES.findIndex(
    (cat) => cat._id === categoryId
  );

  if (categoryIndex === -1) {
    return res
      .status(404)
      .json({ message: "Diamond shape category not found" });
  }

  // Get the uploaded file
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  const originalFilename = req.file.filename;
  const uploadPath = req.file.path;
  // Extract the file extension from the uploaded file
  const fileExtension = path.extname(originalFilename);

  // Define the new filename with the category ID and original extension
  const newFilename = `${categoryId}${fileExtension}`;

  // Get the uploads directory path
  const uploadDir = path.dirname(uploadPath);
  const newFilePath = path.join(uploadDir, newFilename);

  try {
    // Check if a file with the same name already exists, and remove it
    if (fs.existsSync(newFilePath) && uploadPath !== newFilePath) {
      fs.unlinkSync(newFilePath);
    }

    // Rename the uploaded file
    fs.renameSync(uploadPath, newFilePath);

    // Update the image path in the DIAMOND_CATEGORIES array for future requests
    DIAMOND_CATEGORIES[categoryIndex].image = newFilename;

    // Create an object to return with updated information
    const updatedCategory = {
      ...DIAMOND_CATEGORIES[categoryIndex],
    };

    res.status(200).json({
      message: "Diamond shape image updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    // If there's an error with file operations, return an error
    console.error("File operation error:", error);
    return res.status(500).json({
      message: "Failed to process the uploaded image",
      error: error.message,
    });
  }
});

export {
  AddCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  updateDiamondShapeImage,
};
