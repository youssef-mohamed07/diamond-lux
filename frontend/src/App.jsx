import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import Quote from "./pages/Quote";


// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/request-quote" element={<Quote />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
