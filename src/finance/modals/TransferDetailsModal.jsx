import React from "react";
import { FaTimes } from "react-icons/fa";
import "./FinanceModal.css";

const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(value) || 0);

const formatDate = (value) => {
    if (!value) return "—";

    const [year, month, day] = value.split("-");

    return `${day}/${month}/${year}`;
};

const TransferDetailsModal = ({
    transfer,
    onClose,
}) => {
    if (!transfer) return null;

    return (
        <div className="finance-modal__overlay">
            <section
                className="finance-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Detalhes da transferência"
            >
                <header className="finance-modal__header">
                    <h2>Detalhes da transferência</h2>

                    <button
                        type="button"
                        className="finance-modal__close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <FaTimes />
                    </button>
                </header>

                <div className="finance-modal__details-card">
                    <span>Valor da transferência</span>
                    <strong>{formatCurrency(transfer.value)}</strong>
                </div>

                <dl className="finance-modal__details-list">
                    <div>
                        <dt>Data</dt>
                        <dd>{formatDate(transfer.date)}</dd>
                    </div>

                    <div>
                        <dt>Descrição</dt>
                        <dd>{transfer.description}</dd>
                    </div>

                    <div>
                        <dt>Conta de origem</dt>
                        <dd>{transfer.originAccount}</dd>
                    </div>

                    <div>
                        <dt>Conta de destino</dt>
                        <dd>{transfer.destinationAccount}</dd>
                    </div>

                    <div>
                        <dt>Status</dt>
                        <dd>
                            {transfer.paid ? "Efetivada" : "Pendente"}
                        </dd>
                    </div>
                </dl>
            </section>
        </div>
    );
};

export default TransferDetailsModal;