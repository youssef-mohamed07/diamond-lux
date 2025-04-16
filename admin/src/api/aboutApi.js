import axiosInstance from "../utils/axios";

export const getAboutData = async () => {
  const response = await axiosInstance.get("/about");
  return response.data.aboutUs;
};

export const updateAboutData = async (data) => {
  const response = await axiosInstance.patch("/about", data);
  return response.data.aboutUs;
};

export const getAboutDataById = async (id) => {
  const response = await axiosInstance.get(`/about/${id}`);
  return response.data.about;
};
