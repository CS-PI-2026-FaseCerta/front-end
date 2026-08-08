import React, { useState } from "react";
import { FaPen, FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";
import { customersMockData } from "./Customers.mock";
import { customersColumns } from "./Customers.columns";
import RegisterCustomerModal from "../../../form/pages/registercustomer/RegisterCustomerModal.jsx";

import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const CustomersListPage = () => {
  const items = customersMockData;
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  return (
    <>
      <GenericListPage
        title="Clientes"
        description="Gerencie e acompanhe todos os clientes em tempo real."
        columns={customersColumns}
        data={items}
        defaultSort={{
          key: "id",
          direction: "asc",
        }}
        actions={[
          {
            key: "novo-cliente",
            label: "Novo Cliente",
            icon: FaPlus,
            onCreate: {
              mobile: AppRoutes.RegisterClient,
              desktop: () => setIsCustomerModalOpen(true),
            },
            variant: "primary",
          },
        ]}
        rowActions={[
          {
            key: "visualizar",
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
          title: "Nenhum cliente encontrado",
          description:
            "Use filtros, busca ou crie um novo cliente para começar a alimentar a listagem.",
          actionLabel: "Criar novo cliente",
          onCreate: {
            mobile: AppRoutes.RegisterClient,
            desktop: () => setIsCustomerModalOpen(true),
          },
        }}
      />
      <RegisterCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
    </>
  );
};

export default CustomersListPage;