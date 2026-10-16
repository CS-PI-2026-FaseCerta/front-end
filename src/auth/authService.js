// Em desenvolvimento, /api é encaminhado ao backend pelo proxy do React.
// Para deploy em origens diferentes, configure REACT_APP_API_URL no build.
const API_BASE_URL = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

export const loginWithApi = async (email, password) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e a API.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("E-mail ou senha incorretos.");
    }
    if (response.status === 429) {
      throw new Error("Muitas tentativas de login. Aguarde um pouco e tente novamente.");
    }
    if (response.status >= 500) {
      throw new Error("O servidor não conseguiu concluir o login. Tente novamente mais tarde.");
    }
    throw new Error(data?.message || "Não foi possível realizar o login.");
  }

  if (!data || typeof data.token !== "string" || !data.token.trim()) {
    throw new Error("O servidor respondeu sem um token de autenticação válido.");
  }

  return data.token;
};
