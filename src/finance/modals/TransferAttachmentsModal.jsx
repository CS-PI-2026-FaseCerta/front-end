import React from "react";
import {
    FaTimes,
    FaPlus,
    FaPaperclip,
} from "react-icons/fa";
import "./FinanceModal.css";

const TransferAttachmentsModal = ({
    transfer,
    onClose,
    onChange,
}) => {
    if (!transfer) return null;

    const handleFiles = (event) => {
        const files = [...event.target.files];

        if (!files.length) return;

        const attachments = [
            ...(transfer.attachments || []),
            ...files.map((file) => ({
                id:
                    typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
                file,
            })),
        ];

        onChange({
            ...transfer,
            attachments,
        });
    };

    const removeAttachment = (attachment) => {
        const attachments = transfer.attachments.filter(
            (item) => item.id !== attachment.id
        );

        onChange({
            ...transfer,
            attachments,
        });
    };

    return (
        <div className="finance-modal__overlay">
            <section
                className="finance-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Anexos da transferência"
            >
                <header className="finance-modal__header">
                    <h2>Anexos da transferência</h2>

                    <button
                        type="button"
                        className="finance-modal__close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <FaTimes />
                    </button>
                </header>

                <div className="finance-modal__attachments">
                    <label className="finance-modal__upload">
                        <FaPlus />
                        <span>Adicionar comprovante ou documento</span>

                        <input
                            type="file"
                            multiple
                            onChange={handleFiles}
                        />
                    </label>

                    {transfer.attachments?.length > 0 ? (
                        <ul className="finance-modal__attachments-list">
                            {transfer.attachments.map((attachment) => (
                                <li key={attachment.id}>
                                    <FaPaperclip />

                                    <span>{attachment.name}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeAttachment(attachment)
                                        }
                                        aria-label={`Remover ${attachment.name}`}
                                    >
                                        <FaTimes />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="finance-modal__muted">
                            Nenhum arquivo anexado a esta transferência.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default TransferAttachmentsModal;