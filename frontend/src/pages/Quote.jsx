import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGem,
  FaRing,
  FaNotesMedical,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { submitQuoteRequest } from "../services/formService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Quote = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jewelryType: "",
    budget: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.jewelryType) {
      newErrors.jewelryType = "Please select a jewelry type";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitQuoteRequest(formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      toast.success("Quote request submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        jewelryType: "",
        budget: "",
        description: "",
      });
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit request. Please try again."
      );
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/quote-hero-background.jpg"
            alt="Custom jewelry design"
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
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
                Custom Design
              </span>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6">
              Request a Quote
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              Let us create the perfect custom jewelry piece for your special
              occasion. Our expert craftsmen will bring your vision to life.
            </p>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaNotesMedical className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Submit Request
                </h3>
                <p className="text-gray-600">
                  Fill out our custom quote form with your jewelry preferences
                  and requirements.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaFileInvoiceDollar className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Receive Quote
                </h3>
                <p className="text-gray-600">
                  Our experts will review your request and provide a detailed
                  quote within 48 hours.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaGem className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Design Process
                </h3>
                <p className="text-gray-600">
                  Work with our designers to refine your vision and approve the
                  final design.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <FaRing className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Creation & Delivery
                </h3>
                <p className="text-gray-600">
                  Our master craftsmen create your piece and deliver it in a
                  luxury presentation box.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quote Form */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Request Your Custom Quote
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto mt-4"></div>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Whether you're looking for a custom engagement ring, a special
                anniversary gift, or a unique piece of fine jewelry, our team is
                here to bring your vision to life.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your custom jewelry request has been submitted
                      successfully. One of our jewelry experts will contact you
                      within 48 hours to discuss your requirements in detail.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
                    >
                      Submit Another Request
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                          required
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                          required
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="jewelryType"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Jewelry Type *
                        </label>
                        <select
                          id="jewelryType"
                          name="jewelryType"
                          value={formData.jewelryType}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.jewelryType
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="ring">Ring</option>
                          <option value="necklace">Necklace</option>
                          <option value="bracelet">Bracelet</option>
                          <option value="earrings">Earrings</option>
                          <option value="pendant">Pendant</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.jewelryType && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.jewelryType}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">Select Budget Range</option>
                        <option value="under-1000">Under $1,000</option>
                        <option value="1000-3000">$1,000 - $3,000</option>
                        <option value="3000-5000">$3,000 - $5,000</option>
                        <option value="5000-10000">$5,000 - $10,000</option>
                        <option value="over-10000">Over $10,000</option>
                      </select>
                    </div>

                    <div className="mb-8">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description of Your Request *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        className={`w-full px-4 py-2 border ${
                          errors.description
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        placeholder="Please describe your vision, including materials, gemstones, design elements, and any special requirements."
                        required
                      ></textarea>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                What Our Clients Say
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Emily Johnson</h4>
                    <p className="text-sm text-gray-500">
                      Custom Engagement Ring
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The custom engagement ring Diamond Cartel created exceeded
                  all my expectations. The attention to detail and craftsmanship
                  is extraordinary. My fiancée was absolutely speechless!"
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Michael Chen</h4>
                    <p className="text-sm text-gray-500">
                      Anniversary Necklace
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "I wanted something unique for our 10th anniversary. The team
                  at Diamond Cartel helped me design a stunning sapphire
                  necklace that perfectly captures our journey together."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Sophia Rodriguez
                    </h4>
                    <p className="text-sm text-gray-500">
                      Family Heirloom Redesign
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Diamond Cartel transformed my grandmother's outdated jewelry
                  into a modern piece I can wear every day. They respected the
                  sentimental value while creating something fresh and
                  beautiful."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Create Something Extraordinary?
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              From initial concept to final creation, we'll guide you through
              every step of the custom jewelry process.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-white rounded-md shadow-sm text-base font-medium text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Explore Our Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
