import React from "react";
import { FaTimes } from "react-icons/fa";
import "./FinanceModal.css";

const TransferEditModal = ({
    transfer,
    onClose,
    onSave,
}) => {
    if (!transfer) return null;

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        onSave({
            ...transfer,
            date: formData.get("date"),
            description: formData.get("description"),
            originAccount: formData.get("originAccount"),
            destinationAccount: formData.get("destinationAccount"),
            value: Number(formData.get("value")),
            paid: formData.get("paid") === "on",
        });
    };

    return (
        <div className="finance-modal__overlay">
            <section
                className="finance-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Editar transferência"
            >
                <header className="finance-modal__header">
                    <h2>Editar transferência</h2>

                    <button
                        type="button"
                        className="finance-modal__close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <FaTimes />
                    </button>
                </header>

                <form
                    className="finance-modal__form"
                    onSubmit={handleSubmit}
                >
                    <div className="finance-modal__grid">
                        <label className="finance-modal__field">
                            <span>Data</span>
                            <input
                                name="date"
                                type="date"
                                defaultValue={transfer.date}
                                required
                            />
                        </label>

                        <label className="finance-modal__field">
                            <span>Valor</span>
                            <input
                                name="value"
                                type="number"
                                min="0"
                                step="0.01"
                                defaultValue={transfer.value}
                                required
                            />
                        </label>

                        <label className="finance-modal__field finance-modal__field--wide">
                            <span>Descrição</span>
                            <input
                                name="description"
                                defaultValue={transfer.description}
                                required
                            />
                        </label>

                        <label className="finance-modal__field">
                            <span>Conta de origem</span>
                            <input
                                name="originAccount"
                                defaultValue={transfer.originAccount}
                                required
                            />
                        </label>

                        <label className="finance-modal__field">
                            <span>Conta de destino</span>
                            <input
                                name="destinationAccount"
                                defaultValue={transfer.destinationAccount}
                                required
                            />
                        </label>
                    </div>

                    <label className="finance-modal__checkbox">
                        <input
                            name="paid"
                            type="checkbox"
                            defaultChecked={transfer.paid}
                        />
                        <span>Transferência efetivada</span>
                    </label>

                    <div className="finance-modal__actions">
                        <button
                            type="button"
                            className="finance-modal__button finance-modal__button--secondary"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="finance-modal__button finance-modal__button--primary"
                        >
                            Salvar alterações
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default TransferEditModal;