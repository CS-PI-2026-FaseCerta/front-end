export const pedidosColumns = [
  {
    key: "numero",
    header: "OS",
    accessor: "numero",
    width: "92px",
  },
  {
    key: "cliente",
    header: "Cliente",
    accessor: "cliente",
    searchable: true,
  },
  {
    key: "categoria",
    header: "Categoria",
    accessor: "categoria",
    searchable: true,
  },
  {
    key: "dataAbertura",
    header: "Abertura",
    accessor: (row) =>
      new Date(`${row.dataAbertura}T00:00:00`).toLocaleDateString("pt-BR"),
    searchable: false,
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    type: "badge",
    defaultBadgeVariant: "neutral",
    searchable: true,
  },
  {
    key: "prioridade",
    header: "Prioridade",
    accessor: "prioridade",
    type: "badge",
    defaultBadgeVariant: "neutral",
    searchable: true,
  },
  {
    key: "responsavel",
    header: "Responsável",
    accessor: "responsavel",
    searchable: true,
  },
  {
    key: "valor",
    header: "Valor",
    accessor: "valor",
    align: "right",
    searchable: false,
  },
];
