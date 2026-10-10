# Relatório de alterações — JWT no frontend
## Origem da comparação
- **Antes:** `front-end-refatoracao-modulo-despesas (1).zip`.
- **Depois:** `frontend-jwt-finalizado.zip`.
- **Resultado:** 15 arquivos modificados, 7 criados e 1 removido; 183 arquivos permanecem inalterados.
- **Escopo:** somente frontend; nenhum arquivo do backend foi editado nessa integração.
- **Numeração:** as linhas começam em 1 e referem-se aos arquivos **dentro dos respectivos ZIPs**. Linhas substituídas têm posições nas duas versões; adições aparecem apenas na versão JWT; exclusões aparecem apenas na original.
- **Critério:** comparação de conteúdo dos arquivos e blocos de diff, incluindo ajustes de formatação/quebras de linha.

## 1. Tabela por arquivo — descrição da alteração
| Arquivo (relativo à raiz do frontend) | Situação | Linhas (original → JWT) | Descrição |
|---|---|---:|---|
| `src/App.js` | Modificado | 296 → 298 | Inclui monitor da sessão JWT; redireciona a raiz ao painel; protege cadastro de usuário por ADMIN/GESTOR e outras telas internas por autenticação; protege o layout do dashboard. |
| `src/App.test.js` | Modificado | 8 → 10 | Substitui o teste genérico do CRA por um teste que confirma o bloqueio de conteúdo de rota sem JWT. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Modificado | 219 → 236 | Troca o cadastro simulado por chamada autenticada à API; identifica o perfil da sessão; seleciona o perfil permitido; valida senha mínima; trata erros e sucesso sem direcionar à tela de login. |
| `src/auth/pages/changepassword/ChangePassword.jsx` | Modificado | 241 → 26 | Retira formulário e fluxo de alteração de senha sem endpoint real e mostra aviso de indisponibilidade com navegação ao painel. |
| `src/auth/pages/login/Login.jsx` | Modificado | 234 → 197 | Troca o login mock por login assíncrono real; aceita apenas e-mail; não recupera nem armazena senhas no “Lembre de mim”; trata falhas; redireciona após autenticação e retira links de funcionalidades não disponibilizadas. |
| `src/auth/pages/recoverpassword/RecoverPassword.jsx` | Modificado | 178 → 26 | Retira a simulação de envio de código e substitui por aviso de recuperação indisponível e retorno ao login. |
| `src/config/axiosConfig.js` | Modificado | 86 → 41 | Lê JWT da sessão centralizada; anexa Bearer nas rotas protegidas; não envia autorização no login; encerra sessão/redireciona ao receber 401 de uma rota protegida; normaliza mensagens/status. |
| `src/finance/services/despesasService.js` | Modificado | 78 → 63 | Substitui o perfil do mock pelo perfil da sessão JWT; muda a permissão de exclusão de despesas para exclusivamente ADMIN, coerente com a API. |
| `src/finance/services/despesasService.test.js` | Modificado | 47 → 28 | Atualiza testes para sessões JWT ADMIN/GESTOR/TECNICO; comprova que somente ADMIN exclui e que usuário mock legado não recebe autorização. |
| `src/global/components/layout/DashboardLayout.jsx` | Modificado | 50 → 50 | Obtém usuário da sessão JWT em vez do mock e remove perfil “gestor” adotado por padrão. |
| `src/home/components/menu/Sidebar.jsx` | Modificado | 214 → 222 | Altera logout para sessão JWT; habilita menus para ADMIN onde cabível; mantém Financeiro em ADMIN/GESTOR e acrescenta acesso ao cadastro de usuário para ADMIN/GESTOR. |
| `src/home/components/protectedRoute.jsx` | Modificado | 27 → 15 | Obtém sessão JWT real; envia não autenticados ao login preservando a rota desejada; valida perfis permitidos e retorna ao dashboard se faltar autorização. |
| `src/home/data/modules.js` | Modificado | 107 → 107 | Adapta a seleção e ordenação de módulos para que ADMIN herde a estrutura visual de módulos do perfil GESTOR. |
| `src/home/pages/Dashboard.jsx` | Modificado | 221 → 221 | Substitui importação de usuário/rótulos do mock pela sessão JWT. |
| `src/home/utils/quickActions.js` | Modificado | 90 → 90 | Adapta filtro e ordenação dos atalhos para que ADMIN use a configuração visual de GESTOR. |
| `.env.example` | Criado | 0 → 1 | Exemplo da URL base do backend (`REACT_APP_API_BASE_URL=http://localhost:8080`). |
| `JWT_FRONTEND.md` | Criado | 0 → 17 | Manual de configuração do JWT, papéis, limitações do backend e verificações manuais. |
| `src/auth/AuthSessionMonitor.jsx` | Criado | 0 → 39 | Componente que monitora expiração, eventos de sessão e alterações de foco/visibilidade, redirecionando após perda da autenticação. |
| `src/auth/authService.js` | Criado | 0 → 21 | Serviço com POST de login (`/api/auth/login`), armazenamento do token e cadastro de usuários (`/api/usuarios`). |
| `src/auth/authService.test.js` | Criado | 0 → 36 | Testes dos endpoints de login/cadastro e da persistência de JWT após autenticação. |
| `src/auth/session.js` | Criado | 0 → 113 | Módulo central de sessão: decodificação e checagem estrutural/temporal do JWT, leitura de perfil, armazenamento local/da aba, logout e remoção de dados legados. |
| `src/auth/session.test.js` | Criado | 0 → 49 | Testes de sessão persistida, expiração, perfis aceitos, limpeza do mock e lembrança de e-mail sem senha. |
| `src/auth/mockAuth.js` | Removido | 290 → 0 | Autenticação mock removida; substituída pelos novos serviços e utilitários JWT. |

## 2. Tabela detalhada — intervalos exatos de linhas alteradas
**Como ler:** `L10–L12` indica linhas 10 a 12, inclusive. `— (após L9)` representa inserção sem linhas correspondentes na versão original. `— (na L15)` significa que a versão atual não contém aquelas linhas excluídas. As descrições registram a intenção principal do bloco, não a reprodução literal de cada linha.

| Arquivo | Tipo de edição | Linhas do original | Linhas do JWT | O que mudou nesse bloco |
|---|---|---|---|---|
| `src/App.js` | Inserção | — (após L10) | L11 | Importa o monitor de sessão. |
| `src/App.js` | Inserção | — (após L83) | L85 | Monta o monitor no roteador. |
| `src/App.js` | Substituição | L86 | L88 | Muda o redirecionamento da rota raiz. |
| `src/App.js` | Substituição | L93 | L95 | Restringe cadastro de usuário a ADMIN/GESTOR. |
| `src/App.js` | Substituição | L109 | L111 | Protege registro de serviços. |
| `src/App.js` | Substituição | L114 | L116 | Protege registro de produtos. |
| `src/App.js` | Substituição | L119 | L121 | Protege inserção de serviços. |
| `src/App.js` | Substituição | L131 | L133 | Protege cadastro de cidades. |
| `src/App.js` | Substituição | L141 | L143 | Protege o layout de rotas internas. |
| `src/App.test.js` | Substituição | L1–L2 | L1–L3 | Troca imports do teste padrão por teste de rota. |
| `src/App.test.js` | Substituição | L4–L8 | L5–L10 | Exige ausência de conteúdo protegido sem JWT. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Inserção | — (após L2) | L3–L4 | Importa serviço de cadastro e sessão. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Inserção | — (após L14) | L17 | Identifica se a sessão é ADMIN. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Inserção | — (após L20) | L24 | Inicializa perfil do usuário a cadastrar. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Inserção | — (após L29) | L34 | Acrescenta estado de erro da API. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Inserção | — (após L44) | L50 | Acrescenta tamanho mínimo de senha. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Substituição | L61 | L67 | Torna envio do formulário assíncrono. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Substituição | L63–L83 | L69–L91 | Substitui cadastro simulado por POST, sucesso e erros. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Substituição | L101 | L109 | Altera o título da tela. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Substituição | L104 | L112 | Altera a orientação exibida ao usuário. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Inserção | — (após L195) | L204–L219 | Adiciona seletor de perfil, erro e dica de senha. |
| `src/auth/pages/UserRegistration/UserRegistration.jsx` | Substituição | L204–L211 | L228 | Troca link de login por retorno ao painel. |
| `src/auth/pages/changepassword/ChangePassword.jsx` | Substituição | L1–L4 | L1–L5 | Reorganiza os imports do componente. |
| `src/auth/pages/changepassword/ChangePassword.jsx` | Remoção | L7–L10 | — (na L8) | Remove imports e estados do formulário antigo. |
| `src/auth/pages/changepassword/ChangePassword.jsx` | Substituição | L12–L241 | L9–L26 | Substitui formulário simulado por aviso de indisponibilidade. |
| `src/auth/pages/login/Login.jsx` | Remoção | L4 | — (na L4) | Remove import de Link. |
| `src/auth/pages/login/Login.jsx` | Substituição | L7–L11 | L6–L7 | Substitui dependências de autenticação mock por sessão/API. |
| `src/auth/pages/login/Login.jsx` | Substituição | L21–L27 | L17–L18 | Remove preenchimento prévio de credenciais via navegação. |
| `src/auth/pages/login/Login.jsx` | Substituição | L41–L42 | L32–L33 | Redireciona sessão já autenticada ao painel. |
| `src/auth/pages/login/Login.jsx` | Remoção | L52 | — (na L43) | Não preenche senha anteriormente lembrada. |
| `src/auth/pages/login/Login.jsx` | Substituição | L54 | L44 | Ajusta dependências do efeito inicial. |
| `src/auth/pages/login/Login.jsx` | Substituição | L56–L68 | L46–L48 | Troca validação e-mail/usuário por e-mail apenas. |
| `src/auth/pages/login/Login.jsx` | Substituição | L95 | L75 | Torna o handler de login assíncrono. |
| `src/auth/pages/login/Login.jsx` | Substituição | L98–L102 | L78 | Trata erro de formato de e-mail. |
| `src/auth/pages/login/Login.jsx` | Substituição | L104 | L80–L84 | Valida senha vazia. |
| `src/auth/pages/login/Login.jsx` | Remoção | L108 | — (na L88) | Remove comentário/controle da simulação. |
| `src/auth/pages/login/Login.jsx` | Substituição | L110–L138 | L89–L108 | Executa login real, salva e-mail, redireciona e trata erros. |
| `src/auth/pages/login/Login.jsx` | Substituição | L156 | L126 | Troca rótulo para “E-mail”. |
| `src/auth/pages/login/Login.jsx` | Substituição | L162 | L132 | Ajusta placeholder para e-mail. |
| `src/auth/pages/login/Login.jsx` | Substituição | L193–L197 | L163 | Remove link de recuperação sem API. |
| `src/auth/pages/login/Login.jsx` | Substituição | L221–L224 | L187 | Substitui link de autocadastro por orientação de contato. |
| `src/auth/pages/recoverpassword/RecoverPassword.jsx` | Substituição | L1–L3 | L1–L2 | Simplifica imports. |
| `src/auth/pages/recoverpassword/RecoverPassword.jsx` | Inserção | — (após L5) | L5 | Reorganiza import das rotas. |
| `src/auth/pages/recoverpassword/RecoverPassword.jsx` | Remoção | L7–L8 | — (na L7) | Remove estilo do formulário antigo. |
| `src/auth/pages/recoverpassword/RecoverPassword.jsx` | Substituição | L10–L178 | L8–L26 | Substitui simulação de recuperação por aviso. |
| `src/config/axiosConfig.js` | Substituição | L2–L30 | L2 | Importa funções de sessão JWT e remove leitor legado de token. |
| `src/config/axiosConfig.js` | Substituição | L33–L36 | L5 | Compacta configuração da URL base. |
| `src/config/axiosConfig.js` | Substituição | L38–L40 | L7 | Compacta headers padrão. |
| `src/config/axiosConfig.js` | Remoção | L43–L44 | — (na L10) | Remove comentário que pressupunha API sem JWT. |
| `src/config/axiosConfig.js` | Substituição | L46–L49 | L11–L15 | Anexa JWT Bearer exceto na requisição de login. |
| `src/config/axiosConfig.js` | Remoção | L51 | — (na L17) | Remove espaço/fluxo antigo do interceptor. |
| `src/config/axiosConfig.js` | Substituição | L58–L61 | L23–L25 | Extrai status HTTP de forma centralizada. |
| `src/config/axiosConfig.js` | Substituição | L63–L65 | L27–L28 | Ignora erro 401 do login para fins de expiração de sessão. |
| `src/config/axiosConfig.js` | Substituição | L69–L81 | L32–L35 | Normaliza detalhes da mensagem/status de erro. |
| `src/config/axiosConfig.js` | Inserção | — (após L85) | L40 | Reexporta a função centralizada getAuthToken. |
| `src/finance/services/despesasService.js` | Substituição | L1–L2 | L1–L2 | Troca import do mock pela sessão JWT. |
| `src/finance/services/despesasService.js` | Inserção | — (após L52) | L53–L54 | Documenta autoridade do backend. |
| `src/finance/services/despesasService.js` | Substituição | L54–L73 | L56–L57 | Simplifica recuperação de perfil através da sessão. |
| `src/finance/services/despesasService.js` | Substituição | L77 | L61–L62 | Permite DELETE apenas para ADMIN. |
| `src/finance/services/despesasService.test.js` | Inserção | — (após L1) | L2 | Importa saveSession para testes. |
| `src/finance/services/despesasService.test.js` | Substituição | L3–L8 | L4–L9 | Cria utilitário de token com claims de papel. |
| `src/finance/services/despesasService.test.js` | Substituição | L11–L14 | L12 | Limpa armazenamentos antes de cada teste. |
| `src/finance/services/despesasService.test.js` | Substituição | L16–L18 | L14–L16 | Testa permissão de exclusão para ADMIN. |
| `src/finance/services/despesasService.test.js` | Substituição | L20–L23 | L18 | Testa bloqueio de GESTOR/TECNICO. |
| `src/finance/services/despesasService.test.js` | Substituição | L25–L26 | L20 | Elimina teste baseado em usuário mock sem token. |
| `src/finance/services/despesasService.test.js` | Substituição | L30–L40 | L24–L27 | Garante que perfil legado sem JWT não autoriza. |
| `src/finance/services/despesasService.test.js` | Remoção | L42–L47 | — (na L29) | Remove teste redundante baseado em configuração mock. |
| `src/global/components/layout/DashboardLayout.jsx` | Substituição | L6 | L6 | Passa a importar usuário da sessão JWT. |
| `src/global/components/layout/DashboardLayout.jsx` | Substituição | L17 | L17 | Remove valor padrão de perfil gestor. |
| `src/home/components/menu/Sidebar.jsx` | Inserção | — (após L16) | L17 | Importa ícone de cadastro de usuário. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L18 | L19 | Troca logout mock por limpeza de sessão JWT. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L52 | L53 | Inclui ADMIN no menu do dashboard. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L59 | L60 | Inclui ADMIN no menu de clientes. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L66 | L67 | Inclui ADMIN no menu de ordens de serviço. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L73 | L74 | Inclui ADMIN no menu de serviços. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L80 | L81 | Inclui ADMIN no menu de estoque. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L87 | L88–L95 | Habilita Financeiro para ADMIN e adiciona menu de cadastro. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L94 | L102 | Inclui ADMIN no menu de calendário. |
| `src/home/components/menu/Sidebar.jsx` | Substituição | L101 | L109 | Inclui ADMIN no menu de configurações. |
| `src/home/components/protectedRoute.jsx` | Substituição | L2–L3 | L2–L3 | Importa localização atual e sessão JWT. |
| `src/home/components/protectedRoute.jsx` | Substituição | L5–L24 | L5–L12 | Atualiza guardas de login/perfil e redirecionamentos. |
| `src/home/components/protectedRoute.jsx` | Substituição | L27 | L15 | Ajusta linha de exportação. |
| `src/home/data/modules.js` | Substituição | L98 | L98 | Usa módulos de GESTOR como base para ADMIN. |
| `src/home/data/modules.js` | Substituição | L100–L101 | L100–L101 | Ordena módulos ADMIN pela ordem definida para GESTOR. |
| `src/home/pages/Dashboard.jsx` | Substituição | L10 | L10 | Usa usuário e rótulos de perfil da sessão JWT. |
| `src/home/utils/quickActions.js` | Substituição | L7 | L7 | Usa atalhos de GESTOR como base para ADMIN. |
| `src/home/utils/quickActions.js` | Substituição | L9–L10 | L9–L10 | Ordena atalhos ADMIN pela ordem do perfil GESTOR. |

## 3. Linhas de arquivos criados e removidos
| Arquivo | Situação | Linhas no original | Linhas na versão JWT | Conteúdo/efeito |
|---|---|---|---|---|
| `.env.example` | Criado | — | L1–L1 | Exemplo da URL base do backend (`REACT_APP_API_BASE_URL=http://localhost:8080`). |
| `JWT_FRONTEND.md` | Criado | — | L1–L17 | Manual de configuração do JWT, papéis, limitações do backend e verificações manuais. |
| `src/auth/AuthSessionMonitor.jsx` | Criado | — | L1–L39 | Componente que monitora expiração, eventos de sessão e alterações de foco/visibilidade, redirecionando após perda da autenticação. |
| `src/auth/authService.js` | Criado | — | L1–L21 | Serviço com POST de login (`/api/auth/login`), armazenamento do token e cadastro de usuários (`/api/usuarios`). |
| `src/auth/authService.test.js` | Criado | — | L1–L36 | Testes dos endpoints de login/cadastro e da persistência de JWT após autenticação. |
| `src/auth/session.js` | Criado | — | L1–L113 | Módulo central de sessão: decodificação e checagem estrutural/temporal do JWT, leitura de perfil, armazenamento local/da aba, logout e remoção de dados legados. |
| `src/auth/session.test.js` | Criado | — | L1–L49 | Testes de sessão persistida, expiração, perfis aceitos, limpeza do mock e lembrança de e-mail sem senha. |
| `src/auth/mockAuth.js` | Removido | L1–L290 | — | Autenticação mock removida; substituída pelos novos serviços e utilitários JWT. |

## 4. Observações importantes
- O JWT é lido e gerenciado no frontend para sessão e experiência de uso; **a autorização definitiva acontece no backend**.
- A exclusão de despesas foi ajustada no frontend para aceitar somente o perfil `ADMIN`.
- As telas de alteração e recuperação de senha **não foram integradas a endpoints**, pois esses recursos não estavam disponíveis no backend fornecido; elas agora exibem avisos.
- O relatório documenta diferenças de arquivos, não é evidência de que todos os fluxos passaram por testes de integração no navegador.
