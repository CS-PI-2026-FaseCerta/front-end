import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import Header from "../header/Header.jsx";
import EmptyState from "./EmptyState";
import GenericTable from "./GenericTable";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  filterRows,
  paginateRows,
} from "./listHelpers";
import "./GenericListPage.css";

const GenericListPage = ({
  title,
  description,
  columns = [],
  data = [],
  filters = [],
  actions = [],
  rowActions = [],
  emptyState = {},
  loading = false,
  error = null,
  totalItems,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  initialPageSize = DEFAULT_PAGE_SIZE,
  clientSide = true,
  showHeader = true,
  HeaderComponent = Header,
  onRetry,
  onQueryChange,
  onPageChange,
  onPageSizeChange,
  className = "",
  rowKey = "id",
  search = {},
  footerNote,
}) => {
  const [searchTerm, setSearchTerm] = useState(search.defaultValue ?? "");
  const [filterValues, setFilterValues] = useState(() =>
    filters.reduce((accumulator, filter) => {
      if (filter.defaultValue != null) {
        accumulator[filter.key] = filter.defaultValue;
      }

      return accumulator;
    }, {}),
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    onQueryChange?.({
      searchTerm,
      filters: filterValues,
      page,
      pageSize,
    });
  }, [filterValues, onQueryChange, page, pageSize, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterValues, pageSize]);

  const processedRows = useMemo(() => {
    if (!clientSide) {
      const safeTotalItems = Number(totalItems ?? data.length) || 0;
      const safeTotalPages = Math.max(1, Math.ceil(safeTotalItems / pageSize));

      return {
        rows: data,
        totalItems: safeTotalItems,
        totalPages: safeTotalPages,
        page: Math.min(page, safeTotalPages),
        pageSize,
      };
    }

    const filteredRows = filterRows(data, columns, searchTerm, filterValues);
    return paginateRows(filteredRows, page, pageSize);
  }, [
    clientSide,
    columns,
    data,
    filterValues,
    page,
    pageSize,
    searchTerm,
    totalItems,
  ]);

  const currentRows = processedRows.rows ?? [];
  const resolvedTotalItems = processedRows.totalItems ?? currentRows.length;
  const totalPages = processedRows.totalPages ?? 1;
  const currentPage = processedRows.page ?? 1;
  const currentPageSize = processedRows.pageSize ?? pageSize;
  const startItem =
    resolvedTotalItems === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
  const endItem =
    resolvedTotalItems === 0
      ? 0
      : Math.min(startItem + currentRows.length - 1, resolvedTotalItems);

  const searchPlaceholder = search.placeholder ?? "Buscar registros";
  const isEmpty = !loading && !error && currentRows.length === 0;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilterValues((current) => ({
      ...current,
      [filterKey]: value,
    }));
    setPage(1);
  };

  const handlePreviousPage = () => {
    const nextPage = Math.max(1, currentPage - 1);
    setPage(nextPage);
    onPageChange?.(nextPage);
  };

  const handleNextPage = () => {
    const nextPage = Math.min(totalPages, currentPage + 1);
    setPage(nextPage);
    onPageChange?.(nextPage);
  };

  const handlePageSizeChange = (event) => {
    const nextPageSize = Number(event.target.value);
    setPageSize(nextPageSize);
    setPage(1);
    onPageSizeChange?.(nextPageSize);
  };

  return (
    <div className={`generic-list-page ${className}`.trim()}>
      {showHeader ? <HeaderComponent /> : null}

      <main className="generic-list-page__main">
        <section className="generic-list-page__hero">
          <div className="generic-list-page__hero-copy">
            <span className="generic-list-page__eyebrow">Listagem</span>
            <h1 className="generic-list-page__title">{title}</h1>
            {description ? (
              <p className="generic-list-page__description">{description}</p>
            ) : null}
          </div>

          <div className="generic-list-page__hero-actions">
            {actions.map((action) => {
              const ActionIcon = action.icon;
              const actionKey = action.key ?? action.label;

              if (action.href) {
                const resolvedHref =
                  typeof action.href === "function"
                    ? action.href()
                    : action.href;

                return (
                  <Link
                    key={actionKey}
                    to={resolvedHref}
                    className={`generic-list-page__action generic-list-page__action--${action.variant ?? "primary"}`}
                  >
                    {ActionIcon ? <ActionIcon aria-hidden="true" /> : null}
                    <span>{action.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={actionKey}
                  type="button"
                  className={`generic-list-page__action generic-list-page__action--${action.variant ?? "primary"}`}
                  onClick={action.onClick}
                >
                  {ActionIcon ? <ActionIcon aria-hidden="true" /> : null}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="generic-list-page__panel">
          <div className="generic-list-page__toolbar">
            <label className="generic-list-page__search">
              <span className="generic-list-page__field-label">Busca</span>
              <div className="generic-list-page__search-control">
                <FaSearch aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                />
              </div>
            </label>

            {filters.length > 0 ? (
              <div
                className="generic-list-page__filters"
                aria-label="Filtros da listagem"
              >
                {filters.map((filter) => {
                  const value = filterValues[filter.key] ?? "";

                  return (
                    <label
                      key={filter.key}
                      className="generic-list-page__filter"
                    >
                      <span className="generic-list-page__field-label">
                        {filter.label}
                      </span>
                      {filter.type === "select" ? (
                        <select
                          value={value}
                          onChange={(event) =>
                            handleFilterChange(filter.key, event.target.value)
                          }
                        >
                          <option value="">
                            {filter.placeholder ?? "Todos"}
                          </option>
                          {filter.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : filter.type === "date" ? (
                        <input
                          type="date"
                          value={value}
                          onChange={(event) =>
                            handleFilterChange(filter.key, event.target.value)
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={(event) =>
                            handleFilterChange(filter.key, event.target.value)
                          }
                          placeholder={filter.placeholder ?? filter.label}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>

          {error ? (
            <EmptyState
              icon={FaExclamationTriangle}
              title={error.title ?? "Não foi possível carregar os dados"}
              description={
                error.message ??
                "Tente novamente em instantes ou revise a integração com a API."
              }
              actionLabel={error.actionLabel ?? "Tentar novamente"}
              onAction={onRetry}
              secondaryActionLabel={error.secondaryActionLabel}
              onSecondaryAction={error.onSecondaryAction}
            />
          ) : loading ? (
            <div className="generic-list-page__loading" aria-live="polite">
              <div className="generic-list-page__loading-header" />
              <div className="generic-list-page__loading-row" />
              <div className="generic-list-page__loading-row" />
              <div className="generic-list-page__loading-row" />
            </div>
          ) : isEmpty ? (
            <EmptyState
              icon={emptyState.icon}
              title={emptyState.title ?? "Nenhum registro encontrado"}
              description={
                emptyState.description ??
                "Quando houver registros disponíveis, eles aparecerão nesta tabela."
              }
              actionLabel={emptyState.actionLabel}
              actionHref={emptyState.actionHref}
              onAction={emptyState.onAction}
            />
          ) : (
            <GenericTable
              columns={columns}
              data={currentRows}
              rowKey={rowKey}
              rowActions={rowActions}
            />
          )}

          <div className="generic-list-page__footer">
            <div className="generic-list-page__footer-summary">
              <span className="generic-list-page__footer-label">Mostrando</span>
              <strong>
                {resolvedTotalItems === 0 ? 0 : startItem} - {endItem}
              </strong>
              <span>de</span>
              <strong>{resolvedTotalItems}</strong>
              <span>itens</span>
            </div>

            <div className="generic-list-page__footer-controls">
              <label className="generic-list-page__page-size">
                <span className="generic-list-page__field-label">
                  Itens por página
                </span>
                <select value={currentPageSize} onChange={handlePageSizeChange}>
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div
                className="generic-list-page__pagination"
                aria-label="Paginação da listagem"
              >
                <button
                  type="button"
                  className="generic-list-page__pagination-button"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                >
                  <FaArrowLeft aria-hidden="true" />
                  <span>Anterior</span>
                </button>

                <span className="generic-list-page__pagination-status">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  type="button"
                  className="generic-list-page__pagination-button generic-list-page__pagination-button--next"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                >
                  <span>Próxima</span>
                </button>
              </div>
            </div>
          </div>

          {footerNote ? (
            <p className="generic-list-page__note">{footerNote}</p>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default GenericListPage;
