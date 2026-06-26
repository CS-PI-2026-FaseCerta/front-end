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
    {id: "pix", label: "Pix"},
]