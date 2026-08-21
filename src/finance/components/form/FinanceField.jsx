import React from "react";
import "./FinanceForm.css";

export default function FinanceField({
  label,
  children,
  className = "",
  hint = null,
  hintTone = "default",
}) {
  return (
    <label className={`finance-field ${className}`.trim()}>
      <span className="finance-field__label">{label}</span>
      {hint ? (
        <small className={`finance-field__hint finance-field__hint--${hintTone}`.trim()}>
          {hint}
        </small>
      ) : null}
      {children}
    </label>
  );
}
