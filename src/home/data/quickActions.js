import {
  FaBoxOpen,
  FaClipboardList,
  FaMoneyBillWave,
  FaTools,
  FaUserPlus,
  FaCity,
} from "react-icons/fa";

import { PiToolboxBold } from "react-icons/pi";

// TODO: Integrar com backend para carregar atalhos personalizados do usuário logado.
// Hoje o array é mockado para validar comportamento do carrossel e regras de perfil.
export const QUICK_ACTIONS = [
  {
    id: "criar-os",
    nome: "Criar OS",
    rota: "/os/novo",
    icon: FaClipboardList,
    allowedProfiles: ["admin", "gestor", "tecnico"],
    order: {
      gestor: 1,
      tecnico: 1,
    },
  },
  {
    id: "inserir-servico", 
    nome: "Inserir Serviço",
    rota: "/inserirServico",
    icon: PiToolboxBold,
    allowedProfiles: ["admin", "gestor", "tecnico"],
    order: {
      gestor: 1,
      tecnico: 1,
    },
  },
  {
    id: "cadastrar-cliente",
    nome: "Cadastrar Cliente",
    rota: "/cadastroCliente",
    icon: FaUserPlus,
    allowedProfiles: ["admin", "gestor", "tecnico"],
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
    allowedProfiles: ["admin", "gestor"],
    order: {
      gestor: 3,
    },
  },
  {
    id: "novo-servico",
    nome: "Novo Serviço",
    rota: "/cadastroServico",
    icon: FaTools,
    allowedProfiles: ["admin", "gestor", "tecnico"],
    order: {
      gestor: 5,
      tecnico: 4,
    },
  },
  {
    id: "cadastrar-cidade",
    nome: "Cadastrar Cidade",
    rota: "/cadastroCidade",
    icon: FaCity,
    allowedProfiles: ["admin", "gestor", "tecnico"],
    order: {
      gestor: 6,
      tecnico: 5,
    },
  },
  {
    id: "cadastrar-produto",
    nome: "Cadastrar Produto",
    rota: "/cadastroProduto",
    icon: FaBoxOpen,
    allowedProfiles: ["admin", "gestor", "tecnico"],
    order: {
      gestor: 7,
      tecnico: 6,
    },
  },
];
