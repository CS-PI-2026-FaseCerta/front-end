import React, { useState } from "react";
import "./ApplyDiscounts.css";

export default function AplicarDesconto() {
    const subtotalServico = 350;

    const [tipoDescontoServico, setTipoDescontoServico] = useState("percentual");
    const [valorServico, setValorServico] = useState("");

    const handleQuickValue = (valor) => {
        setValorServico(valor);
    };

    const calcularDescontoServico = () => {
        const valor = Number(valorServico);

        if (!valor || valor <= 0) {
            return 0;
        }

        if (tipoDescontoServico === "percentual") {
            return (subtotalServico * valor) / 100;
        }

        return valor;
    };

    const descontoServico = calcularDescontoServico();

    return (
        <div className="page-container">
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
                                type="button"
                                className={`toggle-button ${tipoDescontoServico === "percentual" ? "active" : ""}`}
                                onClick={() => {
                                    setTipoDescontoServico("percentual");
                                    setValorServico("");
                                }}
                            >
                                %
                            </button>

                            <button
                                type="button"
                                className={`toggle-button ${tipoDescontoServico === "valor" ? "active" : ""}`}
                                onClick={() => {
                                    setTipoDescontoServico("valor");
                                    setValorServico("");
                                }}
                            >
                                R$
                            </button>
                        </div>

                        <p>Quanto de desconto?</p>

                        <div className="input-area">
                            {tipoDescontoServico === "percentual" ? (
                                <div className="options-row">
                                    <button
                                        type="button"
                                        className={`opt-btn ${valorServico === "5" ? "active" : ""}`}
                                        onClick={() => handleQuickValue("5")}
                                    >
                                        5%
                                    </button>

                                    <button
                                        type="button"
                                        className={`opt-btn ${valorServico === "10" ? "active" : ""}`}
                                        onClick={() => handleQuickValue("10")}
                                    >
                                        10%
                                    </button>

                                    <input
                                        type="number"
                                        placeholder="Outros (%)"
                                        className="small-input"
                                        value={
                                            valorServico !== "5" &&
                                                valorServico !== "10"
                                                ? valorServico
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setValorServico(e.target.value)
                                        }
                                    />
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    placeholder="Insira o valor em R$"
                                    className="full-input"
                                    value={valorServico}
                                    onChange={(e) =>
                                        setValorServico(e.target.value)
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <div className="discount-card">
                        <h3>Peça</h3>

                        <p>Desconto em percentual ou valor?</p>

                        <div className="toggle-container">
                            <button
                                type="button"
                                className={`toggle-button ${tipoDescontoServico === "percentual" ? "active" : ""}`}
                                onClick={() => {
                                    setTipoDescontoServico("percentual");
                                    setValorServico("");
                                }}
                            >
                                %
                            </button>

                            <button
                                type="button"
                                className={`toggle-button ${tipoDescontoServico === "valor" ? "active" : ""}`}
                                onClick={() => {
                                    setTipoDescontoServico("valor");
                                    setValorServico("");
                                }}
                            >
                                R$
                            </button>
                        </div>

                        <p>Quanto de desconto?</p>

                        <div className="input-area">
                            {tipoDescontoServico === "percentual" ? (
                                <div className="options-row">
                                    <button
                                        type="button"
                                        className={`opt-btn ${valorServico === "5" ? "active" : ""}`}
                                        onClick={() => handleQuickValue("5")}
                                    >
                                        5%
                                    </button>

                                    <button
                                        type="button"
                                        className={`opt-btn ${valorServico === "10" ? "active" : ""}`}
                                        onClick={() => handleQuickValue("10")}
                                    >
                                        10%
                                    </button>

                                    <input
                                        type="number"
                                        placeholder="Outros (%)"
                                        className="small-input"
                                        value={
                                            valorServico !== "5" &&
                                                valorServico !== "10"
                                                ? valorServico
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setValorServico(e.target.value)
                                        }
                                    />
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    placeholder="Insira o valor em R$"
                                    className="full-input"
                                    value={valorServico}
                                    onChange={(e) =>
                                        setValorServico(e.target.value)
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <div className="discount-footer">
                        <span>Desconto total</span>

                        <strong>
                            -R$ {descontoServico.toFixed(2)}
                        </strong>
                    </div>
                </div>
            </main>
        </div>
    );
}