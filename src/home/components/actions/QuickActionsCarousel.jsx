import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaCog,
  FaPlus,
} from "react-icons/fa";
import "./QuickActionsCarousel.css";

const QuickActionsCarousel = ({ actions = [], onSeeMore, onCustomize }) => {
  const trackRef = useRef(null);

  const scrollTrack = (direction) => {
    if (!trackRef.current) {
      return;
    }

    const trackWidth = trackRef.current.clientWidth;

    trackRef.current.scrollBy({
      left: direction * Math.max(trackWidth * 0.8, 240),
      behavior: "smooth",
    });
  };

  return (
    <section className="quick-actions" aria-label="Atalhos rápidos">
      <header className="quick-actions__header">
        <div className="quick-actions__title-wrap">
          <span className="quick-actions__eyebrow">Atalhos Rápidos</span>
          <h2 className="quick-actions__title">
            Ações frequentes em um clique
          </h2>
        </div>

        <div className="quick-actions__actions">
          <button
            type="button"
            className="quick-actions__customize"
            onClick={onCustomize}
          >
            <FaCog />
            Personalizar
          </button>

          <div
            className="quick-actions__controls"
            aria-label="Controles do carrossel"
          >
            <button
              type="button"
              className="quick-actions__control"
              onClick={() => scrollTrack(-1)}
              aria-label="Rolar atalhos para a esquerda"
            >
              <FaArrowLeft />
            </button>
            <button
              type="button"
              className="quick-actions__control"
              onClick={() => scrollTrack(1)}
              aria-label="Rolar atalhos para a direita"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </header>

      <div className="quick-actions__track" ref={trackRef}>
        {actions.map((action) => {
          const IconComponent = action.icon;

          return (
            <Link
              key={action.id}
              to={action.rota}
              className="quick-actions__card"
            >
              <div className="quick-actions__icon" aria-hidden="true">
                <IconComponent />
              </div>
              <div className="quick-actions__content">
                <h3>{action.nome}</h3>
                <span>
                  Ir para ação
                  <FaPlus />
                </span>
              </div>
            </Link>
          );
        })}

        <button
          type="button"
          className="quick-actions__card quick-actions__card--more"
          onClick={onSeeMore}
        >
          <div className="quick-actions__icon" aria-hidden="true">
            <FaBars />
          </div>
          <div className="quick-actions__content">
            <h3>Ver mais</h3>
            <span>Mais atalhos no menu</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default QuickActionsCarousel;
