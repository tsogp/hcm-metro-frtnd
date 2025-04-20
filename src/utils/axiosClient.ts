import axios from "axios";

const backendURL = "http://localhost:8080";

const isServer = typeof window === "undefined";

export const API = axios.create({
  baseURL: backendURL,
});
