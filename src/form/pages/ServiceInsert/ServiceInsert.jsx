import React, { useState, useEffect } from "react";
import "./ServiceInsert.css";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { FaRegTrashCan } from "react-icons/fa6";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { PiToolboxBold } from "react-icons/pi";

export default function ServiceInsert() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [servicos, setServicos] = useState(() => {
    return JSON.parse(localStorage.getItem("servicosSelecionados")) || [];
  });

  useEffect(() => {
    localStorage.setItem("servicosSelecionados", JSON.stringify(servicos));
  }, [servicos]);

  const valorTotal = servicos.reduce(
  (total, s) => total + (Number(s.preco) || 0) * (Number(s.qntd) || 1),
  0
);

  function handleDelete(id) {
    setServicos((prev) => prev.filter((s) => s.id !== id));
  }

  const formatCurrency = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);

  useEffect(() => {
    const sync = () => {
      const stored =
        JSON.parse(localStorage.getItem("servicosDisponiveis")) || [];
      setServicosDisponiveis(stored);
    };

    sync();
    window.addEventListener("focus", sync);

    return () => window.removeEventListener("focus", sync);
  }, []);

  function handleAddService(servico) {
    setServicos((prev) => [...prev, servico]);
    setIsModalOpen(false);
  }

  const servicosIds = new Set(servicos.map((s) => s.id));
  const [searchTerm, setSearchTerm] = useState("");

  const servicosFiltrados = servicosDisponiveis.filter((s) =>
    s.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function updateQuantidade(id, delta) {
    setServicos((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              qntd: Math.max(1, (Number(s.qntd) || 1) + delta),
            }
          : s
      )
    );
  }
  
  function setQuantidadeManual(id, value) {
    const numericValue = Number(value);

    setServicos((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              qntd: isNaN(numericValue) || numericValue < 1 ? 1 : numericValue,
            }
          : s
      )
    );
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
              <FaArrowLeft size={20} />
            </button>
            <h1>Adicionar Serviço</h1>
          </div>

          <form className="service-insert-form" onSubmit={handleSubmit}>
            <div className="header">
              <h2>Serviços</h2>

              <button
                type="button"
                className="add-text-button"
                onClick={() => setIsModalOpen(true)}
              >
                + Adicionar Serviço
              </button>
            </div>

            {servicos.length === 0 ? (
              <div className="list empty-state">
                <PiToolboxBold size={40} color="var(--color-primary)" />
                <p>Comece inserindo um Novo Serviço</p>
              </div>
            ) : (
              <div className="list">
                {servicos.map((servico) => (
                  <Card
                    key={servico.id}
                    servico={servico}
                    handleDelete={handleDelete}
                    updateQuantidade={updateQuantidade}
                    setQuantidadeManual={setQuantidadeManual}
                  />
                ))}
              </div>
            )}

            <div className="value-line">
              <p className="title">Valor Total:</p>
              <span>{formatCurrency(valorTotal)}</span>
            </div>

            <button
              type="submit"
              className="service-insert-form-submit-button"
            >
              Salvar Serviços
            </button>
          </form>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
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
              {servicosFiltrados.length === 0 ? (
                <div className="modal-empty-state">
                  <PiToolboxBold size={42} color="var(--color-primary)" />

                  <p className="title">
                    Nenhum serviço encontrado
                  </p>

                  <p className="subtitle">
                    Tente ajustar a busca ou cadastre um novo serviço
                  </p>
                </div>
              ) : (
                servicosFiltrados.map((servico) => {
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
                      <Card servico={servico} hideActions />
                    </div>
                  );
                })
              )}
            </div>

            <div className="create-service-line">
              <button
                className="add-text-button"
                type="button"
                onClick={() =>
                  navigate("/cadastroServico", {
                    state: { mode: "createCatalog" },
                  })
                }
              >
                + Criar Serviço
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ servico, handleDelete, hideActions, updateQuantidade }) {
  const navigate = useNavigate();

  if (!servico) return null;

  return (
    <div className="card">
      <div className="text">
        <h3>{servico.descricao}</h3>

        <div className="description">
          <p>R$ {servico.preco}</p>
          <span>-</span>
          <p className="desc-text">OBS: {servico.obs}</p>
        </div>
      </div>

      {!hideActions && (
        <div className="qty-container">
          <button
            type="button"
            className="qty-button"
            onClick={() => updateQuantidade(servico.id, -1)}
          >
            -
          </button>

          <input
            className="qty-input"
            type="number"
            min="1"
            value={servico.qntd || 1}
            onChange={(e) =>
              updateQuantidade(servico.id, Number(e.target.value) - (servico.qntd || 1))
            }
          />

          <button
            type="button"
            className="qty-button"
            onClick={() => updateQuantidade(servico.id, 1)}
          >
            +
          </button>
        </div>
      )}

      {!hideActions && (
        <div className="buttons">
          <button
            onClick={() =>
              navigate("/cadastroServico", {
                state: {
                  mode: "editSelected",
                  service: servico,
                },
              })
            }
          >
            <HiOutlinePencil size={20} color="var(--color-primary)" />
          </button>

          <button onClick={() => handleDelete(servico.id)}>
            <FaRegTrashCan size={20} color="red" />
          </button>
        </div>
      )}
    </div>
  );
}