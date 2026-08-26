import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import "./RegisterProduct.css";
import "../../../global/components/form/Form.css";
import Header from "../../../global/components/header/Header";
import Footer from "../../../global/components/Footer/Footer";

export default function CadastrarProduto() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [custo, setCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    const float = (Number(number) / 100).toFixed(2);

    return Number(float).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCustoChange = (e) => {
    const raw = e.target.value;
    const formatted = formatCurrency(raw);
    setCusto(formatted);
  };

  const handleVendaChange = (e) => {
    const raw = e.target.value;
    const formatted = formatCurrency(raw);
    setPrecoVenda(formatted);
  };

  const parseCurrencyToFloat = (valueString) => {
    if (!valueString) return 0;
    const cleanString = valueString
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();
    return parseFloat(cleanString) || 0;
  };

  const custoNum = parseCurrencyToFloat(custo);
  const vendaNum = parseCurrencyToFloat(precoVenda);
  const lucroNominal = vendaNum - custoNum;
  const margemPercentual = vendaNum > 0 ? (lucroNominal / vendaNum) * 100 : 0;

  const isFormValid =
    nome.trim() !== "" &&
    custo !== "" &&
    custo !== "R$ 0,00" &&
    precoVenda !== "" &&
    precoVenda !== "R$ 0,00" &&
    quantidade.trim() !== "" &&
    estoqueMinimo.trim() !== "" &&
    !isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setMessage("");

    const payload = { nome, custo, precoVenda, quantidade, estoqueMinimo };
    console.log("Dados do produto:", payload);

    setTimeout(() => {
      setIsLoading(false);
      setMessage("Cadastro realizado com sucesso!");

      setNome("");
      setCusto("");
      setPrecoVenda("");
      setQuantidade("");
      setEstoqueMinimo("");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="register-product-page">
      <Header />
      <div className="service-page-content">
        <main className="service-form-card">
          <div className="card-header">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
            >
              <FaArrowLeft size={20} className="back-button-icon" />
            </button>
            <h1>Salvar Produto</h1>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="form-label">NOME DO PRODUTO</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ex: Filtro de Óleo Magneti Marelli"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="form-label">CUSTO</label>
                <input
                  className="form-input"
                  type="text"
                  value={custo}
                  onChange={handleCustoChange}
                  placeholder="R$ 0,00"
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <label className="form-label">PREÇO FINAL DE VENDA</label>
                <input
                  className="form-input"
                  type="text"
                  value={precoVenda}
                  onChange={handleVendaChange}
                  placeholder="R$ 0,00"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="form-label">QUANTIDADE ATUAL</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <label className="form-label">ESTOQUE MÍNIMO</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="5"
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginTop: "10px" }}>
              <label className="form-label">MARGEM DE LUCRO ESTIMADA</label>
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
                <span>(R$ {lucroNominal.toFixed(2)})</span>
              </div>

              {lucroNominal < 0 && (
                <p className="form-error-inline">
                  Atenção: Preço de venda abaixo do custo!
                </p>
              )}

              {lucroNominal === 0 && vendaNum > 0 && (
                <p className="form-error-inline" style={{ color: "#f1c40f" }}>
                  Cuidado: Você não terá margem de lucro.
                </p>
              )}
            </div>

            {message && <p className="form-success">{message}</p>}

            <button
              type="submit"
              className="form-button"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "SALVANDO..." : "Salvar Produto"}
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}