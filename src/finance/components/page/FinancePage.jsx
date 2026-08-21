import React from "react";
import FinancePageHeader from "./FinancePageHeader.jsx";
import "./FinancePage.css";

export default function FinancePage({
  title,
  eyebrow = "Financeiro",
  ariaLabel,
  children,
  footer = null,
  className = "",
  panelClassName = "",
  contentClassName = "",
}) {
  return (
    <main className={`finance-page ${className}`.trim()}>
      <section
        className={`finance-page__panel ${panelClassName}`.trim()}
        aria-label={ariaLabel}
      >
        <FinancePageHeader eyebrow={eyebrow} title={title} />
        <div className={`finance-page__content ${contentClassName}`.trim()}>
          {children}
        </div>
        {footer}
      </section>
    </main>
  );
}
