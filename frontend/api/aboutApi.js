import axiosInstance from "../utils/axiosInstance";

export const getAboutData = async () => {
  const response = await axiosInstance.get("/about");
  if (response.data.aboutUs) {
    return response.data.aboutUs;
  } else {
    throw new Error("No about data found");
  }
};

export const getAboutDataById = async (id) => {
  const response = await axiosInstance.get(`/about/${id}`);
  return response.data.about;
};
