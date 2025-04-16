import { Category } from "../../../DB/models/Category.schema.js";
import { catchError } from "../../MiddleWares/CatchError.js";
import { DIAMOND_CATEGORIES } from "../../utils/staticCategories.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  const categoryIndex = DIAMOND_CATEGORIES.findIndex(cat => cat._id === categoryId);
  
  if (categoryIndex === -1) {
    return res.status(404).json({ message: "Diamond shape category not found" });
  }
  
  // Get the uploaded file
  if (!req.file) {
    return res.status(400).json({ message: "No image file uploaded" });
  }
  
  // Ensure the filename ends with .webp
  const originalFilename = req.file.filename;
  const fileExtension = path.extname(originalFilename).toLowerCase();
  
  let imagePath = originalFilename;
  
  // If the file is not already .webp, we'll need to handle conversion or rename
  // For now, we're just renaming the file to ensure consistent naming in our references
  if (fileExtension !== '.webp') {
    // Strip the extension and add .webp
    const filenameWithoutExt = path.parse(originalFilename).name;
    const newFilename = `${filenameWithoutExt}.webp`;
    const originalPath = path.join(__dirname, '../../../uploads/diamond-shapes', originalFilename);
    const newPath = path.join(__dirname, '../../../uploads/diamond-shapes', newFilename);
    
    try {
      // Rename the file
      fs.renameSync(originalPath, newPath);
      imagePath = newFilename;
    } catch (error) {
      console.error('Error renaming file:', error);
      // If rename fails, keep the original filename
      imagePath = originalFilename;
    }
  }
  
  // Create an object to return with updated information
  const updatedCategory = {
    ...DIAMOND_CATEGORIES[categoryIndex],
    image: imagePath
  };
  
  res.status(200).json({
    message: "Diamond shape image updated successfully",
    category: updatedCategory
  });
});

export {
  AddCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  updateDiamondShapeImage
};
