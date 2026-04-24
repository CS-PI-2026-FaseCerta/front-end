import { useState } from "react";
import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./home/pages/Dashboard.jsx";
import Login from "./auth/pages/login/Login.jsx";
import ChangePassword from "./auth/pages/changepassword/ChangePassword.jsx";
import RegisterService from "./form/pages/registerservice/RegisterService.jsx";
import RegisterCity from "./form/pages/registercity/RegisterCity.jsx";
import SectionPage from "./home/pages/SectionPage.jsx";
import ProtectedRoute from "./home/components/ProtectedRoute.jsx";
import CadastroUsuario from "./auth/pages/CadastroUsuario.jsx";

function App() {
  const [tela, setTela] = useState("recuperar");

  return (
    <div className="App">
      {
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
            <Route path="/alterarSenha" element={<ChangePassword />} />
            <Route path="/cadastroServico" element={<RegisterService />} />
            <Route path="/clientes/novo" element={<CadastroUsuario />} />
            <Route path="/cadastrar-cidade" element={<RegisterCity />} />

      {/* HEADER */}
      <header className="page-header">
        <span className="logo">FaseCerta</span>

        {/* Botão simples pra trocar tela */}
        <button onClick={() =>
          setTela(tela === "recuperar" ? "alterar" : "recuperar")
        }>
          Trocar tela
        </button>
      </header>

      {/* CONTEÚDO */}
      <div className="main-content">
        {tela === "recuperar" && <RecuperarSenha />}
        {tela === "alterar" && <AlterarSenha />}
      </div>

      {/* FOOTER */}
      <footer className="page-footer">
        <span>© 2026 FaseCerta</span>

        <div className="footer-links">
          <a href="#">Termos</a>
          <a href="#">Privacidade</a>
          <a href="#">Contato</a>
        </div>
      </footer>

    </div>
  );
}

export default App;