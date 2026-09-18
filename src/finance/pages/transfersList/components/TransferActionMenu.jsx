import React, {
    useEffect,
    useRef,
} from "react";
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

const FOCUSABLE_SELECTOR = [
    "button:not([disabled])",
    "a[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function TransferActionMenu({
    transfer,
    position,
    onClose,
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
    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!transfer || !position) {
            return undefined;
        }

        triggerRef.current =
            document.activeElement;

        const menu = menuRef.current;

        if (!menu) {
            return undefined;
        }

        const firstFocusable =
            menu.querySelector(
                FOCUSABLE_SELECTOR,
            );

        firstFocusable?.focus();

        return () => {
            triggerRef.current?.focus?.();
            triggerRef.current = null;
        };
    }, [transfer, position]);

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();

            onClose?.();

            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusable = Array.from(
            menuRef.current?.querySelectorAll(
                FOCUSABLE_SELECTOR,
            ) ?? [],
        );

        if (!focusable.length) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last =
            focusable[
            focusable.length - 1
            ];

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {
            event.preventDefault();
            last.focus();

            return;
        }

        if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            first.focus();
        }
    };

    if (
        !transfer ||
        !position ||
        typeof document === "undefined"
    ) {
        return null;
    }

    return createPortal(
        <div
            ref={menuRef}
            className="transfer-action-menu finance-surface-theme"
            data-transfer-row-menu
            role="menu"
            aria-label="Ações da transferência"
            onKeyDown={handleKeyDown}
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
            }}
        >
            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onGenerateReceipt(
                        transfer,
                    )
                }
            >
                <FaFileInvoice
                    aria-hidden="true"
                />
                <span>Gerar recibo</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onEdit(transfer)
                }
            >
                <FaPen
                    aria-hidden="true"
                />
                <span>Editar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onDetails(transfer)
                }
            >
                <FaListUl
                    aria-hidden="true"
                />
                <span>Detalhar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onAttachments(
                        transfer,
                    )
                }
            >
                <FaPaperclip
                    aria-hidden="true"
                />
                <span>Anexos</span>

                {transfer.attachments?.length ? (
                    <small>
                        {
                            transfer
                                .attachments
                                .length
                        }
                    </small>
                ) : null}
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onDuplicate(
                        transfer,
                    )
                }
            >
                <FaCopy
                    aria-hidden="true"
                />
                <span>Duplicar</span>
            </button>

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onMove(transfer)
                }
            >
                <FaExchangeAlt
                    aria-hidden="true"
                />
                <span>Mover</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onRecurring(
                        transfer,
                    )
                }
            >
                <FaClock
                    aria-hidden="true"
                />
                <span>Recorrente</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                onClick={() =>
                    onInstallments(
                        transfer,
                    )
                }
            >
                <FaMoneyBillWave
                    aria-hidden="true"
                />
                <span>Parcelar</span>
            </button>

            <div className="transfer-action-menu__divider" />

            <button
                type="button"
                role="menuitem"
                className="is-danger"
                onClick={() =>
                    onDelete(transfer)
                }
            >
                <FaTrash
                    aria-hidden="true"
                />
                <span>Excluir</span>
            </button>
        </div>,
        document.body,
    );
}