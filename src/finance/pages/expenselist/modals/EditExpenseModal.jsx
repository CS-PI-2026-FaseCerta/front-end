import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import { CATEGORIES, PAYMENT_MODES, PAYMENT_TYPES } from "../expenseList.constants.js";

export default function EditExpenseModal({ isReceipt, isOpen, expense, onClose, onSubmit }) {
  const categoriesList = isReceipt ? ["Ordem de serviço", "Outro"] : CATEGORIES;

  return (
    <FinanceModal isOpen={isOpen} title={isReceipt ? "Editar recebimento" : "Editar detalhes da despesa"} onClose={onClose}>
      <form className="finance-form" onSubmit={(event) => onSubmit(event, expense)}>
        <div className="finance-form__grid">
          <FinanceField label="Data">
            <input name="date" type="date" defaultValue={expense?.date} required />
          </FinanceField>
          <FinanceField label="Valor">
            <input name="value" type="number" step="0.01" min="0" defaultValue={expense?.value} required />
          </FinanceField>
          <FinanceField label="Descrição" className="is-wide">
            <input name="description" defaultValue={expense?.description} required />
          </FinanceField>
          <FinanceField label={isReceipt ? "Recebido de" : "Pago a"} className="is-wide">
            <input name="payee" defaultValue={expense?.payee} required />
          </FinanceField>
          <FinanceField label="Categoria">
            <select name="category" defaultValue={expense?.category}>
              {categoriesList.map((category) => <option key={category}>{category}</option>)}
            </select>
          </FinanceField>
          <FinanceField label="Tipo de pagamento">
            <select name="paymentType" defaultValue={expense?.paymentType}>
              {PAYMENT_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </FinanceField>
          <FinanceField label="Modo de pagamento" className="is-wide">
            <select name="paymentMode" defaultValue={expense?.paymentMode}>
              {PAYMENT_MODES.map((mode) => <option key={mode}>{mode}</option>)}
            </select>
          </FinanceField>
        </div>

        <label className="finance-checkbox-row">
          <input name="paid" type="checkbox" defaultChecked={expense?.paid} />
          <span>{isReceipt ? "Recebimento pago" : "Despesa paga"}</span>
        </label>

        <div className="finance-modal-actions">
          <button type="button" className="finance-button finance-button--secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="finance-button finance-button--primary">Salvar alterações</button>
        </div>
      </form>
    </FinanceModal>
  );
}
