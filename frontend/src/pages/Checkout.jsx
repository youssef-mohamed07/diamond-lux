import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaLock, FaShippingFast, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import NewsletterBox from '../components/NewsletterBox';

const Checkout = () => {
  const { wishlist, currency, token, user } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(15);
  const [step, setStep] = useState(1);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!token) {
      toast.error('Please sign in to access checkout');
      navigate('/login?redirect=checkout');
      return;
    }
    
    // Load cart items
    if (wishlist && wishlist.wishlist && wishlist.wishlist.wishlistItems) {
      if (wishlist.wishlist.wishlistItems.length === 0) {
        toast.info('Your cart is empty');
        navigate('/cart');
        return;
      }
      
      setCartItems(wishlist.wishlist.wishlistItems);
      
      // Calculate subtotal
      const total = wishlist.wishlist.wishlistItems.reduce(
        (sum, item) => sum + (item.product.price * item.quantity), 
        0
      );
      setSubtotal(total);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [wishlist, token, navigate, user]);

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateShippingInfo = () => {
    const { firstName, lastName, email, phone, address, city, state, zipCode, country } = shippingInfo;
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode || !country) {
      toast.error('Please fill in all shipping information fields');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleContinueToPayment = () => {
    if (validateShippingInfo()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handleProceedToPayment = () => {
    if (validateShippingInfo()) {
      navigate('/payment', { 
        state: { 
          shippingInfo,
          cartItems,
          subtotal,
          shippingCost,
          tax: subtotal * 0.07,
          total: subtotal + shippingCost + (subtotal * 0.07)
        } 
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full animate-pulse"></div>
        </div>
        <p className="text-lg mt-6 font-medium text-gray-800">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Checkout Steps - Made responsive */}
            <div className="mb-4 sm:mb-8">
              <div className="flex items-center justify-center text-xs sm:text-sm">
                <div className={`flex items-center ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">Shipping</span>
                </div>
                <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 ${step >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">Payment</span>
                </div>
                <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 ${step >= 3 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${step >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    3
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">Confirmation</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden p-4 sm:p-6 mb-4 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Checkout</h1>
              
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                {/* Left Column - Form */}
                <div className="w-full lg:w-2/3">
                  {step === 1 && (
                    <div>
                      <div className="flex items-center mb-3 sm:mb-4">
                        <FaShippingFast className="text-gray-900 mr-2" size={18} />
                        <h2 className="text-base sm:text-lg font-medium text-gray-900">Shipping Information</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div>
                          <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={shippingInfo.firstName}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={shippingInfo.lastName}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3 sm:mb-4">
                        <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div>
                          <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            State/Province *
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={shippingInfo.state}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div>
                          <label htmlFor="zipCode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            ZIP/Postal Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={shippingInfo.zipCode}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="country" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleShippingInfoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
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
                      
                      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3">
                        <Link
                          to="/cart"
                          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <FaArrowLeft className="mr-2" />
                          Back to Cart
                        </Link>
                        
                        <button
                          onClick={handleProceedToPayment}
                          className="w-full mt-3 sm:mt-0 sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
                        >
                          Proceed to Payment
                          <FaCreditCard className="ml-2" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Column - Order Summary */}
                <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
                  <div className="bg-white shadow-sm rounded-lg overflow-hidden p-4 sm:p-6 lg:sticky lg:top-24">
                    <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
                    
                    <div className="max-h-48 sm:max-h-64 overflow-y-auto mb-3 sm:mb-4">
                      {cartItems.map((item) => (
                        <div key={item.product._id} className="flex items-center py-2 border-b border-gray-200">
                          <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={item.product.imageCover} 
                              alt={item.product.title} 
                              className="w-full h-full object-center object-cover"
                            />
                          </div>
                          <div className="ml-2 sm:ml-3 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.product.title}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {currency}{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <p className="text-gray-600">Subtotal</p>
                        <p className="text-gray-900 font-medium">{currency}{subtotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <p className="text-gray-600">Shipping</p>
                        <p className="text-gray-900 font-medium">{currency}{shippingCost.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <p className="text-gray-600">Tax</p>
                        <p className="text-gray-900 font-medium">{currency}{(subtotal * 0.07).toFixed(2)}</p>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <p className="text-sm sm:text-base font-medium text-gray-900">Total</p>
                          <p className="text-sm sm:text-base font-bold text-gray-900">
                            {currency}{(subtotal + shippingCost + (subtotal * 0.07)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <NewsletterBox />
    </div>
  );
};

export default Checkout;