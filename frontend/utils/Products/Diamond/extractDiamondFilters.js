export const extractDiamondFilters = (diamondProducts, categories) => {
  if (!diamondProducts || !categories) return {};

  const unique = (key) => [
    ...new Set(diamondProducts.filter((p) => p[key]).map((p) => p[key])),
  ];

  const usedCategoryIds = [...new Set(diamondProducts.map((p) => p.category))];

  const filteredCategories = categories?.length
    ? categories.filter((c) => usedCategoryIds.includes(c._id))
    : [];

  return {
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
