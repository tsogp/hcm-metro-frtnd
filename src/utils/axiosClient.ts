import axios from "axios";
import https from "https";

export const FRONTEND_URL = "http://localhost:3000"
const BACKEND_URL = "https://localhost:8443";
const isServer = typeof window === "undefined";

// Create axios instance
const API = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

  /*
  --------------------------------
  | ONLY USE THIS IN DEVELOPMENT |
  --------------------------------
   */
  httpsAgent: new https.Agent({
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
