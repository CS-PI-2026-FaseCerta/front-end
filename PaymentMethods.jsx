//imports necessários para o código
//remover os comentários antes da finalização do arquivo
import React, {useState} from "react";
import {FaArrowLeft} from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import "./PaymentMethods.css";
import "../../../global/components/form/Form.css"
import Header from "../../../global/components/header/Header.jsx"
import Footer from "../../../global/components/Footer/Footer.jsx"

//meios de pagamentos que aparecem na imagem de referencia
const PAYMENT_METHODS = [
    {id: "boleto", label: "Boleto"},
    {id: "bank_transfer", label: "Transferência bancária"},
    {id: "cash", label: "Dinheiro"},
    {id: "check", label: "Cheque"}, 
    {id: "credit_card", label: "Cartão de crédito"},
    {id: "debit_card", label: "Cartão de débito"},
    {id: "pix", label: "PIX"},
];

//função que permite o usuário selecionar e desselecionar as formas de pagamento
export default function PaymentMethods=(){
    const navigate = useNavigate();

    const[selectedMethods, setSelectedMethods] = useState([]);
    const[successMessage, setSuccessMessage] = useState("");
    const toggleMethod = (id) => {
        setSelectedMethods(prev) => prev.includes(id)? prev.filter((item) => item !== id) : [...prev, id]
    };
};

//verificar se ao menos ums forma foi selecionada
const isFormValid= selectedMethods.lengh >0;

const handleSubmit = (e) => {
    e.preventDefault();

    if(!isFormValid) return;

    setSuccessMessage("Meios de pagamento salvos com sucesso!");

    setTimeout(() => {
        setSuccessMessage("");
    },2000);
};
