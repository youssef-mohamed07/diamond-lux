import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import { Product } from "./DB/models/product.schema.js"; // Update with your actual model file path
import dotenv from "dotenv";
import { DIAMOND_CATEGORIES } from "./src/utils/staticCategories.js"; // Import shape categories

dotenv.config();

// Configuration options
const IMPORT_ALL_RECORDS = false; // Set to true to import all records, false to import a random subset
const SUBSET_SIZE = 2000; // Number of records to import when not importing all
const BATCH_SIZE = 500; // Increased batch size for faster imports
const PARALLEL_BATCHES = 2; // Number of batches to process in parallel

// Enhanced logging function with timestamps
function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  const colors = {
    info: "\x1b[36m", // Cyan
    success: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    reset: "\x1b[0m", // Reset
  };
  console.log(`${colors[type]}${timestamp} - ${message}${colors.reset}`);
}

// Shuffle helper for selecting random 1,000 records
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to normalize shape names from CSV to match staticCategories format
function normalizeShapeName(csvShape) {
  if (!csvShape) return null;

  // Convert shape to lowercase and create a map for easier searching
  const shapesMap = {};
  DIAMOND_CATEGORIES.forEach((category) => {
    shapesMap[category._id.toLowerCase()] = category._id;
  });

  // Handle specific shape mappings
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

  // Check for direct mapping first
  if (shapeMapping[csvShapeUpper]) {
    return shapeMapping[csvShapeUpper];
  }

  // Convert to standard format (lowercase single word)
  const standardShape = csvShapeUpper.toLowerCase().replace(/\s+/g, "_");

  // Check if it exists in our categories
  if (shapesMap[standardShape]) {
    return shapesMap[standardShape];
  }

  // If shape is not found in categories, log and return a default
  log(
    `Unknown diamond shape: ${csvShape}, using "round" as default`,
    "warning"
  );
  return "round";
}

// Connect to MongoDB with better logging
async function connectToDatabase() {
  try {
    log("Attempting to connect to MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name",
      {
        serverSelectionTimeoutMS: 5000,
        // Updated performance optimizations with compatible options
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
        // Removed poolSize and validateOptions which are not supported
      }
    );
    log("Successfully connected to MongoDB", "success");
  } catch (err) {
    log(`Error connecting to MongoDB: ${err.message}`, "error");
    process.exit(1);
  }
}

// Process a batch of products for insertion
async function processBatch(batch, batchNumber, totalBatches) {
  try {
    const startTime = Date.now();
    const inserted = await Product.insertMany(batch, {
      ordered: false,
      // Skip validation step mention but keep default behavior
    });
    const duration = Date.now() - startTime;
    const count = inserted.length; // Updated to use length instead of insertedCount
    log(
      `Inserted batch ${batchNumber}/${totalBatches}: ${count} records in ${duration}ms (${Math.round(
        count / (duration / 1000)
      )} docs/sec)`,
      "success"
    );
    return count;
  } catch (batchError) {
    const writeErrors = batchError.writeErrors || [];
    const insertedCount = batch.length - writeErrors.length;

    if (insertedCount > 0) {
      log(
        `Partially inserted batch ${batchNumber}/${totalBatches}: ${insertedCount}/${batch.length} records`,
        "warning"
      );
    }

    log(
      `Error inserting batch ${batchNumber}/${totalBatches}: ${batchError.message}`,
      "error"
    );

    if (writeErrors.length > 0 && writeErrors.length <= 3) {
      writeErrors.forEach((err, idx) => {
        log(`Error ${idx + 1}: ${err.errmsg || JSON.stringify(err)}`, "error");
      });
    } else if (writeErrors.length > 3) {
      log(`${writeErrors.length} documents failed validation`, "error");
    }

    return insertedCount > 0 ? insertedCount : 0;
  }
}

// Function to process and import the CSV data
async function importDiamondsFromCSV() {
  log("Starting CSV import process...");
  const results = [];

  // Read the CSV file
  fs.createReadStream("./data.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
      if (results.length % 1000 === 0) {
        log(`Processed ${results.length} records so far...`);
      }
    })
    .on("end", async () => {
      log(`CSV file successfully read. Total records: ${results.length}`);

      // Select either all records or a random subset based on configuration
      let selectedResults;
      if (IMPORT_ALL_RECORDS) {
        selectedResults = results;
        log(`Using all ${results.length} records for import.`);
      } else {
        shuffleArray(results);
        selectedResults = results.slice(0, SUBSET_SIZE);
        log(`Selected ${selectedResults.length} random records for import.`);
      }

      const startTime = Date.now();

      try {
        log("Transforming CSV data to database schema...");
        const diamondProducts = selectedResults
          .map((item, index) => {
            if (index % 1000 === 0) {
              log(`Transforming record ${index + 1}/${selectedResults.length}`);
            }

            try {
              // Check required fields
              if (!item.shape) {
                log(
                  `Record ${
                    index + 1
                  } is missing required field 'shape'. Skipping.`,
                  "warning"
                );
                return null;
              }

              if (!item.image) {
                log(
                  `Record ${
                    index + 1
                  } is missing required field 'image'. Skipping.`,
                  "warning"
                );
                return null;
              }

              // Normalize shape name
              const normalizedShape = normalizeShapeName(item.shape);
              if (!normalizedShape) {
                log(
                  `Could not normalize shape for record ${
                    index + 1
                  }. Skipping.`,
                  "warning"
                );
                return null;
              }

              const parsedValues = {
                price: parseFloat(item.price),
                carats: parseFloat(item.carats),
                length: parseFloat(item.length),
                width: parseFloat(item.width),
                height: parseFloat(item.height),
                depth: parseFloat(item.depth),
                table: parseFloat(item.table),
              };

              Object.keys(parsedValues).forEach((key) => {
                if (isNaN(parsedValues[key])) {
                  parsedValues[key] = 0;
                  log(
                    `Fixed NaN value for ${key} in record ${index + 1}`,
                    "warning"
                  );
                }
              });

              return {
                title: `${item.shape} Diamond - ${item.carats}ct ${item.col} ${item.clar}`,
                description: `Natural ${item.shape} shape diamond with ${item.carats} carats, ${item.col} color, ${item.clar} clarity.`,
                price: parsedValues.price,
                category: "diamond",
                imageCover: item.image,
                images: [item.video].filter(Boolean),
                productType: "diamond",
                shape: normalizedShape,
                carats: parsedValues.carats,
                col: item.col || "",
                clar: item.clar || "",
                cut: item.cut || "",
                pol: item.pol || "",
                symm: item.symm || "",
                flo: item.flo || "",
                floCol: item.floCol || "",
                length: parsedValues.length,
                width: parsedValues.width,
                certificate_url: item.pdf,
                height: parsedValues.height,
                depth: parsedValues.depth,
                table: parsedValues.table,
                culet: item.culet || "",
                lab: item.lab || "",
                girdle: item.girdle || "",
                eyeClean: item.eyeClean || "",
                brown: item.brown || "",
                green: item.green || "",
                milky: item.milky || "",
                isPopular: false,
              };
            } catch (transformError) {
              log(
                `Error transforming record ${index + 1}: ${
                  transformError.message
                }`,
                "warning"
              );
              return null;
            }
          })
          .filter((item) => item !== null);

        log(
          `Data transformation complete. Valid records: ${diamondProducts.length}`
        );

        if (diamondProducts.length === 0) {
          log("No valid records to import", "warning");
          await mongoose.disconnect();
          return;
        }

        // Insert into database with parallel processing
        log("Starting optimized database insert operation...");
        const batches = [];
        for (let i = 0; i < diamondProducts.length; i += BATCH_SIZE) {
          batches.push(diamondProducts.slice(i, i + BATCH_SIZE));
        }

        log(
          `Split data into ${batches.length} batches for parallel processing`
        );

        let totalInserted = 0;
        let currentBatchIndex = 0;

        // Process batches in parallel with a limit on concurrency
        while (currentBatchIndex < batches.length) {
          const batchPromises = [];

          // Create a set of parallel batch operations
          for (
            let i = 0;
            i < PARALLEL_BATCHES && currentBatchIndex < batches.length;
            i++
          ) {
            const batchNumber = currentBatchIndex + 1;
            batchPromises.push(
              processBatch(
                batches[currentBatchIndex],
                batchNumber,
                batches.length
              )
            );
            currentBatchIndex++;
          }

          // Wait for all parallel batches to complete
          const results = await Promise.all(batchPromises);
          totalInserted += results.reduce((sum, count) => sum + count, 0);
        }

        const duration = (Date.now() - startTime) / 1000;
        const docsPerSecond = Math.round(totalInserted / duration);

        log(
          `Import process completed. Total records inserted: ${totalInserted}/${
            selectedResults.length
          } in ${duration.toFixed(2)}s (${docsPerSecond} docs/sec)`,
          totalInserted === selectedResults.length ? "success" : "warning"
        );
      } catch (error) {
        log(`Error during import process: ${error.message}`, "error");
      } finally {
        await mongoose.disconnect();
        log("MongoDB connection closed");
      }
    })
    .on("error", (error) => {
      log(`Error reading CSV file: ${error.message}`, "error");
      mongoose.disconnect();
    });
}

// Main execution
(async () => {
  try {
    await connectToDatabase();
    await importDiamondsFromCSV();
  } catch (error) {
    log(`Fatal error: ${error.message}`, "error");
    process.exit(1);
  }
})();
