import React, { useEffect, useState } from "react";

export default function RegisterServiceForm({ serviceId, onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [billingType, setBillingType] = useState("fixed");
  const [value, setValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const isEdit = Boolean(serviceId);

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, "");
    const float = (Number(number) / 100).toFixed(2);

    return Number(float).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatUnitValue = (value) => {
    const number = value.replace(/\D/g, "");
    const float = (Number(number) / 100).toFixed(2);
    return float.replace(".", ",");
  };

  const handleValueChange = (e) => {
    const raw = e.target.value;

    if (billingType === "hourly") {
      const formatted = formatUnitValue(raw);
      setValue(formatted === "0,00" && raw === "" ? "" : formatted);
      return;
    }

    const formatted = formatCurrency(raw);
    setValue(formatted);
  };

  const numericValue = Number(value.replace(/\D/g, "")) / 100;

  const isFormValid =
    name.trim() !== "" &&
    value !== "" &&
    value !== "R$ 0,00" &&
    value !== "0,00" &&
    !isLoading;

  useEffect(() => {
    if (!serviceId) return;

    const selecionados =
      JSON.parse(localStorage.getItem("servicosSelecionados")) || [];

    const servico = selecionados.find(
      (s) => String(s.id) === String(serviceId)
    );

    if (!servico) return;

    const serviceBillingType = servico.billingType || "fixed";

    setName(servico.descricao || "");
    setDescription(servico.obs || "");
    setBillingType(serviceBillingType);

    if (serviceBillingType === "hourly") {
      setValue(
        Number(servico.preco || 0)
          .toFixed(2)
          .replace(".", ",")
      );
    } else {
      setValue(
        Number(servico.preco || 0).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      );
    }
  }, [serviceId]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setValue("");
    setBillingType("fixed");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsLoading(true);

    const serviceData = {
      id: serviceId,
      name,
      description,
      billingType,
      value: numericValue,
      isEdit,
    };

    setTimeout(() => {
      setIsLoading(false);

      if (onSuccess) {
        onSuccess(serviceData);
      }

      resetForm();
    }, 1500);
  };

  const handleBillingTypeChange = (type) => {
    setBillingType(type);
    setValue("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="serviceName" className="form-label">
          NOME DO SERVIÇO
        </label>

        <input
          id="serviceName"
          className="form-input"
          type="text"
          placeholder="Ex: Manutenção Elétrica"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="input-group">
        <label htmlFor="serviceDescription" className="form-label">
          DESCRIÇÃO
        </label>

        <textarea
          id="serviceDescription"
          className="form-textarea"
          placeholder="Descreva os detalhes do serviço oferecido..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="input-group">
        <label className="form-label">
          TIPO DE COBRANÇA
        </label>

        <div className="form-radio-group">
          <label
            className="form-radio-option"
            tabIndex={isLoading ? -1 : 0}
            style={{
              pointerEvents: isLoading ? "none" : "auto",
              opacity: isLoading ? 0.7 : 1,
            }}
            onKeyDown={(e) => {
              if (isLoading) return;

              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleBillingTypeChange("fixed");
              }
            }}
          >
            <input
              type="radio"
              name="billing"
              value="fixed"
              checked={billingType === "fixed"}
              onChange={() => handleBillingTypeChange("fixed")}
              disabled={isLoading}
              tabIndex={-1}
            />
            Preço Fixo
          </label>

          <label
            className="form-radio-option"
            tabIndex={isLoading ? -1 : 0}
            style={{
              pointerEvents: isLoading ? "none" : "auto",
              opacity: isLoading ? 0.7 : 1,
            }}
            onKeyDown={(e) => {
              if (isLoading) return;

              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleBillingTypeChange("hourly");
              }
            }}
          >
            <input
              type="radio"
              name="billing"
              value="hourly"
              checked={billingType === "hourly"}
              onChange={() => handleBillingTypeChange("hourly")}
              disabled={isLoading}
              tabIndex={-1}
            />
            Por Unidade de Serviço
          </label>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="serviceValue" className="form-label">
          VALOR {billingType === "hourly" ? "(U.S)" : "(R$)"}
        </label>

        <input
          id="serviceValue"
          className="form-input"
          type="text"
          value={value}
          onChange={handleValueChange}
          placeholder={billingType === "hourly" ? "0,00" : "R$ 0,00"}
          disabled={isLoading}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="form-button form-button-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          className="form-button"
          disabled={!isFormValid || isLoading}
        >
          {isLoading
            ? "SALVANDO..."
            : isEdit
              ? "ATUALIZAR SERVIÇO"
              : "SALVAR SERVIÇO"}
        </button>
      </div>
    </form>
  );
}