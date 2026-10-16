
export const MONTHS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

export const PAYMENT_TYPES = [
  { value: "A_VISTA", label: "À vista" },
  { value: "PARCELADO", label: "Parcelado" },
  { value: "RECORRENTE", label: "Recorrente" },
];

export const PAYMENT_MODES = [
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito" },
  { value: "PIX", label: "Pix" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "BOLETO", label: "Boleto" },
  { value: "TRANSFERENCIA", label: "Transferência" },
];

export const CATEGORIES = [
  "ALIMENTACAO",
  "GASOLINA",
  "LUZ",
  "INTERNET",
  "ALUGUEL",
  "AGUA",
  "DESPESA",
  "PRO_LABORE",
  "OUTROS",
];

export const EXPENSE_TABLE_COLUMNS = [
  { key: "date", label: "Data", sortable: true },
  { key: "description", label: "Descrição", sortable: true },
  { key: "payee", label: "Pago a", sortable: true },
  { key: "category", label: "Categoria", sortable: true },
  { key: "value", label: "Valor", sortable: true },
  { key: "paymentType", label: "Tipo de pagamento", sortable: true },
  { key: "paymentMode", label: "Modo de pagamento", sortable: true },
  { key: "paid", label: "Pago", sortable: true },
  { key: "actions", label: "", sortable: false },
];

export const labelFor = (options, value) =>
  options.find((item) => item.value === value)?.label || value;
