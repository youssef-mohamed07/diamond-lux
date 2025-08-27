import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import NewsletterBox from "../components/NewsletterBox";
import { toast } from "react-toastify";
import axios from "axios";
import WishlistForm from "../components/ui/WishlistForm";
import { sendWishlistEmail } from "../../api/wishlistApi";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Wishlist = () => {
  const {
    products,
    guestWishlist,
    removeItemFromWishlist,
    updateWishlistQuantity,
    currency,
  } = useContext(ShopContext);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWishlistForm, setShowWishlistForm] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch products if not available in context
  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length === 0) {
        try {
          const response = await axios.get(`${backendUrl}/product`);
          if (response.data && response.data.Products) {
            const items = response.data.Products.filter((product) =>
              guestWishlist.some((item) => item.productId === product._id)
            ).map((product) => ({
              ...product,
              quantity:
                guestWishlist.find((item) => item.productId === product._id)
                  ?.quantity || 1,
            }));
            setWishlistItems(items);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products. Please try again later.");
        }
      }
      setLoading(false);
    };

    fetchProducts();
  }, [products, guestWishlist, backendUrl]);

  // Update wishlist items when products or wishlist changes
  useEffect(() => {
    if (products.length > 0) {
      const items = products
        .filter((product) =>
          guestWishlist.some((item) => item.productId === product._id)
        )
        .map((product) => ({
          ...product,
          quantity:
            guestWishlist.find((item) => item.productId === product._id)
              ?.quantity || 1,
        }));
      setWishlistItems(items);
      console.log("Updated wishlist items from context:", items);
    }
  }, [products, guestWishlist]);

  // Calculate total price based on quantities
  const subtotal = wishlistItems.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const handleRemoveItem = async (productId) => {
    try {
      console.log("Removing item from wishlist:", productId);
      await removeItemFromWishlist(productId);
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item from wishlist");
    }
  };

  // Debounce function to limit rapid calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Update wishlist item quantity
  const updateWishlistItem = (productId, quantity) => {
    try {
      // Only update in context/storage - local state will update via useEffect
      updateWishlistQuantity(productId, quantity);
    } catch (error) {
      console.error("Error updating wishlist item:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    try {
      const item = wishlistItems.find((item) => item._id === productId);
      if (item) {
        updateWishlistItem(productId, item.quantity + 1);
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    try {
      const item = wishlistItems.find((item) => item._id === productId);
      if (item && item.quantity > 1) {
        updateWishlistItem(productId, item.quantity - 1);
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // Update quantity directly
  const updateQuantity = (productId, newQuantity) => {
    try {
      // Ensure quantity is a valid number and at least 1
      const quantity = Math.max(1, parseInt(newQuantity, 10) || 1);
      updateWishlistItem(productId, quantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Debounced version of updateQuantity
  const debouncedUpdateQuantity = debounce(updateQuantity, 300);

  const handleSendWishlist = async (formData) => {
    try {
      // Format wishlist items for email
      const itemsDetails = wishlistItems.map((item) => ({
        id: item._id,
        image: item.imageCover,
        name: item.title,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }));

      const wishlistData = {
        ...formData,
        itemsDetails,
        totalValue: `${currency}${subtotal.toFixed(2)}`,
      };

      console.log("wishlistData:: ", wishlistData);

      await sendWishlistEmail(wishlistData);
      toast.success("Wishlist sent successfully!");
      setShowWishlistForm(false);
    } catch (error) {
      console.error("Error sending wishlist:", error);
      toast.error("Failed to send wishlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 md:pt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            My Wishlist
          </h1>
          <Link
            to="/products/diamond"
            className="text-gray-600 hover:text-gray-900 flex items-center"
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
              to="/products/diamond"
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
                                  debouncedUpdateQuantity(
                                    product._id,
                                    e.target.value
                                  )
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
                            src={product.imageCover}
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
                              debouncedUpdateQuantity(
                                product._id,
                                e.target.value
                              )
                            }
                            className="w-12 text-center border-x border-gray-300"
                            min="1"
                          />
                          <button
                            onClick={() => increaseQuantity(product._id)}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          Total: {currency}
                          {(product.price * product.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      {currency}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {currency}
                        {subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {wishlistItems.length > 0 && (
                    <div className="pt-4">
                      <button
                        onClick={() => setShowWishlistForm(true)}
                        className="w-full bg-black text-white px-6 py-3  hover:bg-gray-800 transition-colors"
                      >
                        Send Wishlist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <NewsletterBox />
      {showWishlistForm && (
        <WishlistForm
          onSubmit={handleSendWishlist}
          onClose={() => setShowWishlistForm(false)}
        />
      )}
    </div>
  );
};

export default Wishlist;
