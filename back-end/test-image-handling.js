// Test URL handling

// Function to test if a URL is external
const isExternalUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

// Sample URL cases
const testUrls = [
  "default-diamond.jpg",
  "https://nivoda-images.s3.eu-west-2.amazonaws.com/90a643ec-9e5a-49d3-877f-661e52ee42a7.jpg",
  "http://localhost:3000/uploads/product/image.jpg",
  "/uploads/product/another-image.jpg",
  undefined,
  null,
  ""
];

// Process URLs similar to our schema post-init hook
const processUrl = (url) => {
  if (!url) return "DEFAULT_IMAGE";
  
  if (isExternalUrl(url)) {
    return url; // Keep external URLs as-is
  }
  
  // Otherwise, prepend local path
  return `http://localhost:3000/uploads/product/${url}`;
};

// Test each URL
console.log("URL HANDLING TEST RESULTS:\n");
testUrls.forEach(url => {
  console.log(`Original: ${url || "(empty)"}`);
  console.log(`Is External: ${isExternalUrl(url)}`);
  console.log(`Processed: ${processUrl(url)}`);
  console.log("---");
});

console.log("\nTEST COMPLETE"); 