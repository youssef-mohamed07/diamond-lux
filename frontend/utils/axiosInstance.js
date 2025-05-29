import axios from "axios";

let backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
// Remove last / from backendURL if it exists
backendURL = backendURL.replace(/\/$/, "");
console.log("backendURL", backendURL);

const axiosInstance = axios.create({
  baseURL: `${backendURL || "http://localhost:3000"}`,
  timeout: 15000, // 15 second timeout (increased from 10)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  async (error) => {
    const originalRequest = error.config;

    // If there's no response, or it's a timeout, network error, or 5xx server error
    const isNetworkOrServerError =
      !error.response ||
      error.code === "ECONNABORTED" ||
      (error.response && error.response.status >= 500);

    // Maximum of 2 retries for retriable errors
    const maxRetries = 2;
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (isNetworkOrServerError && originalRequest._retryCount < maxRetries) {
      originalRequest._retryCount++;

      // Add progressively longer delay before retrying (1s, 2s, etc.)
      const delay = originalRequest._retryCount * 1000;
      console.log(
        `Retrying request to ${originalRequest.url} after ${delay}ms (attempt ${originalRequest._retryCount})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));

      // Increase timeout for retry attempts
      originalRequest.timeout = 20000; // 20 seconds for retries

      // Retry the request
      return axiosInstance(originalRequest);
    }

    // If we exhausted all retries, log a more detailed error
    if (originalRequest._retryCount >= maxRetries) {
      console.error(
        `Request to ${originalRequest.url} failed after ${maxRetries} retries.`
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
