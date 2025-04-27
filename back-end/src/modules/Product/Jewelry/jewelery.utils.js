// src/modules/Product/Diamond/diamond.utils.js
export const buildJeweleryFilterQuery = (queryParams) => {
  // Start with the base filter for diamond products
  const filterQuery = { productType: "jewelry" };

  // Search query - search in title and description
  if (queryParams.search) {
    filterQuery.$or = [
      { title: { $regex: queryParams.search, $options: 'i' } },
      { description: { $regex: queryParams.search, $options: 'i' } }
    ];
  }

  // Category filter
  if (queryParams.category) {
    const categories = queryParams.category.split(',').map(c => c.trim());
    filterQuery.category = { $in: categories };
  }

  // Price range
  if (queryParams.minPrice || queryParams.maxPrice) {
    filterQuery.price = {};
    if (queryParams.minPrice)
      filterQuery.price.$gte = Number(queryParams.minPrice);
    if (queryParams.maxPrice)
      filterQuery.price.$lte = Number(queryParams.maxPrice);
  }

  // Diamond Type
  if (queryParams.diamondType) {
    const diamondTypes = queryParams.diamondType
      .split(",")
      .map((dt) => dt.trim());
    filterQuery.diamondType = { $in: diamondTypes };
  }

  // Metal
  if (queryParams.metal) {
    const metals = queryParams.metal.split(",").map((m) => m.trim());
    filterQuery.metal = { $in: metals };
  }

  // Metal Color
  if (queryParams.metalColor) {
    const metalColors = queryParams.metalColor
      .split(",")
      .map((mc) => mc.trim());
    filterQuery.metalColor = { $in: metalColors };
  }

  // Carat range
  if (queryParams.minCarat || queryParams.maxCarat) {
    filterQuery.carats = {};
    if (queryParams.minCarat)
      filterQuery.carats.$gte = Number(queryParams.minCarat);
    if (queryParams.maxCarat)
      filterQuery.carats.$lte = Number(queryParams.maxCarat);
  }

  if (queryParams.isPopular !== undefined) {
    filterQuery.isPopular = queryParams.isPopular.toLowerCase() === "true";
  }

  return filterQuery;
};
