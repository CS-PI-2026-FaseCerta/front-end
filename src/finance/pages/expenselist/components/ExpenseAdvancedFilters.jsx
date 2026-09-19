import React from "react";
import FinanceDrawer from "../../../components/drawer/FinanceDrawer.jsx";
import FinanceField from "../../../components/form/FinanceField.jsx";
import "./ExpenseAdvancedFilters.css";

export default function ExpenseAdvancedFilters({
  isOpen,
  values,
  onChange,
  onClear,
  onClose,
}) {
  const update = (key, value) => {
    onChange((current) => ({ ...current, [key]: value }));
  };

  return (
    <FinanceDrawer
      isOpen={isOpen}
      title="Filtros avançados"
      ariaLabel="Filtros avançados"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="finance-button finance-button--secondary"
            onClick={onClear}
          >
            Limpar filtros
          </button>
          <button
            type="button"
            className="finance-button finance-button--primary"
            onClick={onClose}
          >
            Aplicar filtros
          </button>
        </>
      }
    >
      <div className="expense-advanced-filters__grid">
        <FinanceField label="Data inicial">
          <input
            type="date"
            value={values.dateFrom}
            onChange={(event) => update("dateFrom", event.target.value)}
          />
        </FinanceField>
        <FinanceField label="Data final">
          <input
            type="date"
            value={values.dateTo}
            onChange={(event) => update("dateTo", event.target.value)}
          />
        </FinanceField>
      </div>

    </FinanceDrawer>
  );
}
