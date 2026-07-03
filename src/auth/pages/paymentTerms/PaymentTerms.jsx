import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"
import "./PaymentTerms.css";
import "../../../global/components/form/Form.css"
import Header from "../../../global/components/header/Header.jsx"
import Footer from "../../../global/components/Footer/Footer.jsx"

const QUICK_INSTALLMENTS = ["2x", "3x"];

export default function PaymentTerms() {
    const navigate = useNavigate();

    const [paymentType, setPaymentType]= useState("cash");
    const [downPayment, setDownPayment]= useState("");
    const [selectedQuickInstallments, setSelectedQuickInstallments] = useState("");
    const [installmentsText, setInstallmentsText] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const fomatCurrency = (value) => {
        const number = value.replace(/\D/g, "");
        const float = (Number(number)/100).toFixed(2);
        return
        Number(float).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleDownPaymentChange = (e) => {
        const raw = e.target.value;
        if (raw === "") {
            setDownPayment("");
            return;
        }
        setDownPayment(formatCurrency(raw));
    };

    const handleQuickInstallmentsclick = (option) =>{
        setSelectedQuickInstallmentsText(option);
    };

    const handleInstallmentsTextChange = (e) =>{
        const value = e.target.value;
        setInstallmentsText(value);

        if(value !== selectedQuickInstallments("")){
            setSelectedQuickInstallments("");
        }
    };

    const handleSelectCash = () => {
        setPaymentType("cash");
    };

    const handleSelectInstallments = () => {
        setPaymentType("installments");
    };

    const isFormValid = paymentYype === "cash" || (paymentType == "installments" && installmentsText.trim()!== "");

    
};