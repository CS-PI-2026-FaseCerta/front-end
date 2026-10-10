import { clearSession, decodeToken, getAuthToken, getCurrentUser, getRememberMe, saveRememberMe, saveSession } from "./session";

const jwt = (claims) => {
  const b64 = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64(claims)}.signature`;
};
const claims = (role = "GESTOR", diff = 3600) => ({
  sub: "5e0d9c1f-94c8-4db6-98d3-962f9a26f488",
  role,
  iat: Math.floor(Date.now() / 1000) - 10,
  exp: Math.floor(Date.now() / 1000) + diff,
});

beforeEach(() => { window.localStorage.clear(); window.sessionStorage.clear(); });

test("login do backend: guarda JWT na aba sem lembrar e extrai perfil", () => {
  const token = jwt(claims());
  saveSession(token, "GESTOR@EXEMPLO.COM", false);
  expect(window.sessionStorage.getItem("fasecerta.jwt")).toBe(token);
  expect(window.localStorage.getItem("fasecerta.jwt")).toBeNull();
  expect(getCurrentUser()).toMatchObject({ email: "gestor@exemplo.com", perfil: "gestor" });
});

test("lembrar mantém token entre abas; sair revoga sessão local", () => {
  const token = jwt(claims("ADMIN"));
  saveSession(token, "admin@exemplo.com", true);
  expect(window.localStorage.getItem("fasecerta.jwt")).toBe(token);
  clearSession();
  expect(getAuthToken()).toBeNull();
});

test("token vencido ou sem role reconhecida não autentica", () => {
  expect(decodeToken(jwt(claims("GESTOR", -1)))).toBeNull();
  expect(decodeToken(jwt(claims("SUPORTE")))).toBeNull();
  expect(() => saveSession(jwt(claims("SUPORTE")), "test@exemplo.com")).toThrow();
});

test("sessão mock antiga não dá acesso", () => {
  window.localStorage.setItem("user", JSON.stringify({ id: 1, nome: "admin", perfil: "admin" }));
  expect(getCurrentUser()).toBeNull();
});

test("lembrar grava somente o email e descarta senha legada", () => {
  window.localStorage.setItem("rememberMe", JSON.stringify({ password: "segredo" }));
  saveRememberMe({ rememberMe: true, emailOrUsername: "teste@exemplo.com", password: "segredo" });
  expect(getRememberMe()).toMatchObject({ emailOrUsername: "teste@exemplo.com" });
  expect(window.localStorage.getItem("rememberMe")).toBeNull();
  expect(window.localStorage.getItem("fasecerta.rememberedEmail")).not.toContain("segredo");
});
