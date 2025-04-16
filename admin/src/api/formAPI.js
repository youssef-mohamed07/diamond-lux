import axiosInstance from "../utils/axios";

// Fetch form fields from the backend
export const getFormFields = async () => {
  try {
    const response = await axiosInstance.get("/form");
    return response.data.fields;
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return [];
  }
};

// Add a new field to the form
export const addFormField = async (fieldData) => {
  try {
    const response = await axiosInstance.post("/form/add-field", fieldData);
    return response.data;
  } catch (error) {
    console.error("Error adding form field:", error);
    throw error;
  }
};

// Update an existing form field
export const updateFormField = async (id, fieldData) => {
  try {
    const response = await axiosInstance.put(
      `/form/edit-field/${id}`,
      fieldData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating form field:", error);
    throw error;
  }
};

// Delete a form field
export const deleteFormField = async (id) => {
  try {
    const response = await axiosInstance.delete(`/form/remove-field/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting form field:", error);
    throw error;
  }
};

// Reorder form fields
export const reorderFormFields = async (newOrder) => {
  try {
    const response = await axiosInstance.put("/form/reorder-fields", {
      newOrder,
    });
    return response.data;
  } catch (error) {
    console.error("Error reordering form fields:", error);
    throw error;
  }
};

// Get unavailable dates
export const getUnavailableDates = async () => {
  try {
    const response = await axiosInstance.get("/form/unavailable-dates");
    return response.data.unavailableDates;
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    return [];
  }
};

// Add unavailable date
export const addUnavailableDate = async (date) => {
  try {
    const response = await axiosInstance.post("/form/unavailable-dates", {
      date,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding unavailable date:", error);
    throw error;
  }
};

// Remove unavailable date
export const removeUnavailableDate = async (date) => {
  try {
    const response = await axiosInstance.delete(
      `/form/unavailable-dates/${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing unavailable date:", error);
    throw error;
  }
};
