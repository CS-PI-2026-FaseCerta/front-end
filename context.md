# Contexto do Projeto FaseCerta

## 1. Visão Geral do Projeto

O FaseCerta é um sistema front-end em desenvolvimento voltado para organização operacional de uma rotina de campo e de gestão. A interface foi estruturada para apoiar o acesso rápido a módulos, formulários e áreas de navegação com base no perfil do usuário autenticado.

O objetivo do sistema é centralizar o acesso às principais funções do dia a dia, como consulta de módulos, cadastros e atalhos operacionais, com uma experiência visual padronizada e organizada por contexto de uso.

O público-alvo atual é composto por dois perfis:

- Gestor: acompanha áreas administrativas e operacionais mais amplas.
- Técnico em campo: acessa as funções voltadas à execução e apoio operacional.

## 2. Funcionalidades Atuais

### Login com mockAuth

O login já está implementado com uma autenticação mock local. O fluxo utiliza `mockAuth` para validar credenciais, recuperar o usuário atual e simular uma sessão autenticada.

### Lembre de mim

O formulário de login possui a opção de "Lembre de mim". Quando ativada, a aplicação grava os dados no `localStorage` para preencher novamente os campos na próxima visita.

### Dashboard com módulos

A tela de dashboard exibe cartões de módulos com navegação para as áreas do sistema. Os módulos visíveis são filtrados de acordo com o perfil autenticado.

### Renderização por perfil

A exibição da interface varia conforme o perfil do usuário. O código atual distingue principalmente:

- gestor
- tecnico

O módulo financeiro, por exemplo, é tratado como área restrita ao gestor.

### Atalhos rápidos

Existe um carrossel de atalhos rápidos no dashboard para ações frequentes. Ele lista ações permitidas para o perfil atual e oferece navegação direta para rotas relacionadas.

### Personalização de atalhos

A personalização de atalhos já existe. O usuário pode abrir um modal, selecionar quais atalhos quer manter visíveis e salvar a preferência no `localStorage`.

### Tema dark/light persistente

O sistema possui alternância entre tema claro e escuro. A escolha é persistida no `localStorage` e aplicada no elemento raiz do documento por meio do atributo `data-theme`.

### Sidebar / menu lateral

O dashboard conta com um menu lateral em formato de drawer. Ele apresenta preferências e caminhos operacionais de acordo com o perfil do usuário, além de permitir sair da sessão mock.

### Formulários padronizados

Os formulários seguem uma base visual comum por meio de `Form.css`, com reaproveitamento de classes e consistência de espaçamento, botões, inputs e feedbacks de validação.

### Integração entre dashboard e formulários

O dashboard e as telas de formulário já estão conectados por rotas e links internos. Os atalhos rápidos, o menu lateral e os botões de retorno levam para telas existentes ou para páginas placeholder quando a área ainda não foi implementada.

## 3. Controle de Acesso

O controle de acesso atual é feito somente no front-end e depende do perfil salvo na sessão mock.

### Gestor

- Vê os módulos liberados para gestão.
- Tem acesso ao módulo financeiro.
- Pode visualizar atalhos específicos relacionados à operação administrativa.

### Técnico

- Vê os módulos liberados para execução em campo.
- Não visualiza o módulo financeiro.
- Recebe apenas atalhos e itens de menu compatíveis com seu perfil.

### Observação importante

Esse controle é apenas visual e estrutural. Como não existe backend real, as permissões não são seguras e não substituem autenticação ou autorização reais.

## 4. Estrutura de Pastas

A organização atual está concentrada em `src/`, com separação por responsabilidade.

### `auth/`

Concentra o fluxo de autenticação mock e telas relacionadas, como login, cadastro de usuário e alteração de senha.

### `home/`

Agrupa o dashboard, seus componentes visuais, dados de módulos, atalhos rápidos, menu lateral e utilitários usados na área principal do sistema.

### `form/`

Contém telas de cadastro e formulários operacionais, como cadastro de serviço e cadastro de cidade.

### `global/`

Guarda componentes e recursos compartilhados entre várias telas, como o header global, estilos de formulário e o hook de tema.

### `routes/`

Centraliza a definição das rotas da aplicação.

### `public/`

Armazena arquivos públicos do build, como `index.html`, `manifest.json` e `robots.txt`.

### `build/`

Contém a saída gerada da aplicação já compilada.

### Pastas citadas, mas ainda não presentes no código atual

- `components/`: normalmente seria usada para componentes reutilizáveis de uso amplo.
- `pages/`: no projeto atual a lógica equivalente existe de forma distribuída em subpastas por domínio.
- `features/`: poderia concentrar funcionalidades por domínio, caso a aplicação cresça.
- `services/`: seria adequada para integrações com API, persistência e chamadas externas.
- `hooks/`: já existe na prática em `src/global/hooks/` para comportamento reutilizável.
- `utils/`: já existe na prática em `src/home/utils/` para regras auxiliares.
- `docs/`: pode receber documentação complementar do projeto no futuro.

## 5. Padrões Utilizados

- Uso de variáveis CSS em `:root` para padronizar cores, sombras e superfícies.
- Separação de estilos por contexto, como `Auth.css`, `Form.css`, `Dashboard.css` e arquivos específicos por componente.
- Componentização para isolar responsabilidades e facilitar manutenção.
- Reutilização de lógica com hooks, como `useTheme`.
- Reuso de dados e regras em arquivos de apoio, como módulos, rotas e atalhos.
- Evitar duplicação de comportamento e estrutura visual sempre que possível.

## 6. Limitações Atuais

- Não existe backend real integrado.
- A autenticação é mock e depende de dados locais.
- As permissões são apenas front-end e não oferecem segurança real.
- Parte das rotas ainda usa páginas placeholder até a implementação das telas definitivas.

## 7. Próximos Passos Sugeridos

- Integrar o front-end com um backend real.
- Trocar a autenticação mock por autenticação verdadeira.
- Persistir dados em banco ou API.
- Substituir placeholders por telas funcionais para todas as áreas do sistema.
- Melhorar a experiência de uso com feedbacks, estados de carregamento e validações mais completas.

## 8. Observação Final

O código atual já entrega uma base consistente de navegação, identidade visual, controle de tema e organização por perfil. A evolução natural do projeto é conectar essa estrutura a serviços reais de autenticação, autorização e persistência de dados.
