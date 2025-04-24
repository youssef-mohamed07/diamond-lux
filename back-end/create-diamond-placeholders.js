import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DIAMOND_CATEGORIES } from './src/utils/staticCategories.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diamond shapes upload directory
const diamondShapesDir = path.join(__dirname, 'uploads', 'diamond-shapes');

// Create directory if it doesn't exist
if (!fs.existsSync(diamondShapesDir)) {
  fs.mkdirSync(diamondShapesDir, { recursive: true });
  console.log(`Created directory: ${diamondShapesDir}`);
}

// Check each diamond shape category
console.log('Checking diamond shape images...');
let missingCount = 0;

DIAMOND_CATEGORIES.forEach(category => {
  const imageFilename = path.join(diamondShapesDir, category.image);
  
  // Check if the image exists
  if (!fs.existsSync(imageFilename)) {
    missingCount++;
    console.log(`Missing image: ${category.image} for shape: ${category.name}`);
    
    // Create a placeholder image file (just an empty file for now)
    try {
      // This creates an empty file as a placeholder
      fs.writeFileSync(imageFilename, '');
      console.log(`Created placeholder for: ${category.image}`);
    } catch (error) {
      console.error(`Error creating placeholder for ${category.image}:`, error);
    }
  }
});

console.log(`\nDone checking diamond shape images.`);
console.log(`Found ${missingCount} missing images and created placeholders.`);
console.log(`Diamond shapes directory: ${diamondShapesDir}`); 