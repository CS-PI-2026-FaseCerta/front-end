import React from "react";
import FinanceDrawer from "../../../components/drawer/FinanceDrawer.jsx";
import FinanceField from "../../../components/form/FinanceField.jsx";
import "./TransferAdvancedFilters.css";

export default function TransferAdvancedFilters({
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
      footer={(
        <>
          <button type="button" className="finance-button finance-button--secondary" onClick={onClear}>
            Limpar filtros
          </button>
          <button type="button" className="finance-button finance-button--primary" onClick={onClose}>
            Aplicar filtros
          </button>
        </>
      )}
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
        <FinanceField label="Valor mínimo">
          <input
            type="number"
            min="0"
            step="0.01"
            value={values.minValue}
            onChange={(event) => update("minValue", event.target.value)}
            placeholder="0,00"
          />
        </FinanceField>
        <FinanceField label="Valor máximo">
          <input
            type="number"
            min="0"
            step="0.01"
            value={values.maxValue}
            onChange={(event) => update("maxValue", event.target.value)}
            placeholder="0,00"
          />
        </FinanceField>
      </div>

      <label className="finance-checkbox-row expense-advanced-filters__attachments">
        <input
          type="checkbox"
          checked={values.onlyWithAttachments}
          onChange={(event) => update("onlyWithAttachments", event.target.checked)}
        />
        <span>Somente despesas com anexos</span>
      </label>
    </FinanceDrawer>
  );
}
