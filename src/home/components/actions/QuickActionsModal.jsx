import React from "react";
import { FaTimes } from "react-icons/fa";
import "./QuickActionsModal.css";
import FocusTrap from "focus-trap-react";

const QuickActionsModal = ({
    isOpen,
    actions = [],
    selectedIds = [],
    onToggleAction,
    onSave,
    onCancel,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <FocusTrap active={isOpen}>
            <div className="quick-actions-modal" role="dialog" aria-modal="true">
                <div
                    className="quick-actions-modal__backdrop"
                    onClick={onCancel}
                    aria-hidden="true"
                />

                <div className="quick-actions-modal__panel">
                    <header className="quick-actions-modal__header">
                        <div>
                            <h3>Personalizar atalhos</h3>
                            <p>Selecione os atalhos que devem aparecer no carrossel.</p>
                        </div>
                        <button
                            type="button"
                            className="quick-actions-modal__close"
                            onClick={onCancel}
                            aria-label="Fechar personalização"
                        >
                            <FaTimes />
                        </button>
                    </header>

                    <ul className="quick-actions-modal__list">
                        {actions.map((action) => {
                            const IconComponent = action.icon;
                            const checked = selectedIds.includes(action.id);

                            return (
                                <li key={action.id}>
                                    <label className="quick-actions-modal__item">
                                        <span
                                            className="quick-actions-modal__item-icon"
                                            aria-hidden="true"
                                        >
                                            <IconComponent />
                                        </span>
                                        <span className="quick-actions-modal__item-label">
                                            {action.nome}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => onToggleAction(action.id)}
                                        />
                                    </label>
                                </li>
                            );
                        })}
                    </ul>

                    <footer className="quick-actions-modal__footer">
                        <button
                            type="button"
                            className="quick-actions-modal__button quick-actions-modal__button--ghost"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="quick-actions-modal__button quick-actions-modal__button--primary"
                            onClick={onSave}
                        >
                            Salvar
                        </button>
                    </footer>
                </div>
            </div>
        </FocusTrap>
    );
};

export default QuickActionsModal;