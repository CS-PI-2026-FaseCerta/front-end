//imports necessários para o código
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

export default function PaymentMethods=(){
    const navigate = useNavigate();

    const[selectedMethods, setSelectedMethods] = useState([]);
    const[successMessage, setSuccessMessage] = useState("");
    //salva e exibe uma imagem de sucesso após o método ser selecionado para que o cliente tenha uma confirmação que foi salvo

    const toggleMethod = (id) => {
        setSelectedMethods(prev) => prev.includes(id)? prev.filter((item) => item !== id) : [...prev, id]
    };
    //função que checa se o método já está marcado como selecionado, se estiver, quando o cliente clicar novamente ele irá remove-lo do array dos métodos marcados
};