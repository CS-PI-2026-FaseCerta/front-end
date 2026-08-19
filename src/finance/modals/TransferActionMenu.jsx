import React from "react";
import {
    FaFileInvoice,
    FaPen,
    FaListUl,
    FaPaperclip,
    FaCopy,
    FaExchangeAlt,
    FaClock,
    FaMoneyBillWave,
    FaTrash,
} from "react-icons/fa";
import "./TransferActionMenu.css";

const TransferActionMenu = ({
    transfer,
    position,
    onAction,
}) => {
    if (!transfer || !position) {
        return null;
    }

    const handleAction = (action) => {
        onAction(action, transfer);
    };

    return (
        <div
            className="transfer-action-menu"
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
            }}
            data-transfer-row-menu
            role="menu"
        >
            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("receipt")}
            >
                <FaFileInvoice />
                <span>Gerar recibo</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("edit")}
            >
                <FaPen />
                <span>Editar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("details")}
            >
                <FaListUl />
                <span>Detalhar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("attachments")}
            >
                <FaPaperclip />
                <span>Anexos</span>

                {transfer.attachments?.length > 0 && (
                    <small>{transfer.attachments.length}</small>
                )}
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("duplicate")}
            >
                <FaCopy />
                <span>Duplicar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("move")}
            >
                <FaExchangeAlt />
                <span>Mover</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("recurring")}
            >
                <FaClock />
                <span>Recorrente</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                onClick={() => handleAction("installments")}
            >
                <FaMoneyBillWave />
                <span>Parcelar</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                className="is-danger"
                onClick={() => handleAction("delete")}
            >
                <FaTrash />
                <span>Excluir</span>
            </button>
        </div>
    );
};

export default TransferActionMenu;