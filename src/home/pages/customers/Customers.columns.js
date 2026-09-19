

export const customersColumns = [
  {
    key: "id",
    header: "ID",
    accessor: "id",
    sortable: false,
    sortType: "string",
    width: "92px",
  },
  {
    key: "name",
    header: "Nome",
    accessor: "name",
    sortable: false,
    sortType: "string",
    searchable: true,
  },
  {
    key: "cpf/cnpj",
    header: "CPF/CNPJ",
    accessor: "cpfCnpj",
    sortable: false,
    sortType: "string",
    searchable: true,
  },
  {
    key: "telefone",
    header: "Telefone",
    accessor: "telefone",
    sortable: false,
    sortType: "string",
    searchable: true,
  },
];
