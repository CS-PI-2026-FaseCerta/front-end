import React from "react";
import Modal from "../../../global/components/modal/Modal.jsx";
import RegisterCustomerForm from "./RegisterCustomerForm.jsx";

import "./RegisterCustomer.css";

export default function RegisterCustomerModal({
  isOpen,
  onClose,
  onSuccessCallback,
  initialData,
  mode = "create",
  loading = false,
  errorMessage = "",
}) {
  

  const handleSuccess = (data = {}) => {
    

    if (onSuccessCallback) {
      onSuccessCallback(data);
    }

    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    

    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className="register-customer-modal-container">
        <h2>
          {mode === "edit" ? "Editar Cliente" : "Cadastrar Cliente"}
        </h2>

      

        {loading ? (
          <p>Carregando dados do cliente...</p>
        ) : errorMessage ? (
          <div>
            <div className="form-error-inline">
              {errorMessage}
            </div>

            <button
              type="button"
              className="form-button form-button-secondary"
              onClick={handleCancel}
            >
              Fechar
            </button>
          </div>
        ) : (
          <RegisterCustomerForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            initialData={initialData}
            mode={mode}
          />
        )}
      </div>
    </Modal>
  );
}