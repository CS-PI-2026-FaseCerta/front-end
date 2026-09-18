import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import RegisterServiceForm from "./RegisterServiceForm.jsx";
import Header from "../../../global/components/header/Header";
import Footer from "../../../global/components/Footer/Footer";

import "./RegisterService.css";
import "../../../global/components/form/Form.css";

export default function RegisterService() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (data) => {
    setSuccessMessage(
      data.isEdit
        ? "Serviço atualizado com sucesso!"
        : "Serviço cadastrado com sucesso!"
    );

    setTimeout(() => {
      setSuccessMessage("");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="register-service-page">
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

            <h1>Salvar Serviço</h1>
          </div>

          {successMessage && (
            <p className="form-success">
              {successMessage}
            </p>
          )}

          <RegisterServiceForm
            serviceId={id}
            onSuccess={handleSuccess}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}