import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 2000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pine_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
