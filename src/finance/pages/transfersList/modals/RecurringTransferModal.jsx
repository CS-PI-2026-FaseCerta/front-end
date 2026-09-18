import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";

export default function RecurringTransferModal({
    isOpen,
    transfer,
    onClose,
    onSubmit,
}) {
    return (
        <FinanceModal
            isOpen={isOpen}
            title="Tornar transferência recorrente"
            onClose={onClose}
        >
            <form
                className="finance-form"
                onSubmit={(event) =>
                    onSubmit(event, transfer)
                }
            >
                <FinanceField label="Frequência">
                    <select
                        name="frequency"
                        defaultValue="monthly"
                    >
                        <option value="weekly">
                            Semanal
                        </option>

                        <option value="monthly">
                            Mensal
                        </option>

                        <option value="quarterly">
                            Trimestral
                        </option>

                        <option value="yearly">
                            Anual
                        </option>
                    </select>
                </FinanceField>

                <FinanceField label="Iniciar em">
                    <input
                        name="startDate"
                        type="date"
                        defaultValue={transfer?.date}
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
                        Confirmar recorrência
                    </button>
                </div>
            </form>
        </FinanceModal>
    );
}