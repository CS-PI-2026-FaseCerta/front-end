import React, { useEffect, useMemo, useState } from "react";
import servicosService from "../../../services/servicos/servicosService";
import { getServiceErrorMessage } from "../../../services/servicos/servicosErrors";

const EMPTY_FORM = {
  nome: "",
  descricao: "",
  categoria: "",
  tipo_cobranca: "REAL",
  valor_base: "",
};

const validateValue = (value) => {
  const normalized = String(value ?? "").trim().replace(",", ".");

  if (!normalized) return "Campo obrigatório";
  if (normalized.startsWith("-")) return "O valor não pode ser negativo";
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return "Informe um valor numérico com no máximo duas casas decimais";
  }

  const numericValue = Number(normalized);
  if (!Number.isFinite(numericValue)) return "Informe um valor numérico válido";

  const [integerPart] = normalized.split(".");
  if (integerPart.length > 17) {
    return "O valor deve possuir no máximo 17 dígitos inteiros";
  }

  return "";
};

export default function RegisterServiceForm({
  onSuccess,
  onCancel,
  onSavingChange,
  initialData,
  mode = "create",
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialData });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = mode === "edit";

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...initialData });
    setErrors({});
    setFormError("");
  }, [initialData]);

  useEffect(() => {
    onSavingChange?.(isSaving);
  }, [isSaving, onSavingChange]);

  const isFormValid = useMemo(() => {
    return (
      form.nome.trim() !== "" &&
      form.categoria.trim() !== "" &&
      (form.tipo_cobranca === "REAL" || form.tipo_cobranca === "US") &&
      validateValue(form.valor_base) === "" &&
      !isSaving
    );
  }, [form, isSaving]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.nome.trim()) nextErrors.nome = "Campo obrigatório";
    if (form.nome.trim().length > 255) {
      nextErrors.nome = "O nome não pode exceder 255 caracteres";
    }

    if (!form.categoria.trim()) nextErrors.categoria = "Campo obrigatório";
    if (form.categoria.trim().length > 255) {
      nextErrors.categoria = "A categoria não pode exceder 255 caracteres";
    }

    if (form.tipo_cobranca !== "REAL" && form.tipo_cobranca !== "US") {
      nextErrors.tipo_cobranca = "Selecione REAL ou US";
    }

    const valueError = validateValue(form.valor_base);
    if (valueError) nextErrors.valor_base = valueError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (isEdit && !initialData?.id) {
      setFormError("Não foi possível identificar o serviço para edição.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const savedService = isEdit
        ? await servicosService.updateService(initialData.id, form)
        : await servicosService.createService(form);

      onSuccess?.({ ...savedService, isEdit });
    } catch (error) {
      setFormError(
        getServiceErrorMessage(error, "Não foi possível salvar o serviço."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <label htmlFor="serviceName" className="form-label">
          NOME DO SERVIÇO
        </label>
        <input
          id="serviceName"
          className={`form-input ${errors.nome ? "input-error" : ""}`.trim()}
          type="text"
          placeholder="Ex: Manutenção Elétrica"
          value={form.nome}
          onChange={(event) => handleChange("nome", event.target.value)}
          disabled={isSaving}
          maxLength={255}
        />
        {errors.nome ? <span className="form-error-inline">{errors.nome}</span> : null}
      </div>

      <div className="input-group">
        <label htmlFor="serviceDescription" className="form-label">
          DESCRIÇÃO
        </label>
        <textarea
          id="serviceDescription"
          className="form-textarea"
          placeholder="Descreva os detalhes do serviço oferecido..."
          value={form.descricao}
          onChange={(event) => handleChange("descricao", event.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="input-group">
        <label htmlFor="serviceCategory" className="form-label">
          CATEGORIA
        </label>
        <input
          id="serviceCategory"
          className={`form-input ${errors.categoria ? "input-error" : ""}`.trim()}
          type="text"
          placeholder="Ex: Manutenção"
          value={form.categoria}
          onChange={(event) => handleChange("categoria", event.target.value)}
          disabled={isSaving}
          maxLength={255}
        />
        {errors.categoria ? (
          <span className="form-error-inline">{errors.categoria}</span>
        ) : null}
      </div>

      <div className="input-group">
        <span className="form-label">TIPO DE COBRANÇA</span>
        <div className="form-radio-group">
          <label className="form-radio-option">
            <input
              type="radio"
              name="billing"
              value="REAL"
              checked={form.tipo_cobranca === "REAL"}
              onChange={() => handleChange("tipo_cobranca", "REAL")}
              disabled={isSaving}
            />
            Preço Fixo (REAL)
          </label>

          <label className="form-radio-option">
            <input
              type="radio"
              name="billing"
              value="US"
              checked={form.tipo_cobranca === "US"}
              onChange={() => handleChange("tipo_cobranca", "US")}
              disabled={isSaving}
            />
            Por Unidade de Serviço (US)
          </label>
        </div>
        {errors.tipo_cobranca ? (
          <span className="form-error-inline">{errors.tipo_cobranca}</span>
        ) : null}
      </div>

      <div className="input-group">
        <label htmlFor="serviceValue" className="form-label">
          VALOR BASE (R$)
        </label>
        <input
          id="serviceValue"
          className={`form-input ${errors.valor_base ? "input-error" : ""}`.trim()}
          type="text"
          inputMode="decimal"
          value={form.valor_base}
          onChange={(event) => handleChange("valor_base", event.target.value)}
          placeholder="0,00"
          disabled={isSaving}
        />
        {errors.valor_base ? (
          <span className="form-error-inline">{errors.valor_base}</span>
        ) : null}
      </div>

      {formError ? <div className="form-error-inline">{formError}</div> : null}

      <div className="form-actions">
        {onCancel ? (
          <button
            type="button"
            className="form-button form-button-secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>
        ) : null}

        <button
          type="submit"
          className="form-button"
          disabled={!isFormValid || isSaving}
        >
          {isSaving
            ? "SALVANDO..."
            : isEdit
              ? "ATUALIZAR SERVIÇO"
              : "SALVAR SERVIÇO"}
        </button>
      </div>
    </form>
  );
}
