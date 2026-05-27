import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaArrowRight, FaChartLine } from "react-icons/fa";

import HeaderDashBoard from "../components/headerDashBoard/HeaderDashBoard";
import Footer from "../../global/components/Footer/Footer";
import Sidebar from "../components/menu/Sidebar";
import ModuleCard from "../components/cards/ModuleCard";
import QuickActionsCarousel from "../components/actions/QuickActionsCarousel";
import QuickActionsModal from "../components/actions/QuickActionsModal";

import { PERFIL_LABELS, getCurrentUser } from "../../auth/mockAuth";
import { getVisibleModulesByProfile } from "../data/modules";
import {
  getQuickActionsByProfile,
  getSelectedQuickActionsByProfile,
  loadQuickActionSelection,
  saveQuickActionSelection,
  sanitizeQuickActionIdsByProfile,
} from "../utils/quickActions";

import "./Dashboard.css";

import ApplyDiscounts from "../components/submodule/pages/ApplyDiscounts/ApplyDiscounts.jsx";

const Dashboard = () => {
  const currentUser = getCurrentUser();
  const perfilAtual = currentUser?.perfil;

  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] =
    useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const [selectedQuickActionIds, setSelectedQuickActionIds] = useState([]);

  const [draftQuickActionIds, setDraftQuickActionIds] = useState([]);

  const visibleModules = perfilAtual
    ? getVisibleModulesByProfile(perfilAtual)
    : [];

  const allowedQuickActions = perfilAtual
    ? getQuickActionsByProfile(perfilAtual)
    : [];

  useEffect(() => {
    if (!perfilAtual) {
      return;
    }

    const storedSelection = loadQuickActionSelection(perfilAtual);

    setSelectedQuickActionIds(storedSelection);
  }, [perfilAtual]);

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
    perfilAtual,
    selectedQuickActionIds,
  );

  const handleOpenCustomizeQuickActions = () => {
    const safeDraft =
      selectedQuickActionIds.length > 0
        ? sanitizeQuickActionIdsByProfile(
          perfilAtual,
          selectedQuickActionIds,
        )
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
      perfilAtual,
      draftQuickActionIds,
    );

    setSelectedQuickActionIds(safeSelection);

    saveQuickActionSelection(perfilAtual, safeSelection);

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

  const perfilLabel = PERFIL_LABELS[perfilAtual] || "Perfil não mapeado";

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-page">
      <HeaderDashBoard
        onMenuToggle={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        profile={perfilAtual}
      />

      <main className="dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <span className="dashboard-hero__eyebrow">
              Painel de Controle
            </span>

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
            <span className="dashboard-hero__profile-label">
              Usuário logado
            </span>

            <strong>{currentUser.nome}</strong>

            <small>{currentUser.email}</small>

            <span className="dashboard-hero__profile-label">
              Perfil atual
            </span>

            <strong>{perfilLabel}</strong>

            <small>
              As permissões desta página seguem o perfil autenticado.
            </small>
          </aside>
        </section>

        <section className="dashboard-grid" aria-label="Módulos disponíveis">
          {visibleModules.map((modulo) => (
            <div
              key={modulo.id}
              onClick={() => {
                if (modulo.id === "aplicar-desconto") {
                  setIsDiscountModalOpen(true);
                }
              }}
            >
              <ModuleCard
                title={modulo.title}
                description={modulo.description}
                icon={modulo.icon}
                path="#"
                ctaLabel={
                  modulo.id === "pedidos"
                    ? "Abrir módulo"
                    : "Acessar módulo"
                }
              />
            </div>
          ))}
        </section>

        {isDiscountModalOpen && (
          <div
            className="dashboard-modal-overlay"
            onClick={() => setIsDiscountModalOpen(false)}
          >
            <div
              className="dashboard-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="dashboard-modal-close"
                onClick={() => setIsDiscountModalOpen(false)}
              >
                ×
              </button>

              <ApplyDiscounts />
            </div>
          </div>
        )}

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

        {perfilAtual === "gestor" && (
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

      <Footer />
    </div>
  );
};

export default Dashboard;