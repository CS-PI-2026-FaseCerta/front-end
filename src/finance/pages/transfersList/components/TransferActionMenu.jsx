import React from "react";
import { createPortal } from "react-dom";
import {
    FaClock,
    FaCopy,
    FaExchangeAlt,
    FaFileInvoice,
    FaListUl,
    FaMoneyBillWave,
    FaPaperclip,
    FaPen,
    FaTrash,
} from "react-icons/fa";
import "./TransferActionMenu.css";

export default function TransferActionMenu({
    transfer,
    position,
    onGenerateReceipt,
    onEdit,
    onDetails,
    onAttachments,
    onDuplicate,
    onMove,
    onRecurring,
    onInstallments,
    onDelete,
}) {
    if (
        !transfer ||
        !position ||
        typeof document === "undefined"
    ) {
        return null;
    }

    return createPortal(
        <div
            className="transfer-action-menu finance-surface-theme"
            data-transfer-row-menu
            role="menu"
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
            }}
        >
            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onGenerateReceipt(transfer)
                }
            >
                <FaFileInvoice aria-hidden="true" />
                <span>Gerar recibo</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => onEdit(transfer)}
            >
                <FaPen aria-hidden="true" />
                <span>Editar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => onDetails(transfer)}
            >
                <FaListUl aria-hidden="true" />
                <span>Detalhar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onAttachments(transfer)
                }
            >
                <FaPaperclip aria-hidden="true" />
                <span>Anexos</span>

                {transfer.attachments?.length ? (
                    <small>
                        {transfer.attachments.length}
                    </small>
                ) : null}
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onDuplicate(transfer)
                }
            >
                <FaCopy aria-hidden="true" />
                <span>Duplicar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => onMove(transfer)}
            >
                <FaExchangeAlt aria-hidden="true" />
                <span>Mover</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onRecurring(transfer)
                }
            >
                <FaClock aria-hidden="true" />
                <span>Recorrente</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onInstallments(transfer)
                }
            >
                <FaMoneyBillWave aria-hidden="true" />
                <span>Parcelar</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                className="is-danger"
                onClick={() => onDelete(transfer)}
            >
                <FaTrash aria-hidden="true" />
                <span>Excluir</span>
            </button>
        </div>,
        document.body,
    );
}