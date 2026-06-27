import React, { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronRight,
  FaClipboardList,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
  FaWallet,
  FaWrench,
  FaUsers,
  FaCalendarAlt,
  FaPlus,
  FaBoxOpen,
} from "react-icons/fa";
import { clearSession } from "../../../auth/mockAuth";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, profile }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSecondaryItemClick = (itemId) => {
    if (itemId === "sair") {
      clearSession();
    }

    onClose();
  };

  const preferenceItems = useMemo(() => {
    const items = [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: <FaCalendarAlt aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "clientes",
        label: "Clientes",
        path: "/clientes",
        icon: <FaUsers aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "ordens-servico",
        label: "Ordens de Serviço",
        path: "/ordens-servico",
        icon: <FaClipboardList aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "servicos",
        label: "Serviços",
        path: "/servicos",
        icon: <FaWrench aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "estoque",
        label: "Estoque",
        path: "/estoque",
        icon: <FaBoxOpen aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "financeiro",
        label: "Financeiro",
        path: "/financeiro",
        icon: <FaWallet aria-hidden="true" />,
        allowedProfiles: ["gestor"],
      },
      {
        id: "calendario",
        label: "Calendário",
        path: "/calendario",
        icon: <FaCalendarAlt aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "configuracoes",
        label: "Configurações",
        path: "/configuracoes",
        icon: <FaCog aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
    ];

    return items.filter((item) => item.allowedProfiles.includes(profile));
  }, [profile]);

  const secondaryItems = [
    {
      id: "suporte",
      label: "Suporte",
      path: "/suporte",
      icon: <FaQuestionCircle aria-hidden="true" />,
    },
    {
      id: "sair",
      label: "Sair",
      path: "/",
      icon: <FaSignOutAlt aria-hidden="true" />,
    },
  ];

  return (
    <>
      <button
        type="button"
        className={`sidebar-overlay${isOpen ? " sidebar-overlay--visible" : ""}`}
        aria-label="Fechar menu lateral"
        onClick={onClose}
      />

      <aside
        id="dashboard-sidebar"
        className={`sidebar-drawer${isOpen ? " sidebar-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu lateral"
      >
        <header className="sidebar-drawer__header">
          <div className="sidebar-drawer__identity">
            <FaUserCircle
              className="sidebar-drawer__avatar"
              aria-hidden="true"
            />
            <p>Adicione informações pessoais e do negócio</p>
          </div>

          <button
            type="button"
            className="sidebar-drawer__close"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <FaTimes size={16} />
          </button>
        </header>

        <button type="button" className="sidebar-drawer__profile-action" title="Adicionar dados">
          <FaPlus aria-hidden="true" />
          <span className="sidebar-drawer__label">Adicionar dados</span>
          <span className="sidebar-drawer__tooltip">Adicionar dados</span>
        </button>

        <section className="sidebar-drawer__section" aria-label="Preferências">
          <h2>Preferências</h2>

          <nav>
            {preferenceItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="sidebar-drawer__link"
                onClick={window.innerWidth < 1024 ? onClose : undefined}
                title={item.label}
              >
                <span className="sidebar-drawer__link-main">
                  {item.icon}
                  <span className="sidebar-drawer__label">{item.label}</span>
                </span>
                <span className="sidebar-drawer__tooltip">{item.label}</span>
                <FaChevronRight aria-hidden="true" className="sidebar-drawer__chevron" />
              </Link>
            ))}
          </nav>
        </section>

        <section
          className="sidebar-drawer__section sidebar-drawer__section--bottom"
          aria-label="Mais opções"
        >
          <nav>
            {secondaryItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="sidebar-drawer__link"
                onClick={() => handleSecondaryItemClick(item.id)}
                title={item.label}
              >
                <span className="sidebar-drawer__link-main">
                  {item.icon}
                  <span className="sidebar-drawer__label">{item.label}</span>
                </span>
                <span className="sidebar-drawer__tooltip">{item.label}</span>
              </Link>
            ))}
          </nav>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
