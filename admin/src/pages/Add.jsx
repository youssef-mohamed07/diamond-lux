import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { getCategories } from "../api/categoryApi";
import axiosInstance from "../utils/axios";
import { addProduct } from "../api/productApi";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
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
  const [isLoading, setIsLoading] = useState(true);

  // Product type selection
  const [productType, setProductType] = useState("diamond");
  const [jewelryType, setJewelryType] = useState("earrings");

  // Diamond-specific properties
  const [shape, setShape] = useState("");
  const [carats, setCarats] = useState("");
  const [col, setCol] = useState("");
  const [clar, setClar] = useState("");
  const [cut, setCut] = useState("");
  const [pol, setPol] = useState("");
  const [symm, setSymm] = useState("");
  const [flo, setFlo] = useState("");
  const [floCol, setFloCol] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [table, setTable] = useState("");
  const [culet, setCulet] = useState("");
  const [lab, setLab] = useState("");
  const [girdle, setGirdle] = useState("");
  const [eyeClean, setEyeClean] = useState("");
  const [brown, setBrown] = useState("");
  const [green, setGreen] = useState("");
  const [milky, setMilky] = useState("");

  // Jewelry-specific properties
  const [diamondType, setDiamondType] = useState("lab_grown");
  const [metal, setMetal] = useState("");
  const [metalColor, setMetalColor] = useState("");

  const config = {
    key: "AZdksUMuR2CArgS8xFhATz",
    placeholderText: "Edit Your Content Here!",
    charCounterCount: false,
    toolbarInline: false,
    attribution: false,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        if (data && Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) {
            // Only set category if product type is diamond
            if (productType === "diamond") {
              setCategory(data[0]._id);
            } else {
              // For jewelry, set category to "None"
              setCategory("None");
            }
          }
        } else {
          setCategories([]);
          toast.error("Failed to load categories: Invalid data format");
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [productType]); // Add productType as a dependency

  // Update category when product type changes
  useEffect(() => {
    if (productType === "jewelry") {
      setCategory("None");
    } else if (categories.length > 0) {
      setCategory(categories[0]._id);
    }
  }, [productType, categories]);

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

      // Validate product type specific fields
      if (productType === "diamond" && !category) {
        toast.error("Shape is required for diamond products");
        return;
      }

      if (productType === "jewelry") {
        if (!metal) {
          toast.error("Metal is required for jewelry products");
          return;
        }
        if (!metalColor) {
          toast.error("Metal color is required for jewelry products");
          return;
        }
      }

      const formData = new FormData();

      formData.append("title", name);
      formData.append("description", sanitizeContent(description)); // Sanitize description
      formData.append("price", price);
      formData.append("category", category);
      formData.append("imageCover", image1);
      formData.append("isPopular", popularProduct);
      formData.append("productType", productType);

      if (productType === "jewelry") {
        formData.append("jewelryType", jewelryType);
        formData.append("diamondType", diamondType);
        formData.append("metal", metal);
        formData.append("metalColor", metalColor);
      } else if (productType === "diamond") {
        // For diamond products, set the shape field to the selected category
        formData.append("shape", category);
      }

      if (image2) formData.append("images", image2);
      if (image3) formData.append("images", image3);
      if (image4) formData.append("images", image4);

      // Append diamond-specific properties
      if (carats) formData.append("carats", carats);
      if (col) formData.append("col", col);
      if (clar) formData.append("clar", clar);
      if (cut) formData.append("cut", cut);
      if (pol) formData.append("pol", pol);
      if (symm) formData.append("symm", symm);
      if (flo) formData.append("flo", flo);
      if (floCol) formData.append("floCol", floCol);
      if (length) formData.append("length", length);
      if (width) formData.append("width", width);
      if (height) formData.append("height", height);
      if (depth) formData.append("depth", depth);
      if (table) formData.append("table", table);
      if (culet) formData.append("culet", culet);
      if (lab) formData.append("lab", lab);
      if (girdle) formData.append("girdle", girdle);
      if (eyeClean) formData.append("eyeClean", eyeClean);
      if (brown) formData.append("brown", brown);
      if (green) formData.append("green", green);
      if (milky) formData.append("milky", milky);

      const product = await addProduct(formData, token);
      if (product) {
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
      setProductType("diamond");
      setJewelryType("earrings");
      setDiamondType("lab_grown");
      setMetal("");
      setMetalColor("");

      // Reset diamond-specific properties
      setShape("");
      setCarats("");
      setCol("");
      setClar("");
      setCut("");
      setPol("");
      setSymm("");
      setFlo("");
      setFloCol("");
      setLength("");
      setWidth("");
      setHeight("");
      setDepth("");
      setTable("");
      setCulet("");
      setLab("");
      setGirdle("");
      setEyeClean("");
      setBrown("");
      setGreen("");
      setMilky("");
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
                Product Price
              </p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                type="number"
                placeholder="25"
                required
              />
            </div>

            <div>
              <p className="mb-2 text-sm md:text-base font-medium">
                Product Type
              </p>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                required
              >
                <option value="diamond">Diamond</option>
                <option value="jewelry">Jewelry</option>
              </select>
            </div>

            {productType === "jewelry" && (
              <div>
                <p className="mb-2 text-sm md:text-base font-medium">
                  Jewelry Type
                </p>
                <select
                  value={jewelryType}
                  onChange={(e) => setJewelryType(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm md:text-base"
                  required
                >
                  <option value="earrings">Earrings</option>
                  <option value="necklace">Necklace</option>
                  <option value="bracelet">Bracelet</option>
                  <option value="engagement_ring">Engagement Ring</option>
                  <option value="wedding_band">Wedding Band</option>
                </select>
              </div>
            )}
          </div>

          {/* Jewelry Properties */}
          {productType === "jewelry" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Jewelry Properties</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Diamond Type
                  </p>
                  <select
                    value={diamondType}
                    onChange={(e) => setDiamondType(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    required
                  >
                    <option value="lab_grown">Lab Grown</option>
                    <option value="natural">Natural</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">Metal</p>
                  <input
                    onChange={(e) => setMetal(e.target.value)}
                    value={metal}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="14k GOLD, 18k GOLD, 950 Plat, etc."
                    required
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Metal Color
                  </p>
                  <input
                    onChange={(e) => setMetalColor(e.target.value)}
                    value={metalColor}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="Yellow, White, Rose, etc."
                    required
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Carats
                  </p>
                  <input
                    onChange={(e) => setCarats(e.target.value)}
                    value={carats}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="number"
                    step="0.01"
                    placeholder="0.50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Diamond Properties */}
          {productType === "diamond" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Diamond Properties</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Row 1 */}
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Diamond Shape
                  </p>
                  {isLoading ? (
                    <div className="w-full px-3 py-2 border rounded text-sm md:text-base bg-gray-100">
                      Loading shapes...
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm md:text-base"
                      required
                    >
                      <option value="">Select a shape</option>
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No shapes available
                        </option>
                      )}
                    </select>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Carats
                  </p>
                  <input
                    onChange={(e) => setCarats(e.target.value)}
                    value={carats}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="number"
                    step="0.01"
                    placeholder="0.50"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">Color</p>
                  <input
                    onChange={(e) => setCol(e.target.value)}
                    value={col}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="D, E, F, etc."
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Clarity
                  </p>
                  <input
                    onChange={(e) => setClar(e.target.value)}
                    value={clar}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="IF, VVS1, etc."
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">Cut</p>
                  <input
                    onChange={(e) => setCut(e.target.value)}
                    value={cut}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="Excellent, Very Good, etc."
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Polish
                  </p>
                  <input
                    onChange={(e) => setPol(e.target.value)}
                    value={pol}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="Excellent, Very Good, etc."
                  />
                </div>

                {/* Row 3 */}
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Symmetry
                  </p>
                  <input
                    onChange={(e) => setSymm(e.target.value)}
                    value={symm}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="Excellent, Very Good, etc."
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Fluorescence
                  </p>
                  <input
                    onChange={(e) => setFlo(e.target.value)}
                    value={flo}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="None, Faint, etc."
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Fluorescence Color
                  </p>
                  <input
                    onChange={(e) => setFloCol(e.target.value)}
                    value={floCol}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="Blue, Yellow, etc."
                  />
                </div>

                {/* Row 4 - Measurements */}
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Length (mm)
                  </p>
                  <input
                    onChange={(e) => setLength(e.target.value)}
                    value={length}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="number"
                    step="0.01"
                    placeholder="5.50"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Width (mm)
                  </p>
                  <input
                    onChange={(e) => setWidth(e.target.value)}
                    value={width}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="number"
                    step="0.01"
                    placeholder="5.45"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Height (mm)
                  </p>
                  <input
                    onChange={(e) => setHeight(e.target.value)}
                    value={height}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="number"
                    step="0.01"
                    placeholder="3.30"
                  />
                </div>

                {/* Row 5 */}
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Depth (%)
                  </p>
                  <input
                    onChange={(e) => setDepth(e.target.value)}
                    value={depth}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="number"
                    step="0.1"
                    placeholder="61.5"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Table (%)
                  </p>
                  <input
                    onChange={(e) => setTable(e.target.value)}
                    value={table}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="number"
                    step="0.1"
                    placeholder="56.0"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">Culet</p>
                  <input
                    onChange={(e) => setCulet(e.target.value)}
                    value={culet}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="None, Very Small, etc."
                  />
                </div>

                {/* Row 6 */}
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">Lab</p>
                  <input
                    onChange={(e) => setLab(e.target.value)}
                    value={lab}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="GIA, IGI, etc."
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Girdle
                  </p>
                  <input
                    onChange={(e) => setGirdle(e.target.value)}
                    value={girdle}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    type="text"
                    placeholder="Thin, Medium, etc."
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Eye Clean
                  </p>
                  <select
                    onChange={(e) => setEyeClean(e.target.value)}
                    value={eyeClean}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Row 7 - Tints */}
                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Brown Tint
                  </p>
                  <select
                    onChange={(e) => setBrown(e.target.value)}
                    value={brown}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                  >
                    <option value="">Select</option>
                    <option value="None">None</option>
                    <option value="Faint">Faint</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Strong">Strong</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">
                    Green Tint
                  </p>
                  <select
                    onChange={(e) => setGreen(e.target.value)}
                    value={green}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                  >
                    <option value="">Select</option>
                    <option value="None">None</option>
                    <option value="Faint">Faint</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Strong">Strong</option>
                  </select>
                </div>

                <div>
                  <p className="mb-2 text-sm md:text-base font-medium">Milky</p>
                  <select
                    onChange={(e) => setMilky(e.target.value)}
                    value={milky}
                    className="w-full px-3 py-2 border rounded text-sm md:text-base"
                  >
                    <option value="">Select</option>
                    <option value="None">None</option>
                    <option value="Faint">Faint</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Strong">Strong</option>
                  </select>
                </div>
              </div>
            </div>
          )}

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
