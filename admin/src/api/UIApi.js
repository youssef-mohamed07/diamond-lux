import axiosInstance from "../utils/axios";

export const getUI = async () => {
  const response = await axiosInstance.get("/ui");
  if (response.data.status === 200) {
    return response.data.uiElement;
  }
  return null;
};

export const createUI = async (formData) => {
  try {
    const response = await axiosInstance.post("/ui", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.status === 200) {
      return response.data.uiElement;
    }
    return null;
  } catch (error) {
    console.error("Error creating UI:", error);
    throw error;
  }
};

export const updateUI = async (id, formData) => {
  try {
    const response = await axiosInstance.patch(`/ui/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.status === 200) {
      return response.data.uiElement;
    }
    return null;
  } catch (error) {
    console.error("Error updating UI:", error);
    throw error;
  }
};
