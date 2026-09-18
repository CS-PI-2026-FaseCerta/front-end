import React from "react";
import DeleteTransferModal from "./DeleteTransferModal.jsx";
import EditTransferModal from "./EditTransferModal.jsx";
import InstallmentTransferModal from "./InstallmentTransferModal.jsx";
import MoveTransferModal from "./MoveTransferModal.jsx";
import RecurringTransferModal from "./RecurringTransferModal.jsx";
import TransferAttachmentsModal from "./TransferAttachmentsModal.jsx";
import TransferDetailsModal from "./TransferDetailsModal.jsx";

export default function TransferDialogs({
    dialog,
    transfer,
    onClose,
    onEditSubmit,
    onAttachmentAdd,
    onAttachmentRemove,
    onMoveSubmit,
    onRecurringSubmit,
    onInstallmentsSubmit,
    onDeleteConfirm,
}) {
    if (!dialog || !transfer) {
        return null;
    }

    return (
        <>
            <EditTransferModal
                isOpen={dialog.type === "edit"}
                transfer={transfer}
                onClose={onClose}
                onSubmit={onEditSubmit}
            />

            <TransferDetailsModal
                isOpen={dialog.type === "details"}
                transfer={transfer}
                onClose={onClose}
            />

            <TransferAttachmentsModal
                isOpen={
                    dialog.type === "attachments"
                }
                transfer={transfer}
                onClose={onClose}
                onAdd={onAttachmentAdd}
                onRemove={onAttachmentRemove}
            />

            <MoveTransferModal
                isOpen={dialog.type === "move"}
                transfer={transfer}
                onClose={onClose}
                onSubmit={onMoveSubmit}
            />

            <RecurringTransferModal
                isOpen={
                    dialog.type === "recurring"
                }
                transfer={transfer}
                onClose={onClose}
                onSubmit={onRecurringSubmit}
            />

            <InstallmentTransferModal
                isOpen={
                    dialog.type === "installments"
                }
                transfer={transfer}
                onClose={onClose}
                onSubmit={onInstallmentsSubmit}
            />

            <DeleteTransferModal
                isOpen={dialog.type === "delete"}
                transfer={transfer}
                onClose={onClose}
                onConfirm={onDeleteConfirm}
            />
        </>
    );
}