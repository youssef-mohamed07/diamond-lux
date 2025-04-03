import axiosInstance from "../utils/axiosInstance";

export const getUIElement = async () => {
  const response = await axiosInstance.get("/ui");
  if (response.data.uiElement) {
    return response.data.uiElement;
  } else {
    throw new Error("No UI element found");
  }
};
