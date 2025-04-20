import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaGem,
  FaRuler,
  FaCertificate,
  FaSearchPlus,
  FaMagic,
  FaTags,
  FaFlask,
  FaEye,
  FaStar,
  FaCrown,
  FaRulerHorizontal,
} from "react-icons/fa";
import ScrollToTop from "../components/ScrollToTop";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    products,
    currency,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
  } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (products && products.length > 0) {
      const foundProduct = products.find((p) => p._id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
      } else {
        navigate("/products");
        toast.error("Product not found");
      }
    }
  }, [products, productId, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const handleImageChange = (newImage) => {
    setIsImageTransitioning(true);
    setTimeout(() => {
      setActiveImage(newImage);
      setIsImageTransitioning(false);
    }, 200);
  };

  const handleToggleWishlist = () => {
    if (isInFavorites(productId)) {
      removeFromFavorites(productId);
      toast.success("Removed from wishlist");
    } else {
      addToFavorites(productId);
      toast.success("Added to wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const isFavorite = isInFavorites(productId);

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
                      {product.lab}
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
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-0">
          <div className="flex items-center mb-8">
            <div className="mx-4 text-gray-400">/</div>
            <div className="mx-4 text-gray-400">/</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-4 aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <motion.img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[activeImage]
                      : product.imageCover
                  }
                  alt={product.title}
                  className="w-full h-full object-center object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isImageTransitioning ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                        activeImage === index
                          ? "ring-2 ring-gray-900"
                          : "ring-1 ring-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        className="w-full h-full object-center object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              <div className="flex items-center mb-4">
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
                    <p
                      className="text-md leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    />
                  </div>
                )}

                {/* Render properties based on product type */}
                {renderDiamondProperties()}
                {renderJewelryProperties()}

                {/* Measurements Section - Common for both types */}
                {(product.length ||
                  product.width ||
                  product.height ||
                  product.depth ||
                  product.table) && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center mb-4">
                      <FaCrown className="text-teal-500 mr-3 text-xl" />
                      <h3 className="text-md font-semibold text-gray-800">
                        Measurements
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-6">
                      {product.length && (
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Length
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.length} mm
                          </span>
                        </div>
                      )}

                      {product.width && (
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Width
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.width} mm
                          </span>
                        </div>
                      )}

                      {product.height && (
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Height
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.height} mm
                          </span>
                        </div>
                      )}

                      {product.depth && (
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Depth
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.depth}%
                          </span>
                        </div>
                      )}

                      {product.table && (
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Table
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {product.table}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dimensions visualization */}
                    {product.length && product.width && product.height && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-700">
                          <FaSearchPlus className="text-gray-400 mr-2" />
                          <span>
                            L {product.length} mm × W {product.width} mm × H{" "}
                            {product.height} mm
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tabs for Details */}
              <div className="mb-8">
                <div className="border-b border-gray-200 mb-4">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "details"
                          ? "border-gray-900 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Details & Care
                    </button>
                  </nav>
                </div>

                {activeTab === "description" && hasValidDescription && (
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {product.description
                      .split("\n")
                      .filter((p) => p.trim())
                      .map((paragraph, i) => (
                        <p key={i} className="mb-3">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaGem className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Premium Materials
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Crafted with the finest materials, ensuring
                          exceptional quality and durability.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaRuler className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Precise Measurements
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Each piece is meticulously measured and crafted to
                          ensure perfect fit and comfort.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaCertificate className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Authenticity Guaranteed
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Includes a certificate of authenticity and a 2-year
                          warranty against manufacturing defects.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mb-8">
                <button
                  onClick={handleToggleWishlist}
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {isFavorite ? (
                    <>
                      <FaHeart className="text-red-500 mr-2" />
                      <span>Remove from Wishlist</span>
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="mr-2" />
                      <span>Add to Wishlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

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
