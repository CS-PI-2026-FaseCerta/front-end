import React, { useState, useEffect  } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./RegisterService.css";
import "../../../global/components/form/Form.css";
import Header from "../../../global/components/header/Header";
import Footer from "../../../global/components/Footer/Footer";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function RegisterService() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [billingType, setBillingType] = useState("fixed");
  const [value, setValue] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    if (billingType === "hourly") {
      const number = raw.replace(/\D/g, "");
      const float = (Number(number) / 100).toFixed(2);
      const formatted = float.replace(".", ",");
      setValue(formatted === "0,00" && raw === "" ? "" : formatted);
    } else {
      const formatted = formatCurrency(raw);
      setValue(formatted);
    }
  };

  const numericValue = Number(value.replace(/\D/g, "")) / 100;

  const isFormValid =
    name.trim() !== "" &&
    value !== "" &&
    value !== "R$ 0,00" &&
    value !== "0,00" &&
    !isLoading;

  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!id) return;

    const selecionados = JSON.parse(localStorage.getItem("servicosSelecionados")) || [];

    const servico = selecionados.find((s) => String(s.id) === String(id));

    if (servico) {
      setName(servico.descricao);
      setDescription(servico.obs);
      setValue(
        Number(servico.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      );
      setBillingType(servico.billingType || "fixed");
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setSuccessMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Cadastro realizado com sucesso!");

      setName("");
      setDescription("");
      setValue("");
      setBillingType("fixed");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    }, 1500);
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
              disabled={isLoading}
            >
              <FaArrowLeft size={20} className="back-button-icon" />
            </button>
            <h1>Salvar Serviço</h1>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="form-label">NOME DO SERVIÇO</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ex: Manutenção Elétrica"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label className="form-label">DESCRIÇÃO</label>
              <textarea
                className="form-textarea"
                placeholder="Descreva os detalhes do serviço oferecido..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label className="form-label">TIPO DE COBRANÇA</label>

              <div className="form-radio-group">
                <label
                  className="form-radio-option"
                  tabIndex={isLoading ? -1 : 0}
                  style={{ pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.7 : 1 }}
                  onKeyDown={(e) => {
                    if (isLoading) return;
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setBillingType("fixed");
                      setValue("");
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="billing"
                    value="fixed"
                    checked={billingType === "fixed"}
                    onChange={() => {
                      setBillingType("fixed");
                      setValue("");
                    }}
                    disabled={isLoading}
                    tabIndex={-1}
                  />
                  Preço Fixo
                </label>

                <label
                  className="form-radio-option"
                  tabIndex={isLoading ? -1 : 0}
                  style={{ pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.7 : 1 }}
                  onKeyDown={(e) => {
                    if (isLoading) return;
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setBillingType("hourly");
                      setValue("");
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="billing"
                    value="hourly"
                    checked={billingType === "hourly"}
                    onChange={() => {
                      setBillingType("hourly");
                      setValue("");
                    }}
                    disabled={isLoading}
                    tabIndex={-1}
                  />
                  Por Unidade de Serviço
                </label>
              </div>
            </div>

            <div className="input-group">
              <label className="form-label">
                VALOR {billingType === "hourly" ? "(U.S)" : "(R$)"}
              </label>
              <input
                className="form-input"
                type="text"
                value={value}
                onChange={handleValueChange}
                placeholder={billingType === "hourly" ? "0,00" : "R$ 0,00"}
                disabled={isLoading}
              />
            </div>

            {successMessage && <p className="form-success">{successMessage}</p>}

            <button type="submit" className="form-button" disabled={!isFormValid || isLoading}>
              {isLoading ? "SALVANDO..." : "Salvar Serviço"}
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}