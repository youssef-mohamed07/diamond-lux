import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiamondShapes from "./pages/DiamondShapes";
import Home from "./pages/Home";
import About_us from "./pages/Aboutus";
import UI from "./pages/UI";
import FormSettings from "./pages/formSettings";
export const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<UI token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route
                  path="/categories"
                  element={<DiamondShapes token={token} />}
                />
                <Route path="/home" element={<Home token={token} />} />
                <Route path="/about-us" element={<About_us token={token} />} />
                <Route path="/ui" element={<UI token={token} />} />
                <Route path="/form-settings" element={<FormSettings />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
