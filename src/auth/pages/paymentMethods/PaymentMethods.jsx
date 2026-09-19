import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentMethods.css";
import "../../../global/components/form/Form.css";
import {
    getPaymentData,
    savePaymentMethods,
} from "../../../home/pages/orders/payment/paymentStorage";

const PAYMENT_METHODS = [
    {
        id: "boleto",
        label: "Boleto",
    },
    {
        id: "bank_transfer",
        label: "Transferência bancária",
    },
    {
        id: "cash",
        label: "Dinheiro",
    },
    {
        id: "check",
        label: "Cheque",
    },
    {
        id: "credit_card",
        label: "Cartão de crédito",
    },
    {
        id: "debit_card",
        label: "Cartão de débito",
    },
    {
        id: "pix",
        label: "PIX",
    },
];

export default function PaymentMethods() {
    const navigate = useNavigate();
    const location = useLocation();

    const orderId = location.state?.orderId || "OS-1024";

    const [selectedMethods, setSelectedMethods] =
        useState([]);
    const [successMessage, setSuccessMessage] =
        useState("");

    useEffect(() => {
        const paymentData = getPaymentData(orderId);

        setSelectedMethods(paymentData.methods || []);
    }, [orderId]);

    const toggleMethod = (id) => {
        setSelectedMethods((previousMethods) => {
            if (previousMethods.includes(id)) {
                return previousMethods.filter(
                    (method) => method !== id
                );
            }

            return [...previousMethods, id];
        });
    };

    const isFormValid = selectedMethods.length > 0;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }

        savePaymentMethods(
            orderId,
            selectedMethods
        );

        setSuccessMessage(
            "Meios de pagamento salvos com sucesso!"
        );

        setTimeout(() => {
            setSuccessMessage("");
            navigate(`/os/${orderId}/resumo`);
        }, 1000);
    };

    return (
        <div className="service-page">

            <div className="service-page-content">
                <main className="service-form-card">
                    <div className="card-header">
                        <button
                            type="button"
                            className="back-button"
                            onClick={() => navigate(-1)}
                            aria-label="Voltar"
                        >
                            <FaArrowLeft
                                size={20}
                                className="back-button-icon"
                            />
                        </button>

                        <h1>Meios de Pagamento</h1>
                    </div>

                    <form
                        className="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="payment-methods-list">
                            {PAYMENT_METHODS.map((method) => (
                                <label
                                    key={method.id}
                                    className="payment-methods-option"
                                >
                                    <span>{method.label}</span>

                                    <input
                                        type="checkbox"
                                        checked={selectedMethods.includes(
                                            method.id
                                        )}
                                        onChange={() =>
                                            toggleMethod(method.id)
                                        }
                                    />
                                </label>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="form-button"
                            disabled={!isFormValid}
                        >
                            SALVAR MEIOS DE PAGAMENTO
                        </button>

                        {successMessage && (
                            <p className="form-success">
                                {successMessage}
                            </p>
                        )}
                    </form>
                </main>
            </div>

        </div>
    );
}