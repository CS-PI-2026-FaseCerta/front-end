import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaMoon, FaSun, FaBell } from "react-icons/fa";
import useTheme from "../../../global/hooks/useTheme";
import "./HeaderDashBoard.css";

const HeaderDashBoard = ({ onMenuToggle, isSidebarOpen = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__brand">
        <button
          className="dashboard-header__icon-button"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-sidebar"
          onClick={onMenuToggle}
        >
          <FaBars size={20} />
        </button>
        <Link
          to="/dashboard"
          className="dashboard-header__logo"
          aria-label="Ir para o painel inicial"
        >
          FaseCerta
        </Link>
      </div>

      <div className="dashboard-header__actions">

        <button
          className="dashboard-header__icon-button"
          type="button"
          aria-label="Alternar tema"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        <button
          className="dashboard-header__icon-button"
          type="button"
          aria-label="Notificações"
        >
          <FaBell size={18} />
        </button>
      </div>
    </header>
  );
};

export default HeaderDashBoard;
