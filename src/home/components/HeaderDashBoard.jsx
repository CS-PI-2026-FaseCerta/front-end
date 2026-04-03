import React from "react";
import { FaMoon, FaBars, FaUserCircle } from "react-icons/fa";
import "./Header.css";
const HeaderDashBoard = () => {
  return (
    <header className="page-header">
      <div className="header-left">
        <div className="menu-icon" role="button" aria-label="Abrir menu">
          <FaBars size={22} />
        </div>
        <div className="logo">FaseCerta</div>
      </div>
      <div className="header-right">
        <div className="profile-icon" role="button" aria-label="Acessar perfil">
          <FaUserCircle size={24} />
        </div>
        <div className="theme-icon" role="button" aria-label="Mudar tema">
          <FaMoon size={20} />
        </div>
      </div>
    </header>
  );
};

export default HeaderDashBoard;
