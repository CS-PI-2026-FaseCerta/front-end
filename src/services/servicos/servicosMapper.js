const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "") ?? "";

const formatCurrency = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return "-";

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export const mapServiceFromApi = (service = {}) => {
  const tipoCobranca = firstValue(service.tipoCobranca, service.tipo_cobranca);
  const valorBase = firstValue(service.valorBase, service.valor_base);

  return {
    id: service.id,
    nome: firstValue(service.nome),
    descricao: firstValue(service.descricao),
    categoria: firstValue(service.categoria),
    tipo_cobranca: tipoCobranca,
    valor_base: valorBase,
  };
};

export const mapServiceListItem = (service = {}) => {
  const mapped = mapServiceFromApi(service);

  return {
    ...mapped,
    tipo_cobranca: {
      label: mapped.tipo_cobranca,
      variant: mapped.tipo_cobranca === "REAL" ? "success" : "info",
    },
    valor_base: formatCurrency(mapped.valor_base),
  };
};

export const mapServiceListResponse = (response = {}) => {
  const items = response.items ?? response.content ?? response.data ?? (Array.isArray(response) ? response : []);
  const totalItems = response.total ?? response.totalElements ?? response.totalItems ?? items.length;

  return {
    items: Array.isArray(items) ? items.map(mapServiceListItem) : [],
    totalItems: Number(totalItems) || 0,
    page: Number(response.page) || 1,
    limit: Number(response.limit) || 10,
    totalPages: Number(response.totalPages) || 0,
  };
};

export const mapServiceToForm = (service = {}) => {
  const mapped = mapServiceFromApi(service);

  return {
    id: mapped.id,
    nome: mapped.nome,
    descricao: mapped.descricao,
    categoria: mapped.categoria,
    tipo_cobranca: mapped.tipo_cobranca || "REAL",
    valor_base:
      mapped.valor_base === "" || mapped.valor_base == null
        ? ""
        : String(mapped.valor_base).replace(".", ","),
  };
};

export const mapServiceToApi = (form = {}) => ({
  nome: String(form.nome ?? "").trim(),
  descricao: String(form.descricao ?? "").trim() || null,
  categoria: String(form.categoria ?? "").trim(),
  tipo_cobranca: form.tipo_cobranca,
  valor_base: Number(String(form.valor_base ?? "").trim().replace(",", ".")),
});
