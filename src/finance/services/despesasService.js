import api, { getAuthToken } from "../../config/axiosConfig.js";
import { getCurrentUser } from "../../auth/mockAuth.js";

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

  // O login mock persiste um perfil, mas não gera JWT.
  if (!token) {
    const profile = getCurrentUser()?.perfil;
    return profile ? [String(profile).trim().toUpperCase()] : [];
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const raw = payload.roles || payload.authorities || payload.role || [];
    return (Array.isArray(raw) ? raw : [raw]).map((role) =>
      String(role).trim().toUpperCase().replace(/^ROLE_/, ""),
    );
  } catch {
    // Um JWT inválido não deve conceder permissões via perfil local.
    return [];
  }
}

export function canDeleteExpense() {
  return getCurrentRoles().some((role) => role === "ADMIN" || role === "GESTOR");
}
