import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import { Product } from "./DB/models/product.schema.js"; // Update with your actual model file path
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/diamond-jewelry"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Function to process and import the CSV data
async function importDiamondsFromCSV() {
    const results = [];
  
    // Read the CSV file
    fs.createReadStream("./data.csv") // Update with your CSV file path
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const diamondProducts = results
            .filter((item) => item.image) // Filter out items with missing images
            .slice(0, 100) // Only take the first 100 valid entries
            .map((item) => {
              // Helper to detect if URL is already external
              const isExternalUrl = (url) => {
                return url && (url.startsWith('http://') || url.startsWith('https://'));
              };
              
              // Keep external URLs as-is, otherwise use local file path
              const imageCover = isExternalUrl(item.image) 
                ? item.image 
                : (item.image || "default-diamond.jpg");
              
              const images = item.video 
                ? [isExternalUrl(item.video) ? item.video : item.video]
                : [];
                
              // Map CSV fields to your schema
              return {
                title: `${item.shape} Diamond - ${item.carats}ct ${item.col} ${item.clar}`,
                description: `Natural ${item.shape} shape diamond with ${item.carats} carats, ${item.col} color, ${item.clar} clarity.`,
                price: parseFloat(item.price) || 0,
                category: "diamond",
                imageCover: imageCover,
                images: images,
                productType: "diamond",
                shape: item.shape,
                carats: parseFloat(item.carats) || 0,
                col: item.col,
                clar: item.clar,
                cut: item.cut,
                pol: item.pol,
                symm: item.symm,
                flo: item.flo,
                floCol: item.floCol,
                length: isNaN(parseFloat(item.length)) ? 0 : parseFloat(item.length),
                width: isNaN(parseFloat(item.width)) ? 0 : parseFloat(item.width),
                height: isNaN(parseFloat(item.height)) ? 0 : parseFloat(item.height),
                depth: isNaN(parseFloat(item.depth)) ? 0 : parseFloat(item.depth),
                table: isNaN(parseFloat(item.table)) ? 0 : parseFloat(item.table),
                culet: item.culet,
                lab: item.lab,
                girdle: item.girdle,
                eyeClean: item.eyeClean,
                brown: item.brown,
                green: item.green,
                milky: item.milky,
                isPopular: false,
              };
            });
  
          const inserted = await Product.insertMany(diamondProducts);
          console.log(`Successfully imported ${inserted.length} diamond products`);
          mongoose.disconnect();
        } catch (error) {
          console.error("Error importing data:", error);
          mongoose.disconnect();
        }
      });
  }
  

// Run the import function
importDiamondsFromCSV();