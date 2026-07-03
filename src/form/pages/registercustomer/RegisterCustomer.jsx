import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import RegisterCustomerForm from "./RegisterCustomerForm.jsx";
import Header from "../../../global/components/header/Header";
import Footer from "../../../global/components/Footer/Footer";
import "./RegisterCustomer.css";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (data) => {
    setSuccessMessage(data.tipo === "PF" ? "Cliente (PF) cadastrado com sucesso!" : "Empresa (PJ) cadastrada com sucesso!");
    // Aqui no futuro será feito o redirect ou refresh dependendo da UX desejada
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="register-customer-page">
      <Header />
      <main className="register-customer-content">
        <div className="register-customer-card">
          <div className="card-header">
            <button
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft size={20} />
            </button>
            <h1>Cadastrar Cliente</h1>
          </div>

          {successMessage && (
            <div className="form-success register-customer-success-margin">
              {successMessage}
            </div>
          )}

          <RegisterCustomerForm onSuccess={handleSuccess} onCancel={() => navigate(-1)} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
