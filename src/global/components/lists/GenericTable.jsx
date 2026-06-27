import React from "react";
import { Link } from "react-router-dom";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { resolveBadge, getColumnValue, getRowKey } from "./listHelpers";
import "./GenericTable.css";

const variantClassMap = {
  success: "generic-table__badge--success",
  info: "generic-table__badge--info",
  warning: "generic-table__badge--warning",
  danger: "generic-table__badge--danger",
  neutral: "generic-table__badge--neutral",
  surface: "generic-table__badge--surface",
};

const GenericTable = ({
  columns = [],
  data = [],
  rowKey = "id",
  rowActions = [],
  styleActions = [],
  sortConfig = null,
  onSortChange,
  className = "",
  emptyLabel = "Sem dados para exibir.",
}) => {
  const actionList =
    typeof rowActions === "function" ? rowActions : () => rowActions;
  const showActionsColumn = Array.isArray(rowActions)
    ? rowActions.length > 0
    : typeof rowActions === "function";

  const handleSortToggle = (column) => {
    if (!column?.sortable || typeof onSortChange !== "function") {
      return;
    }

    onSortChange(column);
  };

  const resolveSortIcon = (column) => {
    if (!column?.sortable) {
      return null;
    }

    const isActive = sortConfig?.key === column.key;

    if (!isActive) {
      return <FaSort aria-hidden="true" className="generic-table__head-icon" />;
    }

    return sortConfig.direction === "desc" ? (
      <FaSortDown
        aria-hidden="true"
        className="generic-table__head-icon generic-table__head-icon--active"
      />
    ) : (
      <FaSortUp
        aria-hidden="true"
        className="generic-table__head-icon generic-table__head-icon--active"
      />
    );
  };

  return (
    <div className={`generic-table ${className}`.trim()}>
      <div className="generic-table__scroll">
        <table className="generic-table__table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "generic-table__head-cell",
                    column.sortable ? "generic-table__head-cell--sortable" : "",
                    sortConfig?.key === column.key
                      ? "generic-table__head-cell--sorted"
                      : "",
                    sortConfig?.key === column.key &&
                    sortConfig?.direction === "asc"
                      ? "generic-table__head-cell--sorted-asc"
                      : "",
                    sortConfig?.key === column.key &&
                    sortConfig?.direction === "desc"
                      ? "generic-table__head-cell--sorted-desc"
                      : "",
                    column.align
                      ? `generic-table__head-cell--${column.align}`
                      : "",
                    column.className ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={column.width ? { width: column.width } : undefined}
                  scope="col"
                  aria-sort={
                    sortConfig?.key === column.key
                      ? sortConfig.direction === "desc"
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="generic-table__head-button"
                      onClick={() => handleSortToggle(column)}
                      aria-label={`Ordenar por ${column.header ?? column.label ?? column.key}`}
                      title={`Ordenar por ${column.header ?? column.label ?? column.key}`}
                    >
                      <span>{column.header ?? column.label}</span>
                      {resolveSortIcon(column)}
                    </button>
                  ) : (
                    (column.header ?? column.label)
                  )}
                </th>
              ))}
              {showActionsColumn ? (
                <th
                  className="generic-table__head-cell generic-table__head-cell--actions"
                  scope="col"
                >
                  Ações
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  className="generic-table__empty-cell"
                  colSpan={columns.length + (showActionsColumn ? 1 : 0)}
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const actionsForRow = actionList(row, rowIndex) || [];

                return (
                  <tr
                    key={getRowKey(row, rowKey, rowIndex)}
                    className="generic-table__row"
                  >
                    {columns.map((column) => {
                      const value = getColumnValue(row, column, rowIndex);
                      const badge =
                        column.type === "badge"
                          ? resolveBadge(value, column)
                          : null;

                      return (
                        <td
                          key={column.key}
                          className={[
                            "generic-table__cell",
                            column.align
                              ? `generic-table__cell--${column.align}`
                              : "",
                            column.className ?? "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {typeof column.render === "function" ? (
                            column.render(value, row, rowIndex)
                          ) : badge ? (
                            <span
                              className={`generic-table__badge ${variantClassMap[badge.variant] ?? variantClassMap.neutral}`}
                            >
                              {badge.icon ? (
                                <badge.icon aria-hidden="true" />
                              ) : null}
                              <span>{badge.label}</span>
                            </span>
                          ) : (
                            <span className="generic-table__text">
                              {value ?? "-"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {showActionsColumn ? (
                      <td className="generic-table__cell generic-table__cell--actions">
                        <div className="generic-table__actions">
                          {actionsForRow.map((action) => {
                            const ActionIcon = action.icon;
                            const actionKey = action.key ?? action.label;
                            const iconOnly =
                              action.iconOnly ?? Boolean(ActionIcon);
                            const actionLabel =
                              action.title ?? action.label ?? "Ação";

                            if (action.href) {
                              const resolvedHref =
                                typeof action.href === "function"
                                  ? action.href(row, rowIndex)
                                  : action.href;

                              return (
                                <Link
                                  key={actionKey}
                                  className={`generic-table__action generic-table__action--${action.variant ?? "ghost"} ${iconOnly ? "generic-table__action--icon-only" : ""}`.trim()}
                                  to={resolvedHref}
                                  title={actionLabel}
                                  aria-label={actionLabel}
                                >
                                  {ActionIcon ? (
                                    <ActionIcon aria-hidden="true" />
                                  ) : null}
                                  {iconOnly ? null : (
                                    <span>{action.label}</span>
                                  )}
                                </Link>
                              );
                            }

                            return (
                              <button
                                key={actionKey}
                                type="button"
                                className={`generic-table__action generic-table__action--${action.variant ?? "ghost"} ${iconOnly ? "generic-table__action--icon-only" : ""}`.trim()}
                                onClick={() => action.onClick?.(row, rowIndex)}
                                title={actionLabel}
                                aria-label={actionLabel}
                              >
                                {ActionIcon ? (
                                  <ActionIcon aria-hidden="true" />
                                ) : null}
                                {iconOnly ? null : <span>{action.label}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
