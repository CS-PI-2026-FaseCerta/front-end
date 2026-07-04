import React, {useState} from "react";
import {FaArrowLeft} from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import "./PaymentMethods.css";
import "../../../global/components/form/Form.css"
import Header from "../../../global/components/header/Header.jsx"
import Footer from "../../../global/components/Footer/Footer.jsx"

const PAYMENT_METHODS = [
    {id: "boleto", label: "Boleto"},
    {id: "bank_transfer", label: "Transferência bancária"},
    {id: "cash", label: "Dinheiro"},
    {id: "check", label: "Cheque"}, 
    {id: "credit_card", label: "Cartão de crédito"},
    {id: "debit_card", label: "Cartão de débito"},
    {id: "pix", label: "PIX"},
];

export default function PaymentMethods() {
    const navigate = useNavigate();

    const[selectedMethods, setSelectedMethods] = useState([]);
    const[successMessage, setSuccessMessage] = useState("");
    const toggleMethod = (id) => {
        setSelectedMethods(prev) => prev.includes(id)? prev.filter((item) => item !== id) : [...prev, id];
    };

    const isFormValid= selectedMethods.lengh >0;

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!isFormValid) return;

        setSuccessMessage("Meios de pagamento salvos com sucesso!");

        setTimeout(() => {
            setSuccessMessage("");
        },2000);
    };

    return(
        <div className = "service-page">
            <Header/>
            <div className="service-page-content">
                <main className="card-header">
                    <button type="button"className="back-button" onClick={() => navigate(-1)}>
                        <FaArrowLeft size={20} className="back-button-icon" />
                    </button>
                    <h1>Meios de Pagamento</h1>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input-group-payment-methods-list">
                            {PAYMENT_METHODS.map((method) => (
                                <label key={method.id} className="payment-method-options">
                                    <span className="payment-method-label">(method.label)</span>
                                    <input type="checkbox" checked={selectedMethods.includes(method.id)} on onChange={() => toggleMethod(method.i)} />
                                </label>
                            ))}
                        </div>

                        <button type="submit" className="form-button" disabled={!isFormValid}>
                            Salvar
                        </button>

                        {successMessage && (<p className="form-success">(successMessage)</p>)}
                    </form>
                </main>
            </div>
            <Footer/>
        </div>
    );

};