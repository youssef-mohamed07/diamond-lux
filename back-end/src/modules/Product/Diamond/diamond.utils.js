// src/modules/Product/Diamond/diamond.utils.js
export const buildDiamondFilterQuery = (queryParams) => {
  // Start with the base filter for diamond products
  const filterQuery = { productType: "diamond" };

  // Price range
  if (queryParams.minPrice || queryParams.maxPrice) {
    filterQuery.price = {};
    if (queryParams.minPrice)
      filterQuery.price.$gte = Number(queryParams.minPrice);
    if (queryParams.maxPrice)
      filterQuery.price.$lte = Number(queryParams.maxPrice);
  }

  // Shape filter (can be comma-separated list)
  if (queryParams.shape) {
    const shapes = queryParams.shape.split(",").map((s) => s.trim());
    filterQuery.shape = { $in: shapes };
  }

  // Carat range
  if (queryParams.minCarat || queryParams.maxCarat) {
    filterQuery.carats = {};
    if (queryParams.minCarat)
      filterQuery.carats.$gte = Number(queryParams.minCarat);
    if (queryParams.maxCarat)
      filterQuery.carats.$lte = Number(queryParams.maxCarat);
  }

  // Color filter
  if (queryParams.col) {
    const colors = queryParams.col.split(",").map((c) => c.trim());
    filterQuery.col = { $in: colors };
  }

  // Clarity filter
  if (queryParams.clar) {
    const clarities = queryParams.clar.split(",").map((c) => c.trim());
    filterQuery.clar = { $in: clarities };
  }

  // Cut filter
  if (queryParams.cut) {
    const cuts = queryParams.cut.split(",").map((c) => c.trim());
    filterQuery.cut = { $in: cuts };
  }

  // Polish filter
  if (queryParams.pol) {
    const polishes = queryParams.pol.split(",").map((p) => p.trim());
    filterQuery.pol = { $in: polishes };
  }

  // Symmetry filter
  if (queryParams.symm) {
    const symmetries = queryParams.symm.split(",").map((s) => s.trim());
    filterQuery.symm = { $in: symmetries };
  }

  // Fluorescence filter
  if (queryParams.flo) {
    const fluorescences = queryParams.flo.split(",").map((f) => f.trim());
    filterQuery.flo = { $in: fluorescences };
  }

  // Fluorescence color filter
  if (queryParams.floCol) {
    const floColors = queryParams.floCol.split(",").map((fc) => fc.trim());
    filterQuery.floCol = { $in: floColors };
  }

  // Depth percentage range
  if (queryParams.minDepth || queryParams.maxDepth) {
    filterQuery.depth = {};
    if (queryParams.minDepth)
      filterQuery.depth.$gte = Number(queryParams.minDepth);
    if (queryParams.maxDepth)
      filterQuery.depth.$lte = Number(queryParams.maxDepth);
  }

  // Table percentage range
  if (queryParams.minTable || queryParams.maxTable) {
    filterQuery.table = {};
    if (queryParams.minTable)
      filterQuery.table.$gte = Number(queryParams.minTable);
    if (queryParams.maxTable)
      filterQuery.table.$lte = Number(queryParams.maxTable);
  }

  // L/W Ratio range
  if (queryParams.minLwRatio || queryParams.maxLwRatio) {
    filterQuery.lwRatio = {};
    if (queryParams.minLwRatio)
      filterQuery.lwRatio.$gte = Number(queryParams.minLwRatio);
    if (queryParams.maxLwRatio)
      filterQuery.lwRatio.$lte = Number(queryParams.maxLwRatio);
  }

  // Length range
  if (queryParams.minLength || queryParams.maxLength) {
    filterQuery.length = {};
    if (queryParams.minLength)
      filterQuery.length.$gte = Number(queryParams.minLength);
    if (queryParams.maxLength)
      filterQuery.length.$lte = Number(queryParams.maxLength);
  }

  // Width range
  if (queryParams.minWidth || queryParams.maxWidth) {
    filterQuery.width = {};
    if (queryParams.minWidth)
      filterQuery.width.$gte = Number(queryParams.minWidth);
    if (queryParams.maxWidth)
      filterQuery.width.$lte = Number(queryParams.maxWidth);
  }

  // Lab certification filter
  if (queryParams.lab) {
    const labs = queryParams.lab.split(",").map((l) => l.trim());
    filterQuery.lab = { $in: labs };
  }

  // Culet filter
  if (queryParams.culet) {
    const culets = queryParams.culet.split(",").map((c) => c.trim());
    filterQuery.culet = { $in: culets };
  }

  // Boolean filters
  if (queryParams.eyeClean) {
    filterQuery.eyeClean =
      queryParams.eyeClean.toLowerCase() === "true" ? "Yes" : "No";
  }
  if (queryParams.brown) {
    filterQuery.brown =
      queryParams.brown.toLowerCase() === "true" ? "Yes" : "No";
  }
  if (queryParams.green) {
    filterQuery.green =
      queryParams.green.toLowerCase() === "true" ? "Yes" : "No";
  }
  if (queryParams.milky) {
    filterQuery.milky =
      queryParams.milky.toLowerCase() === "true" ? "Yes" : "No";
  }
  if (queryParams.isPopular !== undefined) {
    filterQuery.isPopular = queryParams.isPopular.toLowerCase() === "true";
  }

  return filterQuery;
};
