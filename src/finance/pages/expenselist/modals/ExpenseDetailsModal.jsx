import React from "react";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import { formatCurrency } from "../utils/expenseList.utils.js";
import "./ExpenseModalContent.css";

export default function ExpenseDetailsModal({ isOpen, expense, onClose }) {
  return (
    <FinanceModal isOpen={isOpen} title="Detalhamento do valor" onClose={onClose}>
      <div className="expense-modal__details-card">
        <span>Valor total da despesa</span>
        <strong>{formatCurrency(expense?.value)}</strong>
      </div>
      <dl className="expense-modal__details-list">
        <div><dt>Descrição</dt><dd>{expense?.description}</dd></div>
        <div><dt>Favorecido</dt><dd>{expense?.payee}</dd></div>
        <div><dt>Categoria</dt><dd>{expense?.category}</dd></div>
        <div><dt>Tipo</dt><dd>{expense?.paymentType}</dd></div>
        <div><dt>Modo</dt><dd>{expense?.paymentMode}</dd></div>
        <div><dt>Status</dt><dd>{expense?.paid ? "Pago" : "Pendente"}</dd></div>
      </dl>
    </FinanceModal>
  );
}
