// src/api/axiosClient.js
import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "https://dakshai.onrender.com"

const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
