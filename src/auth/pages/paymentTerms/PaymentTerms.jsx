import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./PaymentTerms.css";
import "../../../global/components/form/Form.css";

import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";

const QUICK_INSTALLMENTS = ["2x", "3x"];

export default function PaymentTerms() {
  const navigate = useNavigate();

  const [paymentType, setPaymentType] = useState("cash");
  const [downPayment, setDownPayment] = useState("");
  const [selectedQuickInstallment, setSelectedQuickInstallment] = useState("");
  const [installmentsText, setInstallmentsText] = useState("");
  const [details, setDetails] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    const float = (Number(number) / 100).toFixed(2);

    return Number(float).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleDownPaymentChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      setDownPayment("");
      return;
    }
    setDownPayment(formatCurrency(raw));
  };

  const handleQuickInstallmentClick = (option) => {
    setSelectedQuickInstallment(option);
    setInstallmentsText(option);
  };

  const handleInstallmentsTextChange = (e) => {
    const value = e.target.value;
    setInstallmentsText(value);

    if (value !== selectedQuickInstallment) {
      setSelectedQuickInstallment("");
    }
  };

  const handleSelectCash = () => {
    setPaymentType("cash");
  };

  const handleSelectInstallments = () => {
    setPaymentType("installments");
  };

  const isFormValid =
    paymentType === "cash" ||
    (paymentType === "installments" && installmentsText.trim() !== "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setSuccessMessage("Condições de pagamento salvas com sucesso!");

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
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft size={20} className="back-button-icon" />
            </button>
            <h1>Condições de Pagamento</h1>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="payment-type-toggle">
                <button
                  type="button"
                  className={`payment-type-option ${
                    paymentType === "cash" ? "payment-type-option-active" : ""
                  }`}
                  onClick={handleSelectCash}
                >
                  À vista
                </button>
                <button
                  type="button"
                  className={`payment-type-option ${
                    paymentType === "installments"
                      ? "payment-type-option-active"
                      : ""
                  }`}
                  onClick={handleSelectInstallments}
                >
                  Parcelas
                </button>
              </div>
            </div>

            {paymentType === "installments" && (
              <>
                <div className="input-group">
                  <label className="form-label">ENTRADA</label>
                  <span className="form-sublabel">Qual o valor de entrada?</span>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Insira a entrada aqui"
                    value={downPayment}
                    onChange={handleDownPaymentChange}
                  />
                </div>

                <div className="input-group">
                  <label className="form-label">PARCELAS</label>
                  <span className="form-sublabel">Quantas parcelas?</span>

                  <div className="installments-row">
                    {QUICK_INSTALLMENTS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`installment-quick-button ${
                          selectedQuickInstallment === option
                            ? "installment-quick-button-active"
                            : ""
                        }`}
                        onClick={() => handleQuickInstallmentClick(option)}
                      >
                        {option}
                      </button>
                    ))}

                    <input
                      className="form-input installments-free-input"
                      type="text"
                      placeholder="Insira as parcelas aqui"
                      value={installmentsText}
                      onChange={handleInstallmentsTextChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label className="form-label">DETALHES</label>
              <textarea
                className="form-textarea"
                placeholder="Opcional"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <button type="submit" className="form-button" disabled={!isFormValid}>
              Salvar Condições de Pagamento
            </button>

            {successMessage && (
              <p className="form-success">{successMessage}</p>
            )}
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}