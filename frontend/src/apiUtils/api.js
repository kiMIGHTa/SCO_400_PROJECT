import axios from "axios";
import accountApis from "./account";

// Base URL from Vite env
const BASE_URL = import.meta.env.VITE_API_URL;

// Anonymous Axios instance (No authentication required)
export const anonAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Authenticated Axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};

// Request interceptor to add JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); // Use localStorage instead of sessionStorage
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => response, // Return successful response
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token found, logging out.");
        handleLogout(); // Clear tokens and redirect
        return Promise.reject(error);
      }

      try {
        console.log("Refreshing token..."); // Debugging
        const response = await accountApis.refreshToken({
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh;

        // Save new tokens
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the original request and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Backend Axios instance (For logging requests)
export const backendAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

backendAxiosInstance.interceptors.request.use(async (request) => {
  console.log("request", request);
  return request;
});
