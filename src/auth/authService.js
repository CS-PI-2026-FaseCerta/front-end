import api from "../config/axiosConfig";
import { saveSession } from "./session";

export async function loginWithEmail(email, password, rememberMe = false) {
  const normalizedEmail = email.trim().toLowerCase();
  const { data } = await api.post("/api/auth/login", { email: normalizedEmail, password });
  if (!data || typeof data.token !== "string") {
    throw new Error("Resposta de autenticação inválida.");
  }
  return saveSession(data.token, normalizedEmail, rememberMe);
}

export async function registerUser({ username, email, password, perfil }) {
  const { data } = await api.post("/api/usuarios", {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
    perfil: perfil.toUpperCase(),
  });
  return data;
}
