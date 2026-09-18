import React, { useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./FinanceTableFooter.css";

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  return [...new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])]
    .filter((page) => page > 0 && page <= totalPages)
    .sort((a, b) => a - b);
};

export default function FinanceTableFooter({
  visibleCount,
  totalCount,
  itemLabel = "itens",
  rowsPerPageInput,
  onRowsPerPageInputChange,
  onCommitRowsPerPage,
  page,
  totalPages,
  onPageChange,
}) {
  const visiblePages = useMemo(
    () => getVisiblePages(page, totalPages),
    [page, totalPages],
  );

  return (
    <footer className="finance-table-footer">
      <div className="finance-table-footer__summary">
        <p>
          Mostrando <strong>{visibleCount}</strong> de <strong>{totalCount}</strong> {itemLabel}
        </p>

        <label className="finance-table-footer__page-size">
          <span>Linhas por página</span>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={rowsPerPageInput}
            onChange={(event) => onRowsPerPageInputChange?.(event.target.value)}
            onBlur={onCommitRowsPerPage}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onCommitRowsPerPage?.();
                event.currentTarget.blur();
              }
            }}
            aria-label="Linhas por página"
          />
        </label>
      </div>

      <div className="finance-table-footer__pagination" aria-label={`Paginação de ${itemLabel}`}>
        <button
          type="button"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <FaChevronLeft aria-hidden="true" />
        </button>

        {visiblePages.map((pageNumber, index) => {
          const previous = visiblePages[index - 1];
          const showGap = previous && pageNumber - previous > 1;
          return (
            <React.Fragment key={pageNumber}>
              {showGap ? <span className="finance-table-footer__page-gap">…</span> : null}
              <button
                type="button"
                className={page === pageNumber ? "is-active" : ""}
                onClick={() => onPageChange?.(pageNumber)}
                aria-current={page === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            </React.Fragment>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label="Próxima página"
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
