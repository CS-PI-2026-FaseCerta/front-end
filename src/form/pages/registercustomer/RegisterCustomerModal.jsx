import React, { useState } from "react";
import Modal from "../../../global/components/modal/Modal.jsx";
import RegisterCustomerForm from "./RegisterCustomerForm.jsx";

import "./RegisterCustomer.css";

export default function RegisterCustomerModal({ isOpen, onClose, onSuccessCallback }) {
    const [successMessage, setSuccessMessage] = useState("");

    const handleSuccess = (data) => {
        setSuccessMessage(data.tipo === "PF" ? "Cliente (PF) cadastrado com sucesso!" : "Empresa (PJ) cadastrada com sucesso!");
        // Tempo para mostrar o feedback antes de fechar e notificar a lista
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
            <div className="register-customer-modal-container">
                <h2>Cadastrar Cliente</h2>
                {successMessage && (
                    <div className="form-success register-customer-success-margin">
                        {successMessage}
                    </div>
                )}
                <RegisterCustomerForm onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
        </Modal>
    );
}