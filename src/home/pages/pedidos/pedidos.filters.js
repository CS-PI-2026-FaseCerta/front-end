export const pedidosFilters = [
  {
    key: "status",
    label: "Status",
    type: "select",
    placeholder: "Todos os status",
    defaultValue: "",
    options: [
      { value: "Finalizado", label: "Finalizado" },
      { value: "Em execução", label: "Em execução" },
      { value: "Aberto", label: "Aberto" },
      { value: "Pausado", label: "Pausado" },
    ],
  },
  {
    key: "categoria",
    label: "Categoria",
    type: "text",
    placeholder: "Filtrar por categoria",
  },
  {
    key: "responsavel",
    label: "Responsável",
    type: "text",
    placeholder: "Filtrar por responsável",
  },
];
