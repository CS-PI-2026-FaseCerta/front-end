import React, { useState, useEffect } from "react";
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

  const valorTotal = servicos.reduce((total, servico) => total + servico.preco, 0);

  function handleDelete(id) {
    const novaLista = servicos.filter((servico) => servico.id !== id);

    setServicos(novaLista);
  }

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // simulação de serviços cadastrados no sistema
  const [servicosDisponiveis] = useState([
    { id: 10, descricao: "Troca de fiação", qntd: 1, preco: 500, obs: "Padrão residencial" },
    { id: 11, descricao: "Instalação de tomada", qntd: 1, preco: 120, obs: "Parede interna" },
    { id: 12, descricao: "Manutenção elétrica", qntd: 1, preco: 300, obs: "Check completo" },
  ]);

  function handleAddService(servico) {
    setServicos((prev) => [...prev, servico]);
    setIsModalOpen(false);
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
              <button
                className="add-text-button"
                type="button"
                onClick={() => setIsModalOpen(true)}
              >
                + Adicionar Serviço
              </button>
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
                    key={servico.id}
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
              <span>{formatCurrency(valorTotal)}</span>
            </div>

            <button
              type="submit"
              className="service-insert-form-submit-button"
              // disabled={!isFormValid}
            >
              Salvar Serviços
            </button>
          </form>
        </div>
      </main>
      <Footer />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h2>Selecionar Serviço</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="modal-list">
              {servicosDisponiveis.map((servico) => (
                <div
                  key={servico.id}
                  className="modal-card"
                  onClick={() => handleAddService(servico)}
                >
                  <Card
                    id={servico.id}
                    descricao={servico.descricao}
                    qntd={servico.qntd}
                    preco={servico.preco}
                    obs={servico.obs}
                    handleDelete={() => {}}
                    hideActions
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
        )}
    </div>
  );
}

function Card({id, descricao, qntd, preco, obs, handleDelete, hideActions}) {
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

      {!hideActions && (
        <div className="buttons">
          <button>
            <HiOutlinePencil size={20} color="var(--color-primary)" />
          </button>

          <button onClick={() => handleDelete(id)}>
            <FaRegTrashCan size={20} color="red" />
          </button>
        </div>
      )}
    </div>
  );
}
