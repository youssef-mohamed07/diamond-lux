import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";

dotenv.config();

async function checkDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name");
        console.log("Connected to MongoDB");

        // Count total products
        const totalProducts = await Product.countDocuments();
        console.log(`Total products in database: ${totalProducts}`);

        // Count diamond products
        const diamondProducts = await Product.countDocuments({
            productType: { $in: ["lab_diamond", "natural_diamond"] }
        });
        console.log(`Total diamond products: ${diamondProducts}`);

        // Get a sample of products
        const sampleProducts = await Product.find({
            productType: { $in: ["lab_diamond", "natural_diamond"] }
        }).limit(5);

        console.log("\nSample products:");
        sampleProducts.forEach(product => {
            console.log(`- ${product.title} (${product.productType})`);
        });

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkDatabase(); 