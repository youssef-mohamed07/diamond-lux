import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaHeart, FaLock, FaCreditCard, FaGem, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import NewsletterBox from '../components/NewsletterBox';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { 
    products, 
    favorites, 
    removeFromFavorites, 
    currency, 
    token, 
    user
  } = useContext(ShopContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for checkout modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State to track wishlist items with quantities
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Update wishlist items when favorites or products change
  useEffect(() => {
    if (products.length > 0) {
      const items = products
        .filter(product => favorites.includes(product._id))
        .map(product => ({
          ...product,
          quantity: 1 // Default quantity
        }));
      setWishlistItems(items);
    }
  }, [products, favorites]);
  
  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  // Calculate total price based on quantities
  const subtotal = wishlistItems.reduce((total, product) => total + (product.price * product.quantity), 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    if (wishlistItems.length === 0) {
      toast.error("Your wishlist is empty");
      return;
    }
    
    if (!token) {
      toast.error("Please sign in to place an order");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // Minimum order amount check
    const minimumOrderAmount = 100; // $100 minimum
    if (subtotal < minimumOrderAmount) {
      toast.error(`Minimum order amount is ${currency}${minimumOrderAmount}`);
      return;
    }
    
    setShowCheckout(true);
  };

  const handleRemoveItem = (productId) => {
    removeFromFavorites(productId);
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setWishlistItems(prev => 
      prev.map(item => 
        item._id === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setWishlistItems(prev => 
      prev.map(item => 
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
    
    setWishlistItems(prev => 
      prev.map(item => 
        item._id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Clear wishlist after successful order
      wishlistItems.forEach(product => {
        removeFromFavorites(product._id);
      });
      
      // Show success message
      toast.success("Order placed successfully!");
      
      // Close checkout modal
      setShowCheckout(false);
      
      // Navigate to confirmation page
      navigate('/order-confirmation', { 
        state: { 
          orderItems: wishlistItems,
          orderTotal: total,
          orderDate: new Date().toISOString()
        } 
      });
    }, 2000);
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, address, city, state, zipCode, cardName, cardNumber, cardExpiry, cardCvc } = formData;
    
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // Card validation
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      toast.error("Please fill in all payment details");
      return false;
    }
    
    // Basic card number validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    
    // Basic expiry validation
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      toast.error("Please enter expiry date in MM/YY format");
      return false;
    }
    
    // Basic CVC validation
    if (!/^\d{3,4}$/.test(cardCvc)) {
      toast.error("Please enter a valid CVC/CVV code");
      return false;
    }
    
    return true;
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <Link to="/products" className="text-gray-600 hover:text-gray-900 flex items-center">
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Browse our collection and add items to your wishlist.</p>
            <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wishlistItems.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={product.image} alt={product.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{currency}{product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button onClick={() => decreaseQuantity(product._id)} className="text-gray-500 hover:text-gray-700">
                              <FaMinus />
                            </button>
                            <input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateQuantity(product._id, e.target.value)}
                              className="mx-2 w-12 text-center border border-gray-300 rounded-md"
                            />
                            <button onClick={() => increaseQuantity(product._id)} className="text-gray-500 hover:text-gray-700">
                              <FaPlus />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{currency}{(product.price * product.quantity).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleRemoveItem(product._id)} className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span>{currency}{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{currency}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaGem className="text-gray-400 mr-2" />
                  <span>All items are certified authentic and come with a certificate of authenticity.</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP/Postal Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="France">France</option>
                          <option value="Germany">Germany</option>
                          <option value="Japan">Japan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            required
                          />
                          <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date *
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC/CVV *
                        </label>
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          placeholder="XXX"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="mr-4 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700 transition-all flex items-center"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          Place Order ({currency}{total.toFixed(2)})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <NewsletterBox />
    </div>
  );
};

export default Wishlist;