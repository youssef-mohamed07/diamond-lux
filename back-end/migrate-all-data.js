import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";
import { DIAMOND_CATEGORIES } from "./src/utils/staticCategories.js";

dotenv.config();

// Configuration options
const BATCH_SIZE = 1000;
const CHUNK_SIZE = 1000;
const MAX_ITEMS = 10000;

// CSV file paths
const LAB_DIAMONDS_CSV = "./lab-diamond.csv";
const NATURAL_DIAMONDS_CSV = "./natural-diamond.csv";

// Enhanced logging function with timestamps and colors
function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[type]}${timestamp} - ${message}${colors.reset}`);
}

// Function to normalize shape names
function normalizeShapeName(csvShape) {
  if (!csvShape) return "round";

  const shapesMap = {};
  DIAMOND_CATEGORIES.forEach((category) => {
    shapesMap[category._id.toLowerCase()] = category._id;
  });

  const shapeMapping = {
    "CUSHION BRILLIANT": "cushion_brilliant",
    "CUSHION MODIFIED": "cushion_modified",
    "SQUARE EMERALD": "sq_emerald",
    "SQUARE RADIANT": "sq_radiant",
    "EUROPEAN CUT": "european_cut",
    "HALF MOON": "half_moon",
    "OLD MINER": "old_miner",
    ROSE: "rose_cut",
    TRIANGULAR: "triangular",
    "TAPERED BAGUETTE": "tapered_baguette",
    TRAPEZOID: "trapzoid",
    OTHER: "other",
    CUSHION: "cushion",
    SQUARE: "square",
    BULLET: "bullet",
    BRIOLETTE: "briolette",
    NONAGONAL: "nonagonal",
    HEPTAGONAL: "heptagonal",
    CALF: "calf",
  };

  const csvShapeUpper = csvShape.trim().toUpperCase();
  return (
    shapeMapping[csvShapeUpper] ||
    shapesMap[csvShapeUpper.toLowerCase()] ||
    "round"
  );
}

// Function to parse color values into color and fancy intensity
function parseColorValue(colorValue) {
  if (!colorValue) return { color: "N/A", fancyIntensity: null };

  // Handle regular D-Z colors
  if (/^[D-Z]$/.test(colorValue)) {
    return { color: colorValue, fancyIntensity: null };
  }

  // Handle fancy colors
  const fancyPattern =
    /^(Fancy\s+)?(Light|Very\s+Light|Intense|Deep|Vivid|Dark)?\s*([A-Za-z\s]+)$/i;
  const match = colorValue.match(fancyPattern);

  if (match) {
    const [_, isFancy, intensity, color] = match;
    return {
      color: color.trim(),
      fancyIntensity: intensity ? intensity.trim() : null,
    };
  }

  return { color: colorValue, fancyIntensity: null };
}

// Function to validate and clean product data
function validateProductData(item, type) {
  const shape = normalizeShapeName(item.shape);
  const { color, fancyIntensity } = parseColorValue(item.col);

  // Basic validation
  if (!item.carats || !item.col || !item.clar) {
    log(
      `Invalid product data: Missing required fields for ${
        item.stock_id || item.ID
      }`,
      "warning"
    );
    return null;
  }

  // Clean and format data
  return {
    // Basic product info
    title: `${shape || "Round"} ${
      type === "lab" ? "Lab" : "Natural"
    } Diamond - ${item.carats}ct ${item.col} ${item.clar}`,
    description: `Beautiful ${shape || "Round"} ${
      type === "lab" ? "Lab" : "Natural"
    } Diamond with ${item.carats} carats, ${item.col} color, and ${
      item.clar
    } clarity.`,
    price: parseFloat(item.price) || 0,
    category: shape || "round",
    imageCover: item.image || `https://placehold.co//300x300`,
    images: [
      item.image ||
        `https://placehold.co//300x300
        )}`,
    ],
    isPopular: false,

    // Product type
    productType: type === "lab" ? "lab_diamond" : "natural_diamond",

    // Diamond specific
    stockId: item.stock_id || item.ID,
    reportNo: item.ReportNo,
    shape: shape || "round",
    carats: parseFloat(item.carats) || 0,
    col: color, // Store the base color
    fancyIntensity: fancyIntensity, // Store the fancy intensity separately
    clar: item.clar || "N/A",
    cut: item.cut || "N/A",
    pol: item.pol || "N/A",
    symm: item.symm || "N/A",
    flo: item.flo || "NON",
    floCol: item.floCol || "",
    length: parseFloat(item.length) || 0,
    width: parseFloat(item.width) || 0,
    height: parseFloat(item.height) || 0,
    depth: parseFloat(item.depth) || 0,
    table: parseFloat(item.table) || 0,
    culet: item.culet || "",
    lab: item.lab || "",
    certificate_url: item.pdf || "",
    certificate_number: item.ReportNo || "",
    girdle: item.girdle || "",
    eyeClean: item.eyeClean || "",
    brown: item.brown === "Yes",
    green: item.green === "Yes",
    milky: item.milky === "Yes",
    pricePerCarat: parseFloat(item.price_per_carat) || 0,
    discount: parseFloat(item.discount) || 0,
    video: item.video || "",
    pdf: item.pdf || "",
    mineOfOrigin: item.mine_of_origin || "",
    canadaMarkEligible: item.canada_mark_eligible === "true",
    isReturnable: item.is_returnable === "Y",
    markupPrice: parseFloat(item.markup_price) || 0,
    markupCurrency: item.markup_currency || "USD",
  };
}

// Connect to MongoDB
async function connectToDatabase() {
  try {
    log("Attempting to connect to MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name",
      {
        serverSelectionTimeoutMS: 5000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
      }
    );
    log("Successfully connected to MongoDB", "success");
  } catch (err) {
    log(`Error connecting to MongoDB: ${err.message}`, "error");
    process.exit(1);
  }
}

// Process a batch of products
async function processBatch(batch, type) {
  try {
    const products = batch
      .map((item) => validateProductData(item, type))
      .filter((product) => product !== null);

    if (products.length === 0) {
      log("No valid products to insert", "warning");
      return;
    }

    // Insert products in smaller sub-batches
    const SUB_BATCH_SIZE = 10;
    for (let i = 0; i < products.length; i += SUB_BATCH_SIZE) {
      const subBatch = products.slice(i, i + SUB_BATCH_SIZE);
      try {
        await Product.insertMany(subBatch, { ordered: false });
        log(`Inserted ${subBatch.length} ${type} diamonds`, "success");
      } catch (error) {
        log(`Error inserting sub-batch: ${error.message}`, "error");
        if (error.writeErrors) {
          error.writeErrors.forEach((writeError) => {
            log(
              `Write error for document: ${JSON.stringify(writeError.err)}`,
              "error"
            );
          });
        }
      }
    }
  } catch (error) {
    log(`Error processing batch: ${error.message}`, "error");
  }
}

// Import diamonds from CSV
async function importDiamondsFromCSV(filePath, type) {
  log(`Starting import of ${type} diamonds from ${filePath}`);

  const fileStream = fs.createReadStream(filePath);
  const parser = fileStream.pipe(csv());

  let currentBatch = [];
  let totalProcessed = 0;

  try {
    for await (const record of parser) {
      if (totalProcessed >= MAX_ITEMS) {
        log(`Reached maximum limit of ${MAX_ITEMS} items for ${type} diamonds`);
        break;
      }

      currentBatch.push(record);
      totalProcessed++;

      if (currentBatch.length >= BATCH_SIZE) {
        await processBatch(currentBatch, type);
        log(`Processed ${totalProcessed} ${type} diamonds so far`);
        currentBatch = [];
      }
    }

    // Process remaining records
    if (currentBatch.length > 0) {
      await processBatch(currentBatch, type);
    }

    log(`Completed import of ${totalProcessed} ${type} diamonds`, "success");
  } catch (error) {
    log(`Error importing ${type} diamonds: ${error.message}`, "error");
    throw error;
  } finally {
    fileStream.destroy();
  }
}

// Main function
async function main() {
  try {
    await connectToDatabase();

    // Clear existing diamonds
    log("Clearing existing diamonds...");
    await Product.deleteMany({
      productType: { $in: ["lab_diamond", "natural_diamond"] },
    });
    log("Existing diamonds cleared");

    // Import diamonds
    await importDiamondsFromCSV(LAB_DIAMONDS_CSV, "lab");
    await importDiamondsFromCSV(NATURAL_DIAMONDS_CSV, "natural");

    await mongoose.disconnect();
    log("Database import completed successfully", "success");
  } catch (error) {
    log(`Error in main process: ${error.message}`, "error");
    process.exit(1);
  }
}

// Run the main function
main();
