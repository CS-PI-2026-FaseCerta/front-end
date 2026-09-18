import React from "react";
import { FaPen, FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";
import { servicesMockData } from "./Services.mock";
import { servicesColumns } from "./Services.columns";
import { servicesFilters } from "./Services.filters";
import RegisterServiceModal from "../../../form/pages/RegisterService/RegisterServiceModal.jsx";
import { useState } from "react";

import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const ServicesListPage = () => {
  const items = servicesMockData;

  const isEmpty = !items || items.length === 0;

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  return (
    <>
      <GenericListPage
        title="Catálogo de Serviços"
        description="Gerencie e organize todos os serviços prestados."
        columns={servicesColumns}
        data={items}
        filters={servicesFilters}
        defaultSort={{
          key: "id",
          direction: "asc",
        }}
        actions={[
          {
            key: "novo-servico",
            label: "Cadastrar Serviço",
            icon: FaPlus,
            onCreate: {
              mobile: AppRoutes.RegisterService,
              desktop: () => setIsServiceModalOpen(true),
            },
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
          onCreate: {
            mobile: AppRoutes.RegisterService,
            desktop: () => setIsServiceModalOpen(true),
          },
        }}
      />
      <RegisterServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />
    </>
  );
};

export default ServicesListPage;