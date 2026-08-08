import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaFilter, FaSearch, FaEllipsisV, FaCheck, FaRegCircle, FaExclamationTriangle, FaSort, FaTimes, FaInfoCircle } from "react-icons/fa";
import { receivablesMockData } from "./receivablesMock";
import { applyReceivablesFilters } from "./receivablesFilters";
import { formatCurrency } from "../../../utils/maskUtils";
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
  const [currentMonth, setCurrentMonth] = useState(5); // 1-12
  const [currentYear, setCurrentYear] = useState(2026);

  // Filtros - Rascunho e Aplicados
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const tableContainerRef = useRef(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Ordenação
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fechar menu ao clicar fora ou apertar Escape ou fazer scroll
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

    const handleScroll = () => {
      if (activeMenuId !== null) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    
    const tableEl = tableContainerRef.current;
    if (tableEl) {
      tableEl.addEventListener("scroll", handleScroll);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (tableEl) {
        tableEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeMenuId]);

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

  const handleDraftChangeCurrency = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: formatCurrency(value) }));
  };

  const applyAllFilters = () => {
    setAppliedFilters({ ...draftFilters });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setDraftFilters({ ...initialFilters });
    setAppliedFilters({ ...initialFilters });
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

  const formatCurrencyLabel = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Ações
  const openMenu = (id, event) => {
    event.stopPropagation();
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left - 150 + window.scrollX // Adjust for menu width so it doesn't spill off screen
      });
      setActiveMenuId(id);
    }
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
    const newItem = { ...item, id: Date.now(), date: item.date };
    setData((prev) => [newItem, ...prev]);
    setActiveMenuId(null);
  };

  const genericAction = () => {
    setActiveMenuId(null);
  };

  // Opções dos selects
  const categoryOptions = ["Ordem de Serviço", "Mensalidade", "Vendas", "Consultoria", "Contrato", "Treinamento", "Serviço Avulso", "Projeto"];
  const paymentTypeOptions = ["À vista", "Parcelado", "Recorrente"];
  const paymentMethodOptions = ["Indefinido", "Boleto", "Carteira Digital", "Cartão Pré-pago", "Cartão de Crédito", "Cartão de Débito", "Cheque", "Criptomoeda", "Depósito Bancário", "Pix", "Dinheiro", "Transferência"];

  return (
    <div className="receipt-list-page">
      <div className="receipt-list-page__card">
        
        {/* Topo: Título FINANCEIRO */}
        <div className="receipt-list-page__top-section">
          <div className="receipt-list-page__title-group">
            <h1 className="receipt-list-page__title">FINANCEIRO</h1>
            <div className="receipt-list-page__tooltip-trigger" tabIndex={0} aria-label="Informações do Financeiro">
              <FaInfoCircle className="receipt-list-page__info-icon" />
              <div className="receipt-list-page__tooltip" role="tooltip">
                Gerencie recebimentos, despesas e transferências financeiras da empresa.
              </div>
            </div>
          </div>
        </div>

        {/* Controles: Meses e Abas */}
        <header className="receipt-list-page__header">
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

        {/* Tabela */}
        <main className="receipt-list-page__table-container">
          <div className="receipt-list-page__table-scroll" ref={tableContainerRef}>
            <table className="receipt-list-page__table">
              <thead>
                <tr>
                  {/* Data */}
                  <th>
                    <div className="receipt-list-page__column-header">
                      <span>Data</span>
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <input type="date" value={draftFilters.date} onChange={(e) => handleDraftChange("date", e.target.value)} aria-label="Filtro de Data" />
                    </div>
                  </th>
                  
                  {/* Descrição */}
                  <th>
                    <div className="receipt-list-page__column-header receipt-list-page__column-header--sortable" onClick={() => handleSort("description")} role="button" tabIndex={0}>
                      <span>Descrição</span>
                      <FaSort className="receipt-list-page__sort-icon" />
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <input type="text" value={draftFilters.description} onChange={(e) => handleDraftChange("description", e.target.value)} aria-label="Filtro de Descrição" />
                    </div>
                  </th>

                  {/* Recebido de */}
                  <th>
                    <div className="receipt-list-page__column-header receipt-list-page__column-header--sortable" onClick={() => handleSort("client")} role="button" tabIndex={0}>
                      <span>Recebido de</span>
                      <FaSort className="receipt-list-page__sort-icon" />
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <input type="text" value={draftFilters.client} onChange={(e) => handleDraftChange("client", e.target.value)} aria-label="Filtro de Cliente" />
                    </div>
                  </th>

                  {/* Categoria */}
                  <th>
                    <div className="receipt-list-page__column-header receipt-list-page__column-header--sortable" onClick={() => handleSort("category")} role="button" tabIndex={0}>
                      <span>Categoria</span>
                      <FaSort className="receipt-list-page__sort-icon" />
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <select value={draftFilters.category} onChange={(e) => handleDraftChange("category", e.target.value)} aria-label="Filtro de Categoria">
                        <option value=""></option>
                        {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </th>

                  {/* Valor */}
                  <th>
                    <div className="receipt-list-page__column-header receipt-list-page__column-header--sortable" onClick={() => handleSort("value")} role="button" tabIndex={0}>
                      <span>Valor</span>
                      <FaSort className="receipt-list-page__sort-icon" />
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <input type="text" placeholder="R$ 0,00" value={draftFilters.value} onChange={(e) => handleDraftChangeCurrency("value", e.target.value)} aria-label="Filtro de Valor" />
                    </div>
                  </th>

                  {/* Tipo de pagamento */}
                  <th>
                    <div className="receipt-list-page__column-header receipt-list-page__column-header--sortable" onClick={() => handleSort("paymentType")} role="button" tabIndex={0}>
                      <span>Tipo pagamento</span>
                      <FaSort className="receipt-list-page__sort-icon" />
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <select value={draftFilters.paymentType} onChange={(e) => handleDraftChange("paymentType", e.target.value)} aria-label="Filtro de Tipo de pagamento">
                        <option value=""></option>
                        {paymentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </th>

                  {/* Modo de pagamento */}
                  <th>
                    <div className="receipt-list-page__column-header receipt-list-page__column-header--sortable" onClick={() => handleSort("paymentMethod")} role="button" tabIndex={0}>
                      <span>Modo pagamento</span>
                      <FaSort className="receipt-list-page__sort-icon" />
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <select value={draftFilters.paymentMethod} onChange={(e) => handleDraftChange("paymentMethod", e.target.value)} aria-label="Filtro de Modo de pagamento">
                        <option value=""></option>
                        {paymentMethodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </th>

                  {/* Pago? */}
                  <th>
                    <div className="receipt-list-page__column-header">
                      <span>Pago?</span>
                    </div>
                    <div className="receipt-list-page__column-filter">
                      <select value={draftFilters.paid} onChange={(e) => handleDraftChange("paid", e.target.value)} aria-label="Filtro de Pago">
                        <option value=""></option>
                        <option value="true">Pago</option>
                        <option value="false">Pendente</option>
                      </select>
                    </div>
                  </th>

                  {/* Coluna Ações (Filtros Globais) */}
                  <th style={{ width: "80px" }}>
                    <div className="receipt-list-page__column-header"></div>
                    <div className="receipt-list-page__column-filter receipt-list-page__global-filter-actions">
                      <button 
                        className="receipt-list-page__filter-btn receipt-list-page__filter-btn--apply"
                        onClick={applyAllFilters}
                        aria-label="Aplicar todos os filtros"
                        title="Aplicar filtros"
                      >
                        <FaCheck size={10} />
                      </button>
                      <button 
                        className="receipt-list-page__filter-btn receipt-list-page__filter-btn--clear"
                        onClick={clearAllFilters}
                        aria-label="Limpar todos os filtros"
                        title="Limpar filtros"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
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
                      <td>{formatDateLabel(item.date)}</td>
                      <td>{item.description}</td>
                      <td>{item.client}</td>
                      <td>{item.category}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrencyLabel(item.value)}</td>
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

      {/* Dropdown Menu rendered absolutely on top of everything */}
      {activeMenuId && (
        <div 
          className="receipt-list-page__dropdown-portal" 
          ref={menuRef} 
          role="menu"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Gerar recibo</button>
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Editar detalhes</button>
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Detalhar valor</button>
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Anexos</button>
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={() => handleDuplicateClick(data.find(i => i.id === activeMenuId))}>Duplicar</button>
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Mover para ...</button>
          <div className="receipt-list-page__dropdown-divider" />
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Tornar recorrente...</button>
          <div className="receipt-list-page__dropdown-divider" />
          <button className="receipt-list-page__dropdown-item" role="menuitem" onClick={genericAction}>Parcelar...</button>
          <div className="receipt-list-page__dropdown-divider" />
          <button className="receipt-list-page__dropdown-item receipt-list-page__dropdown-item--danger" role="menuitem" onClick={() => handleDeleteClick(data.find(i => i.id === activeMenuId))}>Excluir</button>
        </div>
      )}

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
