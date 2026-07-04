const parseCurrencyValue = (value) => {
  const text = String(value ?? "")
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  return Number(text) || 0;
};

export const customersColumns = [
  {
    key: "id",
    header: "ID",
    accessor: "id", 
    sortable: true,
    sortType: "number",
    width: "92px",
  },
  {
    key: "name",
    header: "Nome",
    accessor: "name",
    sortable: true,
    sortType: "string",
    searchable: true,
  },
  {
    key: "cpf/cnpj",
    header: "CPF/CNPJ",
    accessor: "cpfCnpj",
    sortable: true,
    sortType: "string",
    searchable: true,
  },
  {
    key: "telefone",
    header: "Telefone",
    accessor: "telefone",
    sortable: true,
    sortType: "string",
    searchable: true,
  },
];
