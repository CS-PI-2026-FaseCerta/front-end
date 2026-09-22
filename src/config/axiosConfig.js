import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const TOKEN_KEYS = ["token", "accessToken", "access_token", "jwt"];

export function getAuthToken() {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    for (const key of TOKEN_KEYS) {
      const token = storage.getItem(key);
      if (token) return token;
    }

    try {
      const user = JSON.parse(storage.getItem("user") || "null");
      const token = user?.token || user?.accessToken || user?.access_token || user?.jwt;
      if (token) return token;
    } catch {
      // Ignora uma sessão inválida e continua procurando o token nas demais fontes.
    }
  }

  return null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// api.interceptors.request.use((config) => {
//   const token = getAuthToken();

//   if (!token) {
//     window.location.assign("/login");
//     const error = new Error("Sessão expirada. Faça login novamente.");
//     error.status = 401;
//     return Promise.reject(error);
//   }

//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// Comentado temporariamente enquanto não há token implementado.

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
    if (error.response?.status === 401) {
      window.location.assign("/login");
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "Não foi possível concluir a operação.";

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status || error.status;
    normalizedError.data = error.response?.data;
    return Promise.reject(normalizedError);
  },
);

export default api;
