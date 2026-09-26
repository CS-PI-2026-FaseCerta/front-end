import api, { getAuthToken } from "../../config/axiosConfig.js";

export async function listExpenses({
  page = 1,
  limit = 20,
  categoria,
  pago,
  tipo_pagamento,
  modo_pagamento,
  data_inicial,
  data_final,
} = {}) {
  const params = { page, limit };

  Object.entries({
    categoria,
    pago,
    tipo_pagamento,
    modo_pagamento,
    data_inicial,
    data_final,
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });

  const { data } = await api.get("/api/despesas", { params });
  return data;
}

export async function getExpense(id) {
  const { data } = await api.get(`/api/despesas/${id}`);
  return data;
}

export async function createExpense(payload) {
  const { data } = await api.post("/api/despesas", payload);
  return data;
}

export async function updateExpense(id, payload) {
  const { data } = await api.patch(`/api/despesas/${id}`, payload);
  return data;
}

export async function deleteExpense(id) {
  const { data } = await api.delete(`/api/despesas/${id}`);
  return data;
}

export function getCurrentRoles() {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const raw = payload.roles || payload.authorities || payload.role || [];
    return (Array.isArray(raw) ? raw : [raw]).map((role) =>
      String(role).replace(/^ROLE_/, ""),
    );
  } catch {
    return [];
  }
  
}
