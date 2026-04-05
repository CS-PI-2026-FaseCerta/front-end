import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import "./HeaderDashBoard.css";

const HeaderDashBoard = () => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__brand">
        <button
          className="dashboard-header__icon-button"
          type="button"
          aria-label="Abrir menu"
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

      <div className="dashboard-header__actions">
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
