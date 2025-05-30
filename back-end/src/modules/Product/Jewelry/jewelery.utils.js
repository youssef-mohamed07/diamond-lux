// src/modules/Product/Diamond/diamond.utils.js
export const buildJeweleryFilterQuery = (queryParams) => {
  // Track search conditions separately to combine them properly later
  let searchConditions = [];
  let metalConditions = [];
  let metalColorConditions = [];
  
  // Start with the base filter for jewelry products
  const filterQuery = { productType: "jewelry" };

  // Search query - search in title and description
  if (queryParams.search) {
    searchConditions = [
      { title: { $regex: queryParams.search, $options: 'i' } },
      { description: { $regex: queryParams.search, $options: 'i' } },
      { reportNo: { $regex: queryParams.search, $options: 'i' } },
      { stockId: { $regex: queryParams.search, $options: 'i' } }
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

  // Jewelry Type
  if (queryParams.jewelryType) {
    const jewelryTypes = queryParams.jewelryType
      .split(",")
      .map((jt) => jt.trim());
    filterQuery.jewelryType = { $in: jewelryTypes };
  }

  // Diamond Type
  if (queryParams.diamondType) {
    const diamondTypes = queryParams.diamondType
      .split(",")
      .map((dt) => dt.trim());
    filterQuery.diamondType = { $in: diamondTypes };
  }

  // Metal - with case insensitive option
  if (queryParams.metal) {
    const metals = queryParams.metal.split(",").map((m) => m.trim());
    // Always use case-insensitive matching for metals
    metalConditions = metals.map(metal => ({
      metal: { $regex: new RegExp(`^${metal}$`, 'i') }
    }));
    filterQuery.$or = metalConditions;
  }

  // Metal Color - with case insensitive option
  if (queryParams.metalColor) {
    const metalColors = queryParams.metalColor
      .split(",")
      .map((mc) => mc.trim());
    // Always use case-insensitive matching for metal colors
    metalColorConditions = metalColors.map(color => ({
      metalColor: { $regex: new RegExp(`^${color}$`, 'i') }
    }));
    filterQuery.$or = metalColorConditions;
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

  // Combine all the conditions properly
  const conditions = [];
  
  // Add search conditions if any
  if (searchConditions.length > 0) {
    conditions.push({ $or: searchConditions });
  }
  
  // Add metal conditions if any
  if (metalConditions.length > 0) {
    conditions.push({ $or: metalConditions });
  }
  
  // Add metal color conditions if any
  if (metalColorConditions.length > 0) {
    conditions.push({ $or: metalColorConditions });
  }
  
  // If we have any conditions, add them as $and to the filter query
  if (conditions.length > 0) {
    filterQuery.$and = conditions;
  }

  console.log('Filter query:', JSON.stringify(filterQuery, null, 2));
  return filterQuery;
};
