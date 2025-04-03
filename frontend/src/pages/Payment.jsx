import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaLock, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import NewsletterBox from '../components/NewsletterBox';

const Payment = () => {
  const { currency } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  
  useEffect(() => {
    // Redirect if no order data
    if (!orderData) {
      toast.error('Please complete shipping information first');
      navigate('/checkout');
      return;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [orderData, navigate]);
  
  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validatePaymentInfo = () => {
    if (paymentMethod === 'credit-card') {
      const { cardNumber, cardName, expiry, cvv } = cardInfo;
      if (!cardNumber || !cardName || !expiry || !cvv) {
        toast.error('Please fill in all card information fields');
        return false;
      }
      
      // Basic card validation
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      
      if (cvv.length < 3) {
        toast.error('Please enter a valid CVV code');
        return false;
      }
    }
    
    return true;
  };
  
  const handlePlaceOrder = () => {
    if (validatePaymentInfo()) {
      // This would normally send the order to the backend
      // For now, we'll just simulate a successful order
      navigate('/order-confirmation', { 
        state: { 
          orderDetails: {
            ...orderData,
            items: orderData.cartItems,
            paymentMethod,
            cardInfo: paymentMethod === 'credit-card' ? {
              ...cardInfo,
              cardNumber: `**** **** **** ${cardInfo.cardNumber.slice(-4)}`
            } : null
          } 
        } 
      });
    }
  };
  
  if (!orderData) {
    return null; // Will redirect in useEffect
  }
  
  const { shippingInfo, cartItems, subtotal, shippingCost, tax, total } = orderData;
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Checkout Steps - Make more compact on mobile */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center text-xs sm:text-sm">
                <div className="flex items-center text-gray-900">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-900 text-white">
                    1
                  </div>
                  <span className="ml-1 sm:ml-2 font-medium">Shipping</span>
                </div>
                <div className="w-8 sm:w-12 h-1 mx-1 sm:mx-2 bg-gray-900"></div>
                <div className="flex items-center text-gray-900">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-900 text-white">
                    2
                  </div>
                  <span className="ml-1 sm:ml-2 font-medium">Payment</span>
                </div>
                <div className="w-8 sm:w-12 h-1 mx-1 sm:mx-2 bg-gray-200"></div>
                <div className="flex items-center text-gray-400">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-600">
                    3
                  </div>
                  <span className="ml-1 sm:ml-2 font-medium">Confirmation</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden p-4 sm:p-6 mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Payment</h1>
              
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                {/* Left Column - Form */}
                <div className="w-full lg:w-2/3">
                  <div>
                    <div className="flex items-center mb-4">
                      <FaCreditCard className="text-gray-900 mr-2" size={20} />
                      <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center">
                        <input
                          id="credit-card"
                          name="payment-method"
                          type="radio"
                          checked={paymentMethod === 'credit-card'}
                          onChange={() => setPaymentMethod('credit-card')}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                          Credit Card
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="paypal"
                          name="payment-method"
                          type="radio"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300"
                        />
                        <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                          PayPal
                        </label>
                      </div>
                    </div>
                    
                    {paymentMethod === 'credit-card' && (
                      <div className="border border-gray-200 rounded-md p-4 mb-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={cardInfo.cardNumber}
                              onChange={handleCardInfoChange}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                              Name on Card *
                            </label>
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              value={cardInfo.cardName}
                              onChange={handleCardInfoChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration Date *
                              </label>
                              <input
                                type="text"
                                id="expiry"
                                name="expiry"
                                value={cardInfo.expiry}
                                onChange={handleCardInfoChange}
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                CVV *
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={cardInfo.cvv}
                                onChange={handleCardInfoChange}
                                placeholder="123"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'paypal' && (
                      <div className="border border-gray-200 rounded-md p-4 mb-6 text-center">
                        <p className="text-sm text-gray-600 mb-4">
                          You will be redirected to PayPal to complete your purchase securely.
                        </p>
                        <div className="w-32 h-8 mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 33" className="w-full h-full">
                            <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" />
                            <path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Column - Order Summary */}
                <div className="w-full lg:w-1/3">
                  <div className="bg-white shadow-sm rounded-lg overflow-hidden p-4 sm:p-6 lg:sticky lg:top-24">
                    <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                    
                    <div className="max-h-48 sm:max-h-64 overflow-y-auto mb-4">
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
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-600">Subtotal</p>
                        <p className="text-gray-900 font-medium">{currency}{subtotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-600">Shipping</p>
                        <p className="text-gray-900 font-medium">{currency}{shippingCost.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-600">Tax</p>
                        <p className="text-gray-900 font-medium">{currency}{tax.toFixed(2)}</p>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <p className="text-base font-medium text-gray-900">Total</p>
                          <p className="text-base font-bold text-gray-900">
                            {currency}{total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Make buttons more responsive */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-4">
              <Link
                to="/checkout"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaArrowLeft className="mr-2" />
                Back to Shipping
              </Link>
              
              <button
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
              >
                <FaLock className="mr-2" />
                Place Order
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <NewsletterBox />
    </div>
  );
};

export default Payment; 