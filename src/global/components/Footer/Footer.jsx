import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="page-footer">
            <span className="copyright">
                FaseCerta © 2026
            </span>

            <div className="footer-links">
                <Link to="/suporte">
                    Suporte
                </Link>

                <a href="/TermosUso.txt">
                    Termos de Uso
                </a>

                <a href="/PoliticaPrivacidade.txt">
                    Política de Privacidade
                </a>
            </div>
        </footer>
    );
};

export default Footer;