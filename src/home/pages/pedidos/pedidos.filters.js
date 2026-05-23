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
    ],
  },
];
