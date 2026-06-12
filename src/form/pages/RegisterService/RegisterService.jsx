import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./RegisterService.css";
import "../../../global/components/form/Form.css";

import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";

export default function RegisterService() {
  const navigate = useNavigate();
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

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMessage("Cadastro realizado com sucesso!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000); 
  };

  return (
    <div className="service-page">
      <Header />
      <div className="service-page-content">
        <main className="service-form-card">
          <div className="card-header">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeft size={20} className="back-button-icon" />
            </button>
            <h1>Cadastro de Serviço</h1>
          </div>

          <form className="form">
            <div className="input-group">
              <label className="form-label">NOME DO SERVIÇO</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ex: Manutenção Elétrica"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="form-label">DESCRIÇÃO</label>
              <textarea
                className="form-textarea"
                placeholder="Descreva os detalhes do serviço oferecido..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="form-label">TIPO DE COBRANÇA</label>

              <div className="form-radio-group">
                <label className="form-radio-option">
                  <input
                    type="radio"
                    name="billing"
                    value="fixed"
                    checked={billingType === "fixed"}
                    onChange={() => setBillingType("fixed")}
                  />
                  Preço Fixo
                </label>

                <label className="form-radio-option">
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

            <div className="input-group">
              <label className="form-label">
                VALOR {billingType === "hourly" ? "(R$/h)" : "(R$)"}
              </label>
              <input
                className="form-input"
                type="text"
                value={value}
                onChange={handleValueChange}
                placeholder="R$ 0,00"
              />
            </div>

            <button type="submit" className="form-button" disabled={!isFormValid}>
              Salvar Serviço
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
