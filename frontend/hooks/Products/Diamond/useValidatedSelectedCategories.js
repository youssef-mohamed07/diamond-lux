import { useEffect } from "react";

const useValidatedSelectedCategories = (
  filteredCategories,
  selectedCategories,
  setSelectedCategories,
  navigate,
  location,
  categoryParam
) => {
  useEffect(() => {
    if (selectedCategories.length > 0 && filteredCategories.length > 0) {
      // Get all valid category ids from filtered categories
      const validCategoryIds = filteredCategories.map((cat) => cat._id);

      // Filter the selected categories to only those that exist in the valid categories
      const validSelectedCategories = selectedCategories.filter((id) =>
        validCategoryIds.includes(id)
      );

      // Check if selected category from URL is valid
      if (categoryParam && !validCategoryIds.includes(categoryParam)) {
        // If category from URL is not valid, remove it from URL
        const params = new URLSearchParams(location.search);
        params.delete('category');
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      }

      // Update selected categories if the valid ones are different
      if (validSelectedCategories.length !== selectedCategories.length) {
        setSelectedCategories(validSelectedCategories);
      }
    }
  }, [filteredCategories, selectedCategories, setSelectedCategories, navigate, location, categoryParam]);
};

export default useValidatedSelectedCategories;
