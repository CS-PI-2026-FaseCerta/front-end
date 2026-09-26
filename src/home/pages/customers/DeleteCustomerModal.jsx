import React, { useEffect, useState } from "react";
import Modal from "../../../global/components/modal/Modal.jsx";
import { getCustomerErrorMessage } from "../../../services/customers/customerErrors";

export default function DeleteCustomerModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen, customer?.id]);

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!customer?.id) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await onConfirm(customer.id);
      setError("");
      onClose();
    } catch (requestError) {
      setError(
        getCustomerErrorMessage(
          requestError,
          "Não foi possível remover o cliente."
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isDeleting ? undefined : handleClose}
    >
      <div className="register-customer-modal-container">
        <h2>Remover cliente</h2>

        <p>
          Deseja realmente remover{" "}
          <strong>{customer?.name || "este cliente"}</strong>?
        </p>

        {error && (
          <div className="form-error-inline">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="form-button form-button-secondary"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="form-button"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "REMOVENDO..." : "REMOVER"}
          </button>
        </div>
      </div>
    </Modal>
  );
}