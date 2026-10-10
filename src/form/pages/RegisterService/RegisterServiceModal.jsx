import React, { useEffect, useState } from "react";
import Modal from "../../../global/components/modal/Modal.jsx";
import RegisterServiceForm from "./RegisterServiceForm.jsx";
import "./RegisterService.css";
import "../../../global/components/form/Form.css";

export default function RegisterServiceModal({
  isOpen,
  onClose,
  onSuccessCallback,
  initialData,
  mode = "create",
  loading = false,
  errorMessage = "",
}) {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsSaving(false);
  }, [isOpen]);

  const handleSuccess = (data) => {
    setIsSaving(false);
    onSuccessCallback?.(data);
    onClose?.();
  };

  const handleCancel = () => {
    if (isSaving) return;
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={isSaving ? undefined : handleCancel}>
      <div className="register-service-modal-container">
        <h2>{mode === "edit" ? "Editar Serviço" : "Cadastrar Serviço"}</h2>

        {loading ? (
          <p>Carregando dados do serviço...</p>
        ) : errorMessage ? (
          <div>
            <div className="form-error-inline">{errorMessage}</div>
            <button
              type="button"
              className="form-button form-button-secondary"
              onClick={handleCancel}
            >
              Fechar
            </button>
          </div>
        ) : (
          <RegisterServiceForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onSavingChange={setIsSaving}
            initialData={initialData}
            mode={mode}
          />
        )}
      </div>
    </Modal>
  );
}
