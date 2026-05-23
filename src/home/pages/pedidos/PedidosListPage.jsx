import React from "react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";
import { pedidosMockData } from "./pedidos.mock";
import { pedidosColumns } from "./pedidos.columns";
import { pedidosFilters } from "./pedidos.filters";

const PedidosListPage = () => {
  const items = pedidosMockData;

  return (
    <GenericListPage
      title="Ordens de Serviço"
      description="Gerencie e acompanhe todas as ordens de serviço em tempo real."
      columns={pedidosColumns}
      data={items}
      filters={pedidosFilters}
      actions={[
        {
          key: "nova-os",
          label: "Nova OS",
          icon: FaPlus,
          href: "/os/novo",
          variant: "primary",
        },
      ]}
      rowActions={[
        {
          key: "visualizar",
          title: "Editar",
          icon: FaPen,
          iconOnly: true,
          onClick: () => {},
          variant: "ghost",
        },
        {
          key: "excluir",
          title: "Excluir",
          icon: FaTrash,
          iconOnly: true,
          onClick: () => {},
          variant: "ghost",
        },
      ]}
      emptyState={{
        title: "Nenhuma ordem de serviço encontrada",
        description:
          "Use filtros, busca ou crie uma nova OS para começar a alimentar a listagem.",
        actionLabel: "Criar nova OS",
        actionHref: "/os/novo",
      }}
      search={{ placeholder: "Buscar por OS, cliente ou responsável" }}
      footerNote="TODO: integrar com backend futuramente usando paginação, filtros e busca server-side."
    />
  );
};

export default PedidosListPage;
