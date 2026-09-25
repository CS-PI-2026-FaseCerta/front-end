import axios from "axios";
import { clearSession } from "../auth/mockAuth";

const TOKEN_STORAGE_KEYS = ["accessToken", "access_token", "token", "jwt"];

const normalizeToken = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/^Bearer\s+/i, "");
};

export const getStoredAccessToken = () => {
  if (typeof window === "undefined") return "";

  const storages = [window.localStorage, window.sessionStorage].filter(Boolean);

  for (const storage of storages) {
    for (const key of TOKEN_STORAGE_KEYS) {
      const token = normalizeToken(storage.getItem(key));
      if (token) return token;
    }

    const rawUser = storage.getItem("user");
    if (!rawUser) continue;

    try {
      const user = JSON.parse(rawUser);
      const token = normalizeToken(
        user?.accessToken ?? user?.access_token ?? user?.token ?? user?.jwt,
      );
      if (token) return token;
    } catch {
      // Sessão legada/mock sem JWT: não fabrica token.
    }
  }

  return "";
};

const clearStoredAccessToken = () => {
  if (typeof window === "undefined") return;

  [window.localStorage, window.sessionStorage].filter(Boolean).forEach((storage) => {
    TOKEN_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
  });
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearStoredAccessToken();
      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
