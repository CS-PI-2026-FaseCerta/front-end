import React from "react";
import { FaPen, FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";
import { ordersMockData } from "./Orders.mock";
import { ordersColumns } from "./Orders.columns";
import { ordersFilters } from "./Orders.filters";

const OrdersListPage = () => {
  const items = ordersMockData;

  return (
    <GenericListPage
      title="Ordens de Serviço"
      description="Gerencie e acompanhe todas as ordens de serviço em tempo real."
      columns={ordersColumns}
      data={items}
      filters={ordersFilters}
      defaultSort={{
        key: "dataAbertura",
        direction: "desc",
      }}
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
        icon: FaClipboardList,
        title: "Nenhuma ordem de serviço encontrada",
        description:
          "Use filtros, busca ou crie uma nova OS para começar a alimentar a listagem.",
        actionLabel: "Criar nova OS",
        actionHref: "/os/novo",
      }}
    />
  );
};

export default OrdersListPage;
