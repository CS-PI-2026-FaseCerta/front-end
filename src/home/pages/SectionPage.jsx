import React from "react";
import { Link } from "react-router-dom";
import HeaderDashBoard from "../components/HeaderDashBoard";
import "./dashboard.css";

const SectionPage = ({
  eyebrow,
  title,
  description,
  ctaLabel = "Voltar ao painel",
  ctaPath = "/",
}) => {
  return (
    <div className="dashboard-page">
      <HeaderDashBoard />

      <main className="dashboard-shell dashboard-shell--section">
        <section className="section-card">
          <span className="dashboard-hero__eyebrow">{eyebrow}</span>
          <h1 className="dashboard-hero__title">{title}</h1>
          <p className="dashboard-hero__subtitle">{description}</p>

          <Link to={ctaPath} className="section-card__button">
            {ctaLabel}
          </Link>
        </section>
      </main>
    </div>
  );
};

export default SectionPage;
