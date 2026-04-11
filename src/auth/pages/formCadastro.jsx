import React, { useState, useEffect } from 'react';
import './formCadastro.css';
import { FaArrowLeft } from "react-icons/fa"; 

const CadastrarCliente = () => {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        telefone: '',
    });

    const [isbuttonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const { nome, cpf, telefone } = formData;

        const allFilled = nome && cpf && telefone;

        setIsButtonDisabled(!allFilled);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isbuttonDisabled) return;

        alert(`Cliente cadastrado: 
            nome: ${formData.nome}
            cpf: ${formData.cpf}
            telefone: ${formData.telefone}`);
    }
};
