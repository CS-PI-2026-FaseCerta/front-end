import React from "react";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import { formatCurrency } from "../utils/transferList.utils.js";
import "./TransferModalContent.css";

export default function TransferDetailsModal({
    isOpen,
    transfer,
    onClose,
}) {
    return (
        <FinanceModal
            isOpen={isOpen}
            title="Detalhes da transferência"
            onClose={onClose}
        >
            <div className="transfer-modal__details-card">
                <span>
                    Valor da transferência
                </span>

                <strong>
                    {formatCurrency(transfer?.value)}
                </strong>
            </div>

            <dl className="transfer-modal__details-list">
                <div>
                    <dt>Data</dt>
                    <dd>{transfer?.date}</dd>
                </div>

                <div>
                    <dt>Descrição</dt>
                    <dd>{transfer?.description}</dd>
                </div>

                <div>
                    <dt>Conta de origem</dt>
                    <dd>{transfer?.originAccount}</dd>
                </div>

                <div>
                    <dt>Conta de destino</dt>
                    <dd>{transfer?.destinationAccount}</dd>
                </div>

                <div>
                    <dt>Status</dt>
                    <dd>
                        {transfer?.paid
                            ? "Efetivada"
                            : "Pendente"}
                    </dd>
                </div>

                <div>
                    <dt>Anexos</dt>
                    <dd>
                        {transfer?.attachments?.length ?? 0}
                    </dd>
                </div>
            </dl>
        </FinanceModal>
    );
}