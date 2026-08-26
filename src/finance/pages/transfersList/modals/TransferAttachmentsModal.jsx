import React from "react";
import {
    FaPaperclip,
    FaPlus,
    FaTimes,
} from "react-icons/fa";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import "./TransferModalContent.css";

export default function TransferAttachmentsModal({
    isOpen,
    transfer,
    onClose,
    onAdd,
    onRemove,
}) {
    return (
        <FinanceModal
            isOpen={isOpen}
            title="Anexos da transferência"
            onClose={onClose}
        >
            <div className="transfer-modal__attachments">
                <label className="transfer-modal__upload-box">
                    <FaPlus aria-hidden="true" />

                    <span>
                        Adicionar comprovante ou documento
                    </span>

                    <input
                        type="file"
                        multiple
                        onChange={(event) =>
                            onAdd(
                                transfer,
                                event.target.files,
                            )
                        }
                    />
                </label>

                {transfer?.attachments?.length ? (
                    <ul>
                        {transfer.attachments.map(
                            (attachment) => (
                                <li key={attachment.id}>
                                    <FaPaperclip aria-hidden="true" />

                                    <span>
                                        {attachment.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemove(
                                                transfer,
                                                attachment,
                                            )
                                        }
                                        aria-label={`Remover ${attachment.name}`}
                                    >
                                        <FaTimes aria-hidden="true" />
                                    </button>
                                </li>
                            ),
                        )}
                    </ul>
                ) : (
                    <p className="transfer-modal__muted">
                        Nenhum arquivo anexado a esta
                        transferência.
                    </p>
                )}
            </div>
        </FinanceModal>
    );
}