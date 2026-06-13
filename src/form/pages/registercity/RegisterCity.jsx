import React, { useState } from "react";
import Select from "react-select";
import "./RegisterCity.css";
import "./RegisterCityModal.css";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import Modal from "../../../global/components/modal/Modal";

export default function RegisterCity() {
  return (
    <div className="city-page">
      <Header />
      <main className="city-page-content">
        <RegisterCityForm showBackButton={true} />
      </main>
      <Footer />
    </div>
  );
}

export function RegisterCityModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <RegisterCityForm
        showBackButton={false}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}

export function RegisterCityForm({
  showBackButton = false,
  onCancel,
  onSuccess,
}) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isCepValid = (cep) => {
    const numbers = cep.replace(/\D/g, "");
    return numbers.length === 8;
  };

  const isFormValid = name.trim() !== "" && isCepValid(cep);

  const states = [
    { value: "ac", label: "Acre" },
    { value: "al", label: "Alagoas" },
    { value: "ap", label: "Amapá" },
    { value: "am", label: "Amazonas" },
    { value: "ba", label: "Bahia" },
    { value: "ce", label: "Ceará" },
    { value: "df", label: "Distrito Federal" },
    { value: "es", label: "Espírito Santo" },
    { value: "go", label: "Goiás" },
    { value: "ma", label: "Maranhão" },
    { value: "mt", label: "Mato Grosso" },
    { value: "ms", label: "Mato Grosso do Sul" },
    { value: "mg", label: "Minas Gerais" },
    { value: "pa", label: "Pará" },
    { value: "pb", label: "Paraíba" },
    { value: "pr", label: "Paraná" },
    { value: "pe", label: "Pernambuco" },
    { value: "pi", label: "Piauí" },
    { value: "rj", label: "Rio de Janeiro" },
    { value: "rn", label: "Rio Grande do Norte" },
    { value: "rs", label: "Rio Grande do Sul" },
    { value: "ro", label: "Rondônia" },
    { value: "rr", label: "Roraima" },
    { value: "sc", label: "Santa Catarina" },
    { value: "sp", label: "São Paulo" },
    { value: "se", label: "Sergipe" },
    { value: "to", label: "Tocantins" },
  ];

  const [state, setState] = useState(states.find((s) => s.value === "pr"));

  const formatCep = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 8);

    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{0,3})/, "$1-$2");
    }

    return value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMessage("Cadastro realizado com sucesso!");

    setState(states.find((s) => s.value === "pr"));
    setName("");
    setCep("");

    setTimeout(() => {
      setSuccessMessage("");
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    }, 2000);
  };

  return (
    <div className="city-form-card">
      <div className="card-header">
        {showBackButton && (
          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Voltar ao dashboard"
          >
            <FaArrowLeft size={20} />
          </button>
        )}
        <h1>Cadastro de Cidade</h1>
      </div>

      <form className="city-form" onSubmit={handleSubmit}>
        <div className="city-form-group">
          <label htmlFor="city-name" className="city-form-label">
            NOME DA CIDADE
          </label>
          <input
            id="city-name"
            className="city-form-input"
            type="text"
            placeholder="Ex: Dois Vizinhos"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div id="city-form-midline">
          <div className="city-form-group" id="city-form-cep-group">
            <label htmlFor="city-cep" className="city-form-label">
              CEP - CIDADE
            </label>
            <input
              id="city-cep"
              className="city-form-input"
              type="text"
              placeholder="Ex: 85660-000"
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
            />
          </div>

          <div id="city-form-state-group" className="city-form-group">
            <label htmlFor="city-state" className="city-form-label">
              ESTADO (UF)
            </label>

            <Select
              id="city-state"
              options={states}
              value={state}
              onChange={setState}
              placeholder="Selecione um estado..."
              isSearchable
              className="city-select"
              classNamePrefix="city-react-select"
            />
          </div>
        </div>

        {/* MENSAGEM DE SUCESSO */}
        {successMessage && (
          <p
            style={{
              color: "#28a745",
              marginTop: "10px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {successMessage}
          </p>
        )}

        <div className="city-form-actions">
          {onCancel && (
            <button
              type="button"
              className="city-form-cancel-button"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="city-form-submit-button"
            disabled={!isFormValid}
          >
            Salvar Cidade
          </button>
        </div>
      </form>
    </div>
  );
}
