import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../../global/components/Header/Header.jsx";
import Footer from "../../global/components/Footer/Footer.jsx";
import "./cadastroPeca.css";

export default function CadastrarPeca() {
    const navigate = useNavigate();

    // Estados do formulário
    const [form, setForm] = useState({
        nome: "",
        custo: "",
        precoVenda: "",
        quantidade: "",
        estoqueMinimo: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const custoNum = parseFloat(form.custo.replace(',', '.')) || 0;
    const vendaNum = parseFloat(form.precoVenda.replace(',', '.')) || 0;
    const lucroNominal = vendaNum - custoNum;
    const margemPercentual = vendaNum > 0 ? (lucroNominal / vendaNum) * 100 : 0;

    const updateField = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        console.log("Dados da peça:", form);

        setTimeout(() => {
            setIsLoading(false);
            setMessage("Peça cadastrada com sucesso!");
        }, 1500);
    };

    return (
        <div className="page-container">
            <Header />

            <main className="main-content">
                <div className="card wide-card">
                    <div className="card-header">
                        {/* Botão de voltar */}
                        <button onClick={() => navigate(-1)} className="back-button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <FaArrowLeft />
                        </button>
                        <h1>Cadastrar Peça/Material</h1>
                    </div>

                    <form id="registerForm" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="nome">NOME DA PEÇA</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                placeholder="Ex: Filtro de Óleo Magneti Marelli"
                                value={form.nome}
                                onChange={updateField}
                                required
                                className="input-field"
                            />
                        </div>

                        <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label htmlFor="custo">CUSTO (R$)</label>
                                <div className="input-wrapper prefix">
                                    <span className="currency-prefix">R$</span>
                                    <input
                                        type="text"
                                        id="custo"
                                        name="custo"
                                        placeholder="0,00"
                                        value={form.custo}
                                        onChange={updateField}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label htmlFor="precoVenda">PREÇO FINAL DE VENDA (R$)</label>
                                <div className="input-wrapper prefix">
                                    <span className="currency-prefix">R$</span>
                                    <input
                                        type="text"
                                        id="precoVenda"
                                        name="precoVenda"
                                        placeholder="0,00"
                                        value={form.precoVenda}
                                        onChange={updateField}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label htmlFor="quantidade">QUANTIDADE ATUAL</label>
                                <input
                                    type="number"
                                    id="quantidade"
                                    name="quantidade"
                                    min="0"
                                    placeholder="0"
                                    value={form.quantidade}
                                    onChange={updateField}
                                    className="input-field"
                                />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label htmlFor="estoqueMinimo">ESTOQUE MÍNIMO</label>
                                <input
                                    type="number"
                                    id="estoqueMinimo"
                                    name="estoqueMinimo"
                                    min="0"
                                    placeholder="5"
                                    value={form.estoqueMinimo}
                                    onChange={updateField}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ marginTop: '10px' }}>
                            <label>MARGEM DE LUCRO ESTIMADA</label>
                            <div className={`input-field ${lucroNominal < 0 ? 'input-error' : ''}`}
                                style={{
                                    backgroundColor: '#f4f4f4',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    color: lucroNominal >= 0 ? '#28a745' : '#e53e3e'
                                }}>
                                <span>{margemPercentual.toFixed(2)}%</span>
                                <span>(R$ {lucroNominal.toFixed(2)})</span>
                            </div>

                            {lucroNominal < 0 && (
                                <p className="login-error-message" style={{ fontSize: '12px' }}>
                                    Atenção: Preço de venda abaixo do custo!
                                </p>
                            )}
                        </div>

                        {message && (
                            <p style={{ color: "#28a745", fontWeight: "bold", textAlign: "center", marginBottom: "1rem" }}>
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="btn-primary btn-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "CADASTRANDO..." : "CADASTRAR PEÇA/MATERIAL"}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}