import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeGallery from "./components/HomeGallery";

// Pages
import Home from "./pages/Home";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Quote from "./pages/Quote";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Diamond from "./pages/Products/Diamond";
import Bracelets from "./pages/Products/Jewllery/Bracelets";
import Earrings from "./pages/Products/Jewllery/Earrings";
import Necklaces from "./pages/Products/Jewllery/Necklaces";
import EngagementRings from "./pages/Products/Jewllery/EngagementRings";
import EngagementRingsEdit from "./pages/Products/Jewllery/EngagementRings-edit";
import WeddingBands from "./pages/Products/Jewllery/WeddingBands";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/diamond" element={<Diamond />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/request-quote" element={<Quote />} />
        <Route path="/products/jewellery/bracelets" element={<Bracelets />} />
        <Route path="/products/jewellery/earrings" element={<Earrings />} />
        <Route path="/products/jewellery/necklaces" element={<Necklaces />} />
        <Route
          path="/products/jewellery/engagement-rings"
          element={<EngagementRings />}
        />
        <Route path="/products/jewellery/engagement-rings-edit" element={<EngagementRingsEdit />} />
        <Route
          path="/products/jewellery/wedding-bands"
          element={<WeddingBands />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
