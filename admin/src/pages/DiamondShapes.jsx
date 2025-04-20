import React from "react";
import axios from "axios";

import { useEffect, useState, useRef } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useProducts } from "../hooks/useProducts";

function DiamondShapes({ token }) {
  const [list, setList] = useState([]);
  const { products } = useProducts();
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fileInputRef = useRef(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const BACKEND_URL_WITHOUT_API = backendURL.replace("/api", "");

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

  const handleImageUpload = async (categoryId, file) => {
    setUploading(true);
    setSelectedCategory(categoryId);

    try {
      const formData = new FormData();
      formData.append("img", file);

      const response = await axios.post(
        `${backendUrl}/category/${categoryId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Image uploaded successfully");
        // Update the local list with the new image
        setList((prevList) =>
          prevList.map((cat) =>
            cat._id === categoryId
              ? { ...cat, image: response.data.category.image }
              : cat
          )
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      setSelectedCategory(null);
    }
  };

  const handleFileSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedCategory) {
      handleImageUpload(selectedCategory, file);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = null;
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
            You can upload images for each diamond shape category.
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {getProductCountForCategory(category._id)} products
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-50 rounded h-16 w-16 flex items-center justify-center mb-2 overflow-hidden">
                    {category.image ? (
                      <img
                        src={`${BACKEND_URL_WITHOUT_API}/uploads/diamond-shapes/${category.image}`}
                        alt={category.name}
                        className="object-contain h-14 w-14"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleFileSelect(category._id)}
                    disabled={uploading && selectedCategory === category._id}
                    className="text-xs py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    {uploading && selectedCategory === category._id
                      ? "Uploading..."
                      : category.image
                      ? "Change Image"
                      : "Upload Image"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiamondShapes;
