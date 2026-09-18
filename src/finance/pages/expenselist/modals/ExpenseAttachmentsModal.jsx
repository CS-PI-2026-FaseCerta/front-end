import React from "react";
import { FaPaperclip, FaPlus, FaTimes } from "react-icons/fa";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import "./ExpenseModalContent.css";

export default function ExpenseAttachmentsModal({
  isOpen,
  expense,
  onClose,
  onAdd,
  onRemove,
}) {
  return (
    <FinanceModal isOpen={isOpen} title="Anexos da despesa" onClose={onClose}>
      <div className="expense-modal__attachments">
        <label className="expense-modal__upload-box">
          <FaPlus aria-hidden="true" />
          <span>Adicionar nota fiscal, boleto ou comprovante</span>
          <input type="file" multiple onChange={(event) => onAdd(expense, event.target.files)} />
        </label>

        {expense?.attachments?.length ? (
          <ul>
            {expense.attachments.map((attachment) => (
              <li key={attachment.id ?? attachment.name}>
                <FaPaperclip aria-hidden="true" />
                <span>{attachment.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(expense, attachment)}
                  aria-label={`Remover ${attachment.name}`}
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="expense-modal__muted">Nenhum arquivo anexado a esta despesa.</p>
        )}
      </div>
    </FinanceModal>
  );
}
