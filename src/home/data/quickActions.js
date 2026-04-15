import {
  FaBoxOpen,
  FaClipboardList,
  FaMoneyBillWave,
  FaTools,
  FaUserPlus,
} from "react-icons/fa";

// TODO: Integrar com backend para carregar atalhos personalizados do usuário logado.
// Hoje o array é mockado para validar comportamento do carrossel e regras de perfil.
export const QUICK_ACTIONS = [
  {
    id: "criar-os",
    nome: "Criar OS",
    rota: "/os/novo",
    icon: FaClipboardList,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 1,
      tecnico: 1,
    },
  },
  {
    id: "cadastrar-cliente",
    nome: "Cadastrar Cliente",
    rota: "/clientes/novo",
    icon: FaUserPlus,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 2,
      tecnico: 2,
    },
  },
  {
    id: "cadastrar-despesa",
    nome: "Cadastrar Despesa",
    rota: "/financeiro/despesas/nova",
    icon: FaMoneyBillWave,
    allowedProfiles: ["gestor"],
    order: {
      gestor: 3,
    },
  },
  {
    id: "novo-item",
    nome: "Novo Item",
    rota: "/servicos-estoque/novo-item",
    icon: FaBoxOpen,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 4,
      tecnico: 3,
    },
  },
  {
    id: "novo-servico",
    nome: "Novo Serviço",
    rota: "/cadastroServico",
    icon: FaTools,
    allowedProfiles: ["gestor", "tecnico"],
    order: {
      gestor: 5,
      tecnico: 4,
    },
  },
];
