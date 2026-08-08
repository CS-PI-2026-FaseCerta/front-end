import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaFilter, FaSearch, FaEllipsisV, FaCheck, FaRegCircle, FaExclamationTriangle } from "react-icons/fa";
import { receivablesMockData } from "./receivablesMock";
import { applyReceivablesFilters } from "./receivablesFilters";
import Modal from "../../../global/components/modal/Modal";
import EmptyState from "../../../global/components/lists/EmptyState";
import "./ReceiptList.css";

const MONTHS = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
];

const ReceipList = () => {
  const [data, setData] = useState([...receivablesMockData]);
  
  // Período
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Filtros de colunas
  const [filters, setFilters] = useState({
    date: "",
    description: "",
    client: "",
    category: "",
    value: "",
    paymentType: "",
    paymentMethod: "",
    paid: ""
  });

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Ações menu e Modal
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fechar menu ao clicar fora ou apertar Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Processamento de dados
  const filteredData = useMemo(() => {
    return applyReceivablesFilters(data, {
      ...filters,
      month: currentMonth,
      year: currentYear
    });
  }, [data, filters, currentMonth, currentYear]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Ações
  const openMenu = (id, event) => {
    event.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((d) => d.id !== itemToDelete.id));
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDuplicateClick = (item) => {
    const newItem = { ...item, id: Date.now(), date: item.date }; // Mock duplication
    setData((prev) => [newItem, ...prev]);
    setActiveMenuId(null);
  };

  const genericAction = () => {
    setActiveMenuId(null);
  };

  return (
    <div className="receipt-list-page">
      <header className="receipt-list-page__header">
        <div className="receipt-list-page__navigation">
          <h1 className="receipt-list-page__title">FINANCEIRO</h1>
          
          <div className="receipt-list-page__month-selector">
            <button onClick={handlePrevMonth} aria-label="Mês anterior">
              <FaChevronLeft size={16} />
            </button>
            <span>{MONTHS[currentMonth - 1]}/{currentYear}</span>
            <button onClick={handleNextMonth} aria-label="Próximo mês">
              <FaChevronRight size={16} />
            </button>
          </div>

          <div className="receipt-list-page__tabs" role="tablist">
            <button className="receipt-list-page__tab receipt-list-page__tab--active" role="tab" aria-selected="true">
              Recebimentos
            </button>
            <button className="receipt-list-page__tab" role="tab" aria-selected="false">
              Despesas
            </button>
            <button className="receipt-list-page__tab" role="tab" aria-selected="false">
              Transferências
            </button>
          </div>
        </div>

        <div className="receipt-list-page__toolbar-right">
          <button className="receipt-list-page__btn-filters">
            <FaFilter /> Filtros
          </button>
        </div>
      </header>

      <main className="receipt-list-page__table-container">
        <div className="receipt-list-page__table-scroll">
          <table className="receipt-list-page__table">
            <thead>
              <tr>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Data</span>
                    <input 
                      type="date" 
                      value={filters.date} 
                      onChange={(e) => handleFilterChange("date", e.target.value)} 
                      aria-label="Filtrar por data"
                    />
                  </div>
                </th>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Descrição</span>
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      value={filters.description} 
                      onChange={(e) => handleFilterChange("description", e.target.value)}
                      aria-label="Filtrar por descrição"
                    />
                  </div>
                </th>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Recebido de</span>
                    <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      value={filters.client} 
                      onChange={(e) => handleFilterChange("client", e.target.value)}
                      aria-label="Filtrar por cliente"
                    />
                  </div>
                </th>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Categoria</span>
                    <select 
                      value={filters.category} 
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      aria-label="Filtrar por categoria"
                    >
                      <option value="">Todas</option>
                      <option value="Ordem de Serviço">Ordem de Serviço</option>
                      <option value="Mensalidade">Mensalidade</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Consultoria">Consultoria</option>
                      <option value="Contrato">Contrato</option>
                      <option value="Treinamento">Treinamento</option>
                      <option value="Serviço Avulso">Serviço Avulso</option>
                      <option value="Projeto">Projeto</option>
                    </select>
                  </div>
                </th>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Valor</span>
                    <input 
                      type="text" 
                      placeholder="Ex: 150,00" 
                      value={filters.value} 
                      onChange={(e) => handleFilterChange("value", e.target.value)}
                      aria-label="Filtrar por valor"
                    />
                  </div>
                </th>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Tipo de pagamento</span>
                    <select 
                      value={filters.paymentType} 
                      onChange={(e) => handleFilterChange("paymentType", e.target.value)}
                      aria-label="Filtrar por tipo de pagamento"
                    >
                      <option value="">Todos</option>
                      <option value="À vista">À vista</option>
                      <option value="Parcelado">Parcelado</option>
                      <option value="Recorrente">Recorrente</option>
                    </select>
                  </div>
                </th>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Modo de pagamento</span>
                    <select 
                      value={filters.paymentMethod} 
                      onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                      aria-label="Filtrar por modo de pagamento"
                    >
                      <option value="">Todos</option>
                      <option value="Indefinido">Indefinido</option>
                      <option value="Boleto">Boleto</option>
                      <option value="Carteira Digital">Carteira Digital</option>
                      <option value="Cartão Pré-pago">Cartão Pré-pago</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Cartão de Débito">Cartão de Débito</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Criptomoeda">Criptomoeda</option>
                      <option value="Depósito Bancário">Depósito Bancário</option>
                      <option value="Pix">Pix</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Transferência">Transferência</option>
                    </select>
                  </div>
                </th>
                <th>
                  <div className="receipt-list-page__header-cell">
                    <span>Pago?</span>
                    <select 
                      value={filters.paid} 
                      onChange={(e) => handleFilterChange("paid", e.target.value)}
                      aria-label="Filtrar por status de pagamento"
                    >
                      <option value="">Todos</option>
                      <option value="true">Pago</option>
                      <option value="false">Pendente</option>
                    </select>
                  </div>
                </th>
                <th style={{ width: "80px", textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: 0 }}>
                    <div style={{ padding: "48px 16px" }}>
                      <EmptyState 
                        icon={FaSearch}
                        title="Nenhum recebimento encontrado"
                        description="Não existem recebimentos para o período ou filtros selecionados."
                        actionLabel="Registrar recebimento"
                        onAction={() => {}}
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.description}</td>
                    <td>{item.client}</td>
                    <td>{item.category}</td>
                    <td>{formatCurrency(item.value)}</td>
                    <td>{item.paymentType}</td>
                    <td>{item.paymentMethod}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.paid ? (
                        <span className="receipt-list-page__status receipt-list-page__status--paid" title="Pago">
                          <FaCheck />
                        </span>
                      ) : (
                        <span className="receipt-list-page__status receipt-list-page__status--pending" title="Pendente">
                          <FaRegCircle />
                        </span>
                      )}
                    </td>
                    <td className="receipt-list-page__actions-cell">
                      <button 
                        className="receipt-list-page__btn-actions"
                        onClick={(e) => openMenu(item.id, e)}
                        aria-label="Ações do recebimento"
                        aria-haspopup="true"
                        aria-expanded={activeMenuId === item.id}
                      >
                        <FaEllipsisV />
                      </button>
                      
                      {activeMenuId === item.id && (
                        <div className="receipt-list-page__dropdown" ref={menuRef} role="menu">
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Gerar recibo</button>
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Editar detalhes</button>
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Detalhar valor</button>
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Anexos</button>
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={() => handleDuplicateClick(item)}>Duplicar</button>
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Mover para ...</button>
                          <div className="receipt-list-page__dropdown-divider" />
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Tornar recorrente...</button>
                          <div className="receipt-list-page__dropdown-divider" />
                          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Parcelar...</button>
                          <div className="receipt-list-page__dropdown-divider" />
                          <button className="receipt-list-page__dropdown-item receipt-list-page__dropdown-item--danger" role="menuitem" onClick={() => handleDeleteClick(item)}>Excluir</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalItems > 0 && (
          <div className="receipt-list-page__footer">
            <div className="receipt-list-page__pagination-info">
              Mostrando {startIndex + 1} de {endIndex} recebimentos
            </div>
            <div className="receipt-list-page__pagination-controls">
              <button 
                className="receipt-list-page__pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <FaChevronLeft size={12} />
              </button>
              
              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  className={`receipt-list-page__pagination-btn ${page === currentPage ? 'receipt-list-page__pagination-btn--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Ir para página ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button 
                className="receipt-list-page__pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </main>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ color: "var(--error-color)", marginBottom: "16px" }}>
            <FaExclamationTriangle size={48} />
          </div>
          <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--text-primary)" }}>Excluir recebimento?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Esta ação removerá o lançamento selecionado.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <button 
              onClick={() => setDeleteModalOpen(false)}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                color: "var(--text-secondary)"
              }}
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--error-color)",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                color: "#fff"
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReceipList;
