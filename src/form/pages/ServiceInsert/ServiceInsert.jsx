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

  const [servicos, setServicos] = useState([])

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
    { id: 13, descricao: "Instalação de disjuntor", qntd: 1, preco: 180, obs: "Quadro de distribuição" },
    { id: 14, descricao: "Troca de lâmpadas LED", qntd: 1, preco: 80, obs: "Inclui altura até 3m" },
    { id: 15, descricao: "Instalação de ventilador de teto", qntd: 1, preco: 220, obs: "Com suporte estrutural básico" },
    { id: 16, descricao: "Reparo em curto-circuito", qntd: 1, preco: 450, obs: "Diagnóstico incluso" },
    { id: 17, descricao: "Aterramento elétrico", qntd: 1, preco: 600, obs: "Residencial padrão" },
    { id: 18, descricao: "Instalação de chuveiro elétrico", qntd: 1, preco: 150, obs: "Até 7500W" },
    { id: 19, descricao: "Troca de interruptor", qntd: 1, preco: 70, obs: "Simples ou duplo" },
    { id: 20, descricao: "Revisão elétrica geral", qntd: 1, preco: 750, obs: "Residência até 3 quartos" },
    { id: 21, descricao: "Instalação de luminária", qntd: 1, preco: 140, obs: "Fixação em teto ou parede" },
    { id: 22, descricao: "Passagem de cabos", qntd: 1, preco: 320, obs: "Infraestrutura interna" },
    { id: 23, descricao: "Instalação de quadro elétrico", qntd: 1, preco: 900, obs: "Montagem completa" },
    { id: 24, descricao: "Troca de fusível", qntd: 1, preco: 60, obs: "Diagnóstico rápido" },
    { id: 25, descricao: "Instalação de sensor de presença", qntd: 1, preco: 200, obs: "Áreas internas" },
  ]);

  function handleAddService(servico) {
    setServicos((prev) => [...prev, servico]);
    setIsModalOpen(false);
  }

  const servicosIds = new Set(servicos.map((s) => s.id));

  const [searchTerm, setSearchTerm] = useState("");

  const servicosFiltrados = servicosDisponiveis.filter((s) =>
    s.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

            <div className="modal-search">
              <input
                type="text"
                placeholder="Pesquisar serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="modal-list">
              {servicosFiltrados.map((servico) => {
                const isDisabled = servicosIds.has(servico.id);

                return (
                  <div
                    key={servico.id}
                    className={`modal-card ${isDisabled ? "disabled" : ""}`}
                    onClick={() => {
                      if (isDisabled) return;
                      handleAddService(servico);
                    }}
                  >
                    <Card
                      id={servico.id}
                      descricao={servico.descricao}
                      qntd={servico.qntd}
                      preco={servico.preco}
                      obs={servico.obs}
                      hideActions
                    />
                  </div>
                );
              })}
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
