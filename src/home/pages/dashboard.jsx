import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import HeaderDashBoard from "../components/HeaderDashBoard";
import ModuleCard from "../components/ModuleCard";
import QuickActionsCarousel from "../components/QuickActionsCarousel";
import QuickActionsModal from "../components/QuickActionsModal";
import { PERFIL_LABELS, PERFIL_USUARIO } from "../../auth/mockAuth";
import {
  getQuickActionsByProfile,
  getSelectedQuickActionsByProfile,
  loadQuickActionSelection,
  saveQuickActionSelection,
  sanitizeQuickActionIdsByProfile,
} from "../utils/quickActions";
import "./dashboard.css";

const MODULOS = [
  {
    id: "clientes",
    title: "Gestão de Clientes",
    description:
      "Centralize cadastros, histórico e acompanhamento comercial em um único fluxo.",
    path: "/clientes",
    icon: <FaUsers />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 1,
      tecnico: 2,
    },
  },
  {
    id: "servicos-estoque",
    title: "Serviços e Estoque",
    description:
      "Gerencie itens, materiais e disponibilidade operacional com visão integrada.",
    path: "/servicos-estoque",
    icon: <FaBoxOpen />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 2,
      tecnico: 3,
    },
  },
  {
    id: "pedidos",
    title: "Pedidos / Ordens de Serviço",
    description:
      "Acompanhe solicitações, abertura de OS e andamento das atividades em campo.",
    path: "/pedidos",
    icon: <FaClipboardList />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 3,
      tecnico: 1,
    },
  },
  {
    id: "financeiro",
    title: "Financeiro",
    description:
      "Concentre recebimentos, cobranças e indicadores financeiros da operação.",
    path: "/financeiro",
    icon: <FaWallet />,
    allowedProfiles: ["gestor"],
    order: {
      gestor: 4,
    },
  },
];

const PERFIL_ATUAL = PERFIL_USUARIO;

const Dashboard = () => {
  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] = useState(false);
  const [selectedQuickActionIds, setSelectedQuickActionIds] = useState([]);
  const [draftQuickActionIds, setDraftQuickActionIds] = useState([]);

  const visibleModules = MODULOS.filter((modulo) =>
    modulo.allowedProfiles.includes(PERFIL_ATUAL),
  ).sort((a, b) => {
    const orderA = a.order[PERFIL_ATUAL] ?? 99;
    const orderB = b.order[PERFIL_ATUAL] ?? 99;

    return orderA - orderB;
  });

  const allowedQuickActions = getQuickActionsByProfile(PERFIL_ATUAL);

  useEffect(() => {
    const storedSelection = loadQuickActionSelection(PERFIL_ATUAL);
    setSelectedQuickActionIds(storedSelection);
  }, []);

  const quickActions = getSelectedQuickActionsByProfile(
    PERFIL_ATUAL,
    selectedQuickActionIds,
  );

  const handleOpenCustomizeQuickActions = () => {
    const safeDraft =
      selectedQuickActionIds.length > 0
        ? sanitizeQuickActionIdsByProfile(PERFIL_ATUAL, selectedQuickActionIds)
        : allowedQuickActions.map((action) => action.id);

    setDraftQuickActionIds(safeDraft);
    setIsQuickActionsModalOpen(true);
  };

  const handleToggleDraftQuickAction = (actionId) => {
    setDraftQuickActionIds((current) => {
      if (current.includes(actionId)) {
        return current.filter((id) => id !== actionId);
      }

      return [...current, actionId];
    });
  };

  const handleCancelCustomizeQuickActions = () => {
    setIsQuickActionsModalOpen(false);
    setDraftQuickActionIds([]);
  };

  const handleSaveCustomizeQuickActions = () => {
    const safeSelection = sanitizeQuickActionIdsByProfile(
      PERFIL_ATUAL,
      draftQuickActionIds,
    );

    setSelectedQuickActionIds(safeSelection);
    saveQuickActionSelection(PERFIL_ATUAL, safeSelection);
    setIsQuickActionsModalOpen(false);
    setDraftQuickActionIds([]);
  };

  const handleSeeMoreQuickActions = () => {
    // TODO: quando o menu hambúrguer estiver disponível, abrir o painel de navegação daqui.
    console.log("Placeholder: abrir menu hambúrguer para mais atalhos");
  };

  const perfilLabel = PERFIL_LABELS[PERFIL_ATUAL] || "Perfil não mapeado";

  return (
    <div className="dashboard-page">
      <HeaderDashBoard />

      <main className="dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <span className="dashboard-hero__eyebrow">Painel de Controle</span>
            <h1 className="dashboard-hero__title">
              Acesso rápido aos módulos operacionais
            </h1>
            <p className="dashboard-hero__subtitle">
              Os módulos abaixo são filtrados de acordo com o perfil
              autenticado. O objetivo desta tela é dar uma visão clara e direta
              das áreas que cada função pode acessar.
            </p>
          </div>

          <aside className="dashboard-hero__profile">
            <span className="dashboard-hero__profile-label">Perfil atual</span>
            <strong>{perfilLabel}</strong>
            <small>
              Alterne o valor de PERFIL_USUARIO no mock para testar "gestor" e
              "tecnico".
            </small>
          </aside>
        </section>

        <section className="dashboard-grid" aria-label="Módulos disponíveis">
          {visibleModules.map((modulo) => (
            <ModuleCard
              key={modulo.id}
              title={modulo.title}
              description={modulo.description}
              icon={modulo.icon}
              path={modulo.path}
              ctaLabel={
                modulo.id === "pedidos" ? "Abrir módulo" : "Acessar módulo"
              }
            />
          ))}
        </section>

        <QuickActionsCarousel
          actions={quickActions}
          onSeeMore={handleSeeMoreQuickActions}
          onCustomize={handleOpenCustomizeQuickActions}
        />

        <QuickActionsModal
          isOpen={isQuickActionsModalOpen}
          actions={allowedQuickActions}
          selectedIds={draftQuickActionIds}
          onToggleAction={handleToggleDraftQuickAction}
          onSave={handleSaveCustomizeQuickActions}
          onCancel={handleCancelCustomizeQuickActions}
        />

        <section className="dashboard-summary">
          <div className="dashboard-summary__content">
            <span className="dashboard-summary__eyebrow">Área de destaque</span>
            <h2 className="dashboard-summary__title">
              <FaChartLine aria-hidden="true" />
              Operação em alta
            </h2>
            <p className="dashboard-summary__description">
              Acompanhe a performance dos atendimentos e identifique rapidamente
              os pontos de melhoria operacional com visão consolidada.
            </p>
          </div>

          <Link to="/relatorios" className="dashboard-summary__cta">
            Ver relatórios
            <FaArrowRight />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
