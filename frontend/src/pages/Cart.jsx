import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
  FaShoppingCart,
  FaLock,
} from "react-icons/fa";
import { toast } from "react-toastify";
import NewsletterBox from "../components/NewsletterBox";

const Cart = () => {
  const {
    products,
    wishlist,
    token,
    currency,
    addItemToWishlist,
    removeItemFromWishlist,
    updateWishlistItemQuantity,
    guestWishlist,
    updateGuestWishlistItemQuantity,
    removeGuestWishlistItem,
  } = useContext(ShopContext);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  // Calculate cart items and subtotal
  useEffect(() => {
    if (products.length > 0) {
      let items = [];
      let total = 0;

      if (token && wishlist) {
        // For logged in users
        items = wishlist
          .map((item) => {
            const product = products.find((p) => p._id === item.productId);
            if (product) {
              const itemTotal = product.price * item.quantity;
              total += itemTotal;
              return {
                ...item,
                product,
                total: itemTotal,
              };
            }
            return null;
          })
          .filter(Boolean);
      } else {
        // For guest users
        items = guestWishlist
          .map((item) => {
            const product = products.find((p) => p._id === item.productId);
            if (product) {
              const itemTotal = product.price * item.quantity;
              total += itemTotal;
              return {
                ...item,
                product,
                total: itemTotal,
              };
            }
            return null;
          })
          .filter(Boolean);
      }

      setCartItems(items);
      setSubtotal(total);
      setLoading(false);
    }
  }, [products, wishlist, guestWishlist, token]);

  const handleQuantityChange = async (itemId, productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (token) {
        // For logged in users
        await updateWishlistItemQuantity(itemId, newQuantity);
      } else {
        // For guest users
        updateGuestWishlistItemQuantity(productId, newQuantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId, productId) => {
    try {
      if (token) {
        // For logged in users
        await removeItemFromWishlist(itemId);
        toast.success("Item removed from cart");
      } else {
        // For guest users
        removeGuestWishlistItem(productId);
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-24 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Your Shopping Cart
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Review your selections and proceed to checkout when you're ready.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16 bg-gray-50 rounded-lg"
          >
            <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
              <FaShoppingCart className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explore our collection and add your favorite pieces to your cart.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700 transition-all"
            >
              Explore Our Collection
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">
                      Cart Items ({cartItems.length})
                    </h2>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item, index) => (
                      <motion.li
                        key={item.productId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="p-6"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-md mb-4 sm:mb-0">
                            <img
                              src={
                                item.product.images &&
                                item.product.images.length > 0
                                  ? item.product.images[0]
                                  : item.product.imageCover
                              }
                              alt={item.product.title}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>

                          <div className="sm:ml-6 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  <Link
                                    to={`/product/${item.productId}`}
                                    className="hover:underline"
                                  >
                                    {item.product.title}
                                  </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.product.category}
                                </p>
                              </div>
                              <p className="text-base font-medium text-gray-900">
                                {currency}
                                {item.total.toFixed(2)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  className="px-3 py-1 text-gray-600 hover:text-gray-900"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="px-3 py-1 text-gray-600 hover:text-gray-900"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveItem(item._id, item.productId)
                                }
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="text-gray-900 font-medium">
                        {currency}
                        {subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between mb-4">
                      <p className="text-gray-600">Shipping</p>
                      <p className="text-gray-900 font-medium">Free</p>
                    </div>
                    <div className="flex justify-between mb-4">
                      <p className="text-gray-600">Tax</p>
                      <p className="text-gray-900 font-medium">
                        {currency}
                        {(subtotal * 0.07).toFixed(2)}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between mb-6">
                        <p className="text-lg font-medium text-gray-900">
                          Total
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {currency}
                          {(subtotal + subtotal * 0.07).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-3 px-6 rounded-md flex items-center justify-center hover:from-gray-800 hover:to-gray-700 transition-all"
                      >
                        <FaLock className="mr-2" />
                        Proceed to Checkout
                      </button>
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Secure checkout powered by Stripe
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Complimentary Gift Wrapping
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Every Diamond Cartel purchase comes with elegant gift packaging,
              perfect for presenting your exquisite jewelry.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-colors"
            >
              Learn About Our Services
            </Link>
          </motion.div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Cart;
