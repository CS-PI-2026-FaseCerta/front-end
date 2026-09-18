import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./PaymentTerms.css";
import "../../../global/components/form/Form.css";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import {
  getPaymentData,
  savePaymentTerms,
} from "../../../home/pages/orders/payment/paymentStorage";
const QUICK_INSTALLMENTS = ["2x", "3x"];

export default function PaymentTerms() {
  const navigate = useNavigate();

  const [paymentType, setPaymentType] = useState("cash");
  const [downPayment, setDownPayment] = useState("");
  const [selectedQuickInstallment, setSelectedQuickInstallment] = useState("");
  const [installmentsText, setInstallmentsText] = useState("");
  const [details, setDetails] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const paymentData = getPaymentData();
    const terms = paymentData.terms;

    setPaymentType(terms.paymentType || "cash");
    setDownPayment(terms.downPayment || "");
    setInstallmentsText(terms.installments || "");
    setDetails(terms.details || "");

    if (terms.installments === "2x" || terms.installments === "3x") {
      setSelectedQuickInstallment(terms.installments);
    }
  }, []);

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");

    if (!number) {
      return "";
    }

    return (Number(number) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleDownPaymentChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setDownPayment("");
      return;
    }

    setDownPayment(formatCurrency(value));
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

  const hasInstallmentCondition = installmentsText.trim().length > 0;

  const isFormValid =
    paymentType === "cash" ||
    (paymentType === "installments" && hasInstallmentCondition);

  const buildPaymentTerms = () => ({
    paymentType,
    downPayment: paymentType === "installments" ? downPayment : "",
    installments:
      paymentType === "installments" ? installmentsText.trim() : "",
    details: details.trim(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    const paymentTerms = buildPaymentTerms();

    savePaymentTerms(paymentTerms);

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
              aria-label="Voltar"
            >
              <FaArrowLeft size={20} className="back-button-icon" />
            </button>

            <h1>Condições de Pagamento</h1>
          </div>

          <form
            className="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="input-group">
              <div className="payment-type-toggle">
                <button
                  type="button"
                  className={`payment-type-option ${paymentType === "cash"
                      ? "payment-type-option-active"
                      : ""
                    }`}
                  onClick={handleSelectCash}
                  aria-pressed={paymentType === "cash"}
                >
                  À vista
                </button>

                <button
                  type="button"
                  className={`payment-type-option ${paymentType === "installments"
                      ? "payment-type-option-active"
                      : ""
                    }`}
                  onClick={handleSelectInstallments}
                  aria-pressed={paymentType === "installments"}
                >
                  Parcelas
                </button>
              </div>
            </div>

            {paymentType === "installments" && (
              <>
                <div className="input-group">
                  <label
                    className="form-label"
                    htmlFor="downPayment"
                  >
                    ENTRADA
                  </label>

                  <span className="form-sublabel">
                    Qual o valor de entrada?
                  </span>

                  <input
                    id="downPayment"
                    name="downPayment"
                    className="form-input"
                    type="text"
                    placeholder="Insira a entrada aqui"
                    value={downPayment}
                    onChange={handleDownPaymentChange}
                  />
                </div>

                <div className="input-group">
                  <label
                    className="form-label"
                    htmlFor="installments"
                  >
                    PARCELAS
                  </label>

                  <span className="form-sublabel">
                    Quantas parcelas?
                  </span>

                  <div className="installments-row">
                    {QUICK_INSTALLMENTS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`installment-quick-button ${selectedQuickInstallment === option
                            ? "installment-quick-button-active"
                            : ""
                          }`}
                        onClick={() =>
                          handleQuickInstallmentClick(option)
                        }
                        aria-pressed={
                          selectedQuickInstallment === option
                        }
                      >
                        {option}
                      </button>
                    ))}

                    <input
                      id="installments"
                      name="installments"
                      className="form-input installments-free-input"
                      type="text"
                      placeholder="Insira as parcelas aqui"
                      value={installmentsText}
                      onChange={handleInstallmentsTextChange}
                      aria-required="true"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label
                className="form-label"
                htmlFor="details"
              >
                DETALHES
              </label>

              <textarea
                id="details"
                name="details"
                className="form-textarea"
                placeholder="Opcional"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="form-button"
              disabled={!isFormValid}
            >
              SALVAR CONDIÇÕES DE PAGAMENTO
            </button>

            {successMessage && (
              <p className="form-success">
                {successMessage}
              </p>
            )}
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}