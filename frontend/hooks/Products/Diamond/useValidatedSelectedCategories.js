import { useEffect } from "react";

const useValidatedSelectedCategories = (
  filteredCategories,
  selectedCategories,
  setSelectedCategories
) => {
  useEffect(() => {
    if (selectedCategories.length > 0 && filteredCategories.length > 0) {
      // Get all valid category ids from filtered categories
      const validCategoryIds = filteredCategories.map((cat) => cat._id);

      // Filter the selected categories to only those that exist in the valid categories
      const validSelectedCategories = selectedCategories.filter((id) =>
        validCategoryIds.includes(id)
      );

      // Update selected categories if the valid ones are different
      if (validSelectedCategories.length !== selectedCategories.length) {
        setSelectedCategories(validSelectedCategories);
      }
    }
  }, [filteredCategories, selectedCategories, setSelectedCategories]);
};

export default useValidatedSelectedCategories;
