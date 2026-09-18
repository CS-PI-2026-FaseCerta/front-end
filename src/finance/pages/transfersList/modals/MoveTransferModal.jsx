import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";

export default function MoveTransferModal({
    isOpen,
    transfer,
    onClose,
    onSubmit,
}) {
    return (
        <FinanceModal
            isOpen={isOpen}
            title="Mover transferência"
            onClose={onClose}
        >
            <form
                className="finance-form"
                onSubmit={(event) =>
                    onSubmit(event, transfer)
                }
            >
                <FinanceField label="Nova conta de origem">
                    <input
                        name="originAccount"
                        defaultValue={
                            transfer?.originAccount
                        }
                        required
                    />
                </FinanceField>

                <FinanceField label="Nova conta de destino">
                    <input
                        name="destinationAccount"
                        defaultValue={
                            transfer?.destinationAccount
                        }
                        required
                    />
                </FinanceField>

                <div className="finance-modal-actions">
                    <button
                        type="button"
                        className="finance-button finance-button--secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="finance-button finance-button--primary"
                    >
                        Mover
                    </button>
                </div>
            </form>
        </FinanceModal>
    );
}