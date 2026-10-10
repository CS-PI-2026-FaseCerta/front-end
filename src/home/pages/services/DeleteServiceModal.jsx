import React, { useEffect, useState } from "react";
import Modal from "../../../global/components/modal/Modal.jsx";
import { getServiceErrorMessage } from "../../../services/servicos/servicosErrors";

export default function DeleteServiceModal({
  service,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) setError("");
  }, [isOpen, service?.id]);

  const handleClose = () => {
    if (isDeleting) return;
    setError("");
    onClose?.();
  };

  const handleConfirm = async () => {
    if (!service?.id) return;

    setIsDeleting(true);
    setError("");

    try {
      await onConfirm(service.id);
      onClose?.();
    } catch (requestError) {
      setError(
        getServiceErrorMessage(
          requestError,
          "Não foi possível remover o serviço.",
        ),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={isDeleting ? undefined : handleClose}>
      <div className="register-service-modal-container">
        <h2>Remover serviço</h2>
        <p>
          Deseja realmente remover <strong>{service?.nome || "este serviço"}</strong>?
        </p>

        {error ? <div className="form-error-inline">{error}</div> : null}

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
