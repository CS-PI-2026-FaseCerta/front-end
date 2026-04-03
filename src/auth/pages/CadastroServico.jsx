import React, { useState } from "react";
import "./CadastroServico.css";
import { FaArrowLeft } from "react-icons/fa";

export default function CadastroServico() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [billingType, setBillingType] = useState("fixed");
    const [value, setValue] = useState("");

    const formatCurrency = (value) => {
        const number = value.replace(/\D/g, "");
        const float = (Number(number) / 100).toFixed(2);

        return Number(float).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleValueChange = (e) => {
        const raw = e.target.value;
        const formatted = formatCurrency(raw);
        setValue(formatted);
    };

    const isFormValid =
        name.trim() !== "" &&
        description.trim() !== "" &&
        value !== "" &&
        value !== "R$ 0,00";

    return (
        <div className="service-page">
            <div className="service-form-card">
                <div className="card-header">
                    <button className="back-button"><FaArrowLeft size={20} /></button>
                    <h1>Cadastro de Serviço</h1>
                </div>

                <form className="service-form">
                    <div className="service-form-group">
                        <label className="service-form-label">NOME DO SERVIÇO</label>
                        <input
                            className="service-form-input"
                            type="text"
                            placeholder="Ex: Manutenção Elétrica"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="service-form-group">
                        <label className="service-form-label">DESCRIÇÃO</label>
                        <textarea
                            className="service-form-textarea"
                            placeholder="Descreva os detalhes do serviço oferecido..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="service-form-group">
                        <label className="service-form-label">Tipo de Cobrança</label>

                        <div className="service-form-radio-group">
                            <label className="service-form-radio-option">
                                <input
                                    type="radio"
                                    name="billing"
                                    value="fixed"
                                    checked={billingType === "fixed"}
                                    onChange={() => setBillingType("fixed")}
                                />
                                Preço Fixo
                            </label>

                            <label className="service-form-radio-option">
                                <input
                                    type="radio"
                                    name="billing"
                                    value="hourly"
                                    checked={billingType === "hourly"}
                                    onChange={() => setBillingType("hourly")}
                                />
                                Por Hora
                            </label>
                        </div>
                    </div>

                    <div className="service-form-group">
                        <label className="service-form-label">
                            Valor {billingType === "hourly" ? "(R$/h)" : "(R$)"}
                        </label>
                        <input
                            className="service-form-input"
                            type="text"
                            value={value}
                            onChange={handleValueChange}
                            placeholder="R$ 0,00"
                        />
                    </div>

                    <button
                        type="submit"
                        className="service-form-submit-button"
                        disabled={!isFormValid}
                    >
                        Salvar Serviço
                    </button>
                </form>
            </div>
        </div>
    );
}
