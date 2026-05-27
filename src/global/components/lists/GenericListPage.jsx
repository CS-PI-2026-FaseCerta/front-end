import React, { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import Header from "../header/Header.jsx";
import EmptyState from "./EmptyState";
import GenericTable from "./GenericTable";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  filterRows,
  paginateRows,
  sortRows,
} from "./listHelpers";
import "./GenericListPage.css";

const getVisiblePageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return Array.from(pages)
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((left, right) => left - right);
};

const normalizeSortConfig = (sortConfig, columns) => {
  if (!sortConfig?.key || !sortConfig.direction) {
    return null;
  }

  const column = columns.find((item) => item.key === sortConfig.key);

  if (!column?.sortable) {
    return null;
  }

  if (sortConfig.direction !== "asc" && sortConfig.direction !== "desc") {
    return null;
  }

  return {
    key: sortConfig.key,
    direction: sortConfig.direction,
  };
};

const getNextSortConfig = (currentSort, column) => {
  const isActiveColumn = currentSort?.key === column.key;

  if (!isActiveColumn) {
    return {
      key: column.key,
      direction: "asc",
    };
  }

  return {
    key: column.key,
    direction: currentSort.direction === "asc" ? "desc" : "asc",
  };
};

const GenericListPage = ({
  icon: Icon,
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
  defaultSort = null,
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
}) => {
  const titleTooltipId = useId();
  const [searchTerm, setSearchTerm] = useState(search.defaultValue ?? "");
  const [sortConfig, setSortConfig] = useState(() =>
    normalizeSortConfig(defaultSort, columns),
  );
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
    // TODO: quando o backend suportar ordenação remota, reaproveitar sortParams para query string.
    onQueryChange?.({
      searchTerm,
      filters: filterValues,
      page,
      pageSize,
      sort: sortConfig,
      sortKey: sortConfig?.key ?? null,
      sortDirection: sortConfig?.direction ?? null,
      sortParams: sortConfig
        ? {
            sort: sortConfig.key,
            order: sortConfig.direction,
          }
        : null,
    });
  }, [filterValues, onQueryChange, page, pageSize, searchTerm, sortConfig]);

  useEffect(() => {
    setSortConfig(normalizeSortConfig(defaultSort, columns));
  }, [defaultSort, columns]);

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
    const sortedRows = sortRows(filteredRows, columns, sortConfig);

    return paginateRows(sortedRows, page, pageSize);
  }, [
    clientSide,
    columns,
    data,
    filterValues,
    page,
    pageSize,
    sortConfig,
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
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const handleSortChange = (column) => {
    const nextSortConfig = getNextSortConfig(sortConfig, column);

    setSortConfig(nextSortConfig);
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
          <div className="generic-list-page__hero-top">
            <div
              className="generic-list-page__title-group"
              tabIndex={0}
              aria-describedby={description ? titleTooltipId : undefined}
            >
              <span className="generic-list-page__eyebrow">Listagem</span>
              <h1 className="generic-list-page__title">{title}</h1>
              {description ? (
                <span
                  className="generic-list-page__title-tooltip"
                  id={titleTooltipId}
                  role="tooltip"
                >
                  {description}
                </span>
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
          </div>

          <div className="generic-list-page__panel">
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
                icon={Icon ?? FaExclamationTriangle}
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
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
            )}

            <div className="generic-list-page__footer">
              <div className="generic-list-page__footer-summary">
                <span className="generic-list-page__footer-label">
                  Mostrando
                </span>
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
                  <select
                    value={currentPageSize}
                    onChange={handlePageSizeChange}
                  >
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
                    className="generic-list-page__pagination-arrow"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    aria-label="Página anterior"
                    title="Página anterior"
                  >
                    <FaArrowLeft aria-hidden="true" />
                  </button>

                  <div className="generic-list-page__pagination-pages">
                    {visiblePages.map((pageNumber, index) => {
                      const previousPage = visiblePages[index - 1];
                      const needsGap =
                        previousPage && pageNumber - previousPage > 1;

                      return (
                        <React.Fragment key={pageNumber}>
                          {needsGap ? (
                            <span className="generic-list-page__pagination-ellipsis">
                              ...
                            </span>
                          ) : null}
                          <button
                            type="button"
                            className={`generic-list-page__pagination-page ${pageNumber === currentPage ? "generic-list-page__pagination-page--active" : ""}`.trim()}
                            onClick={() => {
                              setPage(pageNumber);
                              onPageChange?.(pageNumber);
                            }}
                            aria-current={
                              pageNumber === currentPage ? "page" : undefined
                            }
                            aria-label={`Página ${pageNumber}`}
                          >
                            {pageNumber}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="generic-list-page__pagination-arrow"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    aria-label="Próxima página"
                    title="Próxima página"
                  >
                    <FaArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GenericListPage;
