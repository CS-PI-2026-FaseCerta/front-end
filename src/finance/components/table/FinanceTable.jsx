import React from "react";
import "./FinanceTable.css";

export default function FinanceTable({
  columns,
  sort,
  onSort,
  filterRow = null,
  children,
  hasRows = true,
  emptyState = null,
  ariaLabel,
  className = "",
  tableClassName = "",
  mobileMinWidth = "920px",
}) {
  return (
    <div className={`finance-table-shell ${className}`.trim()}>
      <div className="finance-table-scroll">
        <table
          className={`finance-table ${tableClassName}`.trim()}
          aria-label={ariaLabel}
          style={{ "--finance-table-mobile-min-width": mobileMinWidth }}
        >
          <thead>
            <tr className="finance-table__header-row">
              {columns.map((column) => {
                const isSortable = column.sortable !== false && Boolean(column.key);
                const isSorted = isSortable && sort?.key === column.key;
                return (
                  <th
                    key={column.key ?? column.label}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    aria-label={column.ariaLabel}
                    aria-sort={
                      isSortable
                        ? isSorted
                          ? sort.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        className="finance-table__sort-button"
                        onClick={() => onSort?.(column.key)}
                      >
                        {column.label}
                        <span className={isSorted ? "is-sorted" : ""} aria-hidden="true">↕</span>
                      </button>
                    ) : (
                      column.label ?? null
                    )}
                  </th>
                );
              })}
            </tr>
            {filterRow}
          </thead>
          <tbody>
            {hasRows ? children : (
              <tr>
                <td colSpan={columns.length} className="finance-table__empty-cell">
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
