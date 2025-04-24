import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import { DIAMOND_CATEGORIES } from "./src/utils/staticCategories.js";
import dotenv from "dotenv";

dotenv.config();

// Create a shape to category mapping
const shapeToCategory = {};
DIAMOND_CATEGORIES.forEach(category => {
  // Add lowercase version
  shapeToCategory[category.name.toLowerCase()] = category._id;
  // Add uppercase version
  shapeToCategory[category.name.toUpperCase()] = category._id;
  // Add version without spaces
  shapeToCategory[category.name.toLowerCase().replace(/\s+/g, '')] = category._id;
  shapeToCategory[category.name.toUpperCase().replace(/\s+/g, '')] = category._id;
});

// Handle special cases
shapeToCategory['cushion brilliant'] = 'cushion_brilliant';
shapeToCategory['CUSHION BRILLIANT'] = 'cushion_brilliant';
shapeToCategory['square emerald'] = 'sq_emerald';
shapeToCategory['SQUARE EMERALD'] = 'sq_emerald';
shapeToCategory['triangular'] = 'traingular'; // There's a typo in the staticCategories.js
shapeToCategory['TRIANGULAR'] = 'traingular';

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/diamond-jewelry"
  )
  .then(async () => {
    console.log("Connected to MongoDB");
    
    try {
      // Get all diamonds
      const diamonds = await Product.find({ productType: "diamond" });
      console.log(`Found ${diamonds.length} diamonds to process`);
      
      let updatedCount = 0;
      let skippedCount = 0;
      
      // Process each diamond
      for (const diamond of diamonds) {
        if (!diamond.shape) {
          console.log(`Diamond ${diamond._id} has no shape, skipping`);
          skippedCount++;
          continue;
        }
        
        const shape = diamond.shape.trim();
        const categoryId = shapeToCategory[shape];
        
        if (!categoryId) {
          console.log(`No category found for shape: "${shape}", skipping`);
          skippedCount++;
          continue;
        }
        
        // Update the diamond's category if needed
        if (diamond.category !== categoryId) {
          diamond.category = categoryId;
          await diamond.save();
          updatedCount++;
          
          if (updatedCount % 10 === 0) {
            console.log(`Updated ${updatedCount} diamonds so far...`);
          }
        }
      }
      
      console.log(`\nUpdate complete!`);
      console.log(`Updated: ${updatedCount} diamonds`);
      console.log(`Skipped: ${skippedCount} diamonds`);
      
    } catch (error) {
      console.error("Error updating diamonds:", error);
    } finally {
      mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err)); 