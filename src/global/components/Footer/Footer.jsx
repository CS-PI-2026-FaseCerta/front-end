import React, { useState } from "react";
import "./Footer.css";


const Footer = () =>{
    return(
        <footer className="page-footer">
            <span className="copyright">FaseCerta © 2026</span>
            <div className="footer-links">
                <a href="#">Suporte</a>
                <a href="TermosUso.txt">Termos de Uso</a>
                <a href="/PoliticaPrivacidade.txt">Política de Privacidade</a>
            </div>
        </footer>
    )

}

export default Footer;

