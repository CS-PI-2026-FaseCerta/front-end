import React, { useState } from "react";
import { FaPlus, FaSyncAlt } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";
import { pedidosMockData } from "./pedidos.mock";
import { pedidosColumns } from "./pedidos.columns";
import { pedidosFilters } from "./pedidos.filters";

const PedidosListPage = () => {
  const [items, setItems] = useState(pedidosMockData);

  const handleRefresh = () => {
    setItems([...pedidosMockData]);
  };

  return (
    <GenericListPage
      title="Ordens de Serviço"
      description="Monitore pedidos, acompanhe o andamento operacional e prepare a base para integração com o backend futuramente."
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
        {
          key: "atualizar",
          label: "Atualizar",
          icon: FaSyncAlt,
          onClick: handleRefresh,
          variant: "secondary",
        },
      ]}
      rowActions={[
        {
          key: "visualizar",
          label: "Abrir",
          onClick: () => {},
          variant: "ghost",
        },
        {
          key: "editar",
          label: "Editar",
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
      search={{
        placeholder: "Buscar por cliente, OS, responsável ou categoria",
      }}
      footerNote="TODO: integrar com backend futuramente usando paginação, filtros e busca server-side."
      onRetry={handleRefresh}
    />
  );
};

export default PedidosListPage;
