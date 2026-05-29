import React, { useState } from "react";
import Select from "react-select";
import "./ServiceInsert.css";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { FaRegTrashCan } from "react-icons/fa6";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx"
import { useNavigate } from "react-router-dom";
import { PiToolboxBold } from "react-icons/pi";

export default function ServiceInsert() {
  const navigate = useNavigate();

  const [valorTotal, setValorTotal] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  const [servicos, setServicos] = useState([
    {
      id: 1,
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      id: 2,
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      id: 3,
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      id: 4,
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
    {
      id: 5,
      descricao: "Instalar Lâmpada",
      qntd: 1,
      preco: 350,
      obs: "Altura de 20 metros."
    },
  ])

  function handleDelete(id) {
    const novaLista = servicos.filter((servico) => servico.id !== id);

    setServicos(novaLista);
  }

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

            
            {servicos.length === 0 ? (
              <div className="list empty-state">
                <PiToolboxBold size={40} color="var(--color-primary)"/>
                <p>Comece inserindo um Novo Serviço</p>
              </div>
            ) : (
              <div className="list">
                {servicos.map((servico) => (
                  <Card
                    id={servico.id}
                    descricao={servico.descricao}
                    qntd={servico.qntd}
                    preco={servico.preco}
                    obs={servico.obs}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            

            <div className="create-service-line">
              <button className="add-text-button">+ Criar Serviço</button>
            </div>

            <div className="value-line">
              <p className="title">Valor Total:</p>
              <span>R$ {valorTotal}</span>
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

function Card({id, descricao, qntd, preco, obs, handleDelete}) {
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

        <button
          onClick={() => handleDelete(id)}
        >
          <FaRegTrashCan size={20} color="red" className="trash-icon" />
        </button>
      </div>
    </div>
  )
}
