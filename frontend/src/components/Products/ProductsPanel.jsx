import { FaExclamationTriangle } from "react-icons/fa";
import GalleryItem from "../Home/GalleryItem";
import { useEffect } from "react";

const ProductsPanel = ({
  products,
  isProductsLoading,
  setIsProductsLoading,
}) => {
  useEffect(() => {
    // Update loading state when products array changes
    if (Array.isArray(products) && products.length > 0) {
      setIsProductsLoading(false);
    }
  }, [products, setIsProductsLoading]);

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
      {isProductsLoading ? (
        <div className="col-span-full min-h-[300px] flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : Array.isArray(products) && products.length > 0 ? (
        <>
          {products.map((product, index) => (
            <GalleryItem
              key={product._id || index}
              item={product}
              index={index}
            />
          ))}
        </>
      ) : (
        <div className="col-span-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-lg p-10">
          <FaExclamationTriangle className="text-4xl text-gray-400 mb-3" />
          <h3 className="text-xl font-medium text-gray-800 mb-1">
            No diamonds found
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-4"></p>
        </div>
      )}
    </div>
  );
};

export default ProductsPanel;
