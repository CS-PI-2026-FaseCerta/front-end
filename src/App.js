import { useState } from "react";
import "./App.css";

import AlterarSenha from "./auth/pages/alterarsenha";
import RecuperarSenha from "./auth/pages/recuperarsenha";

function App() {
  const [tela, setTela] = useState("recuperar");

  return (
    <div className="App">

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