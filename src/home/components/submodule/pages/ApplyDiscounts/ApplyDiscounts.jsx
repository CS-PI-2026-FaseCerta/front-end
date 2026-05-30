import React, { useState } from "react";
import "./ApplyDiscounts.css";


export default function AplicarDesconto() {

    const subtotalServico = 350;
    const subtotalProduto = 350;

    const [tipoDescontoServico, setTipoDescontoServico] = useState("percentual");
    const [valorServico, setValorServico] = useState("");
    const [quickSelectedServico, setQuickSelectedServico] = useState("");

    const [tipoDescontoProduto, setTipoDescontoProduto] = useState("percentual");
    const [valorProduto, setValorProduto] = useState("");
    const [quickSelectedProduto, setQuickSelectedProduto] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    const formatCurrency = (value) => {
        const numericValue = value.replace(/\D/g, "");

        const number = (Number(numericValue) / 100).toFixed(2);

        return number.replace(".", ",");
    };

    const parseCurrency = (value) => {
        return Number(
            value
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()
        );
    };

    const handleQuickValueServico = (valor) => {
        setQuickSelectedServico(valor);

        if (tipoDescontoServico === "valor") {
            setValorServico(formatCurrency(valor));
        } else {
            setValorServico(valor);
        }
    };

    const handleInputChangeServico = (e) => {
        setQuickSelectedServico("");

        const value = e.target.value;

        if (tipoDescontoServico === "valor") {
            setValorServico(formatCurrency(value));
        } else {
            setValorServico(value.replace(/\D/g, ""));
        }
    };

    const handleQuickValueProduto = (valor) => {
        setQuickSelectedProduto(valor);

        if (tipoDescontoProduto === "valor") {
            setValorProduto(formatCurrency(valor));
        } else {
            setValorProduto(valor);
        }
    };

    const handleInputChangeProduto = (e) => {
        setQuickSelectedProduto("");

        const value = e.target.value;

        if (tipoDescontoProduto === "valor") {
            setValorProduto(formatCurrency(value));
        } else {
            setValorProduto(value.replace(/\D/g, ""));
        }
    };

    const calcularDescontoServico = () => {
        const valor =
            tipoDescontoServico === "valor"
                ? parseCurrency(valorServico)
                : Number(valorServico);

        if (!valor || valor <= 0) {
            return 0;
        }

        if (tipoDescontoServico === "percentual") {
            return (subtotalServico * valor) / 100;
        }

        return valor;
    };

    const calcularDescontoProduto = () => {
        const valor =
            tipoDescontoProduto === "valor"
                ? parseCurrency(valorProduto)
                : Number(valorProduto);

        if (!valor || valor <= 0) {
            return 0;
        }

        if (tipoDescontoProduto === "percentual") {
            return (subtotalProduto * valor) / 100;
        }

        return valor;
    };

    const descontoServico = calcularDescontoServico();
    const descontoProduto = calcularDescontoProduto();

    let mensagemErroAtual = "";

    if (tipoDescontoServico === "percentual") {
        if (Number(valorServico) > 100) {
            mensagemErroAtual =
                "O percentual não pode ser maior que 100%.";
        }
    }

    if (descontoServico > subtotalServico) {
        mensagemErroAtual =
            "O desconto não pode ser maior que o valor total do SERVIÇO.";
    }
    
    if (
        tipoDescontoProduto === "percentual" &&
        Number(valorProduto) > 100
    ) {
        mensagemErroAtual =
            "O percentual do produto não pode ser maior que 100%.";
    }

    if (descontoProduto > subtotalProduto) {
        mensagemErroAtual =
            "O desconto não pode ser maior que o valor total do PRODUTO.";
    }

    const servicoValido =
        valorServico !== "" &&
        descontoServico > 0 &&
        descontoServico <= subtotalServico;

    const produtoValido =
        valorProduto !== "" &&
        descontoProduto > 0 &&
        descontoProduto <= subtotalProduto;

    const isFormValid =
        servicoValido && produtoValido;

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
                                        setQuickSelectedServico("");
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
                                        setQuickSelectedServico("");
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
                                            className={`opt-btn ${quickSelectedServico === "5"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                handleQuickValueServico("5")
                                            }
                                        >
                                            5%
                                        </button>

                                        <button
                                            type="button"
                                            className={`opt-btn ${quickSelectedServico === "10"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                handleQuickValueServico("10")
                                            }
                                        >
                                            10%
                                        </button>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Outros (%)"
                                            className="small-input"
                                            value={valorServico}
                                            onChange={handleInputChangeServico}
                                        />
                                    </div>
                                ) : (
                                    <div className="input-wrapper prefix">
                                        <span className="currency-prefix">
                                            R$
                                        </span>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0,00"
                                            className="full-input"
                                            value={valorServico}
                                            onChange={handleInputChangeServico}
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
                                    className={`toggle-button ${tipoDescontoProduto === "percentual"
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        setTipoDescontoProduto("percentual");
                                        setValorProduto("");
                                        setQuickSelectedProduto("");
                                    }}
                                >
                                    %
                                </button>

                                <button
                                    type="button"
                                    className={`toggle-button ${tipoDescontoProduto === "valor"
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() => {
                                        setTipoDescontoProduto("valor");
                                        setValorProduto("");
                                        setQuickSelectedProduto("");
                                    }}
                                >
                                    R$
                                </button>
                            </div>

                            <p>Quanto de desconto?</p>

                            <div className="input-area">
                                {tipoDescontoProduto === "percentual" ? (
                                    <div className="options-row">
                                        <button
                                            type="button"
                                            className={`opt-btn ${quickSelectedProduto === "5"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() => handleQuickValueProduto("5")}
                                        >
                                            5%
                                        </button>

                                        <button
                                            type="button"
                                            className={`opt-btn ${quickSelectedProduto === "10"
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() => handleQuickValueProduto("10")}
                                        >
                                            10%
                                        </button>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Outros (%)"
                                            className="small-input"
                                            value={valorProduto}
                                            onChange={handleInputChangeProduto}
                                        />
                                    </div>
                                ) : (
                                    <div className="input-wrapper prefix">
                                        <span className="currency-prefix">
                                            R$
                                        </span>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0,00"
                                            className="full-input"
                                            value={valorProduto}
                                            onChange={handleInputChangeProduto}
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
                                    -R$ {(descontoServico + descontoProduto).toLocaleString(
                                        "pt-BR",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
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
                                    : "Salvar Desconto"}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}