import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import { CATEGORIES } from "../expenseList.constants.js";

export default function MoveExpenseModal({ isOpen, expense, onClose, onSubmit }) {
  return (
    <FinanceModal isOpen={isOpen} title="Mover despesa" onClose={onClose}>
      <form className="finance-form" onSubmit={(event) => onSubmit(event, expense)}>
        <FinanceField label="Mover para">
          <select name="destination" defaultValue="expenses">
            <option value="expenses">Despesas (reclassificar)</option>
            <option value="receipts">Recebimentos</option>
            <option value="transfers">Transferências</option>
          </select>
        </FinanceField>
        <FinanceField label="Categoria de destino">
          <select name="category" defaultValue={expense?.category}>
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </FinanceField>
        <div className="finance-modal-actions">
          <button type="button" className="finance-button finance-button--secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="finance-button finance-button--primary">Mover</button>
        </div>
      </form>
    </FinanceModal>
  );
}
