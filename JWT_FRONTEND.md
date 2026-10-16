# JWT no frontend FaseCerta

- Configure a URL da API com `REACT_APP_API_BASE_URL` em `.env` (exemplo em `.env.example`). Reinicie o servidor após alterar.
- O backend exige `JWT_SECRET` (pelo menos 32 bytes), MySQL e CORS. Como este frontend usa Create React App, configure `CORS_ALLOWED_ORIGINS=http://localhost:3000` no `.env` do backend (ou inclua outras origens necessárias).
- Faça login com o **e-mail** (não username) e a senha de um usuário criado no backend (`POST /api/auth/login`). O retorno esperado é `{ "token": "..." }`.
- `Lembre de mim` guarda o JWT no `localStorage`; desmarcado guarda somente na aba (`sessionStorage`). A preferência guarda apenas o e-mail, **nunca a senha**. Tokens expirados ou inválidos estruturalmente são ignorados e a sessão é descartada; em `401` a sessão é encerrada e o usuário retorna ao login. Não há refresh token neste backend.
- Perfis: `ADMIN`, `GESTOR`, `TECNICO`. No frontend o perfil é usado somente para navegação e exibição; o **backend** é quem verifica JWT, assinatura e permissões. O cadastro de usuários (`POST /api/usuarios`) é autenticado: `ADMIN` pode criar `GESTOR` ou `TECNICO`, e `GESTOR` pode criar `TECNICO`. Não há auto-cadastro público.
- A exclusão de despesas pelo endpoint `DELETE /api/despesas/{id}` é exclusiva de `ADMIN` na versão de backend fornecida.
- **Limitações do backend fornecido:** não há endpoint `/me`, refresh de token, nem controllers de recuperação/alteração de senha. Por isso a interface exibe o e-mail usado no login (ou "Usuário" após indisponibilidade dos metadados) e as telas legadas de senha não devem ser interpretadas como operações reais. O primeiro administrador deve ser criado pelo bootstrap do backend.
- Em produção, utilize HTTPS e uma política CSP adequada. Armazenamento web de tokens oferece risco em caso de XSS; quando houver suporte no backend, cookies HttpOnly/SameSite são preferíveis.

## Verificação manual
1. Com o backend ativo, abra o frontend (`npm start`) e confirme que `/dashboard` sem JWT redireciona para `/login`.
2. Entre com uma conta real e confira as requisições protegidas com header `Authorization: Bearer ...`.
3. Atualize a página (sessão preservada), saia e verifique que o token foi removido; tente token expirado.
4. Confirme que `GESTOR` não vê exclusão de despesas e que `ADMIN` vê; o backend decide definitivamente.
5. Entre com `ADMIN` e cadastre `GESTOR` ou `TECNICO` em `/cadastroUsuario`; com `GESTOR`, apenas `TECNICO`.
