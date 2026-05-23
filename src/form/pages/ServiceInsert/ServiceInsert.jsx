import React, { useState } from "react";
import Select from "react-select";
import "./ServiceInsert.css";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { FaRegTrashCan } from "react-icons/fa6";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx"
import { useNavigate } from "react-router-dom";

export default function ServiceInsert() {
  const navigate = useNavigate();

  const [valorTotal, setValorTotal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  const servicos = [
    {
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
  ]

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

            <div className="list">
              {servicos.map((servico) => (
                <Card
                  descricao={servico.descricao}
                  qntd={servico.qntd}
                  preco={servico.preco}
                  obs={servico.obs}
                />
              ))}
            </div>

            <div className="create-service-line">
              <button className="add-text-button">+ Criar Serviço</button>
            </div>

            <div className="value-line">
              <p>Valor Total:</p>
              <span>R$</span>
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

function Card({descricao, qntd, preco, obs}) {
  return (
    <div className="card">
      <div className="text">
        <h3>{descricao}</h3>
        <div className="description">
          <p>{qntd}x</p>
          <span>-</span>
          <p>R$ {preco}</p>
          <span>-</span>
          <p>OBS: {obs}</p>
        </div>
      </div>
      <div className="buttons">
        <button><HiOutlinePencil size={20} color="var(--color-primary)" className="pencil-icon" /></button>
        <button><FaRegTrashCan size={20} color="red" className="trash-icon" /></button>
      </div>
    </div>
  )
}