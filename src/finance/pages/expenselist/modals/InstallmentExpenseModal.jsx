import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import { formatCurrency } from "../utils/expenseList.utils.js";
import "./ExpenseModalContent.css";

const FIRST_INSTALLMENT_WARNING = (isReceipt) =>
  `Se o vencimento da primeira parcela não for no mês atual, o ${isReceipt ? "recebimento" : "despesa"} será transferida para a tabela do mês escolhido.`;

export default function InstallmentExpenseModal({ isReceipt, isOpen, expense, onClose, onSubmit }) {
  return (
    <FinanceModal isOpen={isOpen} title={isReceipt ? "Parcelar recebimento" : "Parcelar despesa"} onClose={onClose}>
      <form className="finance-form" onSubmit={(event) => onSubmit(event, expense)}>
        <div className="expense-modal__details-card expense-modal__details-card--compact">
          <span>Valor a parcelar</span>
          <strong>{formatCurrency(expense?.value)}</strong>
        </div>
        <FinanceField label="Número de parcelas">
          <input name="installments" type="number" min="2" max="60" defaultValue="2" required />
        </FinanceField>
        <FinanceField
          label="Vencimento da primeira parcela"
          hint={FIRST_INSTALLMENT_WARNING(isReceipt)}
          hintTone="danger"
        >
          <input name="firstDate" type="date" defaultValue={expense?.date} required />
        </FinanceField>
        <div className="finance-modal-actions">
          <button type="button" className="finance-button finance-button--secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="finance-button finance-button--primary">Criar parcelas</button>
        </div>
      </form>
    </FinanceModal>
  );
}
