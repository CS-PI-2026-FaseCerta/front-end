export const PERFIL_USUARIO = "gestor";
// Altere para "tecnico" ou "gestor" para testar a experiência do outro perfil.
// No futuro, este valor deve vir de token, contexto global ou estado autenticado.

export const PERFIL_LABELS = {
  gestor: "Administrativo / Gestor",
  tecnico: "Técnico em Campo",
};

const USERS_STORAGE_KEY = "mockAuthUsers";

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
    return { success: false, message: "Dados do usuário inválidos." };
  }

  const email = normalize(novoUsuario.email);
  const username = normalize(novoUsuario.username || novoUsuario.nome);
  const senha = novoUsuario.password || novoUsuario.senha || "";

  if (!email || !username || !senha) {
    return {
      success: false,
      message: "Email, username e senha são obrigatórios.",
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
      message: "Já existe usuário com este email ou username.",
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
    return { success: false, message: "Credenciais inválidas." };
  }

  const users = getUsers();
  const user = users.find(
    (item) =>
      normalize(item.email) === identifier ||
      normalize(item.username) === identifier,
  );

  if (!user) {
    return { success: false, message: "Usuário não encontrado." };
  }

  const passwordMatches =
    simpleHash(credentials.password) === user.passwordHash;
  if (!passwordMatches) {
    return { success: false, message: "Senha inválida." };
  }

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

  static fromMock() {
    const [firstUser] = getUsers();

    if (!firstUser) {
      return new Usuario(1, "admin", "admin@fasecerta.com", PERFIL_USUARIO);
    }

    return new Usuario(
      firstUser.id,
      firstUser.nome,
      firstUser.email,
      firstUser.perfil,
    );
  }

  get profileLabel() {
    return PERFIL_LABELS[this.perfil] || "Perfil Desconhecido";
  }

  hasAccess(allowedProfiles) {
    return allowedProfiles.includes(this.perfil);
  }
}
