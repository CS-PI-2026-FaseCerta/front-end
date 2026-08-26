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
} from "../expenseList.constants.js";
import { formatCurrency, formatDate, formatMonth, formatDateFilterMask } from "../utils/expenseList.utils.js";
import "./ExpenseTable.css";

export default function ExpenseTable({
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
          onChange={(event) => onInlineFilterChange("description", event.target.value)}
          placeholder="Pesquisar"
          aria-label="Filtrar por descrição"
        />
      </th>
      <th>
        <input
          type="search"
          value={inlineFilters.payee}
          onChange={(event) => onInlineFilterChange("payee", event.target.value)}
          placeholder="Pesquisar"
          aria-label="Filtrar por favorecido"
        />
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.category}
          onChange={(event) => onInlineFilterChange("category", event.target.value)}
          aria-label="Filtrar por categoria"
        >
          <option value="">Todas</option>
          {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
        </FinanceSelect>
      </th>
      <th>
        <div className="expense-table__value-filter" data-expense-calculator>
          <input
            type="text"
            inputMode="decimal"
            value={inlineFilters.value}
            onChange={(event) => onInlineFilterChange("value", event.target.value)}
            placeholder="0,00"
            aria-label="Filtrar por valor"
          />
          <button
            type="button"
            className={`expense-table__calculator-trigger ${calculatorOpen ? "is-open" : ""}`.trim()}
            onClick={onOpenCalculator}
            title="Abrir calculadora"
            aria-label="Abrir calculadora de valor"
            aria-expanded={calculatorOpen}
          >
            <FaCalculator aria-hidden="true" />
          </button>
        </div>
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.paymentType}
          onChange={(event) => onInlineFilterChange("paymentType", event.target.value)}
          aria-label="Filtrar por tipo de pagamento"
        >
          <option value="">Todos</option>
          {PAYMENT_TYPES.map((type) => <option key={type}>{type}</option>)}
        </FinanceSelect>
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.paymentMode}
          onChange={(event) => onInlineFilterChange("paymentMode", event.target.value)}
          aria-label="Filtrar por modo de pagamento"
        >
          <option value="">Todos</option>
          {PAYMENT_MODES.map((mode) => <option key={mode}>{mode}</option>)}
        </FinanceSelect>
      </th>
      <th>
        <FinanceSelect
          value={inlineFilters.paid}
          onChange={(event) => onInlineFilterChange("paid", event.target.value)}
          aria-label="Filtrar por status de pagamento"
        >
          <option value="">Todos</option>
          <option value="paid">Pagas</option>
          <option value="pending">Pendentes</option>
        </FinanceSelect>
      </th>
      <th></th>
    </tr>
  );

  const emptyState = (
    <div className="finance-table__empty-state">
      <div className="expense-table__empty-icon">
        <FaMoneyBillWave aria-hidden="true" />
      </div>
      <h2>Nenhuma despesa neste período</h2>
      <p>
        {hasFilters
          ? "Não encontramos despesas com os filtros aplicados."
          : `Ainda não há despesas registradas em ${formatMonth(month)}.`}
      </p>
      {hasFilters ? (
        <button type="button" onClick={onClearFilters}>Limpar filtros</button>
      ) : null}
    </div>
  );

  return (
    <FinanceTable
      columns={EXPENSE_TABLE_COLUMNS}
      sort={sort}
      onSort={onSort}
      filterRow={filterRow}
      hasRows={visibleRows.length > 0}
      emptyState={emptyState}
      ariaLabel="Tabela de despesas"
      tableClassName="expense-table"
      mobileMinWidth="920px"
    >
      {visibleRows.map((expense) => {
        if (!expense) return null;
        return (
          <tr key={expense.id}>
            <td>{formatDate(expense.date)}</td>
            <td className="expense-table__description">{expense.description}</td>
          <td>{expense.payee}</td>
          <td>{expense.category}</td>
          <td className="expense-table__value">{formatCurrency(expense.value)}</td>
          <td>{expense.paymentType}</td>
          <td>{expense.paymentMode}</td>
          <td>
            <button
              type="button"
              className={`expense-table__paid-status ${expense.paid ? "is-paid" : "is-pending"}`}
              onClick={() => onTogglePaid(expense)}
              title={expense.paid ? "Marcar como pendente" : "Marcar como paga"}
              aria-label={expense.paid ? "Despesa paga" : "Despesa pendente"}
            >
              {expense.paid
                ? <FaCheckCircle aria-hidden="true" />
                : <FaRegCircle aria-hidden="true" />}
            </button>
          </td>
          <td className="expense-table__actions-cell">
            <div className="expense-table__row-menu" data-expense-row-menu>
              <button
                type="button"
                className={`expense-table__kebab ${menuRowId === expense.id ? "is-open" : ""}`.trim()}
                onClick={(event) => onToggleRowMenu(event, expense.id)}
                aria-haspopup="menu"
                aria-expanded={menuRowId === expense.id}
                aria-label={`Ações da despesa ${expense.description}`}
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
