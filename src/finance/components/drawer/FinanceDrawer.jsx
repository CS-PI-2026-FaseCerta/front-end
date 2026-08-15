import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import FocusTrap from "focus-trap-react";
import "./FinanceDrawer.css";

export default function FinanceDrawer({
  isOpen,
  title,
  onClose,
  children,
  footer = null,
  ariaLabel,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <FocusTrap active={isOpen}>
      <div
        className="finance-drawer__backdrop finance-surface-theme"
        onMouseDown={onClose}
        role="presentation"
      >
        <aside
          className="finance-drawer"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => event.stopPropagation()}
          aria-label={ariaLabel ?? title}
        >
          <header className="finance-drawer__header">
            <h2>{title}</h2>
            <button type="button" className="finance-drawer__close" onClick={onClose} aria-label="Fechar">
              <FaTimes aria-hidden="true" />
            </button>
          </header>
          <div className="finance-drawer__body">{children}</div>
          {footer ? <footer className="finance-drawer__footer">{footer}</footer> : null}
        </aside>
      </div>
    </FocusTrap>
  );
}
