import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./ModuleCard.css";

const ModuleCard = ({
  title,
  description,
  icon,
  path,
  onClick,
}) => {
  const handleClick = (event) => {
    if (!onClick) {
      return;
    }

    event.preventDefault();
    onClick();
  };

  return (
    <Link to={path} onClick={handleClick} className="module-card" title={description}>
      <div className="module-card__icon" aria-hidden="true">
        {icon}
      </div>

      <div className="module-card__content">
        <h3 className="module-card__title">{title}</h3>
      </div>
    </Link>
  );
};

export default ModuleCard;