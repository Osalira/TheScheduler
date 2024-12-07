import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Create a new Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a context for the API client
const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const navigate = useNavigate();

  // Add a request interceptor to include Authorization header globally
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Handle errors before the request is sent
      return Promise.reject(error);
    }
  );

  // Set up Axios response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            console.error("No refresh token found");
            throw new Error("Missing refresh token");
          }

          // Include the refresh token in the Authorization header
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/api/refresh`,
            {},
            {
              headers: {
                "Authorization": `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("authToken", newAccessToken);

          // Retry the failed request with the new token
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiClient(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Clear tokens and redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
          throw refreshError;
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <ApiContext.Provider value={apiClient}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to access the API client
export const useApiClient = () => {
  return useContext(ApiContext);
};
