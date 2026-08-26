import React from "react";
import { FaChevronDown } from "react-icons/fa";
import "./FinanceForm.css";

export default function FinanceSelect({ className = "", children, ...selectProps }) {
  return (
    <div className={`finance-select ${className}`.trim()}>
      <select {...selectProps}>{children}</select>
      <FaChevronDown className="finance-select__chevron" aria-hidden="true" />
    </div>
  );
}
