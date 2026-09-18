const API_BASE_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

const TOKEN_KEYS = ["token", "accessToken", "access_token", "jwt"];

export function getAuthToken() {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    for (const key of TOKEN_KEYS) {
      const token = storage.getItem(key);
      if (token) return token;
    }
  }
  return null;
}

function redirectOnUnauthorized(response) {
  if (response.status === 401) {
    window.location.assign("/login");
  }
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  redirectOnUnauthorized(response);

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = body?.message || body?.error || body?.detail || "Não foi possível concluir a operação.";
    const error = new Error(message);
    error.status = response.status;
    error.data = body;
    throw error;
  }
  return body;
}

export function listExpenses({ page = 1, limit = 20, categoria, pago, tipo_pagamento, modo_pagamento, data_inicial, data_final } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  Object.entries({ categoria, pago, tipo_pagamento, modo_pagamento, data_inicial, data_final }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  });
  return request(`/api/despesas?${params.toString()}`);
}

export const getExpense = (id) => request(`/api/despesas/${id}`);
export const createExpense = (payload) => request("/api/despesas", { method: "POST", body: JSON.stringify(payload) });
export const updateExpense = (id, payload) => request(`/api/despesas/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteExpense = (id) => request(`/api/despesas/${id}`, { method: "DELETE" });

export function getCurrentRoles() {
  const token = getAuthToken();
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const raw = payload.roles || payload.authorities || payload.role || [];
    return (Array.isArray(raw) ? raw : [raw]).map((role) => String(role).replace(/^ROLE_/, ""));
  } catch {
    return [];
  }
}
