import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./Modal.css";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div 
        className="modal-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close" 
          type="button" 
          onClick={onClose} 
          aria-label="Fechar"
        >
          <FaTimes size={18} />
        </button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
