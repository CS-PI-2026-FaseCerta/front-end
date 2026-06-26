import React from "react";

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
        />
    );
};

export default ProductsListPage;