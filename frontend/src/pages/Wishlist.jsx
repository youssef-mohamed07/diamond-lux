import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import NewsletterBox from "../components/NewsletterBox";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { products, favorites, removeFromFavorites, currency } =
    useContext(ShopContext);

  const location = useLocation();

  // State to track wishlist items with quantities
  const [wishlistItems, setWishlistItems] = useState([]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update wishlist items when favorites or products change
  useEffect(() => {
    if (products.length > 0) {
      const items = products
        .filter((product) => favorites.includes(product._id))
        .map((product) => ({
          ...product,
          quantity: 1, // Default quantity
        }));
      setWishlistItems(items);
    }
  }, [products, favorites]);

  // Calculate total price based on quantities
  const subtotal = wishlistItems.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const handleRemoveItem = (productId) => {
    removeFromFavorites(productId);
    toast.success("Item removed from wishlist");
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Update quantity directly
  const updateQuantity = (productId, newQuantity) => {
    // Ensure quantity is a valid number and at least 1
    const quantity = Math.max(1, parseInt(newQuantity) || 1);

    setWishlistItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            My Wishlist
          </h1>
          <Link
            to="/products"
            className="text-gray-600 hover:text-gray-900 flex items-center self-start sm:self-auto"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Browse our collection and add items to your wishlist.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2">
              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {wishlistItems.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  className="h-12 w-12 rounded-md object-cover"
                                  src={product.imageCover}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {currency}
                              {product.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => decreaseQuantity(product._id)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="number"
                                value={product.quantity}
                                onChange={(e) =>
                                  updateQuantity(product._id, e.target.value)
                                }
                                className="mx-2 w-12 text-center border border-gray-300 rounded-md"
                                min="1"
                              />
                              <button
                                onClick={() => increaseQuantity(product._id)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {currency}
                              {(product.price * product.quantity).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleRemoveItem(product._id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              aria-label="Remove item"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4">
                {wishlistItems.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded-md object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {currency}
                            {product.price.toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(product._id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => decreaseQuantity(product._id)}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) =>
                              updateQuantity(product._id, e.target.value)
                            }
                            className="w-12 text-center border-x border-gray-300 py-1"
                            min="1"
                          />
                          <button
                            onClick={() => increaseQuantity(product._id)}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="text-sm font-medium">
                          Total:{" "}
                          <span className="text-gray-900">
                            {currency}
                            {(product.price * product.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 h-fit">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Wishlist Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">
                    {wishlistItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-medium">
                    {currency}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/products"
                  className="w-full inline-block text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Wishlist;
