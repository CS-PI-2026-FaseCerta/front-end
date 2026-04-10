import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronRight,
  FaClipboardList,
  FaCog,
  FaFileAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
  FaWallet,
  FaWrench,
  FaUsers,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";
import { getModuleById } from "../../data/modules";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, profile }) => {
  const preferenceItems = useMemo(() => {
    const moduleConfigById = {
      pedidos: getModuleById("pedidos"),
      servicos: getModuleById("servicos-estoque"),
      clientes: getModuleById("clientes"),
      financeiro: getModuleById("financeiro"),
    };

    const items = [
      {
        id: "pedidos",
        label: "Pedidos",
        path: moduleConfigById.pedidos?.path || "/pedidos",
        icon: <FaClipboardList aria-hidden="true" />,
        allowedProfiles: moduleConfigById.pedidos?.allowedProfiles || [
          "gestor",
          "tecnico",
        ],
      },
      {
        id: "documentos",
        label: "Documentos",
        path: "/relatorios",
        icon: <FaFileAlt aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "financeiro",
        label: "Finanças & pagamentos",
        path: moduleConfigById.financeiro?.path || "/financeiro",
        icon: <FaWallet aria-hidden="true" />,
        allowedProfiles: moduleConfigById.financeiro?.allowedProfiles || [
          "gestor",
        ],
      },
      {
        id: "agenda",
        label: "Agenda",
        path: "/configuracoes",
        icon: <FaCalendarAlt aria-hidden="true" />,
        allowedProfiles: ["gestor", "tecnico"],
      },
      {
        id: "servicos",
        label: "Peças & serviços",
        path: moduleConfigById.servicos?.path || "/servicos-estoque",
        icon: <FaWrench aria-hidden="true" />,
        allowedProfiles: moduleConfigById.servicos?.allowedProfiles || [
          "gestor",
          "tecnico",
        ],
      },
      {
        id: "clientes",
        label: "Clientes",
        path: moduleConfigById.clientes?.path || "/clientes",
        icon: <FaUsers aria-hidden="true" />,
        allowedProfiles: moduleConfigById.clientes?.allowedProfiles || [
          "gestor",
          "tecnico",
        ],
      },
    ];

    return items.filter((item) => item.allowedProfiles.includes(profile));
  }, [profile]);

  const secondaryItems = [
    {
      id: "configuracoes",
      label: "Outras configurações",
      path: "/configuracoes",
      icon: <FaCog aria-hidden="true" />,
    },
    {
      id: "ajuda",
      label: "Preciso de ajuda",
      path: "/configuracoes",
      icon: <FaQuestionCircle aria-hidden="true" />,
    },
    {
      id: "sair",
      label: "Sair da conta",
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

        <button type="button" className="sidebar-drawer__profile-action">
          <FaPlus aria-hidden="true" />
          <span>Adicionar dados</span>
        </button>

        <section className="sidebar-drawer__section" aria-label="Preferências">
          <h2>Preferências</h2>

          <nav>
            {preferenceItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="sidebar-drawer__link"
                onClick={onClose}
              >
                <span className="sidebar-drawer__link-main">
                  {item.icon}
                  {item.label}
                </span>
                <FaChevronRight aria-hidden="true" />
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
                onClick={onClose}
              >
                <span className="sidebar-drawer__link-main">
                  {item.icon}
                  {item.label}
                </span>
                <FaChevronRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
