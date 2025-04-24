// Test for imageHelper.js functions
import { isExternalUrl, getImageUrl, getDiamondShapeImageUrl } from './utils/imageHelper.js';

// Test URLs
const testUrls = [
  null,
  undefined,
  '',
  'local-image.jpg',
  '/path/to/image.jpg',
  'http://example.com/image.jpg',
  'https://nivoda-images.s3.eu-west-2.amazonaws.com/90a643ec-9e5a-49d3-877f-661e52ee42a7.jpg'
];

// Test diamond shape IDs
const testShapeIds = [
  'round',
  'oval',
  'princess',
  'cushion_brilliant',
  'Round', // Test case sensitivity
  'Oval Shape', // Test with spaces
  null
];

console.log('=== Testing isExternalUrl() ===');
testUrls.forEach(url => {
  console.log(`URL: ${url || '(empty)'} => isExternal: ${isExternalUrl(url)}`);
});

console.log('\n=== Testing getImageUrl() ===');
testUrls.forEach(url => {
  console.log(`URL: ${url || '(empty)'} => ${getImageUrl(url)}`);
});

console.log('\n=== Testing getDiamondShapeImageUrl() ===');
testShapeIds.forEach(id => {
  console.log(`Shape ID: ${id || '(empty)'} => ${getDiamondShapeImageUrl(id)}`);
});

console.log('\nTests completed!'); 