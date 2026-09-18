import React from "react";

export default function FinancePageHeader({ eyebrow = "Financeiro", title }) {
  return (
    <header className="finance-page-header">
      <div>
        {eyebrow ? <span className="finance-page-header__eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
      </div>
    </header>
  );
}
