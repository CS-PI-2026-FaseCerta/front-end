import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import {
    getPaymentData,
    getPaymentMethodsSummary,
} from "./payment/paymentStorage";

import { pedidosMockData } from "./pedidos.mock";

import "./OrderSummaryPage.css";

const OrderSummaryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [paymentData, setPaymentData] = useState({
        terms: {
            paymentType: "cash",
            downPayment: "",
            installments: "",
            details: "",
        },
        methods: [],
    });

    const order = pedidosMockData.find(
        (item) => item.id === id
    );

    useEffect(() => {
        if (!id) {
            return;
        }

        setPaymentData(getPaymentData(id));
    }, [id]);

    const handleBack = () => {
        navigate("/pedidos");
    };

    const handlePaymentTerms = () => {
        navigate(`/os/${id}/termos-pagamento`);
    };

    const handlePaymentMethods = () => {
        navigate(`/os/${id}/metodo-pagamento`);
    };

    if (!order) {
        return (
            <main className="order-summary-content">
                <section className="order-summary-card">
                    <h1>Ordem de Serviço não encontrada</h1>

                    <button
                        type="button"
                        className="order-summary-button"
                        onClick={handleBack}
                    >
                        Voltar para Ordens de Serviço
                    </button>
                </section>
            </main>
        );
    }

    const paymentTerms = paymentData.terms;

    const paymentTypeLabel =
        paymentTerms.paymentType === "installments"
            ? "Parcelado"
            : "À vista";

    const methodsSummary = getPaymentMethodsSummary(
        paymentData.methods
    );

    return (
        <main className="order-summary-content">
            <section className="order-summary-card">
                <div className="order-summary-header">
                    <button
                        type="button"
                        className="order-summary-back"
                        onClick={handleBack}
                        aria-label="Voltar"
                    >
                        <FaArrowLeft />
                    </button>

                    <div>
                        <span className="order-summary-eyebrow">
                            Ordem de Serviço
                        </span>

                        <h1>OS #{order.numero}</h1>
                    </div>
                </div>

                <section className="order-summary-section">
                    <h2>Resumo da OS</h2>

                    <div className="order-summary-grid">
                        <div>
                            <span>Cliente</span>
                            <strong>{order.cliente}</strong>
                        </div>

                        <div>
                            <span>Categoria</span>
                            <strong>{order.categoria}</strong>
                        </div>

                        <div>
                            <span>Status</span>
                            <strong>{order.status.label}</strong>
                        </div>

                        <div>
                            <span>Responsável</span>
                            <strong>{order.responsavel}</strong>
                        </div>

                        <div>
                            <span>Valor</span>
                            <strong>{order.valor}</strong>
                        </div>
                    </div>
                </section>

                <section className="order-summary-section">
                    <div className="order-summary-section-header">
                        <div>
                            <span className="order-summary-eyebrow">
                                Financeiro
                            </span>

                            <h2>Detalhes financeiros</h2>
                        </div>

                        <FaCreditCard />
                    </div>

                    <div className="financial-summary">
                        <div className="financial-summary-item">
                            <span>Condições de pagamento</span>

                            <strong>{paymentTypeLabel}</strong>
                        </div>

                        {paymentTerms.paymentType === "installments" &&
                            paymentTerms.installments && (
                                <div className="financial-summary-item">
                                    <span>Parcelamento</span>

                                    <strong>
                                        {paymentTerms.installments}
                                    </strong>
                                </div>
                            )}

                        {paymentTerms.paymentType === "installments" &&
                            paymentTerms.downPayment && (
                                <div className="financial-summary-item">
                                    <span>Entrada</span>

                                    <strong>
                                        {paymentTerms.downPayment}
                                    </strong>
                                </div>
                            )}

                        {paymentTerms.details && (
                            <div className="financial-summary-item">
                                <span>Detalhes</span>

                                <strong>
                                    {paymentTerms.details}
                                </strong>
                            </div>
                        )}

                        <div className="financial-summary-item">
                            <span>Meios de pagamento</span>

                            <strong>
                                {methodsSummary || "Nenhum meio selecionado"}
                            </strong>
                        </div>
                    </div>

                    <div className="order-summary-actions">
                        <button
                            type="button"
                            className="order-summary-button"
                            onClick={handlePaymentTerms}
                        >
                            Editar condições
                        </button>

                        <button
                            type="button"
                            className="order-summary-button"
                            onClick={handlePaymentMethods}
                        >
                            Editar meios de pagamento
                        </button>
                    </div>
                </section>
            </section>
        </main>
    );
};

export default OrderSummaryPage;