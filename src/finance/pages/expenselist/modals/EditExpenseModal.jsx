import React from "react";
import FinanceField from "../../../components/form/FinanceField.jsx";
import FinanceModal from "../../../components/modal/FinanceModal.jsx";
import {
  CATEGORIES,
  PAYMENT_MODES,
  PAYMENT_TYPES,
} from "../expenseList.constants.js";
import {
  CATEGORIES as RECEIPT_CATEGORIES,
  PAYMENT_MODES as RECEIPT_PAYMENT_MODES,
  PAYMENT_TYPES as RECEIPT_PAYMENT_TYPES,
} from "../../receiptlist/receipList.constants.js";

const withCurrentValue = (values, currentValue) =>
  [...new Set([currentValue, ...values].filter(Boolean))];

const asSelectOptions = (values, currentValue) =>
  withCurrentValue(values, currentValue).map((value) => ({
    value,
    label: value,
  }));

export default function EditExpenseModal({
  isReceipt,
  isOpen,
  expense,
  onClose,
  onSubmit,
}) {
  const categories = isReceipt
    ? withCurrentValue(RECEIPT_CATEGORIES, expense?.category)
    : CATEGORIES;
  const paymentTypes = isReceipt
    ? asSelectOptions(RECEIPT_PAYMENT_TYPES, expense?.paymentType)
    : PAYMENT_TYPES;
  const paymentModes = isReceipt
    ? asSelectOptions(RECEIPT_PAYMENT_MODES, expense?.paymentMode)
    : PAYMENT_MODES;

  return (
    <FinanceModal
      isOpen={isOpen}
      title={isReceipt ? "Editar recebimento" : "Editar detalhes da despesa"}
      onClose={onClose}
    >
      <form
        className="finance-form"
        onSubmit={(event) => onSubmit(event, expense)}
      >
        <div className="finance-form__grid">
          <FinanceField label="Data">
            <input
              name="date"
              type="date"
              defaultValue={expense?.date}
              required
            />
          </FinanceField>
          <FinanceField label="Valor">
            <input
              name="value"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={expense?.value}
              required
            />
          </FinanceField>
          <FinanceField label="Descrição" className="is-wide">
            <input
              name="description"
              defaultValue={expense?.description}
              required
            />
          </FinanceField>
          <FinanceField
            label={isReceipt ? "Recebido de" : "Pago a"}
            className="is-wide"
          >
            <input name="payee" defaultValue={expense?.payee} required />
          </FinanceField>
          <FinanceField label="Categoria">
            <select name="category" defaultValue={expense?.category}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </FinanceField>
          <FinanceField label="Tipo de pagamento">
            <select
              name="paymentType"
              defaultValue={
                isReceipt ? expense?.paymentType : expense?.paymentTypeValue
              }
            >
              {paymentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FinanceField>
          <FinanceField label="Modo de pagamento" className="is-wide">
            <select
              name="paymentMode"
              defaultValue={
                isReceipt ? expense?.paymentMode : expense?.paymentModeValue
              }
            >
              {paymentModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </FinanceField>
        </div>

        <label className="finance-checkbox-row">
          <input name="paid" type="checkbox" defaultChecked={expense?.paid} />
          <span>{isReceipt ? "Recebimento pago" : "Despesa paga"}</span>
        </label>

        <div className="finance-modal-actions">
          <button
            type="button"
            className="finance-button finance-button--secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="finance-button finance-button--primary"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </FinanceModal>
  );
}
