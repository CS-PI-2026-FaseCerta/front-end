import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaArrowRight, FaChartLine } from "react-icons/fa";

import { DashboardContext } from "../../global/components/layout/DashboardLayout";
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
} from "./utils/quickActions.js";

import "./Dashboard.css";

import ApplyDiscounts from "../components/submodule/pages/ApplyDiscounts/ApplyDiscounts.jsx";
import FocusTrap from "focus-trap-react";

const Dashboard = () => {
  const currentUser = getCurrentUser();
  const perfilAtual = currentUser?.perfil;

  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] = useState(false);

  const { setIsSidebarOpen } = React.useContext(DashboardContext);

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
    if (!isDiscountModalOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDiscountModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDiscountModalOpen]);

  const quickActions = getSelectedQuickActionsByProfile(
    perfilAtual,
    selectedQuickActionIds,
  );

  const handleOpenCustomizeQuickActions = () => {
    const safeDraft =
      selectedQuickActionIds.length > 0
        ? sanitizeQuickActionIdsByProfile(perfilAtual, selectedQuickActionIds)
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

  const perfilLabel = PERFIL_LABELS[perfilAtual] || "Perfil não mapeado";

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <main className="dashboard-shell">
        <section className="dashboard-grid" aria-label="Módulos disponíveis">
          {visibleModules.map((modulo) => (
            <ModuleCard
              key={modulo.id}
              title={modulo.title}
              description={modulo.description}
              icon={modulo.icon}
              // Se for desconto, não passa path, passa o onClick
              path={modulo.id === "aplicar-desconto" ? null : modulo.path}
              onClick={
                modulo.id === "aplicar-desconto"
                  ? () => setIsDiscountModalOpen(true)
                  : null
              }
              ctaLabel={modulo.id === "aplicar-desconto" ? "Abrir" : "Acessar"}
            />
          ))}
        </section>

        {isDiscountModalOpen && (
          <div
            className="dashboard-modal-overlay"
            onClick={() => setIsDiscountModalOpen(false)}
          >
            <FocusTrap>
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

                <ApplyDiscounts onClose={() => setIsDiscountModalOpen(false)} />
              </div>
            </FocusTrap>
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
    </>
  );
};

export default Dashboard;
