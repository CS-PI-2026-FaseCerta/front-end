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
        const number = value.replace(/\D/g, "");
        const float = (Number(number) / 100).toFixed(2);

        return Number(float).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const parseCurrency = (valueString) => {
        if (!valueString) return 0;
        const cleanString = valueString
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();
        return parseFloat(cleanString) || 0;
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
            setCustoDoInput(value, setValorServico);
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
            setCustoDoInput(value, setValorProduto);
        } else {
            setValorProduto(value.replace(/\D/g, ""));
        }
    };

    const setCustoDoInput = (value, stateSetter) => {
        if (value === "") {
            stateSetter("");
        } else {
            stateSetter(formatCurrency(value));
        }
    };

    const calcularDescontoServico = () => {
        const valor =
            tipoDescontoServico === "valor"
                ? parseCurrency(valorServico)
                : Number(valorServico);

        if (!valor || valor <= 0) return 0;

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

        if (!valor || valor <= 0) return 0;

        if (tipoDescontoProduto === "percentual") {
            return (subtotalProduto * valor) / 100;
        }

        return valor;
    };

    const descontoServico = calcularDescontoServico();
    const descontoProduto = calcularDescontoProduto();

    let mensagemErroAtual = "";

    if (tipoDescontoServico === "percentual" && Number(valorServico) > 100) {
        mensagemErroAtual = "O percentual não pode ser maior que 100%.";
    }

    if (descontoServico > subtotalServico) {
        mensagemErroAtual = "O desconto não pode ser maior que o valor total do SERVIÇO.";
    }

    if (tipoDescontoProduto === "percentual" && Number(valorProduto) > 100) {
        mensagemErroAtual = "O percentual do produto não pode ser maior que 100%.";
    }

    if (descontoProduto > subtotalProduto) {
        mensagemErroAtual = "O desconto não pode ser maior que o valor total do PRODUTO.";
    }

    const servicoValido =
        valorServico !== "" &&
        valorServico !== "R$ 0,00" &&
        descontoServico > 0 &&
        descontoServico <= subtotalServico;

    const produtoValido =
        valorProduto !== "" &&
        valorProduto !== "R$ 0,00" &&
        descontoProduto > 0 &&
        descontoProduto <= subtotalProduto;

    const isFormValid = (servicoValido || produtoValido) && mensagemErroAtual === "";

    const handleSalvarDesconto = () => {
        if (!isFormValid) return;

        setIsSaving(true);

        setTimeout(() => {
            console.log("Desconto salvo com sucesso!");
            setIsSaving(false);

            const modalOverlay = document.querySelector(".dashboard-modal-overlay");
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
                                    className={`toggle-button ${tipoDescontoServico === "percentual" ? "active" : ""}`}
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
                                    className={`toggle-button ${tipoDescontoServico === "valor" ? "active" : ""}`}
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
                                            className={`opt-btn ${quickSelectedServico === "5" ? "active" : ""}`}
                                            onClick={() => handleQuickValueServico("5")}
                                        >
                                            5%
                                        </button>

                                        <button
                                            type="button"
                                            className={`opt-btn ${quickSelectedServico === "10" ? "active" : ""}`}
                                            onClick={() => handleQuickValueServico("10")}
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
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="R$ 0,00"
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
                                    className={`toggle-button ${tipoDescontoProduto === "percentual" ? "active" : ""}`}
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
                                    className={`toggle-button ${tipoDescontoProduto === "valor" ? "active" : ""}`}
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
                                            className={`opt-btn ${quickSelectedProduto === "5" ? "active" : ""}`}
                                            onClick={() => handleQuickValueProduto("5")}
                                        >
                                            5%
                                        </button>

                                        <button
                                            type="button"
                                            className={`opt-btn ${quickSelectedProduto === "10" ? "active" : ""}`}
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
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="R$ 0,00"
                                            className="full-input"
                                            value={valorProduto}
                                            onChange={handleInputChangeProduto}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="discount-total-container">
                            <label className="discount-total-label">DESCONTO TOTAL</label>

                            <div className="discount-total-box">
                                <span className={`discount-total-value ${mensagemErroAtual ? "error" : ""}`}>
                                    -R$ {(descontoServico + descontoProduto).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>

                                <span className="discount-total-description">
                                    Valor total applied na ordem de serviço
                                </span>

                                {mensagemErroAtual && (
                                    <p className="discount-error-message">{mensagemErroAtual}</p>
                                )}
                            </div>

                            <button
                                type="button"
                                className="save-discount-btn"
                                disabled={!isFormValid || isSaving}
                                onClick={handleSalvarDesconto}
                            >
                                {isSaving ? "SALVANDO..." : "Salvar Desconto"}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}