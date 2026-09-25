export const servicesColumns = [
  {
    key: "nome",
    header: "Nome do Serviço",
    accessor: "nome",
    sortable: false,
    searchable: true,
    width: "40%",
  },
  {
    key: "tipo_cobranca",
    header: "Tipo de Cobrança",
    accessor: "tipo_cobranca",
    type: "badge",
    defaultBadgeVariant: "neutral",
    sortable: false,
    searchable: false,
    width: "30%",
  },
  {
    key: "valor_base",
    header: "Valor (R$)",
    accessor: "valor_base",
    align: "left",
    sortable: false,
    searchable: false,
    width: "30%",
  },
];
