import { createContext, useContext } from "react";
import { useUI } from "../hooks/useUI";

// Create context
export const UIContext = createContext();

// Hook for using the UI context
export const useUIContext = () => useContext(UIContext);

// Provider component
export const UIProvider = ({ children }) => {
  const { uiElement, loading, error } = useUI();

  return (
    <UIContext.Provider value={{ uiElement, loading, error }}>
      {children}
    </UIContext.Provider>
  );
};
