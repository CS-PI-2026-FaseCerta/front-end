export const PERFIL_USUARIO = "gestor";
// Altere para "tecnico" ou "gestor" para testar a experiência do outro perfil.
// No futuro, este valor deve vir de token, contexto global ou estado autenticado.

export const PERFIL_LABELS = {
  gestor: "Administrativo / Gestor",
  tecnico: "Técnico em Campo",
};

const USERS_STORAGE_KEY = "mockAuthUsers";
const CURRENT_USER_STORAGE_KEY = "user";
const REMEMBER_ME_STORAGE_KEY = "rememberMe";

const GENERIC_LOGIN_ERROR_MESSAGE =
  "E-mail/Nome de Usuário ou senha incorretos";
const GENERIC_CREATE_ACCOUNT_ERROR_MESSAGE =
  "Não foi possível criar a conta com os dados informados.";

// Lista padrão inicial. Novos usuários serão adicionados dinamicamente via addUser.
const DEFAULT_USERS = [
  {
    id: 1,
    nome: "admin",
    username: "admin",
    email: "admin@fasecerta.com",
    perfil: PERFIL_USUARIO,
    passwordHash: "",
  },
];

// Hash simples apenas para mock local; credenciais reais devem ser tratadas no backend.
const simpleHash = (value = "") => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
};

const normalize = (value = "") => value.trim().toLowerCase();

const withDefaultHashes = (users) =>
  users.map((user) => ({
    ...user,
    passwordHash:
      user.passwordHash ||
      simpleHash(user.password || user.senha || "admin123"),
  }));

const readUsersFromStorage = () => {
  if (typeof window === "undefined" || !window.localStorage) return null;

  const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return withDefaultHashes(parsed);
  } catch {
    return null;
  }
};

const saveUsersToStorage = (users) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const saveCurrentUser = (user) => {
  if (typeof window === "undefined" || !window.localStorage) return;

  // Mock local: no backend real, guardamos apenas dados nao sensiveis da sessao.
  const sanitizedUser = {
    id: user.id,
    nome: user.nome,
    email: user.email,
    perfil: user.perfil,
  };

  window.localStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(sanitizedUser),
  );
};

export const getCurrentUser = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const { id, nome, email, perfil } = parsed;
    if (!id || !nome || !email || !perfil) return null;

    return new Usuario(id, nome, email, perfil);
  } catch {
    return null;
  }
};

export const saveRememberMe = (credentials) => {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  if (!credentials || !credentials.rememberMe) {
    window.localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
    return;
  }

  const payload = {
    emailOrUsername: credentials.emailOrUsername || "",
    // IMPORTANTE: salvar senha no localStorage nao e seguro; aqui e apenas simulacao de ambiente mock.
    password: credentials.password || "",
  };

  window.localStorage.setItem(REMEMBER_ME_STORAGE_KEY, JSON.stringify(payload));
};

export const getRememberMe = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(REMEMBER_ME_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return {
      emailOrUsername: parsed.emailOrUsername || "",
      password: parsed.password || "",
      rememberMe: true,
    };
  } catch {
    return null;
  }
};

export const clearSession = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  // Remove apenas sessao autenticada. Dados de "Lembre de mim" permanecem para UX.
  window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

export const getUsers = () => {
  const storedUsers = readUsersFromStorage();
  if (storedUsers && storedUsers.length > 0) {
    return storedUsers;
  }

  const seededUsers = withDefaultHashes(DEFAULT_USERS);
  saveUsersToStorage(seededUsers);
  return seededUsers;
};

// Preparação para o fluxo futuro de cadastro. Ainda não existe tela de cadastro integrada.
export const addUser = (novoUsuario) => {
  if (!novoUsuario || typeof novoUsuario !== "object") {
    return { success: false, message: GENERIC_CREATE_ACCOUNT_ERROR_MESSAGE };
  }

  const email = normalize(novoUsuario.email);
  const username = normalize(novoUsuario.username || novoUsuario.nome);
  const senha = novoUsuario.password || novoUsuario.senha || "";

  if (!email || !username || !senha) {
    return {
      success: false,
      // Mantemos erro generico para nao expor quais campos falharam.
      message: GENERIC_CREATE_ACCOUNT_ERROR_MESSAGE,
    };
  }

  const users = getUsers();
  const duplicatedUser = users.some(
    (user) =>
      normalize(user.email) === email || normalize(user.username) === username,
  );

  if (duplicatedUser) {
    return {
      success: false,
      message: GENERIC_CREATE_ACCOUNT_ERROR_MESSAGE,
    };
  }

  const nextId =
    users.reduce((maxId, user) => Math.max(maxId, user.id || 0), 0) + 1;
  const userToSave = {
    id: novoUsuario.id || nextId,
    nome: novoUsuario.nome || username,
    username,
    email,
    perfil: novoUsuario.perfil || PERFIL_USUARIO,
    passwordHash: simpleHash(senha),
  };

  const updatedUsers = [...users, userToSave];
  saveUsersToStorage(updatedUsers);

  return { success: true, user: userToSave };
};

export const login = (emailOrUsername, password) => {
  const credentials =
    typeof emailOrUsername === "object" && emailOrUsername !== null
      ? {
          emailOrUsername:
            emailOrUsername.emailOrUsername ||
            emailOrUsername.email ||
            emailOrUsername.username ||
            "",
          password: emailOrUsername.password || emailOrUsername.senha || "",
        }
      : {
          emailOrUsername: emailOrUsername || "",
          password: password || "",
        };

  const identifier = normalize(credentials.emailOrUsername);
  if (!identifier || !credentials.password) {
    return { success: false, message: GENERIC_LOGIN_ERROR_MESSAGE };
  }

  const users = getUsers();
  const user = users.find(
    (item) =>
      normalize(item.email) === identifier ||
      normalize(item.username) === identifier,
  );

  if (!user) {
    // Mensagem unica para evitar enumeracao de usuarios validos.
    return { success: false, message: GENERIC_LOGIN_ERROR_MESSAGE };
  }

  const passwordMatches =
    simpleHash(credentials.password) === user.passwordHash;
  if (!passwordMatches) {
    return { success: false, message: GENERIC_LOGIN_ERROR_MESSAGE };
  }

  saveCurrentUser(user);

  return {
    success: true,
    user: new Usuario(user.id, user.nome, user.email, user.perfil),
  };
};

export class Usuario {
  constructor(id, nome, email, perfil) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.perfil = perfil; // 'gestor' ou 'tecnico'
  }

  get profileLabel() {
    return PERFIL_LABELS[this.perfil] || "Perfil Desconhecido";
  }

  hasAccess(allowedProfiles) {
    return allowedProfiles.includes(this.perfil);
  }
}
