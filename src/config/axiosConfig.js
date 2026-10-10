import axios from "axios";
import { clearSession, getAuthToken } from "../auth/session";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  // Login público não deve carregar Authorization de uma sessão anterior.
  if (config.url !== "/api/auth/login") {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Uma senha errada no login não deve invalidar/redirecionar a página pública.
    if (status === 401 && error.config?.url !== "/api/auth/login") {
      clearSession();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    const apiMessage = error.response?.data?.message ||
      error.response?.data?.error || error.response?.data?.detail;
    if (typeof apiMessage === "string" && apiMessage) error.message = apiMessage;
    if (status) error.status = status;
    return Promise.reject(error);
  },
);

export { getAuthToken } from "../auth/session";
export default api;
