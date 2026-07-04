import React, { useState } from "react";
import { getAddressByCep } from "../../../services/addressService";
import {
    formatCPF,
    formatCNPJ,
    formatPhone,
    formatCEP,
    isValidCPF,
    isValidCNPJ,
    isValidPhone,
    isValidCEP,
} from "../../../utils/maskUtils";

const ESTADOS_BR = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export default function RegisterCustomerForm({ onSuccess, onCancel }) {
    const [tipo, setTipo] = useState("PF"); // "PF" ou "PJ"

    const [form, setForm] = useState({
        nomeOuRazao: "",
        documento: "", // CPF ou CNPJ
        telefone: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        inscricaoEstadual: "", // Apenas PJ
        inscricaoMunicipal: "", // Apenas PJ
        anotacoes: "",
    });

    const [errors, setErrors] = useState({});
    const [loadingCep, setLoadingCep] = useState(false);
    const [cepMessage, setCepMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field, value) => {
        let newValue = value;

        // Aplicação de máscaras
        if (field === "documento") {
            newValue = tipo === "PF" ? formatCPF(value) : formatCNPJ(value);
        } else if (field === "telefone") {
            newValue = formatPhone(value);
        } else if (field === "cep") {
            newValue = formatCEP(value);
        }

        setForm((prev) => ({ ...prev, [field]: newValue }));

        // Limpa o erro ao digitar
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleBlur = (field) => {
        const value = form[field];
        let newErrors = { ...errors };

        if (field === "documento") {
            if (tipo === "PF" && value && !isValidCPF(value)) {
                newErrors.documento = "CPF inválido";
            } else if (tipo === "PJ" && value && !isValidCNPJ(value)) {
                newErrors.documento = "CNPJ inválido";
            } else {
                delete newErrors.documento;
            }
        }

        if (field === "telefone") {
            if (value && !isValidPhone(value)) {
                newErrors.telefone = "Telefone inválido";
            } else {
                delete newErrors.telefone;
            }
        }

        if (field === "cep" && value) {
            if (!isValidCEP(value)) {
                newErrors.cep = "CEP incompleto";
            } else {
                delete newErrors.cep;
                fetchAddress(value);
            }
        }

        if (field === "nomeOuRazao" && !value.trim()) {
            newErrors.nomeOuRazao = tipo === "PF" ? "Nome é obrigatório" : "Razão Social é obrigatória";
        }

        setErrors(newErrors);
    };

    const fetchAddress = async (cep) => {
        setLoadingCep(true);
        setCepMessage("Buscando CEP...");
        try {
            const address = await getAddressByCep(cep);
            setForm((prev) => ({
                ...prev,
                endereco: address.logradouro || prev.endereco,
                bairro: address.bairro || prev.bairro,
                cidade: address.localidade || prev.cidade,
                estado: address.uf || prev.estado,
            }));
            setCepMessage("");
        } catch (error) {
            setCepMessage(error.message || "Não foi possível buscar o CEP. Por favor, preencha manualmente.");
        } finally {
            setLoadingCep(false);
        }
    };

    const toggleTipo = (novoTipo) => {
        if (novoTipo === tipo) return;
        setTipo(novoTipo);
        setForm((prev) => ({ ...prev, documento: "", inscricaoEstadual: "", inscricaoMunicipal: "" }));
        setErrors((prev) => ({ ...prev, documento: null, nomeOuRazao: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate before submit
        let newErrors = {};
        if (!form.nomeOuRazao.trim()) newErrors.nomeOuRazao = "Campo obrigatório";
        if (!form.documento.trim()) newErrors.documento = "Campo obrigatório";
        else if (tipo === "PF" && !isValidCPF(form.documento)) newErrors.documento = "CPF inválido";
        else if (tipo === "PJ" && !isValidCNPJ(form.documento)) newErrors.documento = "CNPJ inválido";

        if (form.telefone && !isValidPhone(form.telefone)) newErrors.telefone = "Telefone inválido";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        // Simular chamada backend
        setTimeout(() => {
            setIsSaving(false);
            if (onSuccess) onSuccess({ tipo, ...form });
        }, 1000);
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="toggle-group">
                <button
                    type="button"
                    className={`toggle-btn ${tipo === "PF" ? "active" : ""}`}
                    onClick={() => toggleTipo("PF")}
                >
                    Pessoa Física
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${tipo === "PJ" ? "active" : ""}`}
                    onClick={() => toggleTipo("PJ")}
                >
                    Pessoa Jurídica
                </button>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="nomeOuRazao" className="form-label">
                        {tipo === "PF" ? "NOME COMPLETO" : "RAZÃO SOCIAL"}
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="nomeOuRazao"
                            className={`form-input ${errors.nomeOuRazao ? "input-error" : ""}`}
                            type="text"
                            placeholder={tipo === "PF" ? "Ex: João da Silva" : "Ex: Empresa Fictícia LTDA"}
                            value={form.nomeOuRazao}
                            onChange={(e) => handleChange("nomeOuRazao", e.target.value)}
                            onBlur={() => handleBlur("nomeOuRazao")}
                            disabled={isSaving}
                        />
                    </div>
                    {errors.nomeOuRazao && <span className="form-error-inline">{errors.nomeOuRazao}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="documento" className="form-label">
                        {tipo === "PF" ? "CPF" : "CNPJ"}
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="documento"
                            className={`form-input ${errors.documento ? "input-error" : ""}`}
                            type="text"
                            placeholder={tipo === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                            value={form.documento}
                            onChange={(e) => handleChange("documento", e.target.value)}
                            onBlur={() => handleBlur("documento")}
                            disabled={isSaving}
                            maxLength={tipo === "PF" ? 14 : 18}
                        />
                    </div>
                    {errors.documento && <span className="form-error-inline">{errors.documento}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="telefone" className="form-label">
                        TELEFONE / WHATSAPP
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="telefone"
                            className={`form-input ${errors.telefone ? "input-error" : ""}`}
                            type="text"
                            placeholder="(00) 00000-0000"
                            value={form.telefone}
                            onChange={(e) => handleChange("telefone", e.target.value)}
                            onBlur={() => handleBlur("telefone")}
                            disabled={isSaving}
                            maxLength={15}
                        />
                    </div>
                    {errors.telefone && <span className="form-error-inline">{errors.telefone}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="cep" className="form-label">
                        CEP
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="cep"
                            className={`form-input ${errors.cep ? "input-error" : ""}`}
                            type="text"
                            placeholder="00000-000"
                            value={form.cep}
                            onChange={(e) => handleChange("cep", e.target.value)}
                            onBlur={() => handleBlur("cep")}
                            disabled={isSaving || loadingCep}
                            maxLength={9}
                        />
                    </div>
                    {errors.cep && <span className="form-error-inline">{errors.cep}</span>}
                    {cepMessage && (
                        <span className={loadingCep ? "form-text" : "form-error-inline"}>
                            {cepMessage}
                        </span>
                    )}
                </div>

                <div className="input-group" style={{ flex: 2 }}>
                    <label htmlFor="endereco" className="form-label">
                        ENDEREÇO (RUA)
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="endereco"
                            className="form-input"
                            type="text"
                            placeholder="Nome da rua ou avenida"
                            value={form.endereco}
                            onChange={(e) => handleChange("endereco", e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="numero" className="form-label">
                        NÚMERO
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="numero"
                            className="form-input"
                            type="text"
                            placeholder="123"
                            value={form.numero}
                            onChange={(e) => handleChange("numero", e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="input-group" style={{ flex: 2 }}>
                    <label htmlFor="complemento" className="form-label">
                        COMPLEMENTO
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="complemento"
                            className="form-input"
                            type="text"
                            placeholder="Apto, Bloco, etc."
                            value={form.complemento}
                            onChange={(e) => handleChange("complemento", e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="bairro" className="form-label">
                        BAIRRO
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="bairro"
                            className="form-input"
                            type="text"
                            placeholder="Nome do bairro"
                            value={form.bairro}
                            onChange={(e) => handleChange("bairro", e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="cidade" className="form-label">
                        CIDADE
                    </label>
                    <div className="form-input-wrapper">
                        <input
                            id="cidade"
                            className="form-input"
                            type="text"
                            placeholder="Ex: São Paulo"
                            value={form.cidade}
                            onChange={(e) => handleChange("cidade", e.target.value)}
                            disabled={isSaving}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="estado" className="form-label">
                        ESTADO
                    </label>
                    <div className="form-input-wrapper">
                        <select
                            id="estado"
                            className="form-input"
                            value={form.estado}
                            onChange={(e) => handleChange("estado", e.target.value)}
                            disabled={isSaving}
                        >
                            <option value="">UF</option>
                            {ESTADOS_BR.map((uf) => (
                                <option key={uf} value={uf}>
                                    {uf}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {tipo === "PJ" && (
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="inscricaoEstadual" className="form-label">
                            INSCRIÇÃO ESTADUAL
                        </label>
                        <div className="form-input-wrapper">
                            <input
                                id="inscricaoEstadual"
                                className="form-input"
                                type="text"
                                placeholder="Isento ou Número"
                                value={form.inscricaoEstadual}
                                onChange={(e) => handleChange("inscricaoEstadual", e.target.value)}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="inscricaoMunicipal" className="form-label">
                            INSCRIÇÃO MUNICIPAL
                        </label>
                        <div className="form-input-wrapper">
                            <input
                                id="inscricaoMunicipal"
                                className="form-input"
                                type="text"
                                placeholder="Número da inscrição"
                                value={form.inscricaoMunicipal}
                                onChange={(e) => handleChange("inscricaoMunicipal", e.target.value)}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="input-group">
                <label htmlFor="anotacoes" className="form-label">
                    ANOTAÇÕES
                </label>
                <div className="form-input-wrapper">
                    <textarea
                        id="anotacoes"
                        className="form-textarea"
                        placeholder="Informações adicionais relevantes..."
                        value={form.anotacoes}
                        onChange={(e) => handleChange("anotacoes", e.target.value)}
                        disabled={isSaving}
                        rows={3}
                    />
                </div>
            </div>

            <div className="form-actions">
                {onCancel && (
                    <button
                        type="button"
                        className="form-button form-button-secondary"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className="form-button"
                    disabled={isSaving}
                >
                    {isSaving ? "SALVANDO..." : (tipo === "PF" ? "CADASTRAR CLIENTE" : "CADASTRAR EMPRESA")}
                </button>
            </div>
        </form>
    );
}