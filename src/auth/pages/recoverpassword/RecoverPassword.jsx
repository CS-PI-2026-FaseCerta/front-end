import React from "react";
import { Link } from "react-router-dom";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import * as AppRoutes from "../../../routes/AppRoutes.jsx";
import "./../Auth.css";

export default function RecoverPassword() {
  return (
    <div className="auth-page">
      <Header />
      <main className="auth-container">
        <section className="auth-card">
          <h1 className="auth-title">Recuperar senha</h1>
          <p className="auth-subtitle" role="status">
            A recuperação de senha ainda não está disponível. O backend fornecido
            não possui os endpoints para enviar e validar códigos de recuperação.
            Solicite auxílio ao administrador do sistema.
          </p>
          <Link to={AppRoutes.Login} className="auth-link">Voltar ao login</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
