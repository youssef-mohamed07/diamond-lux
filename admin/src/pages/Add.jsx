import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { getCategories } from "../api/categoryApi";
import axiosInstance from "../utils/axios";
import { addProduct } from "../api/productApi";
import 'froala-editor/js/plugins.pkgd.min.js'; 
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css'; 
import { lazy, Suspense } from "react";

const FroalaEditor = lazy(() => import("react-froala-wysiwyg"));


const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [popularProduct, setPopularProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);

  const config = {
    key : "AZdksUMuR2CArgS8xFhATz",
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarInline: false,
    attribution: false,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const sanitizeContent = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    // Remove the "Powered by Froala Editor" paragraph
    div.querySelectorAll('p[data-f-id="pbf"]').forEach((el) => el.remove());

    return div.innerHTML;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!category) {
        toast.error("Please select a category");
        return;
      }
      if (!name || !description || !price || !image1) {
        toast.error("Please fill in all required fields");
        return;
      }

      const formData = new FormData();

      formData.append("title", name);
      formData.append("description", sanitizeContent(description)); // Sanitize description
      formData.append("price", price);
      formData.append("category", category);
      formData.append("imageCover", image1);
      formData.append("isPopular", popularProduct);
      if (image2) formData.append("images", image2);
      if (image3) formData.append("images", image3);
      if (image4) formData.append("images", image4);

      // Debug formData
      console.log("Submitting form data:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const product = await addProduct(formData, token);
      if (product) {
        console.log("Product added:", product);
        toast.success("Product added successfully");
      } else {
        toast.error("Failed to add product");
      }

      // Reset form
      setName("");
      setDescription("");
      setImage1(false);
      setImage2(false);
      setImage3(false);
      setImage4(false);
      setPrice("");
      setPopularProduct(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error.response?.data?.Message ||
          error.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm md:text-base font-medium">Upload Image</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label htmlFor="image1" className="cursor-pointer">
              <img
                className="w-full aspect-square object-cover border rounded"
                src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
                alt=""
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image1"
                hidden
              />
            </label>
            <label htmlFor="image2" className="cursor-pointer">
              <img
                className="w-full aspect-square object-cover border rounded"
                src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
                alt=""
              />
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                id="image2"
                hidden
              />
            </label>
            <label htmlFor="image3" className="cursor-pointer">
              <img
                className="w-full aspect-square object-cover border rounded"
                src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
                alt=""
              />
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                id="image3"
                hidden
              />
            </label>
            <label htmlFor="image4" className="cursor-pointer">
              <img
                className="w-full aspect-square object-cover border rounded"
                src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
                alt=""
              />
              <input
                onChange={(e) => setImage4(e.target.files[0])}
                type="file"
                id="image4"
                hidden
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm md:text-base font-medium">
              Product name
            </p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-3 py-2 border rounded text-sm md:text-base"
              type="text"
              placeholder="Type here"
              required
            />
          </div>

          <div>
            <p className="mb-2 text-sm md:text-base font-medium">
              Product description
            </p>
            <Suspense fallback={<div>Loading editor...</div>}>
            <FroalaEditor
              tag="textarea"
              config={config}
              model={description || ""}
              onModelChange={setDescription}
            />
          </Suspense>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="mb-2 text-sm md:text-base font-medium">
                Product category
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm md:text-base font-medium">
                Product Price
              </p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                type="Number"
                placeholder="25"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPopular"
              checked={popularProduct}
              onChange={() => setPopularProduct((prev) => !prev)}
              className="w-4 h-4"
            />
            <label
              className="cursor-pointer text-sm md:text-base"
              htmlFor="isPopular"
            >
              Add to Popular Products
            </label>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded hover:opacity-90 text-sm md:text-base"
          >
            ADD
          </button>
        </div>
      </div>
    </form>
  );
};

export default Add;
