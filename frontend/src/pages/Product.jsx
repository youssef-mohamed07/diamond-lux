import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import NewsletterBox from "../components/NewsletterBox";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../utils/imageHelper";
import {
  FaHeart,
  FaRegHeart,
  FaGem,
  FaRuler,
  FaCertificate,
  FaMagic,
  FaEye,
  FaStar,
  FaCrown,
  FaRulerHorizontal,
  FaExclamationTriangle,
} from "react-icons/fa";
import { TbView360Number } from "react-icons/tb";
import ScrollToTop from "../components/ScrollToTop";
import axios from "axios";

const { VITE_BACKEND_URL } = import.meta.env;
const backendURLWithoutApi = VITE_BACKEND_URL.replace("/api", "");

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    products,
    diamondProducts,
    currency,
    addItemToWishlist,
    removeItemFromWishlist,
    wishlist,
  } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [error, setError] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if product exists in context first
        const contextProduct =
          products?.find((p) => p._id === productId) ||
          diamondProducts?.find((p) => p._id === productId);

        if (contextProduct) {
          setProduct(contextProduct);
          setLoading(false);
          return;
        }

        // If not in context, fetch from API
        const response = await axios.get(
          `${VITE_BACKEND_URL}/product/${productId}`
        );
        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          setError("Product not found");
          toast.error("Product not found");
        }
        console.log("product: ", response.data.product);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }

    window.scrollTo(0, 0);
  }, [productId, products, diamondProducts]);

  const handleImageChange = (newImage) => {
    setIsImageTransitioning(true);
    setTimeout(() => {
      setActiveImage(newImage);
      setIsImageTransitioning(false);
    }, 200);
  };

  const handleToggleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (isInWishlist(productId)) {
        await removeItemFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addItemToWishlist(productId, 1);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setWishlistLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist?.includes(productId) || false;
  };

  const getResponsiveLoupe360Url = (url) => {
    // Check if it's a loupe360 URL
    if (!url || !url.includes("loupe360.com")) return url;

    // Parse out the existing parts of the URL
    const baseUrlPattern =
      /(https:\/\/loupe360\.com\/diamond\/[^\/]+\/video)\/\d+\/\d+\?(.+)/;
    const match = url.match(baseUrlPattern);

    if (match) {
      // If the URL has the expected pattern with dimensions
      const baseUrl = match[1];
      const queryParams = match[2] || "";
      // Use 100% of container width for responsiveness
      return `${baseUrl}?${queryParams}&responsive=true&size=full`;
    } else {
      // If the URL doesn't match the expected pattern, try a different approach
      // Remove any fixed dimensions and add responsive parameters
      const simplifiedUrl = url.replace(/\/\d+\/\d+/, "");

      if (simplifiedUrl.includes("?")) {
        return `${simplifiedUrl}&responsive=true&size=full`;
      } else {
        return `${simplifiedUrl}?responsive=true&size=full`;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "This product doesn't exist or has been removed."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products/diamond"
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Browse Diamonds
            </Link>
            <Link
              to="/"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = isInWishlist(productId);

  // Check if description is valid and meaningful
  const hasValidDescription =
    product.description &&
    product.description.length > 10 &&
    product.description !== "adfds";

  // Render diamond-specific properties
  const renderDiamondProperties = () => {
    if (product.productType !== "diamond") return null;

    return (
      <>
        {/* Diamond Main Properties Section */}
        {(product.shape || product.carats || product.col || product.clar) && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-4">
              <FaStar className="text-yellow-500 mr-3 text-xl" />
              <h3 className="text-md font-semibold text-gray-800">
                Diamond Properties
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
              {product.shape && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Shape
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.shape}
                  </span>
                </div>
              )}

              {product.carats && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Carats
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.carats} ct
                  </span>
                </div>
              )}

              {product.col && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Color
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.col}
                  </span>
                </div>
              )}

              {product.clar && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Clarity
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.clar}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cut Quality Section */}
        {(product.cut || product.pol || product.symm) && (
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center mb-4">
              <FaRulerHorizontal className="text-purple-500 mr-3 text-xl" />
              <h3 className="text-md font-semibold text-gray-800">
                Cut Quality
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              {product.cut && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Cut
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.cut}
                    </span>
                    {product.cut.toLowerCase().includes("excellent") && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Top Grade
                      </span>
                    )}
                  </div>
                </div>
              )}

              {product.pol && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Polish
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.pol}
                    </span>
                    {product.pol.toLowerCase().includes("excellent") && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Top Grade
                      </span>
                    )}
                  </div>
                </div>
              )}

              {product.symm && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Symmetry
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.symm}
                    </span>
                    {product.symm.toLowerCase().includes("excellent") && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Top Grade
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Features */}
        {(product.flo ||
          product.floCol ||
          product.culet ||
          product.lab ||
          product.girdle) && (
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center mb-4">
              <FaMagic className="text-indigo-500 mr-3 text-xl" />
              <h3 className="text-md font-semibold text-gray-800">
                Additional Features
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              {product.flo && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Fluorescence
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.flo}
                  </span>
                </div>
              )}

              {product.floCol && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Fluorescence Color
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.floCol}
                  </span>
                </div>
              )}

              {product.culet && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Culet
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.culet}
                  </span>
                </div>
              )}

              {product.lab && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Certification
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.lab === "NONE" ? (
                        <>NONE</>
                      ) : product.certificate_url ? (
                        <div>
                          <a
                            href={product.certificate_url}
                            target="_blank"
                            className="underline text-md text-indigo-700 cursor-pointer"
                          >
                            {product.lab}
                          </a>
                        </div>
                      ) : (
                        <>
                          {" "}
                          <div>
                            <p className="text-md">{product.lab}</p>
                            <span className="text-[0.8rem] italic text-gray-700">
                              (No certificate url is present)
                            </span>
                          </div>
                        </>
                      )}
                    </span>
                    {(product.lab === "GIA" || product.lab === "IGI") && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Certified
                      </span>
                    )}
                  </div>
                </div>
              )}

              {product.girdle && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Girdle
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.girdle}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Characteristics */}
        {(product.eyeClean ||
          product.brown ||
          product.green ||
          product.milky) && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FaEye className="text-amber-500 mr-3 text-xl" />
              <h3 className="text-md font-semibold text-gray-800">
                Characteristics
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {product.eyeClean && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Eye Clean
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.eyeClean}
                    </span>
                    {product.eyeClean === "Yes" && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        No Visible Inclusions
                      </span>
                    )}
                  </div>
                </div>
              )}

              {product.brown && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Brown Tint
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.brown}
                    </span>
                    {product.brown === "None" && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        None
                      </span>
                    )}
                  </div>
                </div>
              )}

              {product.green && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Green Tint
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.green}
                    </span>
                    {product.green === "None" && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        None
                      </span>
                    )}
                  </div>
                </div>
              )}

              {product.milky && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Milky Appearance
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.milky}
                    </span>
                    {product.milky === "None" && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        None
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  // Render jewelry-specific properties
  const renderJewelryProperties = () => {
    if (product.productType !== "jewelry") return null;

    return (
      <>
        {/* Jewelry Type and Properties */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center mb-4">
            <FaGem className="text-blue-500 mr-3 text-xl" />
            <h3 className="text-md font-semibold text-gray-800">
              {product.jewelryType === "necklace"
                ? "Necklace Properties"
                : product.jewelryType === "bracelet"
                ? "Bracelet Properties"
                : product.jewelryType === "earrings"
                ? "Earrings Properties"
                : "Jewelry Properties"}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
            {product.jewelryType && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Type
                </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {product.jewelryType}
                </span>
              </div>
            )}

            {product.diamondType && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Diamond Type
                </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {product.diamondType.replace("_", " ")}
                </span>
              </div>
            )}

            {product.metal && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Metal
                </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {product.metal}
                </span>
              </div>
            )}

            {product.metalColor && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Metal Color
                </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {product.metalColor}
                </span>
              </div>
            )}

            {product.carats && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Carat
                </span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {product.carats}
                </span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const VideoSection = ({ videoUrl }) => {
    if (!videoUrl) return null;

    return (
      <div className="w-full aspect-video mb-8 bg-gray-100 rounded-lg overflow-hidden">
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls={true}
          playing={false}
          light={true}
          pip={true}
        />
      </div>
    );
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-0">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center mb-8 text-sm"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Images */}
            <div>
              <div className="mb-4 aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                {activeImage === "360" ? (
                  <div className="relative w-full pb-[100%] overflow-hidden bg-white">
                    {product.images &&
                    product.images[0] &&
                    product.images[0].includes("loupe360.com") ? (
                      <iframe
                        src={getResponsiveLoupe360Url(product.images[0])}
                        className="absolute top-0 left-0 w-full h-full"
                        width="100%"
                        height="100%"
                        allowFullScreen
                        title="360 degree view"
                        frameBorder="0"
                        scrolling="no"
                        style={{
                          objectFit: "contain",
                          overflow: "hidden",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          transform: "scale(1.01)", // Slight scale to avoid any border issues
                        }}
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">360° view not available</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-full h-full object-center object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isImageTransitioning ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>

              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {/* Add 360-degree view option first */}
                  {(product.loupe360 ||
                    (product.images &&
                      product.images[0] &&
                      product.images[0].includes("loupe360.com"))) && (
                    <button
                      onClick={() => handleImageChange("360")}
                      className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                        activeImage === "360"
                          ? "ring-2 ring-gray-900"
                          : "ring-1 ring-gray-200"
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <TbView360Number className="text-gray-500 text-xl" />
                      </div>
                    </button>
                  )}

                  {/* Add first image as second option */}
                  <button
                    onClick={() =>
                      handleImageChange(
                        product.imageCover
                          ? product.imageCover
                          : product.images[0]
                      )
                    }
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                      activeImage === 0
                        ? "ring-2 ring-gray-900"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(
                        product.imageCover
                          ? product.imageCover
                          : product.images[0]
                      )}
                      alt="Main view"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Right side - Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-center mb-6">
                <p className="text-2xl font-semibold text-gray-900">
                  {currency}
                  {product.price.toLocaleString()}
                </p>
                {product.oldPrice && (
                  <p className="ml-4 text-lg text-gray-500 line-through">
                    {currency}
                    {product.oldPrice.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Product Specifications */}
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-6 shadow-sm border border-gray-100">
                <div className="px-6 py-4 bg-gradient-to-r from-gray-100 to-white border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Product Specifications
                  </h2>
                </div>

                {product.description && (
                  <div className="p-6 border-b border-gray-100">
                    <p className="text-md leading-relaxed text-gray-700">
                      <div
                        className="prose" // optional Tailwind typography plugin class
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    </p>
                  </div>
                )}

                {/* Diamond Properties */}
                {(product.productType === "lab_diamond" ||
                  product.productType === "natural_diamond") && (
                  <>
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center mb-4">
                        <FaGem className="text-yellow-500 mr-3 text-xl" />
                        <h3 className="text-md font-semibold text-gray-800">
                          Diamond Properties
                        </h3>
                      </div>

                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            SHAPE
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.shape || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            CARAT
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.carats || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            COLOR
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.col || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            CLARITY
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.clar || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cut Quality */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center mb-4">
                        <FaCrown className="text-purple-500 mr-3 text-xl" />
                        <h3 className="text-md font-semibold text-gray-800">
                          Cut Quality
                        </h3>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            CUT
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.cut || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            POLISH
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.pol || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            SYMMETRY
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.symm || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Features */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center mb-4">
                        <FaMagic className="text-indigo-500 mr-3 text-xl" />
                        <h3 className="text-md font-semibold text-gray-800">
                          Additional Features
                        </h3>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            FLUORESCENCE
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.flo || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            CULET
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.culet || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            CERTIFICATION
                          </span>
                          <div className="flex items-center">
                            {product.lab && (
                              <span className="text-sm font-medium text-gray-900 mr-2">
                                {product.lab}
                              </span>
                            )}
                            {(product.certificate_url || product.pdf) && (
                              <a
                                href={product.certificate_url || product.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View PDF
                              </a>
                            )}
                          </div>
                          {product.certificate_url && (
                            <span className="text-xs text-gray-500 block mt-1">
                              Number:{" "}
                              {product.reportNo || product.certificate_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Characteristics */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center mb-4">
                        <FaEye className="text-amber-500 mr-3 text-xl" />
                        <h3 className="text-md font-semibold text-gray-800">
                          Characteristics
                        </h3>
                      </div>

                      <div className="grid grid-cols-4 gap-6">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            EYE CLEAN
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.eyeClean || "No"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            BROWN TINT
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.brown ? "Yes" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            GREEN TINT
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.green ? "Yes" : "No"}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            MILKY APPEARANCE
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.milky ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center mb-4">
                        <FaRulerHorizontal className="text-teal-500 mr-3 text-xl" />
                        <h3 className="text-md font-semibold text-gray-800">
                          Measurements
                        </h3>
                      </div>

                      <div className="grid grid-cols-5 gap-6">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            LENGTH
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.length || "-"} mm
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            WIDTH
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.width || "-"} mm
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            HEIGHT
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.height || "-"} mm
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            DEPTH
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.depth || "-"}%
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                            TABLE
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.table || "-"}%
                          </span>
                        </div>
                      </div>

                      {product.length && product.width && product.height && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-700">
                            <FaRuler className="text-gray-400 mr-2" />
                            <span>
                              L {product.length} × W {product.width} × H{" "}
                              {product.height} mm
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Jewelry Properties */}
                {product.productType === "jewelry" && renderJewelryProperties()}

                {/* Details & Care */}
                <div className="p-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Details & Care
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaGem className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Premium Materials
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Crafted with the finest materials, ensuring
                          exceptional quality and durability.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaRuler className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Precise Measurements
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Each piece is meticulously measured and crafted to
                          ensure perfect fit.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCertificate className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Authenticity Guaranteed
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Includes a certificate of authenticity and a 2-year
                          warranty.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wishlist Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={`flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors ${
                    wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isInWishlist(productId) ? (
                      <motion.span
                        key="filled-heart"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className="mr-2"
                      >
                        <FaHeart className="text-red-500" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="outline-heart"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className="mr-2"
                      >
                        <FaRegHeart />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span>
                    {isInWishlist(productId)
                      ? wishlistLoading
                        ? "Removing..."
                        : "Remove from Wishlist"
                      : wishlistLoading
                      ? "Adding..."
                      : "Add to Wishlist"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <RelatedProducts
              currentProductId={productId}
              category={product.category}
            />
          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-gradient-to-br max-w-7xl mx-auto from-gray-900 via-gray-800 to-black text-white py-16 mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Exquisite Craftsmanship
              </h2>
              <p className="text-xl max-w-3xl mx-auto mb-8">
                Each piece in our collection is meticulously crafted by master
                artisans, ensuring exceptional quality and timeless elegance.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-md shadow-sm text-base font-medium text-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
