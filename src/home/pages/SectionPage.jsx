import React from "react";
import { Link } from "react-router-dom";
import Header from "../../global/components/header/Header.jsx";

import "./Dashboard.css";

const SectionPage = ({
  eyebrow,
  title,
  description,
  ctaLabel = "Voltar ao painel",
  ctaPath = "/",
  children,
}) => {
  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-shell dashboard-shell--section">
        <section className="section-card">
          <span className="dashboard-hero__eyebrow">
            {eyebrow}
          </span>

          <h1 className="dashboard-hero__title">
            {title}
          </h1>

          <p className="dashboard-hero__subtitle">
            {description}
          </p>

          {children}

          <Link
            to={ctaPath}
            className="section-card__button"
          >
            {ctaLabel}
          </Link>
        </section>
      </main>
    </div>
  );
};

export default SectionPage;