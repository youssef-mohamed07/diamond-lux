import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { bootstrap } from "./src/Bootstrap.js";
import { globalError } from "./src/MiddleWares/globalError.js";
import { AppError } from "./src/utils/appError.js";
import { dbConnection } from "./DB/db.connection.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Enable CORS globally
app.use(
  cors({
    origin: [
      "https://elitefiestarentals.com",
      "https://admin.elitefiestarentals.com",
      "http://54.218.35.96:5001",
      "http://localhost:5001",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Request-Headers",
      "token",
    ],
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

bootstrap(app);

app.use("*", (req, res, next) => {
  next(new AppError(`Route Not Found: ${req.originalUrl}`, 404));
});

app.use(globalError);

process.on("unhandledRejection", (err) => {
  console.log("Error:", err);
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
