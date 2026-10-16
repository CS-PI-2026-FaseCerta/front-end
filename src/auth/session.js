// Sessão baseada no JWT emitido pelo backend. O token contém sub, role e exp.
// A leitura do payload aqui serve apenas à interface; a autorização real é do backend.
export const PERFIL_LABELS = {
  admin: "Administrador",
  gestor: "Administrativo / Gestor",
  tecnico: "Técnico em Campo",
};

const SESSION_KEY = "fasecerta_session";
const REMEMBER_EMAIL_KEY = "fasecerta_remember_email";
const LEGACY_REMEMBER_KEY = "rememberMe";
const LEGACY_USER_KEY = "user";

const getStorages = () =>
  typeof window === "undefined"
    ? []
    : [window.sessionStorage, window.localStorage];

const parseClaims = (token) => {
  if (typeof token !== "string" || token.split(".").length !== 3) return null;

  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(window.atob(payload));
    const perfil = typeof claims.role === "string" ? claims.role.toLowerCase() : "";

    if (
      typeof claims.sub !== "string" ||
      !claims.sub ||
      !Object.prototype.hasOwnProperty.call(PERFIL_LABELS, perfil) ||
      typeof claims.exp !== "number" ||
      claims.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    return { id: claims.sub, perfil };
  } catch {
    return null;
  }
};

const readSession = () => {
  for (const storage of getStorages()) {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) continue;

    try {
      const session = JSON.parse(raw);
      const claims = parseClaims(session?.token);
      if (claims) return { ...claims, token: session.token, email: session.email || "" };
    } catch {
      // Dados locais antigos ou inválidos não devem autenticar o usuário.
    }
    storage.removeItem(SESSION_KEY);
  }
  return null;
};

export const getCurrentUser = () => {
  const session = readSession();
  if (!session) return null;

  return {
    id: session.id,
    email: session.email,
    nome: session.email.split("@")[0] || "Usuário",
    perfil: session.perfil,
  };
};

export const getToken = () => readSession()?.token || null;

export const saveSession = ({ token, email, rememberMe = false }) => {
  if (!parseClaims(token)) {
    throw new Error("O servidor retornou um token de autenticação inválido ou expirado.");
  }

  const storages = getStorages();
  if (!storages.length) throw new Error("Não foi possível armazenar a sessão.");

  storages.forEach((storage) => storage.removeItem(SESSION_KEY));
  const targetStorage = rememberMe ? window.localStorage : window.sessionStorage;
  targetStorage.setItem(SESSION_KEY, JSON.stringify({ token, email }));
  // Não permitir que sessões simuladas anteriores mantenham acesso à interface.
  window.localStorage.removeItem(LEGACY_USER_KEY);
};

export const clearSession = () => {
  getStorages().forEach((storage) => storage.removeItem(SESSION_KEY));
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LEGACY_USER_KEY);
  }
};

export const saveRememberMe = ({ rememberMe, emailOrUsername }) => {
  if (typeof window === "undefined") return;

  // Versões anteriores gravavam a senha em texto puro neste item.
  window.localStorage.removeItem(LEGACY_REMEMBER_KEY);
  if (rememberMe) {
    window.localStorage.setItem(REMEMBER_EMAIL_KEY, emailOrUsername.trim());
  } else {
    window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
  }
};

export const getRememberMe = () => {
  if (typeof window === "undefined") return null;

  const oldValue = window.localStorage.getItem(LEGACY_REMEMBER_KEY);
  // Elimina imediatamente eventual senha antiga em texto puro.
  window.localStorage.removeItem(LEGACY_REMEMBER_KEY);

  let rememberedEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
  if (!rememberedEmail && oldValue) {
    try {
      rememberedEmail = JSON.parse(oldValue)?.emailOrUsername || "";
      if (rememberedEmail) {
        window.localStorage.setItem(REMEMBER_EMAIL_KEY, rememberedEmail);
      }
    } catch {
      // Ignora dados inválidos da sessão simulada antiga.
    }
  }

  return rememberedEmail ? { emailOrUsername: rememberedEmail } : null;
};
