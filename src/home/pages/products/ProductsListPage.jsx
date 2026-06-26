import React from "react";
import { FaPen, FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";

import { productsMockData } from "./Products.mock";
import { productsColumns } from "./Products.columns";

const ProductsListPage = () => {
    return (
        <GenericListPage
            title="Estoque"
            description="Gerencie os produtos disponíveis em estoque."
            columns={productsColumns}
            data={productsMockData}
            defaultSort={{
                key: "id",
                direction: "asc",
            }}
            actions={[
              {
                key: "novo-produto",
                label: "Novo Produto",
                icon: FaPlus,
                href: "/produtos-estoque/novo-item",
                variant: "primary",
                },
            ]}
        />
    );
};

export default ProductsListPage;