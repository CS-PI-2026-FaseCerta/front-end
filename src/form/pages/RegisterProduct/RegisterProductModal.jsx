import React, { useState } from "react";

import Modal from "../../../global/components/modal/Modal.jsx";
import RegisterProductForm from "./RegisterProductForm.jsx";

import "./RegisterProduct.css";

export default function RegisterProductModal({
    isOpen,
    onClose,
    onSuccessCallback,
}) {
    const [successMessage, setSuccessMessage] = useState("");

    const handleSuccess = (data) => {
        setSuccessMessage("Produto cadastrado com sucesso!");

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
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
        >
            <div className="register-product-modal-container">
                <h2>Cadastrar Produto</h2>

                {successMessage && (
                    <div className="form-success">
                        {successMessage}
                    </div>
                )}

                <RegisterProductForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </Modal>
    );
}