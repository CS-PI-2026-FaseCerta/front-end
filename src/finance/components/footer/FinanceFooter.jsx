import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./FinanceFooter.css";

const FinanceFooter = ({
    currentPage,
    totalPages,
    visibleCount,
    totalCount,
    itemLabel = "transferências",
    onPageChange,
}) => {
    const getVisiblePages = () => {
        if (totalPages <= 5) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        const pages = new Set([
            1,
            totalPages,
            currentPage - 1,
            currentPage,
            currentPage + 1,
        ]);

        return [...pages]
            .filter((page) => page > 0 && page <= totalPages)
            .sort((a, b) => a - b);
    };

    const visiblePages = getVisiblePages();

    return (
        <footer className="finance-footer">
            <p>
                Mostrando <strong>{visibleCount}</strong> de{" "}
                <strong>{totalCount}</strong> {itemLabel}
            </p>

            <div className="finance-footer__pagination">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Página anterior"
                >
                    <FaChevronLeft />
                </button>

                {visiblePages.map((page, index) => {
                    const previous = visiblePages[index - 1];
                    const showGap =
                        previous && page - previous > 1;

                    return (
                        <React.Fragment key={page}>
                            {showGap && (
                                <span className="finance-footer__gap">
                                    …
                                </span>
                            )}

                            <button
                                type="button"
                                className={currentPage === page ? "is-active" : ""}
                                onClick={() => onPageChange(page)}
                                aria-current={
                                    currentPage === page ? "page" : undefined
                                }
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    );
                })}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Próxima página"
                >
                    <FaChevronRight />
                </button>
            </div>
        </footer>
    );
};

export default FinanceFooter;