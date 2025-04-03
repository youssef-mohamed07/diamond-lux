import axiosInstance from "../utils/axiosInstance";

// Fetch form fields dynamically from the backend
export const getFormFields = async () => {
  try {
    const response = await axiosInstance.get("/form");
    return response.data.fields; //
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return [];
  }
};

// Get unavailable dates from the backend
export const getUnavailableDates = async () => {
  try {
    const response = await axiosInstance.get("/form/unavailable-dates");
    return response.data.unavailableDates || [];
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    return [];
  }
};

// For admin: Add a new unavailable date
export const addUnavailableDate = async (date) => {
  try {
    const response = await axiosInstance.post("/form/unavailable-dates", { date });
    return response.data;
  } catch (error) {
    console.error("Error adding unavailable date:", error);
    throw error;
  }
};

// For admin: Remove an unavailable date
export const removeUnavailableDate = async (date) => {
  try {
    const response = await axiosInstance.delete(`/form/unavailable-dates/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error removing unavailable date:", error);
    throw error;
  }
};
