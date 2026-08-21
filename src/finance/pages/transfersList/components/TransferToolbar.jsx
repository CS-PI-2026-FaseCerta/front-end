import React from "react";
import {
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import "./TransferToolbar.css";

export default function TransferToolbar({
    monthLabel,
    onPreviousMonth,
    onNextMonth,
    onTabChange,
}) {
    return (
        <div className="transfer-toolbar">
            <div
                className="transfer-toolbar__month"
                aria-label="Navegação por mês"
            >
                <button
                    type="button"
                    onClick={onPreviousMonth}
                    aria-label="Mês anterior"
                >
                    <FaChevronLeft aria-hidden="true" />
                </button>

                <strong>{monthLabel}</strong>

                <button
                    type="button"
                    onClick={onNextMonth}
                    aria-label="Próximo mês"
                >
                    <FaChevronRight aria-hidden="true" />
                </button>
            </div>

            <nav
                className="transfer-toolbar__tabs"
                aria-label="Tipo de movimentação"
            >
                <button
                    type="button"
                    onClick={() =>
                        onTabChange?.("receipts")
                    }
                >
                    Recebimentos
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onTabChange?.("expenses")
                    }
                >
                    Despesas
                </button>

                <button
                    type="button"
                    className="is-active"
                    aria-current="page"
                >
                    Transferências
                </button>
            </nav>
        </div>
    );
}