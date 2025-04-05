import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaArrowLeft, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import NewsletterBox from "../components/NewsletterBox";
import { toast } from "react-toastify";
import WishlistForm from "../components/ui/WishlistForm";
import { sendWishlistEmail } from "../../api/wishlistApi";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const Wishlist = () => {
  const { products, favorites, removeFromFavorites, currency } =
    useContext(ShopContext);

  const location = useLocation();

  // State to track wishlist items with quantities
  const [wishlistItems, setWishlistItems] = useState([]);
  // State to control wishlist form visibility
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  // Handle sending wishlist via email
  const handleSendWishlist = async (formData) => {
    try {
      // Format items for email display - include image URL
      const itemsFormatted = wishlistItems
        .map((item) => {
          // Use imageCover or image property, whichever is available
          const imageUrl = item.imageCover || item.image || "";
          return `${imageUrl}||${item.title || item.name}||Quantity: ${
            item.quantity
          }||Price: ${currency}${item.price.toLocaleString()}`;
        })
        .join("@@"); // Use a special separator between items

      // Add wishlist items to form data
      const wishlistData = {
        ...formData,
        itemsDetails: itemsFormatted,
        totalValue: `${currency}${subtotal.toLocaleString()}`, // Add currency symbol
      };

      await sendWishlistEmail(wishlistData);
      toast.success("Wishlist sent successfully!");
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to send wishlist:", error);
      toast.error("Failed to send wishlist");
    }
  };

  return (
    <div className="bg-white  w-full">
      <div className="relative bg-black text-white ">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Luxury wishlist items"
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:max-w-2xl lg:max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-white/70"></div>
              <span className="uppercase tracking-[0.2em] text-sm font-light">
                Your Collections
              </span>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6">
              My Wishlist
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Keep track of all your favorite items and create collections for
              different occasions.
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center bg-white text-gray-900 px-6 py-3  font-medium shadow-md hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Browse our collection and add items to your wishlist.
            </p>
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
                              {product.price.toLocaleString()}
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
                              {(
                                product.price * product.quantity
                              ).toLocaleString()}
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
                            {product.price.toLocaleString()}
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
                            {(
                              product.price * product.quantity
                            ).toLocaleString()}
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

              <hr className="my-4" />
              {/* Show items title and price and quantity */}
              <div className="space-y-3">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left text-gray-600">
                      <th className="pb-2">Product</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.map((item) => (
                      <tr key={item._id} className=" border-gray-100">
                        <td className="py-2 pr-2 truncate max-w-[160px]">
                          {item.name || item.title}
                        </td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">
                          {currency}
                          {item.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <hr className="my-4" />

              {/* Show total items and total value */}
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
                    {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full inline-block text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
                >
                  Send Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <WishlistForm
          onSubmit={handleSendWishlist}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      <NewsletterBox />
    </div>
  );
};

export default Wishlist;
