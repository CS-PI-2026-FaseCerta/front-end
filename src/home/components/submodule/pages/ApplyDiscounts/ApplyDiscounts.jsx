import React, { useState } from "react";
import "./ApplyDiscounts.css";


export default function AplicarDesconto() {
    const subtotalServico = 350;

    const [tipoDescontoServico, setTipoDescontoServico] = useState("percentual");
    const [valorServico, setValorServico] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [quickSelected, setQuickSelected] = useState("");

    const handleQuickValue = (valor) => {
        setQuickSelected(valor);
        setValorServico(valor);
    };

    const handleInputChange = (e) => {
        setQuickSelected("");
        setValorServico(e.target.value);
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

    let mensagemErroAtual = "";

    if (tipoDescontoServico === "percentual") {
        if (Number(valorServico) > 100) {
            mensagemErroAtual =
                "O percentual não pode ser maior que 100%.";
        }
    }

    if (descontoServico > subtotalServico) {
        mensagemErroAtual =
            "O desconto não pode ser maior que o valor total do serviço.";
    }

    const isFormValid =
        valorServico !== "" &&
        descontoServico > 0 &&
        descontoServico <= subtotalServico &&
        mensagemErroAtual === "";

    const handleSalvarDesconto = () => {
        if (!isFormValid) {
            return;
        }

        setIsSaving(true);

        setTimeout(() => {
            console.log("Desconto salvo com sucesso!");

            setIsSaving(false);

            const modalOverlay = document.querySelector(
                ".dashboard-modal-overlay"
            );

            if (modalOverlay) {
                modalOverlay.click();
            }
        }, 1500);
    };

    return (
        <div className="discount-module-wrapper">
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
                                    className={`toggle-button ${tipoDescontoServico === "percentual"
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        setTipoDescontoServico("percentual");
                                        setValorServico("");
                                        setQuickSelected("");
                                    }}
                                >
                                    %
                                </button>

                                <button
                                    type="button"
                                    className={`toggle-button ${tipoDescontoServico === "valor"
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        setTipoDescontoServico("valor");
                                        setValorServico("");
                                        setQuickSelected("");
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
                                            className={`opt-btn ${quickSelected === "5"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                handleQuickValue("5")
                                            }
                                        >
                                            5%
                                        </button>

                                        <button
                                            type="button"
                                            className={`opt-btn ${quickSelected === "10"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                handleQuickValue("10")
                                            }
                                        >
                                            10%
                                        </button>

                                        <input
                                            type="number"
                                            placeholder="Outros (%)"
                                            className="small-input"
                                            value={valorServico}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="input-wrapper prefix">
                                        <span className="currency-prefix">
                                            R$
                                        </span>

                                        <input
                                            type="number"
                                            placeholder="0,00"
                                            className="full-input"
                                            value={valorServico}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="discount-card piece-section">
                            <h3>Produto</h3>

                            <p>Desconto em percentual ou valor?</p>

                            <div className="toggle-container">
                                <button
                                    type="button"
                                    className={`toggle-button ${tipoDescontoServico === "percentual"
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        setTipoDescontoServico("percentual");
                                        setValorServico("");
                                        setQuickSelected("");
                                    }}
                                >
                                    %
                                </button>

                                <button
                                    type="button"
                                    className={`toggle-button ${tipoDescontoServico === "valor"
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        setTipoDescontoServico("valor");
                                        setValorServico("");
                                        setQuickSelected("");
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
                                            className={`opt-btn ${quickSelected === "5"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() => handleQuickValue("5")}
                                        >
                                            5%
                                        </button>

                                        <button
                                            type="button"
                                            className={`opt-btn ${quickSelected === "10"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() => handleQuickValue("10")}
                                        >
                                            10%
                                        </button>

                                        <input
                                            type="number"
                                            placeholder="Outros (%)"
                                            className="small-input"
                                            value={valorServico}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="input-wrapper prefix">
                                        <span className="currency-prefix">
                                            R$
                                        </span>

                                        <input
                                            type="number"
                                            placeholder="0,00"
                                            className="full-input"
                                            value={valorServico}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="discount-total-container">
                            <label className="discount-total-label">
                                DESCONTO TOTAL
                            </label>

                            <div className="discount-total-box">
                                <span
                                    className={`discount-total-value ${mensagemErroAtual ? "error" : ""
                                        }`}
                                >
                                    -R${" "}
                                    {descontoServico.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>

                                <span className="discount-total-description">
                                    Valor total aplicado na ordem de serviço
                                </span>

                                {mensagemErroAtual && (
                                    <p className="discount-error-message">
                                        {mensagemErroAtual}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                className="save-discount-btn"
                                disabled={!isFormValid || isSaving}
                                onClick={handleSalvarDesconto}
                            >
                                {isSaving
                                    ? "SALVANDO..."
                                    : "SALVAR DESCONTO"}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}