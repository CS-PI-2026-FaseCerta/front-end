import React from 'react';
import './ModuleCard.css';

const ModuleCard = ({ title, description, icon, path, onClick }) => {
  // O uso de 'a' é para semântica, mas o onClick controla a ação
  // para simular a navegação de forma segura.
  const handleClick = (e) => {
    e.preventDefault(); // Previne a navegação padrão do link
    onClick(path);
  };

  return (
    <a href={path} onClick={handleClick} className="module-card">
      <div className="module-card__icon">{icon}</div>
      <h3 className="module-card__title">{title}</h3>
      <p className="module-card__description">{description}</p>
    </a>
  );
};

export default ModuleCard;