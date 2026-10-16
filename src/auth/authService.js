import api from "../config/axiosConfig";
import { saveSession } from "./session";

const requestLoginToken = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const { data } = await api.post("/api/auth/login", {
    email: normalizedEmail,
    password,
  });

  if (!data || typeof data.token !== "string" || !data.token.trim()) {
    throw new Error("O servidor respondeu sem um token de autenticação válido.");
  }
  return { token: data.token, email: normalizedEmail };
};

// Interface já utilizada pelo login da branch original: autentica E salva a sessão.
export async function loginWithEmail(email, password, rememberMe = false) {
  const result = await requestLoginToken(email, password);
  return saveSession(result.token, result.email, rememberMe);
}

// Compatibilidade com a tela de login da correção anterior: retorna apenas o JWT.
// A tela salva o token depois, usando saveSession({ token, email, rememberMe }).
export async function loginWithApi(email, password) {
  try {
    const result = await requestLoginToken(email, password);
    return result.token;
  } catch (error) {
    const status = error.status || error.response?.status;
    if (status === 401) throw new Error("E-mail ou senha incorretos.");
    if (status === 429) {
      throw new Error("Muitas tentativas de login. Aguarde um pouco e tente novamente.");
    }
    if (status >= 500) {
      throw new Error("O servidor não conseguiu concluir o login. Tente novamente mais tarde.");
    }
    if (!error.response && !status && error.message !== "O servidor respondeu sem um token de autenticação válido.") {
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e a API.");
    }
    throw error;
  }
}

// Mantido: cadastro de usuários autenticado. Não substituí-lo por mock.
export async function registerUser({ username, email, password, perfil }) {
  const { data } = await api.post("/api/usuarios", {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
    perfil: perfil.toUpperCase(),
  });
  return data;
}
