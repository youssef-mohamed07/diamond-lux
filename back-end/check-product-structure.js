import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";

dotenv.config();

const BATCH_SIZE = 1000; // Process 1000 products at a time

async function checkAndFixProductStructure() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name"
    );
    console.log("Connected to MongoDB");

    // Get total count of diamond products
    const totalCount = await Product.countDocuments({
      productType: { $in: ["lab_diamond", "natural_diamond"] },
    });
    console.log(`Found ${totalCount} diamond products to check`);

    let fixedCount = 0;
    let errorCount = 0;
    let processedCount = 0;

    // Process in batches
    while (processedCount < totalCount) {
      const products = await Product.find({
        productType: { $in: ["lab_diamond", "natural_diamond"] },
      })
        .skip(processedCount)
        .limit(BATCH_SIZE);

      const bulkOps = [];

      for (const product of products) {
        try {
          const updates = {};
          let needsUpdate = false;

          // Check and fix required string fields for filtering
          const requiredStringFields = {
            stockId: "",
            shape: "",
            col: "", // color
            clar: "", // clarity
            cut: "",
            pol: "", // polish
            symm: "", // symmetry
            flo: "", // fluorescence
            floCol: "", // fluorescence color
            lab: "",
            girdle: "",
            culet: "",
            eyeClean: "",
            title: "",
            description: "",
            category: "",
            certificate_url: "",
            certificate_number: "",
          };

          // Set default values for string fields
          Object.entries(requiredStringFields).forEach(
            ([field, defaultValue]) => {
              if (!product[field]) {
                needsUpdate = true;
                if (field === "title") {
                  updates[field] = `${product.shape || "Round"} ${
                    product.productType === "lab_diamond" ? "Lab" : "Natural"
                  } Diamond - ${product.carats}ct ${product.col || "N/A"} ${
                    product.clar || "N/A"
                  }`;
                } else if (field === "description") {
                  updates[field] = `Beautiful ${product.shape || "Round"} ${
                    product.productType === "lab_diamond" ? "Lab" : "Natural"
                  } Diamond with ${product.carats} carats, ${
                    product.col || "N/A"
                  } color, and ${product.clar || "N/A"} clarity.`;
                } else if (field === "category") {
                  updates[field] = product.shape || "round";
                } else {
                  updates[field] = defaultValue;
                }
              }
            }
          );

          // Check and fix numeric fields for filtering
          const numericFields = {
            carats: 0,
            price: 0,
            pricePerCarat: 0,
            discount: 0,
            length: 0,
            width: 0,
            height: 0,
            depth: 0,
            table: 0,
            markupPrice: 0,
          };

          Object.entries(numericFields).forEach(([field, defaultValue]) => {
            if (typeof product[field] !== "number" || isNaN(product[field])) {
              needsUpdate = true;
              updates[field] = defaultValue;
            }
          });

          // Check and fix boolean fields
          const booleanFields = {
            brown: false,
            green: false,
            milky: false,
            canadaMarkEligible: false,
            isReturnable: false,
          };

          Object.entries(booleanFields).forEach(([field, defaultValue]) => {
            if (typeof product[field] !== "boolean") {
              needsUpdate = true;
              updates[field] = defaultValue;
            }
          });

          // Check and fix measurements object
          if (
            !product.measurements ||
            typeof product.measurements !== "object"
          ) {
            needsUpdate = true;
            updates.measurements = {
              length: product.length || 0,
              width: product.width || 0,
              height: product.height || 0,
              depth: product.depth || 0,
              table: product.table || 0,
            };
          }

          // Check and fix image fields
          if (!product.image || !product.imageCover) {
            needsUpdate = true;
            const placeholderImage = `https://placehold.co//300x300`;
            updates.image = placeholderImage;
            updates.imageCover = placeholderImage;
          }

          if (!Array.isArray(product.images) || product.images.length === 0) {
            needsUpdate = true;
            updates.images = [
              updates.image || product.image || `https://placehold.co//300x300`,
            ];
          }

          // Check and fix product type
          if (
            !product.productType ||
            !["lab_diamond", "natural_diamond"].includes(product.productType)
          ) {
            needsUpdate = true;
            updates.productType =
              product.lg === "natural" ? "natural_diamond" : "lab_diamond";
          }

          // Add to bulk operations if updates are needed
          if (needsUpdate) {
            bulkOps.push({
              updateOne: {
                filter: { _id: product._id },
                update: { $set: updates },
              },
            });
            fixedCount++;
          }
        } catch (error) {
          console.error(`Error processing product ${product._id}:`, error);
          errorCount++;
        }
      }

      // Execute bulk operations if any
      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
        console.log(
          `Processed batch: ${processedCount + 1} to ${
            processedCount + products.length
          } (${fixedCount} fixed)`
        );
      }

      processedCount += products.length;
    }

    console.log("\nProduct Structure Check Complete:");
    console.log(`Total products checked: ${totalCount}`);
    console.log(`Products fixed: ${fixedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

checkAndFixProductStructure();
