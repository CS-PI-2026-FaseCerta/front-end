import { canDeleteExpense, getCurrentRoles } from "./despesasService.js";

const tokenWithClaims = (claims) => `header.${btoa(JSON.stringify(claims))}.signature`;

const setMockUser = (perfil) => {
  window.localStorage.setItem("user", JSON.stringify({
    id: 1, nome: "Usuário de teste", email: "teste@example.com", perfil,
  }));
};

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

test("permite excluir despesas com perfil GESTOR no login mock sem JWT", () => {
  setMockUser("gestor");
  expect(getCurrentRoles()).toEqual(["GESTOR"]);
  expect(canDeleteExpense()).toBe(true);
});

test("não permite excluir despesas com perfil TÉCNICO ou sem sessão", () => {
  setMockUser("tecnico");
  expect(canDeleteExpense()).toBe(false);

  window.localStorage.clear();
  expect(canDeleteExpense()).toBe(false);
});

test.each([
  [{ roles: ["ADMIN"] }, true],
  [{ roles: ["GESTOR"] }, true],
  [{ authorities: ["ROLE_GESTOR"] }, true],
  [{ role: "gestor" }, true],
  [{ roles: ["ROLE_ADMIN"] }, true],
  [{ roles: ["TECNICO"] }, false],
  [{ roles: ["VISUALIZADOR"] }, false],
])("avalia as permissões do JWT %j", (claims, expected) => {
  window.localStorage.setItem("token", tokenWithClaims(claims));
  expect(canDeleteExpense()).toBe(expected);
});

test("JWT inválido não herda a permissão do perfil local", () => {
  setMockUser("gestor");
  window.localStorage.setItem("token", "invalido");
  expect(canDeleteExpense()).toBe(false);
});
