import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaArrowLeft, FaGem, FaRuler, FaCertificate } from "react-icons/fa";
import ScrollToTop from '../components/ScrollToTop';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    currency, 
    addToFavorites, 
    removeFromFavorites, 
    isInFavorites
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
        navigate('/products');
        toast.error('Product not found');
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
  const hasValidDescription = product.description && 
    product.description.length > 10 && 
    product.description !== "adfds";

  return (
    <>
      <ScrollToTop />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back</span>
            </button>
            <div className="mx-4 text-gray-400">/</div>
            <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <div className="mx-4 text-gray-400">/</div>
                <Link to={`/products?category=${product.category}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {product.category}
                </Link>
              </>
            )}
            <div className="mx-4 text-gray-400">/</div>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-4 aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <motion.img 
                  src={product.images && product.images.length > 0 ? product.images[activeImage] : product.imageCover} 
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
                        activeImage === index ? 'ring-2 ring-gray-900' : 'ring-1 ring-gray-200'
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <p className="text-2xl font-semibold text-gray-900">{currency}{product.price.toFixed(2)}</p>
                {product.oldPrice && (
                  <p className="ml-4 text-lg text-gray-500 line-through">{currency}{product.oldPrice.toFixed(2)}</p>
                )}
              </div>
              
              {/* Product Specifications */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.category && (
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">Category:</span>
                      <Link 
                        to={`/products?category=${product.category}`}
                        className="text-sm text-gray-900 hover:text-gray-700 hover:underline"
                      >
                        {product.category}
                      </Link>
                    </div>
                  )}
                  
                  {product.material && (
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">Material:</span>
                      <span className="text-sm text-gray-900">{product.material}</span>
                    </div>
                  )}
                  
                  {product.gemstone && (
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">Gemstone:</span>
                      <span className="text-sm text-gray-900">{product.gemstone}</span>
                    </div>
                  )}
                  
                  {product.caratWeight && (
                    <div className="flex items-center">
                      <span className="w-24 text-sm font-medium text-gray-500">Carat Weight:</span>
                      <span className="text-sm text-gray-900">{product.caratWeight}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tabs for Details */}
              <div className="mb-8">
                <div className="border-b border-gray-200 mb-4">
                  <nav className="flex space-x-8">
                    {hasValidDescription && (
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "description"
                            ? "border-gray-900 text-gray-900"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Description
                      </button>
                    )}
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
                    {product.description.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                      <p key={i} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                )}
                
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaGem className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Premium Materials</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Crafted with the finest materials, ensuring exceptional quality and durability.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaRuler className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Precise Measurements</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Each piece is meticulously measured and crafted to ensure perfect fit and comfort.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCertificate className="text-gray-400 mt-1 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Authenticity Guaranteed</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Includes a certificate of authenticity and a 2-year warranty against manufacturing defects.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <RelatedProducts currentProductId={productId} category={product.category} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Exquisite Craftsmanship</h2>
              <p className="text-xl max-w-3xl mx-auto mb-8">
                Each piece in our collection is meticulously crafted by master artisans, 
                ensuring exceptional quality and timeless elegance.
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
        
        <NewsletterBox />
      </div>
    </>
  );
};

export default Product;
