import React from "react";
import { Link } from "react-router-dom";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import * as AppRoutes from "../../../routes/AppRoutes.jsx";
import "./ChangePassword.css";
import "./../Auth.css";

export default function ChangePassword() {
  return (
    <div className="auth-page page-container">
      <Header />
      <main className="auth-container">
        <section className="auth-card">
          <h1 className="auth-title">Alteração de senha</h1>
          <p className="auth-subtitle" role="status">
            Alteração de senha indisponível no momento. O backend fornecido ainda
            não possui uma API para essa operação. Procure o administrador do sistema.
          </p>
          <Link to={AppRoutes.Dashboard} className="auth-link">Voltar ao painel</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
