import api from "../../config/axiosConfig.js";
import { getCurrentUser } from "../../auth/session.js";

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

// Fonte de verdade para a autorização é sempre o backend. O frontend apenas
// ajusta a interface ao perfil informado no JWT da sessão atual.
export function getCurrentRoles() {
  const role = getCurrentUser()?.perfil;
  return role ? [role.toUpperCase()] : [];
}

export function canDeleteExpense() {
  // DELETE /api/despesas/{id} aceita somente ROLE_ADMIN no backend.
  return getCurrentRoles().includes("ADMIN");
}
