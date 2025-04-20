export const extractDiamondFilters = (diamondProducts, categories) => {
  if (!diamondProducts || !categories) return {};

  const maxProductPrice = Math.max(
    ...diamondProducts.map((product) => product.price || 0)
  );
  const maxProductCarat = Math.max(
    ...diamondProducts.map((product) => product.carats || 0)
  );

  const unique = (key) => [
    ...new Set(diamondProducts.filter((p) => p[key]).map((p) => p[key])),
  ];

  const usedCategoryIds = [...new Set(diamondProducts.map((p) => p.category))];

  const filteredCategories = categories?.length
    ? categories.filter((c) => usedCategoryIds.includes(c._id))
    : [];

  return {
    maxPrice: maxProductPrice > 0 ? maxProductPrice : 1000000,
    maxCarat: maxProductCarat > 0 ? maxProductCarat : 10,
    priceRange: [0, maxProductPrice > 0 ? maxProductPrice : 1000000],
    caratRange: [0, maxProductCarat > 0 ? maxProductCarat : 10],
    uniqueShapes: unique("shape"),
    uniqueColors: unique("col"),
    uniqueClarities: unique("clar"),
    uniqueCuts: unique("cut"),
    uniquePolishes: unique("pol"),
    uniqueSymmetries: unique("symm"),
    uniqueFluorescences: unique("flo"),
    uniqueLabs: unique("lab"),
    filteredCategories,
  };
};
