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
import "./ExpenseFloatingPanels.css";

export default function ExpenseActionMenu({
  isReceipt,
  expense,
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
  if (!expense || !position || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="expense-action-menu finance-surface-theme"
      data-expense-row-menu
      role="menu"
      style={{ left: `${position.left}px`, top: `${position.top}px` }}
    >
      <button type="button" role="menuitem" onClick={() => onGenerateReceipt(expense)}>
        <FaFileInvoice aria-hidden="true" />
        <span>Gerar recibo</span>
      </button>
      <button type="button" role="menuitem" onClick={() => onEdit(expense)}>
        <FaPen aria-hidden="true" />
        <span>{isReceipt ? "Editar recebimento" : "Editar detalhes"}</span>
      </button>
      <button type="button" role="menuitem" onClick={() => onDetails(expense)}>
        <FaListUl aria-hidden="true" />
        <span>Detalhar valor</span>
      </button>
      <button type="button" role="menuitem" onClick={() => onAttachments(expense)}>
        <FaPaperclip aria-hidden="true" />
        <span>Anexos</span>
        {expense.attachments?.length ? <small>{expense.attachments.length}</small> : null}
      </button>
      <button type="button" role="menuitem" onClick={() => onDuplicate(expense)}>
        <FaCopy aria-hidden="true" />
        <span>Duplicar</span>
      </button>
      <button type="button" role="menuitem" onClick={() => onMove(expense)}>
        <FaExchangeAlt aria-hidden="true" />
        <span>Mover para...</span>
      </button>
      <div className="expense-action-menu__divider" />
      <button type="button" role="menuitem" onClick={() => onRecurring(expense)}>
        <FaClock aria-hidden="true" />
        <span>Tornar recorrente...</span>
      </button>
      <div className="expense-action-menu__divider" />
      <button type="button" role="menuitem" onClick={() => onInstallments(expense)}>
        <FaMoneyBillWave aria-hidden="true" />
        <span>{isReceipt ? "Parcelar recebimento" : "Parcelar despesa"}</span>
      </button>
      <div className="expense-action-menu__divider" />
      <button type="button" role="menuitem" className="is-danger" onClick={() => onDelete(expense)}>
        <FaTrash aria-hidden="true" />
        <span>Excluir</span>
      </button>
    </div>,
    document.body,
  );
}
