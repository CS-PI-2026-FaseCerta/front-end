import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FinancePage from "../../components/page/FinancePage.jsx";
import FinanceField from "../../components/form/FinanceField.jsx";
import LoadingOverlay from "../../../global/components/loading/LoadingOverlay.jsx";
import { CATEGORIES, PAYMENT_MODES, PAYMENT_TYPES } from "../expenselist/expenseList.constants.js";
import { createExpense } from "../../services/despesasService.js";
import "../../components/form/FinanceForm.css";

export default function NewExpense() {
  const navigate = useNavigate(); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  const submit = async (event) => {
    event.preventDefault(); const f=new FormData(event.currentTarget); const valor=Number(f.get("valor"));
    if (!Number.isFinite(valor) || valor <= 0) { setError("O valor deve ser numérico e maior que zero."); return; }
    setLoading(true); setError("");
    try {
      await createExpense({ data:f.get("data"), descricao:f.get("descricao"), pago_a:f.get("pago_a"), categoria:f.get("categoria"), valor,
        tipo_pagamento:f.get("tipo_pagamento"), modo_pagamento:f.get("modo_pagamento"), pago:f.get("pago") === "on" });
      navigate("/financeiro/despesas", { replace:true });
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return <>
    {loading ? <LoadingOverlay label="Salvando despesa" /> : null}
    <FinancePage title="CADASTRAR DESPESA" eyebrow="Financeiro" ariaLabel="Cadastrar despesa">
      <form className="finance-form" onSubmit={submit}>
        {error ? <p role="alert">{error}</p> : null}
        <div className="finance-form__grid">
          <FinanceField label="Data"><input name="data" type="date" required /></FinanceField>
          <FinanceField label="Valor"><input name="valor" type="number" min="0.01" step="0.01" required /></FinanceField>
          <FinanceField label="Descrição" className="is-wide"><input name="descricao" required /></FinanceField>
          <FinanceField label="Pago a" className="is-wide"><input name="pago_a" required /></FinanceField>
          <FinanceField label="Categoria"><select name="categoria" required>{CATEGORIES.map(v=><option key={v} value={v}>{v}</option>)}</select></FinanceField>
          <FinanceField label="Tipo de pagamento"><select name="tipo_pagamento" required>{PAYMENT_TYPES.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}</select></FinanceField>
          <FinanceField label="Modo de pagamento" className="is-wide"><select name="modo_pagamento" required>{PAYMENT_MODES.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}</select></FinanceField>
        </div>
        <label className="finance-checkbox-row"><input name="pago" type="checkbox" /><span>Despesa paga</span></label>
        <div className="finance-modal-actions"><button type="button" className="finance-button finance-button--secondary" onClick={()=>navigate("/financeiro/despesas")}>Cancelar</button><button type="submit" className="finance-button finance-button--primary">Cadastrar</button></div>
      </form>
    </FinancePage>
  </>;
}
