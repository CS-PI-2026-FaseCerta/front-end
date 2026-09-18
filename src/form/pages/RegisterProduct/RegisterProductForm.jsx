import React, { useState } from "react";

export default function RegisterProductForm({
    onSuccess,
    onCancel,
}) {
    const [nome, setNome] = useState("");
    const [custo, setCusto] = useState("");
    const [precoVenda, setPrecoVenda] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    const formatCurrency = (value) => {
        const number = value.replace(/\D/g, "");
        const float = (Number(number) / 100).toFixed(2);

        return Number(float).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleCustoChange = (e) => {
        setCusto(formatCurrency(e.target.value));
    };

    const handleVendaChange = (e) => {
        setPrecoVenda(formatCurrency(e.target.value));
    };

    const parseCurrencyToFloat = (value) => {
        if (!value) return 0;

        return (
            parseFloat(
                value
                    .replace("R$", "")
                    .replace(/\./g, "")
                    .replace(",", ".")
                    .trim()
            ) || 0
        );
    };

    const custoNum = parseCurrencyToFloat(custo);
    const vendaNum = parseCurrencyToFloat(precoVenda);

    const lucroNominal = vendaNum - custoNum;

    const margemPercentual =
        vendaNum > 0 ? (lucroNominal / vendaNum) * 100 : 0;

    const isFormValid =
        nome.trim() !== "" &&
        custo !== "" &&
        custo !== "R$ 0,00" &&
        precoVenda !== "" &&
        precoVenda !== "R$ 0,00" &&
        quantidade.trim() !== "" &&
        estoqueMinimo.trim() !== "";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        setIsSaving(true);

        setTimeout(() => {
            setIsSaving(false);

            if (onSuccess) {
                onSuccess({
                    nome,
                    custo,
                    precoVenda,
                    quantidade,
                    estoqueMinimo,
                });
            }

            setNome("");
            setCusto("");
            setPrecoVenda("");
            setQuantidade("");
            setEstoqueMinimo("");
        }, 1000);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label className="form-label">NOME DO PRODUTO</label>

                <div className="form-input-wrapper">
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Ex: Filtro de Óleo Magneti Marelli"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        disabled={isSaving}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label className="form-label">CUSTO</label>

                    <div className="form-input-wrapper">
                        <input
                            className="form-input"
                            type="text"
                            value={custo}
                            onChange={handleCustoChange}
                            placeholder="R$ 0,00"
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="form-label">
                        PREÇO FINAL DE VENDA
                    </label>

                    <div className="form-input-wrapper">
                        <input
                            className="form-input"
                            type="text"
                            value={precoVenda}
                            onChange={handleVendaChange}
                            placeholder="R$ 0,00"
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label className="form-label">
                        QUANTIDADE ATUAL
                    </label>

                    <div className="form-input-wrapper">
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="form-label">
                        ESTOQUE MÍNIMO
                    </label>

                    <div className="form-input-wrapper">
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            placeholder="5"
                            value={estoqueMinimo}
                            onChange={(e) => setEstoqueMinimo(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>

            <div className="input-group">
                <label className="form-label">
                    MARGEM DE LUCRO ESTIMADA
                </label>

                <div
                    className="margin-display"
                    style={{
                        color:
                            lucroNominal > 0
                                ? "#28a745"
                                : lucroNominal === 0
                                    ? "#f1c40f"
                                    : "#e53e3e",
                    }}
                >
                    <span>{margemPercentual.toFixed(2)}%</span>

                    <span>
                        (R$ {lucroNominal.toFixed(2)})
                    </span>
                </div>

                {lucroNominal < 0 && (
                    <p className="form-error-inline">
                        Atenção: Preço de venda abaixo do custo!
                    </p>
                )}

                {lucroNominal === 0 && vendaNum > 0 && (
                    <p
                        className="form-error-inline"
                        style={{ color: "#f1c40f" }}
                    >
                        Cuidado: Você não terá margem de lucro.
                    </p>
                )}
            </div>
            <div className="form-actions">
                {onCancel && (
                    <button
                        type="button"
                        className="form-button form-button-secondary"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    className="form-button"
                    disabled={isSaving || !isFormValid}
                >
                    {isSaving ? "SALVANDO..." : "SALVAR PRODUTO"}
                </button>
            </div>
        </form>
    );
}