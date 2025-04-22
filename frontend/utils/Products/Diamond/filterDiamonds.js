const filterAndSortDiamonds = ({
  diamondProducts = [],
  searchQuery = "",
  selectedCategories = [],
  shapes = [],
  colors = [],
  clarities = [],
  cuts = [],
  polishes = [],
  symmetries = [],
  fluorescences = [],
  labs = [],
  caratRange = [0, 10],
  priceRange = [0, 100000],
  sortType = "",
  tableRange = [0, 100],
  lwRatioRange = [0, 10],
  lengthRange = [0, 30],
  widthRange = [0, 30],
  depthRange = [0, 100],
}) => {
  console.log("filterAndSortDiamonds DETAILED:", {
    diamondProductsCount: diamondProducts.length,
    selectedCategories,
    shapes,
    colors,
    priceRange,
    sampleProduct:
      diamondProducts.length > 0
        ? {
            id: diamondProducts[0]._id,
            category: diamondProducts[0].category,
            shape: diamondProducts[0].shape,
            price: diamondProducts[0].price,
          }
        : null,
  });

  let filteredProducts = [...diamondProducts];

  // Search
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title &&
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Category filter - handle string-based category IDs
  if (selectedCategories.length > 0) {
    console.log("Filtering by selectedCategories:", selectedCategories);
    const beforeCount = filteredProducts.length;

    // Convert to lowercase for case-insensitive matching
    const lowercaseCategories = selectedCategories.map((cat) =>
      typeof cat === "string" ? cat.toLowerCase() : cat
    );

    filteredProducts = filteredProducts.filter((product) => {
      if (!product.category) return false;

      // Handle both cases: category could be an ID or a name
      const productCategory =
        typeof product.category === "string"
          ? product.category.toLowerCase()
          : product.category;

      return lowercaseCategories.includes(productCategory);
    });

    console.log(
      `Category filter: ${beforeCount} -> ${filteredProducts.length}`
    );
  }

  // Shape filter - special handling
  if (shapes.length > 0) {
    console.log("Filtering by shapes:", shapes);
    const sampleShapes = filteredProducts.slice(0, 3).map((p) => ({
      id: p._id,
      category: p.category,
      shape: p.shape,
    }));
    console.log("Sample product shapes:", sampleShapes);

    const beforeCount = filteredProducts.length;

    // Convert shape names to lowercase for case-insensitive comparison
    const lowercaseShapes = shapes.map((s) =>
      typeof s === "string" ? s.toLowerCase() : s
    );

    filteredProducts = filteredProducts.filter((product) => {
      // If no shape property but has category, try using category as shape
      if (!product.shape && product.category) {
        const productCategory =
          typeof product.category === "string"
            ? product.category.toLowerCase()
            : String(product.category).toLowerCase();

        return lowercaseShapes.some(
          (shape) =>
            productCategory.includes(shape) || shape.includes(productCategory)
        );
      }

      // Normal shape check
      if (!product.shape) return false;

      const productShape =
        typeof product.shape === "string"
          ? product.shape.toLowerCase()
          : String(product.shape).toLowerCase();

      // Check if any selected shape matches the product shape
      return lowercaseShapes.some(
        (shape) => productShape.includes(shape) || shape.includes(productShape)
      );
    });

    console.log(`Shape filter: ${beforeCount} -> ${filteredProducts.length}`);
  }

  // Color filter
  if (colors.length > 0) {
    const beforeCount = filteredProducts.length;
    filteredProducts = filteredProducts.filter(
      (product) => product.col && colors.includes(product.col)
    );
    console.log(`Color filter: ${beforeCount} -> ${filteredProducts.length}`);
  }

  if (clarities.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.clar && clarities.includes(product.clar)
    );
  }

  if (cuts.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.cut && cuts.includes(product.cut)
    );
  }

  if (polishes.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.pol && polishes.includes(product.pol)
    );
  }

  if (symmetries.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.symm && symmetries.includes(product.symm)
    );
  }

  if (fluorescences.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.flo && fluorescences.includes(product.flo)
    );
  }

  if (labs.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) => product.lab && labs.includes(product.lab)
    );
  }

  // Carat range
  if (caratRange && caratRange.length === 2) {
    const beforeCount = filteredProducts.length;
    filteredProducts = filteredProducts.filter(
      (product) =>
        !product.carats ||
        (parseFloat(product.carats) >= caratRange[0] &&
          parseFloat(product.carats) <= caratRange[1])
    );
  }

  // Price range
  if (priceRange && priceRange.length === 2) {
    const beforePriceCount = filteredProducts.length;

    // Make sure price is a number before comparison
    filteredProducts = filteredProducts.filter((product) => {
      const price = parseFloat(product.price);
      if (isNaN(price)) return false;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    console.log(
      `Price filter: ${beforePriceCount} -> ${filteredProducts.length}`
    );
  }

  // Table percentage range
  if (tableRange && tableRange.length === 2) {
    filteredProducts = filteredProducts.filter((product) => {
      const tablePercent = parseFloat(product.table);
      if (isNaN(tablePercent)) return true; // Skip if not a number
      return tablePercent >= tableRange[0] && tablePercent <= tableRange[1];
    });
  }

  // Length/Width ratio range
  if (lwRatioRange && lwRatioRange.length === 2) {
    filteredProducts = filteredProducts.filter((product) => {
      // Calculate l/w ratio if both dimensions exist
      if (product.length && product.width) {
        const ratio = parseFloat(product.length) / parseFloat(product.width);
        if (isNaN(ratio)) return true; // Skip if not a number
        return ratio >= lwRatioRange[0] && ratio <= lwRatioRange[1];
      }
      return true; // Keep products without l/w data
    });
  }

  // Length range
  if (lengthRange && lengthRange.length === 2) {
    filteredProducts = filteredProducts.filter((product) => {
      const length = parseFloat(product.length);
      if (isNaN(length)) return true; // Skip if not a number
      return length >= lengthRange[0] && length <= lengthRange[1];
    });
  }

  // Width range
  if (widthRange && widthRange.length === 2) {
    filteredProducts = filteredProducts.filter((product) => {
      const width = parseFloat(product.width);
      if (isNaN(width)) return true; // Skip if not a number
      return width >= widthRange[0] && width <= widthRange[1];
    });
  }

  // Depth percentage range
  if (depthRange && depthRange.length === 2) {
    filteredProducts = filteredProducts.filter((product) => {
      const depthPercent = parseFloat(product.depth);
      if (isNaN(depthPercent)) return true; // Skip if not a number
      return depthPercent >= depthRange[0] && depthPercent <= depthRange[1];
    });
  }

  // Sorting
  if (sortType === "low-high") {
    filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortType === "high-low") {
    filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  console.log("filterAndSortDiamonds RESULT:", filteredProducts.length);
  return filteredProducts;
};

export default filterAndSortDiamonds;
