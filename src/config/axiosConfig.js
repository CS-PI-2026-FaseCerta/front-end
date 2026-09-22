import axios from "axios";
import { clearSession } from "../auth/mockAuth";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * A autenticação atual da aplicação ainda utiliza mockAuth
 * e não fornece JWT.
 *
 * O envio de Authorization: Bearer será integrado junto
 * com o fluxo real de autenticação.
 *
 * Não deve ser criado ou persistido token fictício.
 */

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

    return Promise.reject(error);
  }
);

export default api;