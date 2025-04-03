import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaEnvelope, FaUserCircle } from "react-icons/fa";

const Login = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(backendUrl + '/api/user/login', {
        email,
        password
      });
      
      if (response.data.success) {
        setToken(response.data.token);
        if (rememberMe) {
          localStorage.setItem('token', response.data.token);
        } else {
          sessionStorage.setItem('token', response.data.token);
        }
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
        >
          <div>
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
            >
              <FaUserCircle className="h-10 w-10" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-center text-3xl font-extrabold text-gray-900"
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2 text-center text-sm text-gray-600"
            >
              Sign in to access your account
            </motion.p>
          </div>
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-gray-900 hover:text-gray-700 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </div>
          </motion.form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-gray-900 hover:text-gray-700 transition-colors">
                Create one now
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
