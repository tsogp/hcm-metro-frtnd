import axios from "axios";

const backendURL = "https://localhost:8443";
const isServer = typeof window === "undefined";

// Create axios instance
const API = axios.create({
  baseURL: backendURL,
  withCredentials: true, // This is important for CORS with credentials
  headers: {
    "Content-Type": "application/json",
  },
  // Add this for development to handle self-signed certificates
  httpsAgent: new (require("https").Agent)({
    rejectUnauthorized: false,
  }),
});

// Request interceptor
API.interceptors.request.use((config) => {
  try {
    return config;
  } catch (error) {
    if (!isServer) {
      console.error("Request interceptor error", error);
    }
    return Promise.reject(error);
  }
});

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default API;
