import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ShopContextProvider } from "./context/ShopContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UIProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </UIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
