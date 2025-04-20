import { useEffect } from "react";

const useResetSelectedCategories = (
  diamondProducts,
  filteredCategories,
  setSelectedCategories
) => {
  useEffect(() => {
    if (diamondProducts.length === 0 || filteredCategories.length === 0) {
      setSelectedCategories([]);
    }
  }, [diamondProducts, filteredCategories, setSelectedCategories]);
};

export default useResetSelectedCategories;
