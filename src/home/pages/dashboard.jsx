import React from "react";
import { FaBoxOpen, FaClipboardList, FaUsers, FaWallet } from "react-icons/fa";
import HeaderDashBoard from "../components/HeaderDashBoard";
import ModuleCard from "../components/ModuleCard";
import { PERFIL_LABELS, PERFIL_USUARIO } from "../../auth/mockAuth";
import "./dashboard.css";

const MODULOS = [
  {
    id: "clientes",
    title: "Gestão de Clientes",
    description:
      "Centralize cadastros, histórico e acompanhamento comercial em um único fluxo.",
    path: "/clientes",
    icon: <FaUsers />,
    allowedProfiles: ["gestor"],
    order: {
      gestor: 1,
    },
  },
  {
    id: "servicos-estoque",
    title: "Serviços e Estoque",
    description:
      "Gerencie itens, materiais e disponibilidade operacional com visão integrada.",
    path: "/servicos-estoque",
    icon: <FaBoxOpen />,
    allowedProfiles: ["gestor"],
    order: {
      gestor: 2,
    },
  },
  {
    id: "pedidos",
    title: "Pedidos / Ordens de Serviço",
    description:
      "Acompanhe solicitações, abertura de OS e andamento das atividades em campo.",
    path: "/pedidos",
    icon: <FaClipboardList />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 3,
      tecnico: 1,
    },
  },
  {
    id: "financeiro",
    title: "Financeiro",
    description:
      "Concentre recebimentos, cobranças e indicadores financeiros da operação.",
    path: "/financeiro",
    icon: <FaWallet />,
    allowedProfiles: ["gestor"],
    order: {
      gestor: 4,
    },
  },
];

const PERFIL_ATUAL = PERFIL_USUARIO;

const Dashboard = () => {
  const visibleModules = MODULOS.filter((modulo) =>
    modulo.allowedProfiles.includes(PERFIL_ATUAL),
  ).sort((a, b) => {
    const orderA = a.order[PERFIL_ATUAL] ?? 99;
    const orderB = b.order[PERFIL_ATUAL] ?? 99;

    return orderA - orderB;
  });

  const perfilLabel = PERFIL_LABELS[PERFIL_ATUAL] || "Perfil não mapeado";

  return (
    <div className="dashboard-page">
      <HeaderDashBoard />

      <main className="dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <span className="dashboard-hero__eyebrow">Painel de Controle</span>
            <h1 className="dashboard-hero__title">
              Acesso rápido aos módulos operacionais
            </h1>
            <p className="dashboard-hero__subtitle">
              Os módulos abaixo são filtrados de acordo com o perfil
              autenticado. O objetivo desta tela é dar uma visão clara e direta
              das áreas que cada função pode acessar.
            </p>
          </div>

          <aside className="dashboard-hero__profile">
            <span className="dashboard-hero__profile-label">Perfil atual</span>
            <strong>{perfilLabel}</strong>
            <small>
              Alterne o valor de PERFIL_USUARIO no mock para testar "gestor" e
              "tecnico".
            </small>
          </aside>
        </section>

        <section className="dashboard-grid" aria-label="Módulos disponíveis">
          {visibleModules.map((modulo) => (
            <ModuleCard
              key={modulo.id}
              title={modulo.title}
              description={modulo.description}
              icon={modulo.icon}
              path={modulo.path}
              ctaLabel={
                modulo.id === "pedidos" ? "Abrir módulo" : "Acessar módulo"
              }
            />
          ))}
        </section>

        <section className="dashboard-summary">
          <div>
            <span className="dashboard-summary__eyebrow">Área de destaque</span>
            <h2 className="dashboard-summary__title">
              Segurança de interface e controle por perfil
            </h2>
            <p className="dashboard-summary__description">
              A exibição dos cards é apenas uma camada de experiência. A rota de
              Financeiro também é protegida no front-end para evitar acesso
              indevido por URL direta. A validação definitiva deve acontecer no
              backend.
            </p>
          </div>

          <div
            className="dashboard-summary__chips"
            aria-label="Resumo de acesso"
          >
            <span>Gestor vê todos os módulos</span>
            <span>Técnico vê apenas o permitido</span>
            <span>Financeiro exige permissão</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
