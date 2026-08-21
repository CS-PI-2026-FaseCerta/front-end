import React from "react";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import "./ExpenseToolbar.css";

export default function ExpenseToolbar({
  monthLabel,
  onPreviousMonth,
  onNextMonth,
  onTabChange,
  onOpenFilters,
  hasFilters,
}) {
  return (
    <div className="expense-toolbar">
      <div className="expense-toolbar__month" aria-label="Navegação por mês">
        <button type="button" onClick={onPreviousMonth} aria-label="Mês anterior">
          <FaChevronLeft aria-hidden="true" />
        </button>
        <strong>{monthLabel}</strong>
        <button type="button" onClick={onNextMonth} aria-label="Próximo mês">
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="expense-toolbar__right">
        <nav className="expense-toolbar__tabs" aria-label="Tipo de movimentação">
          <button type="button" data-tab="receipts" onClick={() => onTabChange?.("receipts")}>Recebimentos</button>
          <button type="button" data-tab="expenses" className="is-active" aria-current="page">Despesas</button>
          <button type="button" data-tab="transfers" onClick={() => onTabChange?.("transfers")}>Transferências</button>
        </nav>

        <button
          type="button"
          className={`expense-toolbar__filters ${hasFilters ? "has-filters" : ""}`.trim()}
          onClick={onOpenFilters}
        >
          <FaFilter aria-hidden="true" />
          <span>Filtros</span>
          {hasFilters ? <i aria-hidden="true" /> : null}
        </button>
      </div>
    </div>
  );
}
