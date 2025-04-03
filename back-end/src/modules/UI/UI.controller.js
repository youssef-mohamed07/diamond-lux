import { catchError } from "../../MiddleWares/CatchError.js";
import { AppError } from "../../utils/appError.js";
import { UI } from "../../../DB/models/UI.schema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to delete file
const deleteFile = (filename) => {
  try {
    const filePath = path.join(__dirname, "../../../uploads/ui", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

const addOrUpdateUIElement = catchError(async (req, res) => {
  const existingElement = await UI.findOne();

  if (existingElement) {
    // If there's a new file and an existing image, delete the old one
    if (req.file && existingElement.logoImage) {
      const oldFilename = existingElement.logoImage.split("/").pop(); // Get filename from URL
      deleteFile(oldFilename);
    }

    // Update with new data
    if (req.file) {
      req.body.logoImage = req.file.filename;
    }

    const updatedElement = await UI.findByIdAndUpdate(
      existingElement._id,
      req.body,
      { new: true }
    );

    if (updatedElement.logoImage) {
      updatedElement.logoImage = `${
        process.env.BACKEND_URL || "http://localhost:3000"
      }/uploads/ui/${updatedElement.logoImage}`;
    }
    return res
      .status(200)
      .json({ message: "UI Element Updated", uiElement: updatedElement });
  }

  // Create new element
  if (req.file) {
    req.body.logoImage = req.file.filename;
  }

  const uiElement = new UI(req.body);
  await uiElement.save();

  if (uiElement.logoImage) {
    uiElement.logoImage = `${
      process.env.BACKEND_URL || "http://localhost:3000"
    }/uploads/ui/${uiElement.logoImage}`;
  }

  res
    .status(201)
    .json({ message: "UI Element Created", uiElement, status: 200 });
});

const getUIElement = catchError(async (req, res) => {
  const uiElement = await UI.findOne();
  if (!uiElement) {
    return res.status(404).json({ message: "No UI Element Found" });
  }
  if (uiElement.logoImage) {
    uiElement.logoImage = `${
      process.env.BACKEND_URL || "http://localhost:3000"
    }/uploads/ui/${uiElement.logoImage}`;
  }
  res.status(200).json({ message: "UI Element", uiElement, status: 200 });
});

const updateUIElement = catchError(async (req, res, next) => {
  const uiElement = await UI.findById(req.params.id);

  if (!uiElement) {
    return next(new AppError("UI Element Not Found", 404));
  }

  // If there's a new file and an existing image, delete the old one
  if (req.file && uiElement.logoImage) {
    const oldFilename = uiElement.logoImage.split("/").pop(); // Get filename from URL
    deleteFile(oldFilename);
  }

  // Update with new data
  if (req.file) {
    req.body.logoImage = req.file.filename;
  }

  const updatedElement = await UI.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (updatedElement.logoImage) {
    updatedElement.logoImage = `${
      process.env.BACKEND_URL || "http://localhost:3000"
    }/uploads/ui/${updatedElement.logoImage}`;
  }

  res
    .status(200)
    .json({ message: "UI Element Updated", uiElement: updatedElement });
});

export { addOrUpdateUIElement, getUIElement, updateUIElement };
