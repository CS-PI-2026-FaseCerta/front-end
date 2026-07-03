import { FaBoxOpen, FaClipboardList, FaUsers, FaWallet, FaWrench, FaFileAlt } from "react-icons/fa";

export const MODULES = [
  {
    id: "clientes",
    title: "Clientes",
    description: "Gerenciamento de clientes e histórico.",
    path: "/clientes",
    icon: <FaUsers />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 1,
      tecnico: 1,
    },
  },
  {
    id: "ordens-servico",
    title: "Ordens de Serviço",
    description: "Acompanhe solicitações e andamento das atividades em campo.",
    path: "/ordens-servico",
    icon: <FaClipboardList />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 2,
      tecnico: 2,
    },
  },
  {
    id: "produtos-estoque",
    title: "Produtos e Estoque",
    description:
      "Gerencie e centralize produtos, materiais, custos de compra e venda, além de quantidade em estoque com visão integrada.",
    path: "/produtos-estoque",
    icon: <FaBoxOpen />,
    id: "servicos",
    title: "Serviços",
    description: "Catálogo de serviços oferecidos e tabelas de preço.",
    path: "/servicos",
    icon: <FaWrench />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 3,
      tecnico: 3,
    },
  },
  {
    id: "pedidos",
    title: "Pedidos",
    description: "Acompanhamento de pedidos comerciais.",
    path: "/pedidos",
    icon: <FaFileAlt />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 4,
      tecnico: 4,
    },
  },
  {
    id: "estoque",
    title: "Estoque",
    description: "Gerencie itens, materiais e disponibilidade operacional.",
    path: "/produtos-estoque",
    icon: <FaBoxOpen />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 5,
      tecnico: 5,
    },
  },
  {
    id: "financeiro",
    title: "Financeiro",
    description: "Concentre recebimentos, cobranças e indicadores financeiros da operação.",
    path: "/financeiro",
    icon: <FaWallet />,
    allowedProfiles: ["gestor"],
    order: {
      gestor: 6,
    },
  },
];

export const getVisibleModulesByProfile = (profile) =>
  MODULES.filter((moduleItem) =>
    moduleItem.allowedProfiles.includes(profile),
  ).sort((a, b) => {
    const orderA = a.order[profile] ?? 99;
    const orderB = b.order[profile] ?? 99;

    return orderA - orderB;
  });

export const getModuleById = (moduleId) =>
  MODULES.find((moduleItem) => moduleItem.id === moduleId);
