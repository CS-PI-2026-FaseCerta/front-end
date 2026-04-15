import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./ModuleCard.css";

const ModuleCard = ({
  title,
  description,
  icon,
  path,
  ctaLabel = "Acessar módulo",
  onClick,
}) => {
  const handleClick = (event) => {
    if (!onClick) {
      return;
    }

    event.preventDefault();
    onClick(path);
  };

  return (
    <Link to={path} onClick={handleClick} className="module-card">
      <div className="module-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="module-card__content">
        <h3 className="module-card__title">{title}</h3>
        <p className="module-card__description">{description}</p>
      </div>
      <span className="module-card__cta">
        {ctaLabel}
        <FaArrowRight />
      </span>
    </Link>
  );
};

export default ModuleCard;
