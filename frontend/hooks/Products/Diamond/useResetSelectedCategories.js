import { useEffect } from "react";

const useResetSelectedCategories = (
  diamondProducts,
  filteredCategories,
  setSelectedCategories,
  categoryParam
) => {
  useEffect(() => {
    // Only reset selected categories if there's no URL parameter and no products/categories
    if ((diamondProducts.length === 0 || filteredCategories.length === 0) && !categoryParam) {
      setSelectedCategories([]);
    }
  }, [diamondProducts, filteredCategories, setSelectedCategories, categoryParam]);
};

export default useResetSelectedCategories;
