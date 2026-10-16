import {
  clearSession,
  getCurrentUser,
  getRememberMe,
  getToken,
  saveRememberMe,
  saveSession,
} from "./session";

const tokenFor = (role = "GESTOR", exp = Math.floor(Date.now() / 1000) + 3600) =>
  `${btoa(JSON.stringify({ alg: "HS256" }))}.${btoa(JSON.stringify({
    sub: "123e4567-e89b-12d3-a456-426614174000",
    role,
    exp,
  }))}.signature`;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test("lê o perfil real do JWT após login", () => {
  const token = tokenFor("ADMIN");
  saveSession({ token, email: "admin@exemplo.com", rememberMe: false });

  expect(getCurrentUser()).toMatchObject({
    email: "admin@exemplo.com",
    perfil: "admin",
  });
  expect(getToken()).toBe(token);
  expect(localStorage.getItem("fasecerta_session")).toBeNull();
  expect(sessionStorage.getItem("fasecerta_session")).not.toBeNull();
});

test("não autentica token vencido", () => {
  expect(() => saveSession({
    token: tokenFor("GESTOR", Math.floor(Date.now() / 1000) - 1),
    email: "gestor@exemplo.com",
  })).toThrow("inválido ou expirado");
  expect(getCurrentUser()).toBeNull();
});

test("não reaproveita usuário simulado antigo", () => {
  localStorage.setItem("user", JSON.stringify({
    id: 1, nome: "admin", email: "admin@fasecerta.com", perfil: "gestor",
  }));
  expect(getCurrentUser()).toBeNull();
});

test("o lembre de mim não persiste senhas e limpa valor legado", () => {
  localStorage.setItem("rememberMe", JSON.stringify({
    emailOrUsername: "usuario@exemplo.com", password: "senhaSecreta",
  }));
  expect(getRememberMe()).toEqual({ emailOrUsername: "usuario@exemplo.com" });
  expect(localStorage.getItem("rememberMe")).toBeNull();
  expect(localStorage.getItem("fasecerta_remember_email")).toBe("usuario@exemplo.com");
  saveRememberMe({ rememberMe: false, emailOrUsername: "usuario@exemplo.com" });
  expect(getRememberMe()).toBeNull();
});

test("logout remove token da sessão", () => {
  saveSession({ token: tokenFor(), email: "gestor@exemplo.com", rememberMe: true });
  expect(getCurrentUser()).not.toBeNull();
  clearSession();
  expect(getCurrentUser()).toBeNull();
  expect(getToken()).toBeNull();
});
