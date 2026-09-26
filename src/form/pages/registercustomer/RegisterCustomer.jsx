import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import RegisterCustomerForm from "./RegisterCustomerForm.jsx";
import Header from "../../../global/components/header/Header";
import Footer from "../../../global/components/Footer/Footer";
import "./RegisterCustomer.css";

export default function RegisterCustomer() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/clientes");
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
              type="button"
            >
              <FaArrowLeft size={20} />
            </button>

            <h1>Cadastrar Cliente</h1>
          </div>

          <RegisterCustomerForm
            onSuccess={handleSuccess}
            onCancel={() => navigate(-1)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}