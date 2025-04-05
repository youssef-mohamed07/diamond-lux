import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/"}`,
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Get userId from header and store it if present
    const userId = response.headers["x-user-id"];
    if (userId) {
      localStorage.setItem("userId", userId);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
