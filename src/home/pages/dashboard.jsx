import React from "react";
import "../../index.css";
import Header from "../../global/components/Header/Header";
import ModuleCard from "../components/ModuleCard";
import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import "./dashboard.css";

// ----------------------------------------------------------------------
// MOCK DE AUTENTICAÇÃO E PERFIS
// Futuramente, essas informações virão de um Contexto Global (ex: AuthContext),
// Redux ou decodificadas de um token JWT do backend.
// ----------------------------------------------------------------------
const ROLES = {
  GESTOR: "Administrativo / Gestor",
  TECNICO: "Técnico em Campo",
};

// ALTERE ESTA VARIÁVEL PARA TESTAR OS PERFIS:
// Opções: ROLES.GESTOR | ROLES.TECNICO
const CURRENT_USER_ROLE = ROLES.GESTOR;

// Estrutura de dados dos módulos com controle de acesso (RBAC)
const MODULES = [
  {
    id: "clientes",
    title: "Gestão de Clientes",
    description: "Cadastre e gerencie a base de clientes do sistema.",
    icon: <FaUsers size={32} color="var(--color-info)" />,
    path: "/clientes",
    allowedRoles: [ROLES.GESTOR], // Apenas Gestor visualiza
  },
  {
    id: "servicos",
    title: "Serviços e Estoque",
    description: "Controle de peças, equipamentos e catálogos de serviços.",
    icon: <FaBoxOpen size={32} color="var(--color-warning)" />,
    path: "/servicos",
    allowedRoles: [ROLES.GESTOR, ROLES.TECNICO], // Gestor e Técnico visualizam
  },
  {
    id: "pedidos",
    title: "Pedidos / Ordens de Serviço",
    description: "Acompanhamento e execução de ordens de serviço.",
    icon: <FaClipboardList size={32} color="var(--color-accent)" />,
    path: "/pedidos",
    allowedRoles: [ROLES.GESTOR, ROLES.TECNICO], // Gestor e Técnico visualizam
  },
  {
    id: "financeiro",
    title: "Financeiro",
    description: "Gestão de faturamento, pagamentos e relatórios financeiros.",
    icon: <FaChartLine size={32} color="var(--color-success)" />,
    path: "/financeiro",
    allowedRoles: [ROLES.GESTOR], // Apenas Gestor visualiza (Técnico não tem acesso)
  },
];

const Dashboard = () => {
  // Filtra os módulos que o usuário atual tem permissão para visualizar
  const permittedModules = MODULES.filter((module) =>
    module.allowedRoles.includes(CURRENT_USER_ROLE),
  );

  const handleNavigation = (path) => {
    // ----------------------------------------------------------------------
    // PROTEÇÃO DE ROTA FRONT-END (Simulação)
    // ----------------------------------------------------------------------
    // Além de ocultar o card na UI, é vital ter rotas protegidas (Private Routes).
    // Se um usuário tentar acessar a URL diretamente pela barra de endereços,
    // o componente da rota deverá fazer esta validação e redirecionar se necessário.
    //
    // AVISO DE SEGURANÇA: Bloqueio visual no front-end é apenas para UX.
    // A verdadeira segurança e validação de permissões DEVEM ocorrer no Backend!
    const targetModule = MODULES.find((m) => m.path === path);

    if (
      targetModule &&
      !targetModule.allowedRoles.includes(CURRENT_USER_ROLE)
    ) {
      alert("Acesso Negado: Você não tem permissão para acessar esta área.");
      // Exemplo de redirecionamento futuro usando react-router-dom:
      // navigate('/dashboard', { replace: true });
      return;
    }

    // Exemplo de navegação permitida
    console.log(`Navegando para a rota permitida: ${path}`);
    alert(`Redirecionando para: ${targetModule.title}`);
    // navigate(path);
  };

  return (
    <div className="page-container">
      {/* O Header já contém o menu hambúrguer e acesso ao perfil */}
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h2>Bem-vindo(a) ao FaseCerta</h2>
            <p>
              Perfil atual: <strong>{CURRENT_USER_ROLE}</strong>
            </p>
          </div>

          {/* Renderização Condicional do Grid de Módulos */}
          <div className="modules-grid">
            {permittedModules.length > 0 ? (
              permittedModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  path={module.path}
                  onClick={handleNavigation}
                />
              ))
            ) : (
              <p className="no-modules-msg">
                Nenhum módulo disponível para este perfil.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
