import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChartLine } from "react-icons/fa";
import HeaderDashBoard from "../components/headerDashBoard/HeaderDashBoard";
import Sidebar from "../components/menu/Sidebar";

import ModuleCard from "../components/cards/ModuleCard";
import QuickActionsCarousel from "../components/actions/QuickActionsCarousel";
import QuickActionsModal from "../components/actions/QuickActionsModal";
import { PERFIL_LABELS, PERFIL_USUARIO } from "../../auth/mockAuth";
import { getVisibleModulesByProfile } from "../data/modules";
import {
  getQuickActionsByProfile,
  getSelectedQuickActionsByProfile,
  loadQuickActionSelection,
  saveQuickActionSelection,
  sanitizeQuickActionIdsByProfile,
} from "../utils/quickActions";
import "./Dashboard.css";

const PERFIL_ATUAL = PERFIL_USUARIO;

const Dashboard = () => {
  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedQuickActionIds, setSelectedQuickActionIds] = useState([]);
  const [draftQuickActionIds, setDraftQuickActionIds] = useState([]);

  const visibleModules = getVisibleModulesByProfile(PERFIL_ATUAL);

  const allowedQuickActions = getQuickActionsByProfile(PERFIL_ATUAL);

  useEffect(() => {
    const storedSelection = loadQuickActionSelection(PERFIL_ATUAL);
    setSelectedQuickActionIds(storedSelection);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

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
    setIsSidebarOpen(true);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((current) => !current);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const perfilLabel = PERFIL_LABELS[PERFIL_ATUAL] || "Perfil não mapeado";

  return (
    <div className="dashboard-page">
      <HeaderDashBoard
        onMenuToggle={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        profile={PERFIL_ATUAL}
      />

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

        {PERFIL_ATUAL === "gestor" && (
          <section className="dashboard-summary">
            <div className="dashboard-summary__content">
              <span className="dashboard-summary__eyebrow">
                Área de destaque
              </span>
              <h2 className="dashboard-summary__title">
                <FaChartLine aria-hidden="true" />
                Operação em alta
              </h2>
              <p className="dashboard-summary__description">
                Acompanhe a performance dos atendimentos e identifique
                rapidamente os pontos de melhoria operacional com visão
                consolidada.
              </p>
            </div>

            <Link to="/relatorios" className="dashboard-summary__cta">
              Ver relatórios
              <FaArrowRight />
            </Link>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
