import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("image only", false);
    }
  };
  const upload = multer({ storage, fileFilter });
  return upload;
};

export const uploadSinleFile = (fieldName, folderName) => {
  return fileUpload(folderName).single(fieldName);
};

export const uploadMixOFFiles = (arrayOfFields, folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, `../../uploads/${folderName}`);
      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "-"));
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload.fields(arrayOfFields);
};
