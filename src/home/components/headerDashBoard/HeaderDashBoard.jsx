import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import "./HeaderDashBoard.css";

const HeaderDashBoard = ({ onMenuToggle, isSidebarOpen = false }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("fasecerta-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("fasecerta-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

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
          to="/"
          className="dashboard-header__logo"
          aria-label="Ir para o painel inicial"
        >
          FaseCerta
        </Link>
      </div>

      <nav className="dashboard-header__nav" aria-label="Navegação principal">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `dashboard-header__nav-link${isActive ? " dashboard-header__nav-link--active" : ""}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/relatorios"
          className={({ isActive }) =>
            `dashboard-header__nav-link${isActive ? " dashboard-header__nav-link--active" : ""}`
          }
        >
          Relatórios
        </NavLink>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `dashboard-header__nav-link${isActive ? " dashboard-header__nav-link--active" : ""}`
          }
        >
          Configurações
        </NavLink>
      </nav>

      <div className="dashboard-header__actions">
        <button
          className="dashboard-header__icon-button"
          type="button"
          aria-label="Alternar tema"
          onClick={handleThemeToggle}
        >
          {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        <Link
          to="/perfil"
          className="dashboard-header__profile-link"
          aria-label="Acessar gerenciamento do perfil"
        >
          <FaUserCircle size={22} />
          <span>Perfil</span>
        </Link>
      </div>
    </header>
  );
};

export default HeaderDashBoard;
