import { MONTHS } from "../expenseList.constants.js";

export const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const parseMonth = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), 1);
  }

  if (typeof value === "string") {
    const parsed = new Date(`${value.slice(0, 7)}-01T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
  }

  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const formatMonth = (date) => `${MONTHS[date.getMonth()]}/${date.getFullYear()}`;

export const formatDate = (value) => {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

export const includesNormalized = (value, query) =>
  normalize(value).includes(normalize(query));

export const matchesCurrencyFilter = (value, query) => {
  const rawValueQuery = String(query ?? "").trim().replace(/\s/g, "");
  if (!rawValueQuery) return true;

  const normalizedValueQuery = rawValueQuery.includes(",")
    ? rawValueQuery.replace(/\./g, "").replace(",", ".")
    : rawValueQuery;
  const numericValue = Number(value);
  const candidates = Number.isFinite(numericValue)
    ? [String(numericValue), numericValue.toFixed(2)]
    : [String(value ?? "")];

  return candidates.some((candidate) => candidate.includes(normalizedValueQuery));
};

export const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const normalizeCalculatorExpression = (value) =>
  String(value ?? "")
    .replaceAll(",", ".")
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-");

export const formatCalculatorNumber = (value) => {
  const rounded = Math.round((Number(value) + Number.EPSILON) * 100000000) / 100000000;
  return String(rounded).replace(".", ",");
};

export const evaluateCalculatorExpression = (value) => {
  const normalized = normalizeCalculatorExpression(value).trim();

  if (!normalized || !/^[0-9+\-*/().\s]+$/.test(normalized)) {
    throw new Error("Expressão inválida");
  }

  // A expressão é limitada pelo regex acima a números, parênteses e operadores aritméticos.
  const result = Function(`"use strict"; return (${normalized});`)();

  if (!Number.isFinite(result)) {
    throw new Error("Resultado inválido");
  }

  return result;
};
