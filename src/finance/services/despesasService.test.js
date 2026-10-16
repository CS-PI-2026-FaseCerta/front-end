import { canDeleteExpense, getCurrentRoles } from "./despesasService.js";
import { saveSession } from "../../auth/session";

const token = (role) => {
  const payload = {
    sub: "5e0d9c1f-94c8-4db6-98d3-962f9a26f488", role,
    iat: Math.floor(Date.now() / 1000) - 5, exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return `header.${btoa(JSON.stringify(payload))}.signature`;
};

beforeEach(() => { window.localStorage.clear(); window.sessionStorage.clear(); });

test("somente ADMIN pode excluir despesas com a regra da API atual", () => {
  saveSession(token("ADMIN"), "a@exemplo.com");
  expect(getCurrentRoles()).toEqual(["ADMIN"]);
  expect(canDeleteExpense()).toBe(true);
  saveSession(token("GESTOR"), "g@exemplo.com");
  expect(canDeleteExpense()).toBe(false);
  saveSession(token("TECNICO"), "t@exemplo.com");
  expect(canDeleteExpense()).toBe(false);
});

test("usuário simulado, sem JWT, não pode excluir", () => {
  window.localStorage.setItem("user", JSON.stringify({ id: 1, nome: "Admin", perfil: "admin" }));
  expect(canDeleteExpense()).toBe(false);
  expect(getCurrentRoles()).toEqual([]);
});
