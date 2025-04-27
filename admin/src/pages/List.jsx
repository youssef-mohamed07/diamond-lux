import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCategories } from "../hooks/useCategories";
import { updateProductIsPopular } from "../api/productApi";
import axiosInstance from "../utils/axios";
import Loading from "../components/Loading";
import { getImageUrl } from "../../utils/imageHelper";

const List = ({ token }) => {
  const [diamondProducts, setDiamondProducts] = useState([]);
  const [jewelryProducts, setJewelryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [diamondPage, setDiamondPage] = useState(1);
  const [jewelryPage, setJewelryPage] = useState(1);
  const [hasMoreDiamonds, setHasMoreDiamonds] = useState(true);
  const [hasMoreJewelry, setHasMoreJewelry] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const categories = useCategories();

  const fetchProducts = async (reset = false) => {
    try {
      setIsLoading(true);
      const fetcheDiamondProducts = await axiosInstance.get(
        "/product/diamonds",
        { params: { page: 1 } }
      );
      console.log(fetcheDiamondProducts);
      const fetchedJeweleryProducts = await axiosInstance.get(
        "/product/jewelery",
        { params: { page: 1 } }
      );
      console.log(fetchedJeweleryProducts.data.products);
      if (fetcheDiamondProducts.data && fetchedJeweleryProducts.data) {
        // Extract products from the nested data structure
        setDiamondProducts(fetcheDiamondProducts.data.products || []);
        setJewelryProducts(fetchedJeweleryProducts.data.products || []);

        // Check if there are more pages
        setHasMoreDiamonds(
          fetcheDiamondProducts.data.currentPage <
            fetcheDiamondProducts.data.totalPages
        );
        setHasMoreJewelry(
          fetchedJeweleryProducts.data.currentPage <
            fetchedJeweleryProducts.data.totalPages
        );

        // Reset page counters if needed
        if (reset) {
          setDiamondPage(1);
          setJewelryPage(1);
        }

        setIsLoading(false);
      } else {
        toast.error(
          fetcheDiamondProducts?.message || fetchedJeweleryProducts?.message
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const loadMoreDiamonds = async () => {
    try {
      setLoadingMore(true);
      const nextPage = diamondPage + 1;
      const response = await axiosInstance.get("/product/diamonds", {
        params: { page: nextPage },
      });

      if (response.data && response.data.products) {
        setDiamondProducts([...diamondProducts, ...response.data.products]);
        setDiamondPage(nextPage);
        setHasMoreDiamonds(
          response.data.currentPage < response.data.totalPages
        );
      } else {
        toast.error("Failed to load more diamond products");
      }
      setLoadingMore(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoadingMore(false);
    }
  };

  const loadMoreJewelry = async () => {
    try {
      setLoadingMore(true);
      const nextPage = jewelryPage + 1;
      const response = await axiosInstance.get("/product/jewelery", {
        params: { page: nextPage },
      });

      if (response.data && response.data.products) {
        setJewelryProducts([...jewelryProducts, ...response.data.products]);
        setJewelryPage(nextPage);
        setHasMoreJewelry(response.data.currentPage < response.data.totalPages);
      } else {
        toast.error("Failed to load more jewelry products");
      }
      setLoadingMore(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoadingMore(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axiosInstance.delete(`/product/${id}`);

      if (response.data) {
        toast.success(response.data.message);
        await fetchProducts(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleIsPopular = async (id, currentStatus, productType) => {
    try {
      const updatedProduct = await updateProductIsPopular(
        id,
        !currentStatus,
        token
      );
      toast.success("Product updated successfully");

      if (productType === "diamond") {
        setDiamondProducts((prevList) =>
          prevList.map((item) =>
            item._id === id
              ? { ...item, isPopular: updatedProduct.isPopular }
              : item
          )
        );
      } else {
        setJewelryProducts((prevList) =>
          prevList.map((item) =>
            item._id === id
              ? { ...item, isPopular: updatedProduct.isPopular }
              : item
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const DiamondTable = () => (
    <div className="overflow-x-auto shadow-sm rounded-lg mb-8">
      <p className="my-3 text-lg md:text-xl font-medium">Diamond Products</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Image
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Name
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Diamond Shape
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Price
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Carats
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Color
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Clarity
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Cut
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Polish
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Symmetry
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Fluorescence
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Dept
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Table
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Dimensions
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Lab
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Brown
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Green
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Milky
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Popular
            </th>
            <th className="px-2 py-3 text-center text-xs md:text-sm font-medium text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {diamondProducts.length > 0 ? (
            diamondProducts.map((item, index) => {
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <img
                      className="w-10 md:w-12 h-10 md:h-12 object-cover rounded"
                      src={getImageUrl(item.imageCover)}
                      alt="cover-img"
                    />
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">{item.title}</td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.shape || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    ${item.price}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.carats || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.col || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.clar || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.cut || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.pol || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.symm || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.flo || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.depth || "-"}%
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.table || "-"}%
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.length && item.width && item.height
                      ? `${item.length}×${item.width}×${item.height}`
                      : "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.lab || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.brown || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.green || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.milky || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    <input
                      type="checkbox"
                      checked={item.isPopular}
                      onChange={() =>
                        toggleIsPopular(item._id, item.isPopular, "diamond")
                      }
                    />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm md:text-base font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="24" className="px-2 py-4 text-center text-gray-500">
                No diamond products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {hasMoreDiamonds && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMoreDiamonds}
            disabled={loadingMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );

  const JewelryTable = () => (
    <div className="overflow-x-auto shadow-sm rounded-lg">
      <p className="my-3 text-lg md:text-xl font-medium">Jewelry Products</p>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Image
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Name
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Jewelry Type
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Price
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Diamond Type
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Metal
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Metal Color
            </th>
            <th className="px-2 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
              Popular
            </th>
            <th className="px-2 py-3 text-center text-xs md:text-sm font-medium text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jewelryProducts.length > 0 ? (
            jewelryProducts.map((item, index) => {
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <img
                      className="w-10 md:w-12 h-10 md:h-12 object-cover rounded"
                      src={getImageUrl(item.imageCover)}
                      alt="cover-img"
                    />
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">{item.title}</td>
                  <td className="px-2 py-2 text-xs md:text-sm capitalize">
                    {item.jewelryType || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    ${item.price}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm capitalize">
                    {item.diamondType?.replace("_", " ") || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.metal || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    {item.metalColor || "-"}
                  </td>
                  <td className="px-2 py-2 text-xs md:text-sm">
                    <input
                      type="checkbox"
                      checked={item.isPopular}
                      onChange={() =>
                        toggleIsPopular(item._id, item.isPopular, "jewelry")
                      }
                    />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm md:text-base font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10" className="px-2 py-4 text-center text-gray-500">
                No jewelry products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {hasMoreJewelry && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMoreJewelry}
            disabled={loadingMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <p className="mb-6 text-xl md:text-2xl font-medium">
        Products Management
      </p>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <DiamondTable />
          <JewelryTable />
        </>
      )}
    </div>
  );
};

export default List;
