import React from "react";
import { createPortal } from "react-dom";
import { FaBackspace, FaCheck, FaTimes } from "react-icons/fa";
import "./ExpenseFloatingPanels.css";

const CALCULATOR_KEYS = [
  "backspace", "(", ")", "÷",
  "7", "8", "9", "×",
  "4", "5", "6", "−",
  "1", "2", "3", "+",
  "C", "0", ",", "=",
];

export default function ExpenseCalculator({
  calculator,
  onClose,
  onExpressionChange,
  onKey,
  onUseValue,
}) {
  if (!calculator.open || typeof document === "undefined") return null;

  return createPortal(
    <section
      className={`expense-calculator finance-surface-theme ${calculator.placement === "above" ? "is-above" : "is-below"}`.trim()}
      style={{ left: `${calculator.left}px`, top: `${calculator.top}px` }}
      data-expense-calculator
      role="dialog"
      aria-label="Calculadora de valor"
    >
      <header className="expense-calculator__header">
        <div>
          <span>Calculadora</span>
          <strong>Valor da despesa</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar calculadora">
          <FaTimes aria-hidden="true" />
        </button>
      </header>

      <div className={`expense-calculator__display ${calculator.error ? "has-error" : ""}`.trim()}>
        <input
          value={calculator.expression}
          onChange={(event) => onExpressionChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onKey("=");
            }
          }}
          inputMode="decimal"
          aria-label="Expressão da calculadora"
          placeholder="0"
          autoFocus
        />
        <span>{calculator.error || "Use +, −, ×, ÷ e parênteses"}</span>
      </div>

      <div className="expense-calculator__grid">
        {CALCULATOR_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`expense-calculator__key ${key === "=" ? "is-equals" : ""} ${key === "C" ? "is-clear" : ""} ${["÷", "×", "−", "+"].includes(key) ? "is-operator" : ""}`.trim()}
            onClick={() => onKey(key)}
            aria-label={key === "backspace" ? "Apagar último caractere" : key}
          >
            {key === "backspace" ? <FaBackspace aria-hidden="true" /> : key}
          </button>
        ))}
      </div>

      <button type="button" className="expense-calculator__use" onClick={onUseValue}>
        <FaCheck aria-hidden="true" />
        <span>Usar valor no filtro</span>
      </button>
    </section>,
    document.body,
  );
}
