import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import FocusTrap from "focus-trap-react";
import "./FinanceModal.css";

export default function FinanceModal({
  isOpen,
  title,
  onClose,
  children,
  className = "",
  size = "default",
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
        className="finance-modal__overlay finance-surface-theme"
        role="presentation"
        onMouseDown={onClose}
      >
        <section
          className={`finance-modal finance-modal--${size} ${className}`.trim()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <header className="finance-modal__header">
            <h2>{title}</h2>
            <button
              type="button"
              className="finance-modal__close"
              onClick={onClose}
              aria-label="Fechar"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </header>
          <div className="finance-modal__body">{children}</div>
        </section>
      </div>
    </FocusTrap>
  );
}
