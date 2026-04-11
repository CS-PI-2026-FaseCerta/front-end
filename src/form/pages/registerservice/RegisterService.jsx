import React, { useState } from "react";
import "./RegisterService.css";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../../../global/components/Header/Header";
import Footer from "../../../global/components/Footer/Footer";
 
export default function RegisterService() {
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
            <Header/>
            <div className="service-form-card">
                <div className="card-header">
                    <button className="back-button"><FaArrowLeft size={20} color="#433f9b"/></button>
                    <h1>Cadastro de Serviço</h1>
                </div>

                <form className="service-form">
                    <div className="service-form-group">
                        <label className="service-form-label" style={{ textAlign: "left" }}>NOME DO SERVIÇO</label>
                        <input
                            className="service-form-input"
                            type="text"
                            placeholder="Ex: Manutenção Elétrica"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="service-form-group">
                        <label className="service-form-label" style={{ textAlign: "left" }}>DESCRIÇÃO</label>
                        <textarea
                            className="service-form-textarea"
                            placeholder="Descreva os detalhes do serviço oferecido..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="service-form-group">
                        <label className="service-form-label" style={{ textAlign: "left" }}>TIPO DE COBRANÇA</label>

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

                    <div className="service-form-group service-form-value-conteiner">
                        <label className="service-form-label" style={{ textAlign: "left" }}>
                            VALOR {billingType === "hourly" ? "(R$/h)" : "(R$)"}
                        </label>
                        <div>
                            <div className="service-form-value-square"></div>
                            <span className="service-form-value-span">R$</span>
                            <input
                                className="service-form-input service-form-value-input"
                                type="text"
                                value={value}
                                onChange={handleValueChange}
                                placeholder="0,00"
                            />
                        </div>
                        
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
            <Footer/>
        </div>
    );
}
