import React from "react";
import { FaPen, FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";
import { servicesMockData } from "./Services.mock";
import { servicesColumns } from "./Services.columns";
import { servicesFilters } from "./Services.filters";

const ServicesListPage = () => {
  const items = servicesMockData;

  const isEmpty = !items || items.length === 0;

  return (
    <GenericListPage
      title="Catálogo de Serviços"
      description="Gerencie e organize todos os serviços prestados."
      columns={servicesColumns}
      data={items}
      filters={servicesFilters}
      defaultSort={{
        key: "nome",
        direction: "asc",
      }}
      actions={[
        {
          key: "novo-servico",
          label: "Cadastrar Serviço",
          icon: FaPlus,
          href: "/servicos/novo",
          variant: "primary",
        },
      ]}
      rowActions={[
        {
          key: "editar",
          title: "Editar",
          icon: FaPen,
          iconOnly: true,
          onClick: () => { },
          variant: "ghost",
        },
        {
          key: "excluir",
          title: "Excluir",
          icon: FaTrash,
          iconOnly: true,
          onClick: () => { },
          variant: "ghost",
        },
      ]}
      emptyState={{
        icon: FaClipboardList,
        title: "Salve o Serviço prestado",
        description: "Salve seu catalogo.",
        actionLabel: "+ CADASTRAR SERVIÇO",
        actionHref: "/servicos/novo",
      }}
    />
  );
};

export default ServicesListPage;