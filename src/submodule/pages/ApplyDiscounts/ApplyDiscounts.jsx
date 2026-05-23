import React, { useState } from "react";
import "./ApplyDiscounts.css";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";

export default function AplicarDesconto() {
    // Estado para controlar o tipo de desconto de Serviço e de Peça
    const [tipoDescontoServico, setTipoDescontoServico] = useState("percentual");
    const [tipoDescontoPeca, setTipoDescontoPeca] = useState("valor");

    return (
        <div className="page-container">
            <Header />

            <main className="main-content">
                <div className="card wide-card">
                    <div className="card-header">
                        <h1>Aplicar Desconto</h1>
                    </div>
                    <div className="discount-card">
                        <h3>Serviço</h3>
                        <p>Desconto em percentual ou valor?</p>


                        <div className="toggle-container">
                            <button
                                className={`toggle-button ${tipoDescontoServico === "percentual" ? "active" : ""}`}
                                onClick={() => setTipoDescontoServico("percentual")}
                            >
                                %
                            </button>
                            <button
                                className={`toggle-button ${tipoDescontoServico === "valor" ? "active" : ""}`}
                                onClick={() => setTipoDescontoServico("valor")}
                            >
                                R$
                            </button>
                        </div>

                        <div className="input-area">
                            {tipoDescontoServico === "percentual" ? (
                                <div className="options-row">
                                    <button className="opt-btn">5%</button>
                                    <button className="opt-btn">10%</button>
                                    <input type="text" placeholder="Outros (%)" className="small-input" />
                                </div>
                            ) : (
                                <input type="text" placeholder="Insira o valor em R$" className="full-input" />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}