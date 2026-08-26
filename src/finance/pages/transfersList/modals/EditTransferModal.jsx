import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";

export default function EditTransferModal({
    isOpen,
    transfer,
    onClose,
    onSubmit,
}) {
    return (
        <FinanceModal
            isOpen={isOpen}
            title="Editar transferência"
            onClose={onClose}
        >
            <form
                className="finance-form"
                onSubmit={(event) =>
                    onSubmit(event, transfer)
                }
            >
                <div className="finance-form__grid">
                    <FinanceField label="Data">
                        <input
                            name="date"
                            type="date"
                            defaultValue={transfer?.date}
                            required
                        />
                    </FinanceField>

                    <FinanceField label="Valor">
                        <input
                            name="value"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={transfer?.value}
                            required
                        />
                    </FinanceField>

                    <FinanceField
                        label="Descrição"
                        className="is-wide"
                    >
                        <input
                            name="description"
                            defaultValue={
                                transfer?.description
                            }
                            required
                        />
                    </FinanceField>

                    <FinanceField label="Conta de origem">
                        <input
                            name="originAccount"
                            defaultValue={
                                transfer?.originAccount
                            }
                            required
                        />
                    </FinanceField>

                    <FinanceField label="Conta de destino">
                        <input
                            name="destinationAccount"
                            defaultValue={
                                transfer?.destinationAccount
                            }
                            required
                        />
                    </FinanceField>
                </div>

                <label className="finance-checkbox-row">
                    <input
                        name="paid"
                        type="checkbox"
                        defaultChecked={transfer?.paid}
                    />

                    <span>
                        Transferência efetivada
                    </span>
                </label>

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
                        Salvar alterações
                    </button>
                </div>
            </form>
        </FinanceModal>
    );
}