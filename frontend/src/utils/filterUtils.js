// Case-insensitive filter utilities

// Check if a value matches any of the selected values (case-insensitive)
export const isValueSelected = (value, selectedValues) => {
  if (!value || !selectedValues || selectedValues.length === 0) return false;
  return selectedValues.some(selected => 
    selected.toLowerCase() === value.toLowerCase()
  );
};

// Toggle a value in the selected values array (case-insensitive)
export const toggleFilterValue = (value, selectedValues, setSelectedValues) => {
  const valueLower = value.toLowerCase();
  const isSelected = selectedValues.some(v => v.toLowerCase() === valueLower);
  
  if (isSelected) {
    setSelectedValues(selectedValues.filter(v => v.toLowerCase() !== valueLower));
  } else {
    setSelectedValues([...selectedValues, value]);
  }
};

// Filter products by a specific field (case-insensitive)
export const filterProductsByField = (products, field, selectedValues) => {
  if (!selectedValues || selectedValues.length === 0) return products;
  
  return products.filter(product => {
    const productValue = product[field];
    if (!productValue) return false;
    return selectedValues.some(value => 
      productValue.toLowerCase() === value.toLowerCase()
    );
  });
};

// Filter products by multiple fields (case-insensitive)
export const filterProductsByFields = (products, filters) => {
  let filtered = [...products];
  
  Object.entries(filters).forEach(([field, values]) => {
    if (values && values.length > 0) {
      filtered = filterProductsByField(filtered, field, values);
    }
  });
  
  return filtered;
}; 