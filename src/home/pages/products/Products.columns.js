const parseCurrencyValue = (value) => {
    const text = String(value ?? "")
        .replace(/\s/g, "")
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");

    return Number(text) || 0;
};

export const productsColumns = [
    {
        key: "id",
        header: "ID",
        accessor: "id",
        sortable: true,
        sortType: "number",
    },
    {
        key: "name",
        header: "Nome do Produto",
        accessor: "name",
        sortable: true,
        sortType: "string",
        searchable: true,
    },
    {
        key: "cost",
        header: "Custo (R$)",
        accessor: "cost",
        sortable: true,
        sortType: "custom",
        sortValue: parseCurrencyValue,
    },
    {
        key: "salePrice",
        header: "Preço de Venda (R$)",
        accessor: "salePrice",
        sortable: true,
        sortType: "custom",
        sortValue: parseCurrencyValue,
    },
    {
        key: "stock",
        header: "Quantidade em Estoque",
        accessor: "stock",
        sortable: true,
        sortType: "number",
    },
];