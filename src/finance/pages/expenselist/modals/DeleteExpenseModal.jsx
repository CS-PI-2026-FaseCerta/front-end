import React from "react";
import { FaTrash } from "react-icons/fa";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import "./ExpenseModalContent.css";

export default function DeleteExpenseModal({ isReceipt, isOpen, expense, onClose, onConfirm }) {
  return (
    <FinanceModal isOpen={isOpen} title={isReceipt ? "Excluir recebimento" : "Excluir despesa"} onClose={onClose} size="small">
      <div className="expense-modal__delete-copy">
        <div className="expense-modal__danger-icon"><FaTrash aria-hidden="true" /></div>
        <p>Tem certeza que deseja excluir <strong>{expense?.description}</strong>?</p>
        <span>A exclusão é lógica e pode ser tratada pela API por meio do callback <code>{isReceipt ? "onDeleteReceipt" : "onDeleteExpense"}</code>.</span>
      </div>
      <div className="finance-modal-actions">
        <button type="button" className="finance-button finance-button--secondary" onClick={onClose}>Cancelar</button>
        <button type="button" className="finance-button finance-button--danger" onClick={() => onConfirm(expense)}>Excluir {isReceipt ? "recebimento" : "despesa"}</button>
      </div>
    </FinanceModal>
  );
}
