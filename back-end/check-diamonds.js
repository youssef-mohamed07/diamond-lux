import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";

dotenv.config();

async function checkAndFixNaturalDiamonds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name");
    console.log("Connected to MongoDB");

    // Check natural diamonds count
    const naturalCount = await Product.countDocuments({ productType: "natural_diamond" });
    console.log("Natural diamonds count:", naturalCount);

    // Check lab diamonds count
    const labCount = await Product.countDocuments({ productType: "lab_diamond" });
    console.log("Lab diamonds count:", labCount);

    // Find all diamonds that need fixing
    const diamondsToFix = await Product.find({
      $or: [
        { productType: { $exists: false } },
        { productType: null },
        { productType: "natural" },
        { productType: "Natural" },
        { productType: "diamond" }
      ]
    });

    console.log("Found", diamondsToFix.length, "diamonds to fix");

    // Update their productType based on the lg field
    for (const diamond of diamondsToFix) {
      const productType = diamond.lg === 'natural' ? 'natural_diamond' : 'lab_diamond';
      await Product.updateOne(
        { _id: diamond._id },
        { $set: { productType } }
      );
    }

    console.log("Updated", diamondsToFix.length, "diamonds");

    // Verify the counts after fixing
    const newNaturalCount = await Product.countDocuments({ productType: "natural_diamond" });
    const newLabCount = await Product.countDocuments({ productType: "lab_diamond" });
    console.log("Natural diamonds count after fix:", newNaturalCount);
    console.log("Lab diamonds count after fix:", newLabCount);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

checkAndFixNaturalDiamonds(); 