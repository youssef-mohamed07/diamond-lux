import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";

dotenv.config();

async function checkErrors() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name");
        console.log("Connected to MongoDB");

        // Get all products with validation errors
        const products = await Product.find({
            $or: [
                { productType: { $exists: false } },
                { productType: null },
                { productType: { $nin: ["lab_diamond", "natural_diamond", "jewelry"] } }
            ]
        });

        console.log("Products with validation errors:", products.length);
        if (products.length > 0) {
            console.log("Sample products with errors:");
            products.slice(0, 5).forEach(product => {
                console.log({
                    id: product._id,
                    productType: product.productType,
                    stockId: product.stockId,
                    shape: product.shape
                });
            });
        }

        // Get counts by product type
        const counts = await Product.aggregate([
            {
                $group: {
                    _id: "$productType",
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log("\nCounts by product type:", counts);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

checkErrors(); 