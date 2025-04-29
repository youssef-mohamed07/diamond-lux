import mongoose from "mongoose";
import { Product } from "./DB/models/product.schema.js";
import dotenv from "dotenv";

dotenv.config();

async function checkImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name");
        console.log("Connected to MongoDB");

        // Get all products with images
        const products = await Product.find({
            $or: [
                { imageCover: { $exists: true } },
                { images: { $exists: true, $ne: [] } }
            ]
        });

        console.log(`Found ${products.length} products with images`);

        // Check image URLs
        let brokenImages = 0;
        let totalImages = 0;

        for (const product of products) {
            totalImages++;
            if (product.imageCover) {
                if (!product.imageCover.startsWith('http')) {
                    console.log(`Invalid imageCover URL for product ${product._id}: ${product.imageCover}`);
                    brokenImages++;
                }
            }

            if (product.images && product.images.length > 0) {
                for (const image of product.images) {
                    totalImages++;
                    if (!image.startsWith('http')) {
                        console.log(`Invalid image URL for product ${product._id}: ${image}`);
                        brokenImages++;
                    }
                }
            }
        }

        console.log(`\nImage Statistics:`);
        console.log(`Total images checked: ${totalImages}`);
        console.log(`Broken images found: ${brokenImages}`);
        console.log(`Percentage broken: ${((brokenImages / totalImages) * 100).toFixed(2)}%`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

checkImages(); 