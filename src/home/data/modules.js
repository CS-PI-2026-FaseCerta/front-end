import { FaBoxOpen, FaClipboardList, FaUsers, FaWallet } from "react-icons/fa";

export const MODULES = [
  {
    id: "clientes",
    title: "Gestão de Clientes",
    description:
      "Centralize cadastros, histórico e acompanhamento comercial em um único fluxo.",
    path: "/clientes",
    icon: <FaUsers />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 1,
      tecnico: 2,
    },
  },
  {
    id: "servicos-estoque",
    title: "Serviços e Estoque",
    description:
      "Gerencie itens, materiais e disponibilidade operacional com visão integrada.",
    path: "/servicos-estoque",
    icon: <FaBoxOpen />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 2,
      tecnico: 3,
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
  {
    id: "aplicar-desconto",
    title: "Aplicar Desconto",
    description:
      "Configure descontos para serviços e peças de forma rápida.",
    path: "#",
    icon: <FaWallet />,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 5,
      tecnico: 4,
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
