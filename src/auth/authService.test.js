import { loginWithApi } from "./authService";

describe("loginWithApi", () => {
  afterEach(() => {
    delete global.fetch;
  });

  test("envia as credenciais com os campos exigidos pelo backend e lê token", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ token: "header.payload.signature" }),
    });

    await expect(loginWithApi(" usuario@exemplo.com ", "senha"))
      .resolves.toBe("header.payload.signature");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "usuario@exemplo.com", password: "senha" }),
      }),
    );
  });

  test("trata credenciais incorretas", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "E-mail ou senha inválidos" }),
    });
    await expect(loginWithApi("usuario@exemplo.com", "errada"))
      .rejects.toThrow("E-mail ou senha incorretos.");
  });

  test("não aceita resposta HTTP 200 sem token", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    await expect(loginWithApi("usuario@exemplo.com", "senha"))
      .rejects.toThrow("sem um token");
  });

  test("trata erros de rede", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("connection refused"));
    await expect(loginWithApi("usuario@exemplo.com", "senha"))
      .rejects.toThrow("Não foi possível conectar");
  });
});
