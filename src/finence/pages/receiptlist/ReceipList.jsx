import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaFilter, FaSearch, FaEllipsisV, FaCheck, FaRegCircle, FaExclamationTriangle, FaSort, FaTimes } from "react-icons/fa";
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
  
  // Período - Mês inicial fixo em Maio/2026 para corresponder aos mocks e à referência
  const [currentMonth, setCurrentMonth] = useState(5); // 1-12
  const [currentYear, setCurrentYear] = useState(2026);

  // Filtros - Rascunho (o que está sendo digitado) e Aplicados (o que filtra a tabela)
  const initialFilters = {
    date: "",
    description: "",
    client: "",
    category: "",
    value: "",
    paymentType: "",
    paymentMethod: "",
    paid: ""
  };
  
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Ações menu e Modal
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Ordenação básica para manter o componente interativo e os ícones funcionais
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  const handleDraftChange = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilter = (key) => {
    setAppliedFilters((prev) => ({ ...prev, [key]: draftFilters[key] }));
    setCurrentPage(1);
  };

  const clearFilter = (key) => {
    setDraftFilters((prev) => ({ ...prev, [key]: "" }));
    setAppliedFilters((prev) => ({ ...prev, [key]: "" }));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Processamento de dados
  const filteredData = useMemo(() => {
    let result = applyReceivablesFilters(data, {
      ...appliedFilters,
      month: currentMonth,
      year: currentYear
    });

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, appliedFilters, currentMonth, currentYear, sortConfig]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
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

  // Componente de coluna de filtro
  const FilterColumn = ({ label, fieldKey, type = "text", options = [], sortable = true }) => {
    return (
      <th>
        <div 
          className={`receipt-list-page__column-header ${sortable ? 'receipt-list-page__column-header--sortable' : ''}`}
          onClick={sortable ? () => handleSort(fieldKey) : undefined}
          role={sortable ? "button" : undefined}
          tabIndex={sortable ? 0 : undefined}
        >
          <span>{label}</span>
          {sortable && <FaSort className="receipt-list-page__sort-icon" />}
        </div>
        <div className="receipt-list-page__column-filter">
          {type === "select" ? (
            <select 
              value={draftFilters[fieldKey]} 
              onChange={(e) => handleDraftChange(fieldKey, e.target.value)}
              aria-label={`Filtro rascunho de ${label}`}
            >
              <option value=""></option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : type === "date" ? (
            <input 
              type="date" 
              value={draftFilters[fieldKey]} 
              onChange={(e) => handleDraftChange(fieldKey, e.target.value)} 
              aria-label={`Filtro rascunho de ${label}`}
            />
          ) : (
            <input 
              type="text" 
              value={draftFilters[fieldKey]} 
              onChange={(e) => handleDraftChange(fieldKey, e.target.value)}
              aria-label={`Filtro rascunho de ${label}`}
            />
          )}
          
          <div className="receipt-list-page__filter-actions">
            <button 
              className="receipt-list-page__filter-btn receipt-list-page__filter-btn--apply"
              onClick={() => applyFilter(fieldKey)}
              aria-label={`Aplicar filtro de ${label}`}
              title="Confirmar filtro"
            >
              <FaCheck size={10} />
            </button>
            <button 
              className="receipt-list-page__filter-btn receipt-list-page__filter-btn--clear"
              onClick={() => clearFilter(fieldKey)}
              aria-label={`Limpar filtro de ${label}`}
              title="Limpar filtro"
            >
              <FaTimes size={10} />
            </button>
          </div>
        </div>
      </th>
    );
  };

  return (
    <div className="receipt-list-page">
      <div className="receipt-list-page__card">
        <header className="receipt-list-page__header">
          <h1 className="receipt-list-page__title">FINANCEIRO</h1>
          
          <div className="receipt-list-page__header-controls">
            <div className="receipt-list-page__month-selector">
              <button onClick={handlePrevMonth} aria-label="Mês anterior">
                <FaChevronLeft size={12} />
              </button>
              <span>{MONTHS[currentMonth - 1]}/{currentYear}</span>
              <button onClick={handleNextMonth} aria-label="Próximo mês">
                <FaChevronRight size={12} />
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
            
            <div style={{ flex: 1 }}></div>

            <button className="receipt-list-page__btn-filters">
              <FaFilter size={14} /> Filtros
            </button>
          </div>
        </header>

        <main className="receipt-list-page__table-container">
          <div className="receipt-list-page__table-scroll">
            <table className="receipt-list-page__table">
              <thead>
                <tr>
                  <FilterColumn label="Data" fieldKey="date" type="date" sortable={false} />
                  <FilterColumn label="Descrição" fieldKey="description" />
                  <FilterColumn label="Recebido de" fieldKey="client" />
                  <FilterColumn 
                    label="Categoria" 
                    fieldKey="category" 
                    type="select" 
                    options={[
                      {value: "Ordem de Serviço", label: "Ordem de Serviço"},
                      {value: "Mensalidade", label: "Mensalidade"},
                      {value: "Vendas", label: "Vendas"},
                      {value: "Consultoria", label: "Consultoria"},
                      {value: "Contrato", label: "Contrato"},
                      {value: "Treinamento", label: "Treinamento"},
                      {value: "Serviço Avulso", label: "Serviço Avulso"},
                      {value: "Projeto", label: "Projeto"}
                    ]} 
                  />
                  <FilterColumn label="Valor" fieldKey="value" />
                  <FilterColumn 
                    label="Tipo de pagamento" 
                    fieldKey="paymentType" 
                    type="select"
                    options={[
                      {value: "À vista", label: "À vista"},
                      {value: "Parcelado", label: "Parcelado"},
                      {value: "Recorrente", label: "Recorrente"}
                    ]} 
                  />
                  <FilterColumn 
                    label="Modo de pagamento" 
                    fieldKey="paymentMethod" 
                    type="select"
                    options={[
                      {value: "Indefinido", label: "Indefinido"},
                      {value: "Boleto", label: "Boleto"},
                      {value: "Carteira Digital", label: "Carteira Digital"},
                      {value: "Cartão Pré-pago", label: "Cartão Pré-pago"},
                      {value: "Cartão de Crédito", label: "Cartão de Crédito"},
                      {value: "Cartão de Débito", label: "Cartão de Débito"},
                      {value: "Cheque", label: "Cheque"},
                      {value: "Criptomoeda", label: "Criptomoeda"},
                      {value: "Depósito Bancário", label: "Depósito Bancário"},
                      {value: "Pix", label: "Pix"},
                      {value: "Dinheiro", label: "Dinheiro"},
                      {value: "Transferência", label: "Transferência"}
                    ]} 
                  />
                  <FilterColumn 
                    label="Pago?" 
                    fieldKey="paid" 
                    type="select"
                    sortable={false}
                    options={[
                      {value: "true", label: "Pago"},
                      {value: "false", label: "Pendente"}
                    ]} 
                  />
                  <th style={{ width: "60px" }}>
                    <div className="receipt-list-page__column-header"></div>
                  </th>
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
                      <td style={{ fontWeight: 600 }}>{formatCurrency(item.value)}</td>
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
                Mostrando <strong>{startIndex + 1}</strong> a <strong>{endIndex}</strong> de <strong>{totalItems}</strong> recebimentos
              </div>
              <div className="receipt-list-page__pagination-controls">
                <button 
                  className="receipt-list-page__pagination-arrow"
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
                  className="receipt-list-page__pagination-arrow"
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
      </div>

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
