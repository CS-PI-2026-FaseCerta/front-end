import axios from "axios";
import { clearSession } from "../auth/mockAuth";

const TOKEN_KEYS = ["token", "accessToken", "access_token", "jwt"];

export function getAuthToken() {
  if (typeof window === "undefined") return null;

  for (const storage of [window.localStorage, window.sessionStorage]) {
    for (const key of TOKEN_KEYS) {
      const token = storage.getItem(key);
      if (token) return token;
    }

    try {
      const user = JSON.parse(storage.getItem("user") || "null");
      const token =
        user?.token ||
        user?.accessToken ||
        user?.access_token ||
        user?.jwt;

      if (token) return token;
    } catch {
      // Ignora dados de sessao invalidos.
    }
  }

  return null;
}

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// O backend ainda nao exige JWT. Quando existir um token real, ele e enviado;
// na ausencia de token, a requisicao segue normalmente.
api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail;

    if (apiMessage) {
      error.message = apiMessage;
    }

    if (!error.status && error.response?.status) {
      error.status = error.response.status;
    }

    return Promise.reject(error);
  },
);

export default api;
