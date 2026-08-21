import React from "react";
import {
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
    TRANSFER_TABLE_COLUMNS,
} from "../transferList.constants.js";
import {
    formatCurrency,
    formatDate,
    formatMonth,
} from "../utils/transferList.utils.js";
import "./TransferTable.css";

export default function TransferTable({
    visibleRows,
    month,
    sort,
    onSort,
    draftInlineFilters,
    onInlineFilterChange,
    onApplyInlineFilters,
    onClearFilters,
    hasPendingInlineChanges,
    hasFilters,
    hasDraftInlineFilters,
    menuRowId,
    onToggleRowMenu,
    onTogglePaid,
    onRegisterTransfer,
}) {
    const filterRow = (
        <tr
            className="transfer-table__filter-row"
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    onApplyInlineFilters();
                }
            }}
        >
            <th>
                <input
                    type="date"
                    value={draftInlineFilters.date}
                    onChange={(event) =>
                        onInlineFilterChange(
                            "date",
                            event.target.value,
                        )
                    }
                    aria-label="Filtrar por data"
                />
            </th>

            <th>
                <input
                    type="search"
                    value={
                        draftInlineFilters.description
                    }
                    onChange={(event) =>
                        onInlineFilterChange(
                            "description",
                            event.target.value,
                        )
                    }
                    placeholder="Pesquisar"
                    aria-label="Filtrar por descrição"
                />
            </th>

            <th>
                <input
                    type="search"
                    value={
                        draftInlineFilters.originAccount
                    }
                    onChange={(event) =>
                        onInlineFilterChange(
                            "originAccount",
                            event.target.value,
                        )
                    }
                    placeholder="Pesquisar"
                    aria-label="Filtrar por conta de origem"
                />
            </th>

            <th>
                <input
                    type="search"
                    value={
                        draftInlineFilters.destinationAccount
                    }
                    onChange={(event) =>
                        onInlineFilterChange(
                            "destinationAccount",
                            event.target.value,
                        )
                    }
                    placeholder="Pesquisar"
                    aria-label="Filtrar por conta de destino"
                />
            </th>

            <th>
                <input
                    type="text"
                    inputMode="decimal"
                    value={draftInlineFilters.value}
                    onChange={(event) =>
                        onInlineFilterChange(
                            "value",
                            event.target.value,
                        )
                    }
                    placeholder="0,00"
                    aria-label="Filtrar por valor"
                />
            </th>

            <th>
                <FinanceSelect
                    value={draftInlineFilters.paid}
                    onChange={(event) =>
                        onInlineFilterChange(
                            "paid",
                            event.target.value,
                        )
                    }
                    aria-label="Filtrar por status"
                >
                    <option value="">Todos</option>
                    <option value="paid">Efetivadas</option>
                    <option value="pending">Pendentes</option>
                </FinanceSelect>
            </th>

            <th>
                <div
                    className="transfer-table__filter-actions"
                    aria-label="Ações dos filtros inline"
                >
                    <button
                        type="button"
                        className="transfer-table__apply-filter"
                        onClick={onApplyInlineFilters}
                        title="Aplicar filtros"
                        aria-label="Aplicar filtros"
                        disabled={!hasPendingInlineChanges}
                    >
                        <FaCheck aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="transfer-table__clear-filter"
                        onClick={onClearFilters}
                        title="Limpar todos os filtros"
                        aria-label="Limpar todos os filtros"
                        disabled={
                            !hasFilters &&
                            !hasDraftInlineFilters
                        }
                    >
                        <FaTimes aria-hidden="true" />
                    </button>
                </div>
            </th>
        </tr>
    );

    const emptyState = (
        <div className="finance-table__empty-state">
            <div className="transfer-table__empty-icon">
                <FaMoneyBillWave aria-hidden="true" />
            </div>

            <h2>
                Nenhuma transferência neste período
            </h2>

            <p>
                {hasFilters
                    ? "Não encontramos transferências com os filtros aplicados."
                    : `Ainda não há transferências registradas em ${formatMonth(month)}.`}
            </p>

            {hasFilters ? (
                <button
                    type="button"
                    onClick={onClearFilters}
                >
                    Limpar filtros
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() =>
                        onRegisterTransfer?.()
                    }
                >
                    Registrar transferência
                </button>
            )}
        </div>
    );

    return (
        <FinanceTable
            columns={TRANSFER_TABLE_COLUMNS}
            sort={sort}
            onSort={onSort}
            filterRow={filterRow}
            hasRows={visibleRows.length > 0}
            emptyState={emptyState}
            ariaLabel="Tabela de transferências"
            tableClassName="transfer-table"
            mobileMinWidth="920px"
        >
            {visibleRows.map((transfer) => (
                <tr key={transfer.id}>
                    <td>
                        {formatDate(transfer.date)}
                    </td>

                    <td className="transfer-table__description">
                        {transfer.description}
                    </td>

                    <td>
                        {transfer.originAccount}
                    </td>

                    <td>
                        {transfer.destinationAccount}
                    </td>

                    <td className="transfer-table__value">
                        {formatCurrency(transfer.value)}
                    </td>

                    <td>
                        <button
                            type="button"
                            className={`transfer-table__paid-status ${transfer.paid
                                    ? "is-paid"
                                    : "is-pending"
                                }`.trim()}
                            onClick={() =>
                                onTogglePaid(transfer)
                            }
                            title={
                                transfer.paid
                                    ? "Marcar como pendente"
                                    : "Marcar como efetivada"
                            }
                            aria-label={
                                transfer.paid
                                    ? "Transferência efetivada"
                                    : "Transferência pendente"
                            }
                        >
                            {transfer.paid ? (
                                <FaCheckCircle aria-hidden="true" />
                            ) : (
                                <FaRegCircle aria-hidden="true" />
                            )}
                        </button>
                    </td>

                    <td className="transfer-table__actions-cell">
                        <div
                            className="transfer-table__row-menu"
                            data-transfer-row-menu
                        >
                            <button
                                type="button"
                                className={`transfer-table__kebab ${menuRowId === transfer.id
                                        ? "is-open"
                                        : ""
                                    }`.trim()}
                                onClick={(event) =>
                                    onToggleRowMenu(
                                        event,
                                        transfer.id,
                                    )
                                }
                                aria-haspopup="menu"
                                aria-expanded={
                                    menuRowId === transfer.id
                                }
                                aria-label={`Ações da transferência ${transfer.description}`}
                            >
                                <FaEllipsisV aria-hidden="true" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </FinanceTable>
    );
}