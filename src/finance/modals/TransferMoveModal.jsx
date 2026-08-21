import React from "react";
import { FaTimes } from "react-icons/fa";
import "./FinanceModal.css";

const TransferMoveModal = ({
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
            originAccount: formData.get("originAccount"),
            destinationAccount: formData.get("destinationAccount"),
        });
    };

    return (
        <div className="finance-modal__overlay">
            <section
                className="finance-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Mover transferência"
            >
                <header className="finance-modal__header">
                    <h2>Mover transferência</h2>

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
                    <label className="finance-modal__field">
                        <span>Nova conta de origem</span>

                        <input
                            name="originAccount"
                            defaultValue={transfer.originAccount}
                            required
                        />
                    </label>

                    <label className="finance-modal__field">
                        <span>Nova conta de destino</span>

                        <input
                            name="destinationAccount"
                            defaultValue={transfer.destinationAccount}
                            required
                        />
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
                            Mover
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default TransferMoveModal;