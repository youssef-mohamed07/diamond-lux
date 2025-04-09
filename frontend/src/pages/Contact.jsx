import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaGem,
  FaRing,
} from "react-icons/fa";
import NewsletterBox from "../components/NewsletterBox";
import { submitContactForm } from "../services/formService";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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
      await submitContactForm(formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
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
            src="/images/contact-hero-background.jpg"
            alt="Luxury jewelry showroom"
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
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
                Get In Touch
              </span>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              We'd love to hear from you. Reach out to us with any questions
              about our luxury jewelry collection.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-gray-200 ">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100  mb-4">
                  <FaMapMarkerAlt className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Our Location
                </h3>
                <p className="text-gray-600">47th St, New York, NY, USA</p>
                <hr className="my-4" />
                <p className="text-gray-600">55 Queen St, Torronto, ON, CA</p>
              </div>

              <div className="text-center p-6 border border-gray-200 ">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100  mb-4">
                  <FaPhone className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Phone
                </h3>
                <p className="text-gray-600">+1 437-361-4188</p>
              </div>

              <div className="text-center p-6 border border-gray-200 ">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100  mb-4">
                  <FaEnvelope className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Email
                </h3>
                <p className="text-gray-600 text-[0.9rem]">
                  Diamondcartel07@gmail.com
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form and Services */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Get In Touch</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto mt-4"></div>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Have a question about our diamond collection or need assistance
                with a custom piece? Fill out the form below and our jewelry
                experts will get back to you as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white p-8  shadow-sm">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100  mb-6">
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
                      Your message has been sent successfully. We'll get back to
                      you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="inline-flex items-center px-4 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
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
                        }  focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
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
                        }  focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${
                          errors.subject ? "border-red-500" : "border-gray-300"
                        }  focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        required
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className={`w-full px-4 py-2 border ${
                          errors.message ? "border-red-500" : "border-gray-300"
                        }  focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
                        required
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full  px-6 py-3 border border-transparent  shadow-sm text-base font-medium text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:from-gray-800 hover:to-gray-700 ${
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
                          Sending...
                        </span>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-white p-8  shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Our Services
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12  bg-gray-100 text-gray-900">
                        <FaGem className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Custom Jewelry Design
                      </h4>
                      <p className="mt-2 text-gray-600">
                        Work with our expert designers to create a unique piece
                        that perfectly captures your vision and style.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12  bg-gray-100 text-gray-900">
                        <FaRing className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Engagement & Wedding
                      </h4>
                      <p className="mt-2 text-gray-600">
                        Find the perfect symbol of your love with our exquisite
                        collection of engagement rings and wedding bands.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12  bg-gray-100 text-gray-900">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Jewelry Repair & Restoration
                      </h4>
                      <p className="mt-2 text-gray-600">
                        Restore your treasured pieces to their original beauty
                        with our expert repair and restoration services.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12  bg-gray-100 text-gray-900">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Appraisal Services
                      </h4>
                      <p className="mt-2 text-gray-600">
                        Get professional appraisals for insurance, estate
                        planning, or resale purposes from our certified
                        gemologists.
                      </p>
                    </div>
                  </div>
                </div>
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6">Visit Our Showroom</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Experience our exquisite collection in person. Our jewelry experts
              are ready to assist you in finding the perfect piece.
            </p>
            <a
              href="/request-quote"
              className="inline-flex items-center justify-center px-6 py-3 border border-white  shadow-sm text-base font-medium text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Request a Custom Quote
            </a>
          </motion.div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
