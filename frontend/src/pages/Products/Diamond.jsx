import { FaFilter } from "react-icons/fa";
import BannerSection from "../../components/Products/BannerSection";
import QuickFilters from "../../components/Products/Diamond/QuickFilters";
import SearchBar from "../../components/Products/SearchBar";
import SubBannerSection from "../../components/Products/SubBannerSection";
import { debounce } from "../../../utils/debounce";
import { useEffect, useState, useCallback } from "react";
import MobileFilterPanel from "../../components/Products/Diamond/MobileFilterPanel";
import ProductsPanel from "../../components/Products/ProductsPanel";
import AdvancedFilters from "../../components/Products/Diamond/AdvancedFilters";
import { useDiamonds } from "../../../hooks/Products/Diamond/useDiamonds";
import Pagination from "../../components/Products/Pagination";
import SortDropdown from "../../components/Products/SortDropdown";
import DoubleRangeSlider from "../../components/Products/DoubleRangeSlider";

const Diamond = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [paginationKey, setPaginationKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [diamondType, setDiamondType] = useState("lab");
  const [error, setError] = useState(null);

  // Get data and functions from useDiamonds hook
  const {
    diamonds,
    pagination,
    loading,
    error: hookError,
    filters,
    sortOption,
    diamondShapes,
    shapesLoading,
    changePage,
    changeLimit,
    updateFilters,
    updateSortOption,
    clearFilters,
    searchDiamonds,
  } = useDiamonds();

  // Define filter options data
  const colorOptions = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const fancyColorOptions = [
    "Yellow",
    "Orange",
    "Pink",
    "Blue",
    "Green",
    "Purple",
    "Brown",
    "Gray",
    "Black",
  ];
  const fancyIntensityOptions = [
    "Fancy Light",
    "Fancy Very Light",
    "Fancy",
    "Fancy Intense",
    "Fancy Deep",
    "Fancy Vivid",
    "Fancy Dark",
  ];
  const cutOptions = ["ID", "EX", "VG", "G", "F", "P"]; // ID=Ideal, EX=Excellent, VG=Very Good, G=Good, F=Fair, P=Poor
  const clarityOptions = [
    "FL",
    "IF",
    "VVS1",
    "VVS2",
    "VS1",
    "VS2",
    "SI1",
    "SI2",
    "I1",
    "I2",
    "I3",
  ];
  const polishOptions = ["EX", "VG", "G", "F", "P"];
  const symmetryOptions = ["EX", "VG", "G", "F", "P"];
  const labOptions = ["GIA", "IGI", "AGS", "HRD", "GSI", "GCAL"];
  const fluorescenceOptions = ["NON", "FNT", "MED", "STG", "VSTG"]; // None, Faint, Medium, Strong, Very Strong

  // Sort options
  const sortOptions = [
    { value: "price:asc", label: "Price: L to H" },
    { value: "price:desc", label: "Price: H to L" },
    { value: "carats:asc", label: "Carat: L to H" },
    { value: "carats:desc", label: "Carat: H to L" },
  ];

  // Filter handlers
  const handleShapeChange = (selectedShapes) => {
    if (selectedShapes.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.shape;
      updateFilters(updatedFilters);
    } else if (selectedShapes.length === 1) {
      // Check if this is a toggle operation on an already selected shape
      const shapeId = String(selectedShapes[0]);

      // Create an array from the current shape filter for consistent handling
      const currentShapes = Array.isArray(filters.shape)
        ? filters.shape.map(String)
        : filters.shape
        ? [String(filters.shape)]
        : [];

      if (currentShapes.includes(shapeId)) {
        // If the shape is already selected and it's the only one, remove the filter
        if (currentShapes.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.shape;
          updateFilters(updatedFilters);
        } else {
          // If multiple shapes are selected, remove just this one
          const newShapes = currentShapes.filter((shape) => shape !== shapeId);

          updateFilters({ ...filters, shape: newShapes });
        }
      } else {
        // If it's a new shape, add it to existing selections
        const newShapes = [...currentShapes, shapeId];
        updateFilters({ ...filters, shape: newShapes });
      }
    } else {
      updateFilters({ ...filters, shape: selectedShapes.map(String) });
    }
  };

  const handleColorChange = (selectedColors) => {
    if (selectedColors.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.col;
      delete updatedFilters.fancyIntensity;
      updateFilters(updatedFilters);
    } else if (selectedColors.length === 1) {
      // Check if this is a toggle operation on an already selected color
      const colorValue = selectedColors[0];

      // Create arrays from the current color filters for consistent handling
      const currentColors = Array.isArray(filters.col)
        ? filters.col
        : filters.col
        ? filters.col.split(",")
        : [];

      const currentFancyIntensities = Array.isArray(filters.fancyIntensity)
        ? filters.fancyIntensity
        : filters.fancyIntensity
        ? filters.fancyIntensity.split(",")
        : [];

      if (
        currentColors.includes(colorValue) ||
        currentFancyIntensities.includes(colorValue)
      ) {
        // If the color is already selected and it's the only one, remove the filter
        if (
          currentColors.length === 1 ||
          currentFancyIntensities.length === 1
        ) {
          const updatedFilters = { ...filters };
          delete updatedFilters.col;
          delete updatedFilters.fancyIntensity;
          updateFilters(updatedFilters);
        } else {
          // If multiple colors are selected, remove just this one
          const newColors = currentColors.filter(
            (color) => color !== colorValue
          );
          const newFancyIntensities = currentFancyIntensities.filter(
            (intensity) => intensity !== colorValue
          );

          const updatedFilters = { ...filters };
          if (newColors.length > 0) updatedFilters.col = newColors;
          if (newFancyIntensities.length > 0)
            updatedFilters.fancyIntensity = newFancyIntensities;
          updateFilters(updatedFilters);
        }
      } else {
        // If it's a new color, add it to existing selections
        const updatedFilters = { ...filters };
        if (fancyIntensityOptions.includes(colorValue)) {
          updatedFilters.fancyIntensity = [
            ...currentFancyIntensities,
            colorValue,
          ];
        } else {
          updatedFilters.col = [...currentColors, colorValue];
        }
        updateFilters(updatedFilters);
      }
    } else {
      // Multiple colors were passed, use as is
      const updatedFilters = { ...filters };
      const regularColors = selectedColors.filter(
        (color) => !fancyIntensityOptions.includes(color)
      );
      const fancyIntensities = selectedColors.filter((color) =>
        fancyIntensityOptions.includes(color)
      );

      if (regularColors.length > 0) updatedFilters.col = regularColors;
      if (fancyIntensities.length > 0)
        updatedFilters.fancyIntensity = fancyIntensities;
      updateFilters(updatedFilters);
    }
  };

  const handleCutChange = (selectedCuts) => {
    if (selectedCuts.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.cut;
      updateFilters(updatedFilters);
    } else if (selectedCuts.length === 1) {
      // Check if this is a toggle operation on an already selected cut
      const cutValue = selectedCuts[0];

      // Create an array from the current cut filter for consistent handling
      const currentCuts = Array.isArray(filters.cut)
        ? filters.cut
        : filters.cut
        ? filters.cut.split(",")
        : [];

      if (currentCuts.includes(cutValue)) {
        // If the cut is already selected and it's the only one, remove the filter
        if (currentCuts.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.cut;
          updateFilters(updatedFilters);
        } else {
          // If multiple cuts are selected, remove just this one
          const newCuts = currentCuts.filter((cut) => cut !== cutValue);
          updateFilters({ ...filters, cut: newCuts });
        }
      } else {
        // If it's a new cut, add it to existing selections
        const newCuts = [...currentCuts, cutValue];
        updateFilters({ ...filters, cut: newCuts });
      }
    } else {
      // Multiple cuts were passed, use as is
      updateFilters({ ...filters, cut: selectedCuts });
    }
  };

  const handleClarityChange = (selectedClarities) => {
    if (selectedClarities.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.clar;
      updateFilters(updatedFilters);
    } else if (selectedClarities.length === 1) {
      // Check if this is a toggle operation on an already selected clarity
      const clarityValue = selectedClarities[0];

      // Create an array from the current clarity filter for consistent handling
      const currentClarities = Array.isArray(filters.clar)
        ? filters.clar
        : filters.clar
        ? filters.clar.split(",")
        : [];

      if (currentClarities.includes(clarityValue)) {
        // If the clarity is already selected and it's the only one, remove the filter
        if (currentClarities.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.clar;
          updateFilters(updatedFilters);
        } else {
          // If multiple clarities are selected, remove just this one
          const newClarities = currentClarities.filter(
            (clarity) => clarity !== clarityValue
          );
          updateFilters({ ...filters, clar: newClarities });
        }
      } else {
        // If it's a new clarity, add it to existing selections
        const newClarities = [...currentClarities, clarityValue];
        updateFilters({ ...filters, clar: newClarities });
      }
    } else {
      // Multiple clarities were passed, use as is
      updateFilters({ ...filters, clar: selectedClarities });
    }
  };

  const handlePriceChange = ({ min, max }) => {
    // Debounced update to avoid excessive API calls
    const debouncedUpdate = debounce(() => {
      const updatedFilters = {
        ...filters,
        minPrice: min,
        maxPrice: max,
      };

      // Remove keys if they are at their default values to keep URL clean
      if (min === 0 || min === null) delete updatedFilters.minPrice;
      if (max === 99999999 || max === null) delete updatedFilters.maxPrice;

      updateFilters(updatedFilters);
    }, 500);

    debouncedUpdate();
  };

  const handleCaratChange = ({ min, max }) => {
    const debouncedUpdate = debounce(() => {
      const updatedFilters = { ...filters };

      if (min !== null && min !== undefined && min !== 0.2) {
        updatedFilters.minCarat = min;
      } else {
        delete updatedFilters.minCarat;
      }

      if (max !== null && max !== undefined && max !== 50) {
        updatedFilters.maxCarat = max;
      } else {
        delete updatedFilters.maxCarat;
      }

      updateFilters(updatedFilters);
    }, 500);
    debouncedUpdate();
  };

  const handlePolishChange = (selectedPolishes) => {
    if (selectedPolishes.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.pol;
      updateFilters(updatedFilters);
    } else if (selectedPolishes.length === 1) {
      // Check if this is a toggle operation on an already selected polish
      const polishValue = selectedPolishes[0];

      // Create an array from the current polish filter for consistent handling
      const currentPolishes = Array.isArray(filters.pol)
        ? filters.pol
        : filters.pol
        ? filters.pol.split(",")
        : [];

      if (currentPolishes.includes(polishValue)) {
        // If the polish is already selected and it's the only one, remove the filter
        if (currentPolishes.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.pol;
          updateFilters(updatedFilters);
        } else {
          // If multiple polishes are selected, remove just this one
          const newPolishes = currentPolishes.filter(
            (polish) => polish !== polishValue
          );
          updateFilters({ ...filters, pol: newPolishes });
        }
      } else {
        // If it's a new polish, add it to existing selections
        const newPolishes = [...currentPolishes, polishValue];
        updateFilters({ ...filters, pol: newPolishes });
      }
    } else {
      // Multiple polishes were passed, use as is
      updateFilters({ ...filters, pol: selectedPolishes });
    }
  };

  const handleSymmetryChange = (selectedSymmetries) => {
    if (selectedSymmetries.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.symm;
      updateFilters(updatedFilters);
    } else if (selectedSymmetries.length === 1) {
      // Check if this is a toggle operation on an already selected symmetry
      const symmetryValue = selectedSymmetries[0];

      // Create an array from the current symmetry filter for consistent handling
      const currentSymmetries = Array.isArray(filters.symm)
        ? filters.symm
        : filters.symm
        ? filters.symm.split(",")
        : [];

      if (currentSymmetries.includes(symmetryValue)) {
        // If the symmetry is already selected and it's the only one, remove the filter
        if (currentSymmetries.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.symm;
          updateFilters(updatedFilters);
        } else {
          // If multiple symmetries are selected, remove just this one
          const newSymmetries = currentSymmetries.filter(
            (symmetry) => symmetry !== symmetryValue
          );

          updateFilters({ ...filters, symm: newSymmetries });
        }
      } else {
        // If it's a new symmetry, add it to existing selections
        const newSymmetries = [...currentSymmetries, symmetryValue];

        updateFilters({ ...filters, symm: newSymmetries });
      }
    } else {
      // Multiple symmetries were passed, use as is
      updateFilters({ ...filters, symm: selectedSymmetries });
    }
  };

  const handleLabChange = (selectedLabs) => {
    if (selectedLabs.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.lab;
      updateFilters(updatedFilters);
    } else if (selectedLabs.length === 1) {
      // Check if this is a toggle operation on an already selected lab
      const labValue = selectedLabs[0];

      // Create an array from the current lab filter for consistent handling
      const currentLabs = Array.isArray(filters.lab)
        ? filters.lab
        : filters.lab
        ? filters.lab.split(",")
        : [];

      if (currentLabs.includes(labValue)) {
        // If the lab is already selected and it's the only one, remove the filter
        if (currentLabs.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.lab;
          updateFilters(updatedFilters);
        } else {
          // If multiple labs are selected, remove just this one
          const newLabs = currentLabs.filter((lab) => lab !== labValue);
          updateFilters({ ...filters, lab: newLabs });
        }
      } else {
        // If it's a new lab, add it to existing selections
        const newLabs = [...currentLabs, labValue];
        updateFilters({ ...filters, lab: newLabs });
      }
    } else {
      // Multiple labs were passed, use as is
      updateFilters({ ...filters, lab: selectedLabs });
    }
  };

  const handleFluorescenceChange = (selectedFluorescences) => {
    if (selectedFluorescences.length === 0) {
      // If empty array is passed, remove the filter
      const updatedFilters = { ...filters };
      delete updatedFilters.flu;
      updateFilters(updatedFilters);
    } else if (selectedFluorescences.length === 1) {
      // Check if this is a toggle operation on an already selected fluorescence
      const fluorescenceValue = selectedFluorescences[0];

      // Create an array from the current fluorescence filter for consistent handling
      const currentFluorescences = Array.isArray(filters.flu)
        ? filters.flu
        : filters.flu
        ? filters.flu.split(",")
        : [];

      if (currentFluorescences.includes(fluorescenceValue)) {
        // If the fluorescence is already selected and it's the only one, remove the filter
        if (currentFluorescences.length === 1) {
          const updatedFilters = { ...filters };
          delete updatedFilters.flu;
          updateFilters(updatedFilters);
        } else {
          // If multiple fluorescences are selected, remove just this one
          const newFluorescences = currentFluorescences.filter(
            (fluorescence) => fluorescence !== fluorescenceValue
          );
          updateFilters({ ...filters, flu: newFluorescences });
        }
      } else {
        // If it's a new fluorescence, add it to existing selections
        const newFluorescences = [...currentFluorescences, fluorescenceValue];
        updateFilters({ ...filters, flu: newFluorescences });
      }
    } else {
      // Multiple fluorescences were passed, use as is
      updateFilters({ ...filters, flu: selectedFluorescences });
    }
  };

  const handleDepthChange = ({ min, max }) => {
    const updatedFilters = { ...filters };

    if (min > 0) {
      updatedFilters.minDepth = min;
    } else {
      delete updatedFilters.minDepth;
    }

    if (max < 100) {
      updatedFilters.maxDepth = max;
    } else {
      delete updatedFilters.maxDepth;
    }

    updateFilters(updatedFilters);
  };

  const handleTableChange = ({ min, max }) => {
    const updatedFilters = { ...filters };

    if (min > 0) {
      updatedFilters.minTable = min;
    } else {
      delete updatedFilters.minTable;
    }

    if (max < 100) {
      updatedFilters.maxTable = max;
    } else {
      delete updatedFilters.maxTable;
    }

    updateFilters(updatedFilters);
  };

  const handleLwRatioChange = ({ min, max }) => {
    const updatedFilters = { ...filters };

    if (min > 0) {
      updatedFilters.minLwRatio = min;
    } else {
      delete updatedFilters.minLwRatio;
    }

    if (max < 10) {
      updatedFilters.maxLwRatio = max;
    } else {
      delete updatedFilters.maxLwRatio;
    }

    updateFilters(updatedFilters);
  };

  const handleLengthChange = ({ min, max }) => {
    const updatedFilters = { ...filters };

    if (min > 0) {
      updatedFilters.minLength = min;
    } else {
      delete updatedFilters.minLength;
    }

    if (max < 30) {
      updatedFilters.maxLength = max;
    } else {
      delete updatedFilters.maxLength;
    }

    updateFilters(updatedFilters);
  };

  const handleWidthChange = ({ min, max }) => {
    const updatedFilters = { ...filters };

    if (min > 0) {
      updatedFilters.minWidth = min;
    } else {
      delete updatedFilters.minWidth;
    }

    if (max < 30) {
      updatedFilters.maxWidth = max;
    } else {
      delete updatedFilters.maxWidth;
    }

    updateFilters(updatedFilters);
  };

  const handleSortChange = (newSortValue) => {
    updateSortOption(newSortValue);
  };

  const handleClearFilters = () => {
    clearFilters();
    // Force refresh the pagination component
    setPaginationKey((prevKey) => prevKey + 1);
    // Scroll to top of the page for better UX
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setError(null);
    }, 300),
    []
  );

  const handleSearch = (term) => {
    debouncedSearch(term);
    const updatedFilters = { ...filters, searchTerm: term };

    if (!term) {
      delete updatedFilters.searchTerm;
    }

    updateFilters(updatedFilters);
    changePage(1);

    const url = new URL(window.location);
    if (term) {
      url.searchParams.set("search", term);
    } else {
      url.searchParams.delete("search");
    }
    url.searchParams.set("page", "1");
    window.history.pushState({}, "", url);
  };

  // Handle diamond type change
  const handleDiamondTypeChange = (type) => {
    setDiamondType(type);
    setError(null);
    const updatedFilters = { ...filters };
    // Set the correct product type based on the selected type
    updatedFilters.productType =
      type === "lab" ? "lab_diamond" : "natural_diamond";

    // Reset to first page when changing diamond type
    setPaginationKey((prev) => prev + 1);
    updateFilters(updatedFilters);
    changePage(1);

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set("type", type);
    url.searchParams.set("page", "1");
    window.history.pushState({}, "", url);
  };

  // Update error state when hook error changes
  useEffect(() => {
    if (hookError) {
      setError(hookError);
      setIsProductsLoading(false);
    }
  }, [hookError]);

  // Update loading state
  useEffect(() => {
    setIsProductsLoading(loading);
  }, [loading]);

  // Update pagination key whenever pagination changes to force re-render
  useEffect(() => {
    setPaginationKey((prev) => prev + 1);
  }, [pagination]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      const pageNumber = parseInt(newPage);
      if (isNaN(pageNumber)) {
        console.error("Invalid page number:", newPage);
        return;
      }

      setIsProductsLoading(true);
      changePage(pageNumber);

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set("page", pageNumber);
      window.history.pushState({}, "", url);
    },
    [changePage]
  );

  // Handle limit change
  const handleLimitChange = useCallback(
    (newLimit) => {
      const limitNumber = parseInt(newLimit);
      if (isNaN(limitNumber)) {
        console.error("Invalid limit number:", newLimit);
        return;
      }

      setIsProductsLoading(true);
      changeLimit(limitNumber);
      changePage(1); // Reset to first page when changing limit

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set("limit", limitNumber);
      url.searchParams.set("page", "1");
      window.history.pushState({}, "", url);
    },
    [changeLimit, changePage]
  );

  // Initialize from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 1;
    const limit = parseInt(params.get("limit")) || 12;
    const type = params.get("type");
    const search = params.get("search");
    const category = params.get("category");

    // Set initial values
    if (type && ["lab", "natural"].includes(type)) {
      setDiamondType(type);
      handleDiamondTypeChange(type);
    }

    if (search) {
      setSearchTerm(search);
      handleSearch(search);
    }

    // Handle category/shape filter from URL
    if (category) {
      const updatedFilters = { ...filters };
      updatedFilters.shape = [category];
      updateFilters(updatedFilters);
    }

    // Set initial pagination
    changePage(page);
    changeLimit(limit);
  }, []);

  // Calculate filter values for QuickFilters component
  const selectedShapes = Array.isArray(filters.shape)
    ? filters.shape.map(String)
    : filters.shape
    ? filters.shape.split(",").map(String)
    : [];

  const selectedColors = [
    ...(Array.isArray(filters.col)
      ? filters.col
      : filters.col
      ? filters.col.split(",")
      : []),
    ...(Array.isArray(filters.fancyIntensity)
      ? filters.fancyIntensity
      : filters.fancyIntensity
      ? filters.fancyIntensity.split(",")
      : []),
  ];

  const selectedCuts = Array.isArray(filters.cut)
    ? filters.cut
    : filters.cut
    ? filters.cut.split(",")
    : [];

  const selectedClarities = Array.isArray(filters.clar)
    ? filters.clar
    : filters.clar
    ? filters.clar.split(",")
    : [];

  const priceRange = [
    filters.minPrice !== undefined ? Number(filters.minPrice) : 0,
    filters.maxPrice !== undefined ? Number(filters.maxPrice) : 99999999,
  ];

  const caratRange = [
    filters.minCarat !== undefined ? Number(filters.minCarat) : 0.2,
    filters.maxCarat !== undefined ? Number(filters.maxCarat) : 50,
  ];

  const selectedPolishes = Array.isArray(filters.pol)
    ? filters.pol
    : filters.pol
    ? filters.pol.split(",")
    : [];

  const selectedSymmetries = Array.isArray(filters.symm)
    ? filters.symm
    : filters.symm
    ? filters.symm.split(",")
    : [];

  const selectedLabs = Array.isArray(filters.lab)
    ? filters.lab
    : filters.lab
    ? filters.lab.split(",")
    : [];

  const selectedFluorescences = Array.isArray(filters.flu)
    ? filters.flu
    : filters.flu
    ? filters.flu.split(",")
    : [];

  const tableRange = [filters.minTable || 0, filters.maxTable || 100];

  const depthRange = [filters.minDepth || 0, filters.maxDepth || 100];

  const lwRatioRange = [filters.minLwRatio || 0, filters.maxLwRatio || 10];

  const lengthRange = [filters.minLength || 0, filters.maxLength || 30];

  const widthRange = [filters.minWidth || 0, filters.maxWidth || 30];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Background Image */}
      <BannerSection productsType={"diamond"} />

      {/* Filters and search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Below Hero Section Text*/}
        <SubBannerSection productsType={"diamond"} />
        {/* Search bar */}
        <SearchBar onSearch={handleSearch} initialSearchTerm={searchTerm} />

        {/* Diamond type filter buttons */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <button
              onClick={() => handleDiamondTypeChange("lab")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                diamondType === "lab"
                  ? "bg-black text-white shadow-lg hover:bg-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-900 hover:text-white border border-gray-200"
              }`}
            >
              Lab Grown
            </button>
            <button
              onClick={() => handleDiamondTypeChange("natural")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                diamondType === "natural"
                  ? "bg-black text-white shadow-lg hover:bg-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-900 hover:text-white border border-gray-200"
              }`}
            >
              Natural
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Main Layout - Three Section Design */}
        <div className="flex flex-col w-full">
          {/* SECTION 1: Quick filters - Full Width on All Screens (hidden on mobile) */}
          <QuickFilters
            categories={diamondShapes}
            selectedCategories={selectedShapes}
            onCategoryChange={handleShapeChange}
            colors={[
              ...colorOptions,
              ...fancyColorOptions,
              ...fancyIntensityOptions,
            ]}
            selectedColors={selectedColors}
            onColorChange={handleColorChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            caratRange={[
              filters.minCarat !== undefined ? Number(filters.minCarat) : 0.2,
              filters.maxCarat !== undefined ? Number(filters.maxCarat) : 50,
            ]}
            onCaratChange={handleCaratChange}
            cuts={cutOptions}
            selectedCuts={selectedCuts}
            onCutChange={handleCutChange}
            clarities={clarityOptions}
            selectedClarities={selectedClarities}
            onClarityChange={handleClarityChange}
            onClearFilters={handleClearFilters}
            isLoading={shapesLoading}
            type="diamond"
          />

          {/* SECTION 2 & 3: Main Content Area with Left Sidebar and Product Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button - Only show on mobile */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="w-full py-2 bg-gray-900 text-white rounded-lg flex justify-center items-center space-x-2"
              >
                <FaFilter />
                <span>{isMobileFilterOpen ? "Hide Filters" : "Filters"}</span>
                {Object.keys(filters).length > 0 && (
                  <span className="bg-white text-gray-900 text-xs rounded-full px-2 py-0.5 ml-2">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filter Panel */}
            <MobileFilterPanel
              isMobileFilterOpen={isMobileFilterOpen}
              setIsMobileFilterOpen={setIsMobileFilterOpen}
              selectedCategories={selectedShapes}
              onCategoryChange={handleShapeChange}
              categories={diamondShapes}
              colors={[
                ...colorOptions,
                ...fancyColorOptions,
                ...fancyIntensityOptions,
              ]}
              selectedColors={selectedColors}
              onColorChange={handleColorChange}
              priceRange={[
                filters.minPrice !== undefined ? Number(filters.minPrice) : 0,
                filters.maxPrice !== undefined
                  ? Number(filters.maxPrice)
                  : 99999999,
              ]}
              onPriceChange={handlePriceChange}
              caratRange={[
                filters.minCarat !== undefined ? Number(filters.minCarat) : 0.2,
                filters.maxCarat !== undefined ? Number(filters.maxCarat) : 50,
              ]}
              onCaratChange={handleCaratChange}
              cuts={cutOptions}
              selectedCuts={selectedCuts}
              onCutChange={handleCutChange}
              clarities={clarityOptions}
              selectedClarities={selectedClarities}
              onClarityChange={handleClarityChange}
              polishes={polishOptions}
              selectedPolishes={selectedPolishes}
              onPolishChange={handlePolishChange}
              symmetries={symmetryOptions}
              selectedSymmetries={selectedSymmetries}
              onSymmetryChange={handleSymmetryChange}
              labs={labOptions}
              selectedLabs={selectedLabs}
              onLabChange={handleLabChange}
              fluorescences={fluorescenceOptions}
              selectedFluorescences={selectedFluorescences}
              onFluorescenceChange={handleFluorescenceChange}
              depthRange={depthRange}
              onDepthChange={handleDepthChange}
              tableRange={tableRange}
              onTableChange={handleTableChange}
              lwRatioRange={lwRatioRange}
              onLwRatioChange={handleLwRatioChange}
              lengthRange={lengthRange}
              onLengthChange={handleLengthChange}
              widthRange={widthRange}
              onWidthChange={handleWidthChange}
              onClearFilters={handleClearFilters}
              type="diamond"
            />

            {/* Advanced Filters */}
            <AdvancedFilters
              polishes={polishOptions}
              selectedPolishes={selectedPolishes}
              onPolishChange={handlePolishChange}
              symmetries={symmetryOptions}
              selectedSymmetries={selectedSymmetries}
              onSymmetryChange={handleSymmetryChange}
              labs={labOptions}
              selectedLabs={selectedLabs}
              onLabChange={handleLabChange}
              fluorescences={fluorescenceOptions}
              selectedFluorescences={selectedFluorescences}
              onFluorescenceChange={handleFluorescenceChange}
              depthRange={depthRange}
              onDepthChange={handleDepthChange}
              tableRange={tableRange}
              onTableChange={handleTableChange}
              lwRatioRange={lwRatioRange}
              onLwRatioChange={handleLwRatioChange}
              lengthRange={lengthRange}
              onLengthChange={handleLengthChange}
              widthRange={widthRange}
              onWidthChange={handleWidthChange}
              onClearFilters={handleClearFilters}
            />

            {/* Products panel */}
            <div className="flex-1 flex flex-col">
              {/* Sort and Count Information */}
              <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <div className="text-sm text-gray-500">
                  {!isProductsLoading && pagination.totalCount > 0 && (
                    <span>
                      Showing {diamonds.length} of {pagination.totalCount}{" "}
                      diamonds
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center space-x-3">
                  {/* Clear All Filters Button */}
                  {Object.keys(filters).length > 0 && (
                    <div>
                      <button
                        onClick={handleClearFilters}
                        className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium flex items-center"
                      >
                        <span className="mr-1">Clear All Filters</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <SortDropdown
                    options={sortOptions}
                    value={sortOption}
                    onChange={handleSortChange}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 p-4 mb-4 bg-red-50 rounded">
                  Error loading diamonds: {error}
                </div>
              )}

              <ProductsPanel
                products={diamonds || []}
                isProductsLoading={isProductsLoading}
                setIsProductsLoading={setIsProductsLoading}
              />

              {/* No Diamonds Found Message */}
              {!isProductsLoading && (!diamonds || diamonds.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 mb-4 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Diamonds Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    We couldn't find any diamonds matching your criteria. Try
                    adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-300"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!isProductsLoading &&
                Array.isArray(diamonds) &&
                diamonds.length > 0 &&
                pagination.totalPages > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      key={paginationKey}
                      loading={isProductsLoading}
                    />
                  </div>
                )}

              {/* Items per page selector */}
              {!isProductsLoading && diamonds.length > 0 && (
                <div className="mt-4 flex justify-end items-center space-x-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="80">80</option>
                  </select>
                </div>
              )}

              {/* Summary */}
              {!isProductsLoading && pagination.totalCount > 0 && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalCount
                  )}{" "}
                  of {pagination.totalCount} diamonds
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diamond;
