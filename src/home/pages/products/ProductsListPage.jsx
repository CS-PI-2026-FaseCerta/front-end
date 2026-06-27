import React, { useState } from "react";
import { FaPen, FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import GenericListPage from "../../../global/components/lists/GenericListPage";

import { productsMockData } from "./Products.mock";
import { productsColumns } from "./Products.columns";
import RegisterProductModal from "../../../form/pages/RegisterProduct/RegisterProductModal";

import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const ProductsListPage = () => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    return (
        <>
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
                        onCreate: {
                            mobile: AppRoutes.RegisterProduct,
                            desktop: () => setIsProductModalOpen(true),
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
                    title: "Crie seu próprio catálogo de produtos!",
                    description: "Isso vai te economizar muito tempo!",
                    actionLabel: "Cadastrar Produto",
                    onCreate: {
                        mobile: AppRoutes.RegisterProduct,
                        desktop: () => setIsProductModalOpen(true),
                    },
                }}
            />

            <RegisterProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
            />
        </>
    );
};

export default ProductsListPage;