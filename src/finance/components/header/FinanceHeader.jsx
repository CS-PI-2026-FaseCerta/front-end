import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./FinanceHeader.css";

const MONTHS = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
];

const FinanceHeader = ({
    month,
    onMonthChange,
    activeTab = "transfers",
    onTabChange,
}) => {
    const formatMonth = (date) => {
        return `${MONTHS[date.getMonth()]}/${date.getFullYear()}`;
    };

    return (
        <>
            <header className="finance-header__title">
                <div>
                    <span>Financeiro</span>
                    <h1>FINANCEIRO</h1>
                </div>
            </header>

            <div className="finance-header__toolbar">
                <div
                    className="finance-header__month"
                    aria-label="Navegação por mês"
                >
                    <button
                        type="button"
                        onClick={() => onMonthChange(-1)}
                        aria-label="Mês anterior"
                    >
                        <FaChevronLeft />
                    </button>

                    <strong>{formatMonth(month)}</strong>

                    <button
                        type="button"
                        onClick={() => onMonthChange(1)}
                        aria-label="Próximo mês"
                    >
                        <FaChevronRight />
                    </button>
                </div>

                <nav
                    className="finance-header__tabs"
                    aria-label="Tipo de movimentação"
                >
                    <button
                        type="button"
                        className={activeTab === "receipts" ? "is-active is-receipt" : ""}
                        onClick={() => onTabChange?.("receipts")}
                    >
                        Recebimentos
                    </button>

                    <button
                        type="button"
                        className={activeTab === "expenses" ? "is-active is-expense" : ""}
                        onClick={() => onTabChange?.("expenses")}
                    >
                        Despesas
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "transfers" ? "is-active is-transfer" : ""
                        }
                        onClick={() => onTabChange?.("transfers")}
                    >
                        Transferências
                    </button>
                </nav>
            </div>
        </>
    );
};

export default FinanceHeader;