import React from "react";
import { FaTrash } from "react-icons/fa";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import "./TransferModalContent.css";

export default function DeleteTransferModal({
    isOpen,
    transfer,
    onClose,
    onConfirm,
}) {
    return (
        <FinanceModal
            isOpen={isOpen}
            title="Excluir transferência"
            onClose={onClose}
            size="small"
        >
            <div className="transfer-modal__delete-copy">
                <div className="transfer-modal__danger-icon">
                    <FaTrash aria-hidden="true" />
                </div>

                <p>
                    Tem certeza que deseja excluir{" "}
                    <strong>
                        {transfer?.description}
                    </strong>
                    ?
                </p>

                <span>
                    Essa ação removerá a transferência da
                    listagem atual.
                </span>
            </div>

            <div className="finance-modal-actions">
                <button
                    type="button"
                    className="finance-button finance-button--secondary"
                    onClick={onClose}
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    className="finance-button finance-button--danger"
                    onClick={() =>
                        onConfirm(transfer)
                    }
                >
                    Excluir transferência
                </button>
            </div>
        </FinanceModal>
    );
}