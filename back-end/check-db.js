import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";

dotenv.config();

async function checkDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name");
        console.log("Connected to MongoDB");

        // Get all products
        const products = await Product.find({});
        console.log("Total products:", products.length);

        // Count by product type
        const counts = products.reduce((acc, product) => {
            acc[product.productType] = (acc[product.productType] || 0) + 1;
            return acc;
        }, {});

        console.log("Counts by product type:", counts);

        // Show first few products
        console.log("\nFirst 5 products:");
        products.slice(0, 5).forEach(product => {
            console.log({
                id: product._id,
                productType: product.productType,
                stockId: product.stockId,
                shape: product.shape
            });
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

checkDatabase(); 