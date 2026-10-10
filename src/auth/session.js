// Sessão JWT emitida pelo backend. Claims são usadas apenas para UX; a API
// valida assinatura, expiração e autorização em todas as requisições.
const TOKEN_KEY = "fasecerta.jwt";
const USER_KEY = "fasecerta.user";
const REMEMBER_KEY = "fasecerta.rememberedEmail";
const LEGACY_TOKEN_KEYS = ["token", "accessToken", "access_token", "jwt"];
const PROFILE_SET = new Set(["ADMIN", "GESTOR", "TECNICO"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const PERFIL_LABELS = {
  admin: "Administrador",
  gestor: "Administrativo / Gestor",
  tecnico: "Técnico em Campo",
};

export const SESSION_CHANGE_EVENT = "fasecerta:auth-change";

const announceAuthChange = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
};

const storages = () =>
  typeof window === "undefined" ? [] : [window.sessionStorage, window.localStorage];

export function decodeToken(token) {
  if (typeof token !== "string" || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) return null;
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "=")));
    const now = Math.floor(Date.now() / 1000);
    if (!payload || !UUID_RE.test(payload.sub) || !PROFILE_SET.has(payload.role) ||
        !Number.isFinite(payload.exp) || payload.exp <= now ||
        !Number.isFinite(payload.iat) || payload.iat > now + 60 || payload.exp <= payload.iat) {
      return null;
    }
    return { id: payload.sub, role: payload.role, exp: payload.exp };
  } catch {
    return null;
  }
}

export function clearSession(announce = true) {
  for (const storage of storages()) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem("user"); // sessão mock anterior não é confiável
    storage.removeItem("mockAuthUsers");
    storage.removeItem("rememberMe"); // versões antigas guardavam senhas em texto puro
    LEGACY_TOKEN_KEYS.forEach((key) => storage.removeItem(key));
  }
  if (announce) announceAuthChange();
}

export function getAuthToken() {
  for (const storage of storages()) {
    const token = storage.getItem(TOKEN_KEY);
    if (token) {
      if (decodeToken(token)) return token;
      clearSession(false);
      return null;
    }
  }
  return null;
}

export function saveSession(token, email, rememberMe = false) {
  const claims = decodeToken(token);
  if (!claims) throw new Error("O servidor retornou um token de acesso inválido.");
  clearSession(false);
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify({ email: String(email).trim().toLowerCase() }));
  announceAuthChange();
  return getCurrentUser();
}

export function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  const claims = decodeToken(token);
  const storage = storages().find((item) => item.getItem(TOKEN_KEY) === token);
  let email = "";
  try {
    email = JSON.parse(storage?.getItem(USER_KEY) || "null")?.email || "";
  } catch { /* dados de exibição opcionais */ }
  const perfil = claims.role.toLowerCase();
  return {
    id: claims.id,
    nome: email ? email.split("@")[0] : "Usuário",
    email,
    perfil,
    profileLabel: PERFIL_LABELS[perfil],
    hasAccess: (profiles) => profiles.some((profile) => profile.toLowerCase() === perfil),
  };
}

export function saveRememberMe({ rememberMe, emailOrUsername }) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("rememberMe"); // removemos dados legados que incluíam senha
  if (rememberMe) {
    window.localStorage.setItem(REMEMBER_KEY, String(emailOrUsername).trim().toLowerCase());
  } else {
    window.localStorage.removeItem(REMEMBER_KEY);
  }
}

export function getRememberMe() {
  if (typeof window === "undefined") return null;
  // Nunca manter senhas de versões antigas nem em localStorage nem em estado de formulário.
  window.localStorage.removeItem("rememberMe");
  const emailOrUsername = window.localStorage.getItem(REMEMBER_KEY);
  return emailOrUsername ? { emailOrUsername, rememberMe: true } : null;
}
