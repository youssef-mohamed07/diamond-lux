import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/diamond-jewelry"
  )
  .then(async () => {
    console.log("Connected to MongoDB");
    
    try {
      // Get sample diamonds
      const diamonds = await Product.find({ productType: "diamond" }).limit(5);
      
      console.log(`Found ${diamonds.length} diamonds`);
      
      if (diamonds.length > 0) {
        // Check first diamond
        const firstDiamond = diamonds[0];
        console.log("\nFirst diamond sample:");
        console.log(`ID: ${firstDiamond._id}`);
        console.log(`Title: ${firstDiamond.title}`);
        console.log(`Shape: ${firstDiamond.shape}`);
        console.log(`Category: ${firstDiamond.category}`);
        
        // Count unique shapes
        const allDiamonds = await Product.find({ productType: "diamond" });
        const shapes = [...new Set(allDiamonds.map(d => d.shape))];
        console.log(`\nUnique shapes in database (${shapes.length}): ${shapes.join(', ')}`);
        
        // Count unique categories
        const categories = [...new Set(allDiamonds.map(d => d.category))];
        console.log(`\nUnique categories in database (${categories.length}): ${categories.join(', ')}`);
      }
    } catch (error) {
      console.error("Error checking diamonds:", error);
    } finally {
      mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err)); 