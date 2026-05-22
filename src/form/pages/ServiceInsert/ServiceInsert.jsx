import React, { useState } from "react";
import Select from "react-select";
import "./ServiceInsert.css";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx"
import { useNavigate } from "react-router-dom";

export default function ServiceInsert() {
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div className="service-insert-page">
      <Header />
      <main className="service-insert-page-content">
        <div className="service-insert-form-card">
          <div className="card-header">
            <button
              className="back-button"
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeft size={20}/>
            </button>
            <h1>Adicionar Serviço</h1>
          </div>

          <form className="service-insert-form" onSubmit={handleSubmit}>
            <div className="header">
              <h2>Serviços</h2>
              <button className="add-text-button">+ Adicionar Serviço</button>
            </div>

            <button
              type="submit"
              className="service-insert-form-submit-button"
              // disabled={!isFormValid}
            >
              Salvar Cidade
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
