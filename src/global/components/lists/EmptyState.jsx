import React from "react";
import { Link } from "react-router-dom";
import "./EmptyState.css";

const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    actionHref,
    secondaryActionLabel,
    onSecondaryAction,
    className = "",
}) => {
    return (
        <div className={`empty-state ${className}`.trim()}>
            <div className="empty-state__icon" aria-hidden="true">
                {Icon ? <Icon size={32} /> : null}
            </div>
            <div className="empty-state__content">
                <h3 className="empty-state__title">{title}</h3>
                {description ? (
                    <p className="empty-state__description">{description}</p>
                ) : null}
            </div>
            <div className="empty-state__actions">
                {actionLabel && actionHref ? (
                    <Link to={actionHref} className="empty-state__button">
                        {actionLabel}
                    </Link>
                ) : null}
                {actionLabel && onAction ? (
                    <button
                        type="button"
                        className="empty-state__button"
                        onClick={onAction}
                    >
                        {actionLabel}
                    </button>
                ) : null}
                {secondaryActionLabel && onSecondaryAction ? (
                    <button
                        type="button"
                        className="empty-state__button empty-state__button--secondary"
                        onClick={onSecondaryAction}
                    >
                        {secondaryActionLabel}
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default EmptyState;