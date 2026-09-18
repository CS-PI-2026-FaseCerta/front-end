import React, { useState } from "react";

import Modal from "../../../global/components/modal/Modal.jsx";
import RegisterServiceForm from "./RegisterServiceForm.jsx";

import "./RegisterService.css";
import "../../../global/components/form/Form.css";

export default function RegisterServiceModal({
  isOpen,
  onClose,
  onSuccessCallback,
  serviceId,
}) {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (data) => {
    setSuccessMessage(
      data.isEdit
        ? "Serviço atualizado com sucesso!"
        : "Serviço cadastrado com sucesso!"
    );

    setTimeout(() => {
      setSuccessMessage("");

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }

      if (onClose) {
        onClose();
      }
    }, 1500);
  };

  const handleCancel = () => {
    setSuccessMessage("");

    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className="register-service-modal-container">
        <h2>Salvar Serviço</h2>

        {successMessage && (
          <div className="form-success register-service-success-margin">
            {successMessage}
          </div>
        )}

        <RegisterServiceForm
          serviceId={serviceId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Modal>
  );
}