import React, { useEffect, useState } from "react";
import { getAddressByCep } from "../../../services/addressService";
import customersService from "../../../services/customers/customersService";
import { getCustomerErrorMessage } from "../../../services/customers/customerErrors";
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

export default function RegisterCustomerForm({ onSuccess, onCancel, initialData, mode = "create" }) {
  const [tipo, setTipo] = useState(initialData?.tipo || "PF");
  
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
  ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepMessage, setCepMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setTipo(initialData.tipo || "PF");
    setForm((current) => ({ ...current, ...initialData }));
    setErrors({});
    setFormError("");
  }, [initialData]);

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
        setFormError("");
        
        // Limpa o erro ao digitar
        if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleBlur = async (field) => {
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

  const toggleTipo = (novoTipo) => {
    if (novoTipo === tipo) return;
    setTipo(novoTipo);
    setForm((prev) => ({ ...prev, documento: "", inscricaoEstadual: "", inscricaoMunicipal: "" }));
    setErrors((prev) => ({ ...prev, documento: null, nomeOuRazao: null }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setIsSaving(true);
    setFormError("");
    try {
      const payload = { ...form, tipo };
      const savedCustomer = mode === "edit"
        ? await customersService.updateCustomer(initialData.id, payload)
        : await customersService.createCustomer(payload);
      setIsSaving(false);
      if (onSuccess) onSuccess(savedCustomer);
    } catch (error) {
      setIsSaving(false);
      setFormError(getCustomerErrorMessage(error, "Não foi possível salvar o cliente."));
    }
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

      {formError && <div className="form-error-inline">{formError}</div>}

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
          {isSaving ? "SALVANDO..." : mode === "edit" ? "SALVAR ALTERAÇÕES" : (tipo === "PF" ? "CADASTRAR CLIENTE" : "CADASTRAR EMPRESA")}
        </button>
      </div>
    </form>
  );
}
