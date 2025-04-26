import { useState, useEffect } from "react";
import { getUIElement } from "../api/UIApi";

export const useUI = () => {
  const [uiElement, setUIElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUIElement = async () => {
      try {
        const data = await getUIElement();
        setUIElement(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch UI element:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchUIElement();
  }, []);

  return { uiElement, loading, error };
};
