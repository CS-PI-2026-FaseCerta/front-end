export const MONTHS = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

export const PAYMENT_TYPES = ["À vista", "Parcelado", "Recorrente"];

export const PAYMENT_MODES = [
  "Boleto",
  "Carteira Digital",
  "Cartão Pré-pago",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Cheque",
  "Criptomoeda",
  "Depósito Bancário",
  "Dinheiro",
  "Pix",
  "Transferência Bancária",
];

export const CATEGORIES = [
  "Ordem de Serviço",
  "Outros",
];

export const RECEIP_TABLE_COLUMNS = [
  { key: "date", label: "Data", width: "8.5%" },
  { key: "description", label: "Descrição", width: "14%" },
  { key: "payee", label: "recebido de", width: "13.5%" },
  { key: "category", label: "Categoria", width: "11.5%" },
  { key: "value", label: "Valor", width: "9.5%" },
  { key: "paymentType", label: "Tipo pagamento", width: "11%" },
  { key: "paymentMode", label: "Modo do pagamento", width: "11.5%" },
  { key: "paid", label: "Pago?", width: "10.5%" },
  { key: "actions", label: null, ariaLabel: "Ações", sortable: false, width: "10%" },
];
