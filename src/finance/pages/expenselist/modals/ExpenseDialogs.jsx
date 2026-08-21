import React from "react";
import DeleteExpenseModal from "./DeleteExpenseModal.jsx";
import EditExpenseModal from "./EditExpenseModal.jsx";
import ExpenseAttachmentsModal from "./ExpenseAttachmentsModal.jsx";
import ExpenseDetailsModal from "./ExpenseDetailsModal.jsx";
import InstallmentExpenseModal from "./InstallmentExpenseModal.jsx";
import MoveExpenseModal from "./MoveExpenseModal.jsx";
import RecurringExpenseModal from "./RecurringExpenseModal.jsx";

export default function ExpenseDialogs({
  dialog,
  expense,
  onClose,
  onEditSubmit,
  onAttachmentAdd,
  onAttachmentRemove,
  onMoveSubmit,
  onRecurringSubmit,
  onInstallmentsSubmit,
  onDeleteConfirm,
}) {
  if (!dialog || !expense) return null;

  return (
    <>
      <EditExpenseModal
        isOpen={dialog.type === "edit"}
        expense={expense}
        onClose={onClose}
        onSubmit={onEditSubmit}
      />
      <ExpenseDetailsModal
        isOpen={dialog.type === "details"}
        expense={expense}
        onClose={onClose}
      />
      <ExpenseAttachmentsModal
        isOpen={dialog.type === "attachments"}
        expense={expense}
        onClose={onClose}
        onAdd={onAttachmentAdd}
        onRemove={onAttachmentRemove}
      />
      <MoveExpenseModal
        isOpen={dialog.type === "move"}
        expense={expense}
        onClose={onClose}
        onSubmit={onMoveSubmit}
      />
      <RecurringExpenseModal
        isOpen={dialog.type === "recurring"}
        expense={expense}
        onClose={onClose}
        onSubmit={onRecurringSubmit}
      />
      <InstallmentExpenseModal
        isOpen={dialog.type === "installments"}
        expense={expense}
        onClose={onClose}
        onSubmit={onInstallmentsSubmit}
      />
      <DeleteExpenseModal
        isOpen={dialog.type === "delete"}
        expense={expense}
        onClose={onClose}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
}
