import React from "react";
import {
  FaCalculator,
  FaCheck,
  FaCheckCircle,
  FaEllipsisV,
  FaMoneyBillWave,
  FaRegCircle,
  FaTimes,
} from "react-icons/fa";
import FinanceSelect from "../../../components/form/FinanceSelect.jsx";
import FinanceTable from "../../../components/table/FinanceTable.jsx";
import {
  CATEGORIES,
  EXPENSE_TABLE_COLUMNS,
  PAYMENT_MODES,
  PAYMENT_TYPES,
} from "../../expenselist/expenseList.constants.js";
import {
  formatCurrency,
  formatDate,
  formatMonth,
  formatDateFilterMask,
} from "../../expenselist/utils/expenseList.utils.js";
import "../../expenselist/components/ExpenseTable.css";

export default function ReceiptTable({
  visibleRows,
  month,
  sort,
  onSort,
  inlineFilters,
  onInlineFilterChange,
  onClearFilters,
  hasFilters,
  calculatorOpen,
  onOpenCalculator,
  menuRowId,
  onToggleRowMenu,
  onTogglePaid,
}) {
  const filterRow = (
    <tr className="expense-table__filter-row">
      <th>
        <input
          type="text"
          placeholder="MM/AAAA"
          value={inlineFilters.date}
          onChange={(event) => onInlineFilterChange("date", formatDateFilterMask(event.target.value))}
          aria-label="Filtrar por data"
        />
      </th>
      <th>
        <input
          type="search"
          value={inlineFilters.description}
          onChange={(event) =>
            onInlineFilterChange("description", event.target.value)
          }
          placeholder="Pesquisar"
          aria-label="Filtrar por descrição"
        />
      </th>
      <th>
        <input
          type="search"
          value={inlineFilters.payee}
          onChange={(event) =>
            onInlineFilterChange("payee", event.target.value)
          }
          placeholder="Pesquisar"
          aria-label="Filtrar por cliente"
        />
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.category}
          onChange={(event) =>
            onInlineFilterChange("category", event.target.value)
          }
          aria-label="Filtrar por categoria"
        >
          <option value="">Todas</option>
          {CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </FinanceSelect>
      </th>
      <th>
        <div className="expense-table__value-filter" data-expense-calculator>
          <input
            type="text"
            inputMode="decimal"
            value={inlineFilters.value}
            onChange={(event) =>
              onInlineFilterChange("value", event.target.value)
            }
            placeholder="0,00"
            aria-label="Filtrar por valor"
          />
          <button
            type="button"
            className={`expense-table__calculator-trigger ${calculatorOpen ? "is-open" : ""}`.trim()}
            onClick={onOpenCalculator}
            aria-label="Abrir calculadora de valor"
          >
            <FaCalculator aria-hidden="true" />
          </button>
        </div>
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.paymentType}
          onChange={(event) =>
            onInlineFilterChange("paymentType", event.target.value)
          }
          aria-label="Filtrar por tipo de pagamento"
        >
          <option value="">Todos</option>
          {PAYMENT_TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </FinanceSelect>
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.paymentMode}
          onChange={(event) =>
            onInlineFilterChange("paymentMode", event.target.value)
          }
          aria-label="Filtrar por modo de pagamento"
        >
          <option value="">Todos</option>
          {PAYMENT_MODES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </FinanceSelect>
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.paid}
          onChange={(event) => onInlineFilterChange("paid", event.target.value)}
          aria-label="Filtrar por status"
        >
          <option value="">Todos</option>
          <option value="paid">Recebidos</option>
          <option value="pending">Pendentes</option>
        </FinanceSelect>
      </th>
      <th></th>
    </tr>
  );

  return (
    <FinanceTable
      columns={EXPENSE_TABLE_COLUMNS}
      sort={sort}
      onSort={onSort}
      filterRow={filterRow}
      hasRows={visibleRows.length > 0}
      ariaLabel="Tabela de recebimentos"
      tableClassName="expense-table"
      mobileMinWidth="920px"
      emptyState={
        <div className="finance-table__empty-state">
          <div className="expense-table__empty-icon">
            <FaMoneyBillWave aria-hidden="true" />
          </div>
          <h2>Nenhum recebimento neste período</h2>
          <p>
            {hasFilters
              ? "Não encontramos recebimentos com os filtros aplicados."
              : `Ainda não há recebimentos registrados em ${formatMonth(month)}.`}
          </p>
          {hasFilters ? (
            <button type="button" onClick={onClearFilters}>Limpar filtros</button>
          ) : null}
        </div>
      }
    >
      {visibleRows.map((receipt) => {
        if (!receipt) return null;
        return (
        <tr key={receipt.id}>
          <td>{formatDate(receipt.date)}</td>
          <td className="expense-table__description">{receipt.description}</td>
          <td>{receipt.payee}</td>
          <td>{receipt.category}</td>
          <td className="expense-table__value">
            {formatCurrency(receipt.value)}
          </td>
          <td>{receipt.paymentType}</td>
          <td>{receipt.paymentMode}</td>
          <td>
            <button
              type="button"
              className={`expense-table__paid-status ${receipt.paid ? "is-paid" : "is-pending"}`}
              onClick={() => onTogglePaid(receipt)}
              aria-label={
                receipt.paid ? "Recebimento recebido" : "Recebimento pendente"
              }
            >
              {receipt.paid ? (
                <FaCheckCircle aria-hidden="true" />
              ) : (
                <FaRegCircle aria-hidden="true" />
              )}
            </button>
          </td>
          <td className="expense-table__actions-cell">
            <div className="expense-table__row-menu" data-expense-row-menu>
              <button
                type="button"
                className={`expense-table__kebab ${menuRowId === receipt.id ? "is-open" : ""}`.trim()}
                onClick={(event) => onToggleRowMenu(event, receipt.id)}
                aria-haspopup="menu"
                aria-expanded={menuRowId === receipt.id}
                aria-label={`Ações do recebimento ${receipt.description}`}
              >
                <FaEllipsisV aria-hidden="true" />
              </button>
            </div>
          </td>
        </tr>
        );
      })}
    </FinanceTable>
  );
}
