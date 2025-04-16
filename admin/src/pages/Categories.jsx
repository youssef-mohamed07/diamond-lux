import React from "react";
import axios from "axios";

import { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useProducts } from "../hooks/useProducts";

function Categories({ token }) {
  const [list, setList] = useState([]);
  const { products } = useProducts();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/category");
      if (response.data) {
        setList(response.data.categories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const getProductCountForCategory = (categoryId) => {
    return products.filter((product) => product.category === categoryId).length;
  };

  return (
    <div className="p-4 md:p-6">
      <p className="mb-4 text-lg md:text-xl font-medium">
        Diamond Shape Categories
      </p>

      <div className="flex flex-col gap-4">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-blue-700">
            Diamond shape categories are predefined and cannot be modified.
            These categories represent standard diamond shapes in the industry.
          </p>
        </div>

        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-3 py-3 text-left text-xs md:text-sm font-medium text-gray-500">
                  ID
                </th>
                <th className="px-3 py-3 text-center text-xs md:text-sm font-medium text-gray-500">
                  Products Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.map((item, index) => (
                <tr key={index} className="text-sm">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item._id}</td>
                  <td className="border p-2 text-center">
                    {getProductCountForCategory(item._id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categories;
