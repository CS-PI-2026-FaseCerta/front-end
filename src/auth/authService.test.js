import api from "../config/axiosConfig";
import { loginWithEmail, registerUser } from "./authService";

jest.mock("../config/axiosConfig", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const sampleToken = () => {
  const payload = {
    sub: "5e0d9c1f-94c8-4db6-98d3-962f9a26f488",
    role: "ADMIN",
    iat: Math.floor(Date.now() / 1000) - 10,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return `header.${btoa(JSON.stringify(payload))}.signature`;
};

beforeEach(() => { jest.resetAllMocks(); localStorage.clear(); sessionStorage.clear(); });

test("login envia credenciais ao endpoint real e armazena JWT retornado", async () => {
  const token = sampleToken();
  api.post.mockResolvedValueOnce({ data: { token } });
  const user = await loginWithEmail(" ADMIN@EXEMPLO.COM ", "minha-senha", false);
  expect(api.post).toHaveBeenCalledWith("/api/auth/login", { email: "admin@exemplo.com", password: "minha-senha" });
  expect(user.perfil).toBe("admin");
  expect(sessionStorage.getItem("fasecerta.jwt")).toBe(token);
});

test("cadastro envia dados e perfil autenticado à API", async () => {
  api.post.mockResolvedValueOnce({ data: { id: "um-uuid", perfil: "TECNICO" } });
  await registerUser({ username: " Maria ", email: " MARIA@TESTE.COM ", password: "senha123", perfil: "tecnico" });
  expect(api.post).toHaveBeenCalledWith("/api/usuarios", {
    username: "Maria", email: "maria@teste.com", password: "senha123", perfil: "TECNICO",
  });
});
