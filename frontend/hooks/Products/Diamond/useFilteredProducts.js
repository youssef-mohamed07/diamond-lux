import { useEffect, useState } from "react";
import filterAndSortDiamonds from "../../../utils/Products/Diamond/filterAndSortDiamonds";

const useFilteredProducts = ({
  diamondProducts,
  searchQuery,
  selectedCategories,
  sortType,
  shapes,
  colors,
  clarities,
  cuts,
  polishes,
  symmetries,
  fluorescences,
  labs,
  caratRange,
  priceRange,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const result = filterAndSortDiamonds({
      diamondProducts,
      searchQuery,
      selectedCategories,
      sortType,
      shapes,
      colors,
      clarities,
      cuts,
      polishes,
      symmetries,
      fluorescences,
      labs,
      caratRange,
      priceRange,
    });
    setFilteredProducts(result);
    setIsLoading(false);
  }, [
    diamondProducts,
    searchQuery,
    selectedCategories,
    sortType,
    shapes,
    colors,
    clarities,
    cuts,
    polishes,
    symmetries,
    fluorescences,
    labs,
    caratRange,
    priceRange,
  ]);

  return { filteredProducts, isLoading };
};

export default useFilteredProducts;
