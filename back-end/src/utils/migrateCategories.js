import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../../DB/models/Category.schema.js";
import { Product } from "../../DB/models/product.schema.js";
import { DIAMOND_CATEGORIES } from "./staticCategories.js";

dotenv.config();

// Helper function to map old ObjectId categories to new string categories
const mapCategoryToNew = (oldCategories, newCategories) => {
  // Create a map from old category name to new category id
  const categoryMap = {};

  oldCategories.forEach((oldCat) => {
    // Find a matching new category by name (case insensitive)
    const matchingNewCat = newCategories.find(
      (newCat) => newCat.name.toLowerCase() === oldCat.name.toLowerCase()
    );

    if (matchingNewCat) {
      categoryMap[oldCat._id.toString()] = matchingNewCat._id;
    } else {
      // Default to 'round' if no match found
      categoryMap[oldCat._id.toString()] = "round";
    }
  });

  return categoryMap;
};

const migrate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get all existing categories
    const existingCategories = await Category.find();
    console.log(`Found ${existingCategories.length} existing categories`);

    // Create a mapping from old category IDs to new category IDs
    const categoryMap = mapCategoryToNew(
      existingCategories,
      DIAMOND_CATEGORIES
    );

    // Get all products
    const products = await Product.find();
    console.log(`Found ${products.length} products to migrate`);

    // Update all products
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const oldCategoryId = product.category
          ? product.category.toString()
          : null;

        if (oldCategoryId && categoryMap[oldCategoryId]) {
          // Update product with new string category ID
          product.category = categoryMap[oldCategoryId];
          await product.save();
          successCount++;
        } else {
          // Set to default if no mapping found
          product.category = "round";
          await product.save();
          successCount++;
        }
      } catch (error) {
        console.error(`Error updating product ${product._id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `Migration completed: ${successCount} products updated, ${errorCount} errors`
    );

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run the migration
migrate();
