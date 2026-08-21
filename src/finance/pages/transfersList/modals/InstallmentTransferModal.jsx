import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import { formatCurrency } from "../utils/transferList.utils.js";
import "./TransferModalContent.css";

const FIRST_INSTALLMENT_WARNING =
    "Se a primeira parcela não for no mês atual, ela será registrada no mês correspondente à data escolhida.";

export default function InstallmentTransferModal({
    isOpen,
    transfer,
    onClose,
    onSubmit,
}) {
    return (
        <FinanceModal
            isOpen={isOpen}
            title="Parcelar transferência"
            onClose={onClose}
        >
            <form
                className="finance-form"
                onSubmit={(event) =>
                    onSubmit(event, transfer)
                }
            >
                <div className="transfer-modal__details-card transfer-modal__details-card--compact">
                    <span>
                        Valor a parcelar
                    </span>

                    <strong>
                        {formatCurrency(transfer?.value)}
                    </strong>
                </div>

                <FinanceField label="Número de parcelas">
                    <input
                        name="installments"
                        type="number"
                        min="2"
                        max="60"
                        defaultValue="2"
                        required
                    />
                </FinanceField>

                <FinanceField
                    label="Data da primeira parcela"
                    hint={FIRST_INSTALLMENT_WARNING}
                    hintTone="danger"
                >
                    <input
                        name="firstDate"
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
                        Criar parcelas
                    </button>
                </div>
            </form>
        </FinanceModal>
    );
}