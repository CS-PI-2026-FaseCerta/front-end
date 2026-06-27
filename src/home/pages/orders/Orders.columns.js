const parseCurrencyValue = (value) => {
  const text = String(value ?? "")
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  return Number(text) || 0;
};

export const ordersColumns = [
  {
    key: "numero",
    header: "OS",
    accessor: "numero",
    sortable: true,
    sortType: "number",
    width: "92px",
  },
  {
    key: "cliente",
    header: "Cliente",
    accessor: "cliente",
    sortable: true,
    sortType: "string",
    searchable: true,
  },
  {
    key: "dataAbertura",
    header: "Abertura",
    accessor: (row) =>
      new Date(`${row.dataAbertura}T00:00:00`).toLocaleDateString("pt-BR"),
    sortAccessor: (row) => row.dataAbertura,
    sortable: true,
    sortType: "date",
    searchable: true,
    width: "132px",
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    type: "badge",
    defaultBadgeVariant: "neutral",
    sortable: true,
    sortType: "status",
    sortOrder: ["Aberto", "Em execução", "Finalizado"],
    searchable: true,
    width: "160px",
  },
  {
    key: "responsavel",
    header: "Responsável",
    accessor: "responsavel",
    sortable: true,
    sortType: "string",
    searchable: true,
  },
  {
    key: "valor",
    header: "Valor",
    accessor: "valor",
    align: "right",
    sortable: true,
    sortType: "number",
    sortAccessor: (row) => parseCurrencyValue(row.valor),
    searchable: false,
    width: "120px",
  },
];
