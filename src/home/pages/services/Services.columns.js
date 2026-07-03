const parseCurrencyValue = (value) => {
  const text = String(value ?? "")
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  return Number(text) || 0;
};

export const servicesColumns = [
  {
    key: "nome",
    header: "Nome do Serviço",
    accessor: "nome",
    sortable: true,
    sortType: "string",
    searchable: true,
    width: "33.33%",
  },
  {
    key: "tipoCobranca",
    header: "Tipo de Cobrança",
    accessor: "tipoCobranca",
    type: "badge",
    defaultBadgeVariant: "neutral",
    sortable: true,
    sortType: "string",
    searchable: true,
    width: "33.33%",
  },
  {
    key: "valor",
    header: "Valor (R$)",
    accessor: "valor",
    align: "left",
    sortable: true,
    sortType: "number",
    sortAccessor: (row) => parseCurrencyValue(row.valor),
    searchable: false,
    width: "33.33%",
  },
];