import React from "react";
import "./LoadingOverlay.css";

const LoadingOverlay = ({
    label = "Carregando",
    description = "Aguarde enquanto processamos a solicitação.",
    className = "",
    fullscreen = true,
}) => {
    return (
        <div
            className={`loading-overlay ${fullscreen ? "loading-overlay--fullscreen" : ""} ${className}`.trim()}
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="loading-overlay__backdrop" aria-hidden="true" />
            <div className="loading-overlay__panel">
                <div className="loading-overlay__dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
                <strong className="loading-overlay__label">{label}</strong>
                <span className="loading-overlay__description">{description}</span>
            </div>
        </div>
    );
};

export default LoadingOverlay;