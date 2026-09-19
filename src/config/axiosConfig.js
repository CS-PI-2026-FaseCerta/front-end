import axios from "axios";
import { clearSession } from "../auth/mockAuth";

const api = axios.create({
    baseURL:
        process.env.REACT_APP_API_BASE_URL ||
        process.env.API_BASE_URL ||
        "http://localhost:8080",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
        const token = typeof window !== "undefined"
                ? window.localStorage.getItem("accessToken") ||
                    window.localStorage.getItem("token") ||
                    window.localStorage.getItem("authToken")
                : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            ["accessToken", "token", "authToken"].forEach((key) =>
                window.localStorage.removeItem(key),
            );
            clearSession();
            if (window.location.pathname !== "/login") {
                window.location.assign("/login");
            }
        }

        return Promise.reject(error);
    },
);

export default api;