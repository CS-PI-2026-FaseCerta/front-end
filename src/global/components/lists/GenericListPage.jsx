import React, { useEffect, useId, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaExclamationTriangle,
  FaFileImport,
  FaSearch,
} from "react-icons/fa";

import EmptyState from "./EmptyState";
import GenericTable from "./GenericTable";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  filterRows,
  paginateRows,
  sortRows,
} from "./listHelpers";
import LoadingOverlay from "../loading/LoadingOverlay.jsx";
import { exportCsv } from "../../utils/exportCsv";
import { exportXlsx } from "../../import-export/exportXlsx";
import ExportButton from "../../import-export/ExportButton";
import ImportModal from "../../import-export/ImportModal";
import useDeviceType from "../../hooks/useDeviceType.js";
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

const buildExportFileName = (value) => {
  const normalizedValue = String(value ?? "exportacao")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedValue || "exportacao";
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

  onRetry,
  onExport,
  onQueryChange,
  onPageChange,
  onPageSizeChange,
  importExport = {},
  className = "",
  rowKey = "id",
  search = {},
}) => {
  const navigate = useNavigate();
  const deviceType = useDeviceType();
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
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

  const filteredSortedRows = useMemo(() => {
    if (!clientSide) {
      return data;
    }

    const filteredRows = filterRows(data, columns, searchTerm, filterValues);
    return sortRows(filteredRows, columns, sortConfig);
  }, [clientSide, columns, data, filterValues, searchTerm, sortConfig]);

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

    return paginateRows(filteredSortedRows, page, pageSize);
  }, [clientSide, data, filteredSortedRows, page, pageSize, totalItems]);

  const currentRows = processedRows.rows ?? [];
  const resolvedTotalItems = processedRows.totalItems ?? currentRows.length;
  const totalPages = processedRows.totalPages ?? 1;
  const currentPage = processedRows.page ?? 1;
  const currentPageSize = processedRows.pageSize ?? pageSize;
  const importExportColumns = importExport.columns ?? columns;
  const exportRows = clientSide ? filteredSortedRows : data;
  const exportFileName = `${buildExportFileName(title)}.csv`;
  const importTemplateName = `${buildExportFileName(title)}-template`;
  const importExportFormats =
    Array.isArray(importExport.exportFormats) &&
    importExport.exportFormats.length > 0
      ? importExport.exportFormats
      : ["csv"];
  const isImportEnabled = Boolean(importExport.enableImport);
  const isExportEnabled = importExport.enableExport !== false;
  const hasRealData = clientSide
    ? data.length > 0
    : Number(totalItems ?? data.length) > 0;
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

  const searchPlaceholder = search.placeholder ?? "Buscar por ID ou nome...";
  const hasQuery =
    Boolean(searchTerm) ||
    Object.values(filterValues).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value != null && value !== "";
    });
  const isRealEmpty = !loading && !error && !hasRealData;
  const showTableState = !loading && !error && hasRealData;
  const showFooter = showTableState;
  const showToolbar = !loading && !error && !isRealEmpty;
  const tableEmptyLabel = hasQuery
    ? "Nenhum resultado encontrado"
    : "Sem dados para exibir.";

  const handleExport = async (exportPayload = {}) => {
    const requestedRows = exportPayload.rows ?? exportRows;
    const requestedColumns = exportPayload.columns ?? importExportColumns;
    const requestedFormat = exportPayload.format ?? "csv";
    const requestedFilename = exportPayload.filename ?? exportFileName;

    if (!requestedRows.length || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      if (typeof onExport === "function") {
        // TODO: quando a exportação vier do backend, a página pode delegar o download sem mudar a estrutura da listagem.
        await onExport({
          rows: requestedRows,
          columns: requestedColumns,
          searchTerm,
          filters: filterValues,
          sort: sortConfig,
          fileName: requestedFilename,
          format: requestedFormat,
        });
        return;
      }

      if (requestedFormat === "xlsx") {
        exportXlsx(requestedRows, {
          columns: requestedColumns,
          filename: requestedFilename,
        });
      } else {
        exportCsv(requestedRows, {
          columns: requestedColumns,
          filename: requestedFilename,
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportConfirm = async ({
    rows,
    headers,
    rawRows,
    summary,
    file,
    parser,
    errors,
    warnings,
  }) => {
    if (typeof importExport.onImportConfirm !== "function") {
      return;
    }

    setIsImporting(true);

    try {
      // TODO: quando a API de importação estiver pronta, enviar rows como JSON para o backend.
      await importExport.onImportConfirm({
        rows,
        headers,
        rawRows,
        summary,
        file,
        parser,
        errors,
        warnings,
      });
    } finally {
      setIsImporting(false);
    }
  };

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
      {isExporting || isImporting ? (
        <LoadingOverlay
          label={isImporting ? "Importando dados" : "Exportando dados"}
          description={
            isImporting
              ? "Consolidando os dados para a próxima etapa."
              : "Preparando o arquivo para download."
          }
        />
      ) : null}

      <main
        className="generic-list-page__main"
        aria-busy={isExporting || isImporting}
        inert={isExporting || isImporting ? "" : undefined}
      >
        <section className="generic-list-page__hero">
          <div className="generic-list-page__hero-top">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                className="back-button"
                onClick={() => navigate(-1)}
                title="Voltar"
                aria-label="Voltar"
              >
                <FaArrowLeft size={20} />
              </button>
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
            </div>

            {actions.length > 0 ? (
              <div className="generic-list-page__hero-actions">
                {actions.map((action) => {
                  const ActionIcon = action.icon;
                  const actionKey = action.key ?? action.label;

                  if (action.onCreate) {
                    if (deviceType === "mobile") {
                      const resolvedHref =
                        typeof action.onCreate.mobile === "function"
                          ? action.onCreate.mobile()
                          : action.onCreate.mobile;

                      return (
                        <Link
                          key={actionKey}
                          to={resolvedHref}
                          className={`generic-list-page__action generic-list-page__action--${action.variant ?? "primary"}`}
                        >
                          {ActionIcon ? (
                            <ActionIcon aria-hidden="true" />
                          ) : null}
                          <span>{action.label}</span>
                        </Link>
                      );
                    } else {
                      return (
                        <button
                          key={actionKey}
                          type="button"
                          className={`generic-list-page__action generic-list-page__action--${action.variant ?? "primary"}`}
                          onClick={action.onCreate.desktop}
                        >
                          {ActionIcon ? (
                            <ActionIcon aria-hidden="true" />
                          ) : null}
                          <span>{action.label}</span>
                        </button>
                      );
                    }
                  }

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
            ) : null}
          </div>

          <div
            className={`generic-list-page__panel ${isRealEmpty ? "generic-list-page__panel--empty" : ""}`.trim()}
          >
            {showToolbar ? (
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
                <div className="generic-list-page__toolbar-group">
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
                                  handleFilterChange(
                                    filter.key,
                                    event.target.value,
                                  )
                                }
                              >
                                <option value="">
                                  {filter.placeholder ?? "Todos"}
                                </option>
                                {filter.options?.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            ) : filter.type === "date" ? (
                              <input
                                type="date"
                                value={value}
                                onChange={(event) =>
                                  handleFilterChange(
                                    filter.key,
                                    event.target.value,
                                  )
                                }
                              />
                            ) : (
                              <input
                                type="text"
                                value={value}
                                onChange={(event) =>
                                  handleFilterChange(
                                    filter.key,
                                    event.target.value,
                                  )
                                }
                                placeholder={filter.placeholder ?? filter.label}
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ) : null}

                  {isImportEnabled ? (
                    <button
                      type="button"
                      className="generic-list-page__action generic-list-page__action--secondary generic-list-page__export-button"
                      onClick={() => setIsImportModalOpen(true)}
                      disabled={isImporting || isExporting}
                    >
                      <FaFileImport aria-hidden="true" />
                      <span>Importar</span>
                    </button>
                  ) : null}

                  {isExportEnabled ? (
                    <ExportButton
                      className="generic-list-page__export-button"
                      rows={exportRows}
                      columns={importExportColumns}
                      formats={importExportFormats}
                      filename={exportFileName.replace(/\.csv$/i, "")}
                      busy={isExporting}
                      disabled={isImporting}
                      onExport={handleExport}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

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
            ) : isRealEmpty ? (
              <EmptyState
                icon={emptyState.icon}
                title={emptyState.title ?? "Nenhum registro encontrado"}
                description={
                  emptyState.description ??
                  "Quando houver registros disponíveis, eles aparecerão nesta tabela."
                }
                actionLabel={emptyState.actionLabel}
                actionHref={
                  emptyState.onCreate
                    ? deviceType === "mobile"
                      ? emptyState.onCreate.mobile
                      : undefined
                    : emptyState.actionHref
                }
                onAction={
                  emptyState.onCreate
                    ? deviceType === "desktop"
                      ? emptyState.onCreate.desktop
                      : undefined
                    : emptyState.onAction
                }
              />
            ) : showTableState ? (
              <GenericTable
                columns={columns}
                data={currentRows}
                rowKey={rowKey}
                rowActions={rowActions}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
                emptyLabel={tableEmptyLabel}
              />
            ) : null}

            {showFooter ? (
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
            ) : null}
          </div>
        </section>
      </main>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={importExport.importTitle ?? `Importar ${title}`}
        columns={importExportColumns}
        requiredColumns={importExport.requiredColumns}
        allowUnknownColumns={Boolean(importExport.allowUnknownColumns)}
        onConfirm={handleImportConfirm}
        templateBaseName={importExport.templateBaseName ?? importTemplateName}
        enableTemplateXlsx={importExport.enableTemplateXlsx !== false}
      />
    </div>
  );
};

export default GenericListPage;
