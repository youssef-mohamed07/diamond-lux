import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCategories } from "../hooks/useCategories";
import { updateProductIsPopular } from "../api/productApi";
import axiosInstance from "../utils/axios";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const categories = useCategories();
  const fetchList = async () => {
    try {
      const response = await axiosInstance.get("/product");

      if (response.data) {
        setList(response.data.Products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axiosInstance.delete(`/product/${id}`);

      if (response.data) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleIsPopular = async (id, currentStatus) => {
    try {
      const updatedProduct = await updateProductIsPopular(
        id,
        !currentStatus,
        token
      );
      toast.success("Product updated successfully");
      setList((prevList) =>
        prevList.map((item) =>
          item._id === id
            ? { ...item, isPopular: updatedProduct.isPopular }
            : item
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <p className="mb-2 text-lg md:text-xl font-medium">All Products List</p>
      <div className="overflow-x-auto shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
                Image
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
                Category
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
                Price
              </th>
              <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
                Popular
              </th>
              <th className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.length > 0 ? (
              list.map((item, index) => {
                const category = categories?.find(
                  (cat) => cat._id === item.category
                );
                const categoryName = category ? category.name : "Unknown";

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap ">
                      <img
                        className="w-10 md:w-12 h-10 md:h-12 object-cover rounded"
                        src={item.imageCover}
                        alt="cover-img"
                      />
                    </td>
                    <td className="px-3 py-2 text-xs md:text-sm">
                      {item.title}
                    </td>
                    <td className="px-3 py-2 text-xs md:text-sm">
                      {categoryName}
                    </td>
                    <td className="px-3 py-2 text-xs md:text-sm">
                      ${item.price}
                    </td>
                    <td className="px-3 py-2 text-xs md:text-sm">
                      <input
                        type="checkbox"
                        checked={item.isPopular}
                        onChange={() =>
                          toggleIsPopular(item._id, item.isPopular)
                        }
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => removeProduct(item._id)}
                        className="text-red-500 hover:text-red-700 text-sm md:text-base font-bold "
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-3 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
