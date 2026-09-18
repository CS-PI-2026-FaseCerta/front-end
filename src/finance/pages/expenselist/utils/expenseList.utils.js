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

export const formatDateFilterMask = (value) => {
  if (!value) return "";
  const raw = value.replace(/\D/g, "");
  if (raw.length === 0) return "";
  
  let month = raw.slice(0, 2);
  const year = raw.slice(2, 6);
  
  if (month.length === 2) {
    const m = parseInt(month, 10);
    if (m < 1) month = "01";
    if (m > 12) month = "12";
  }
  
  if (raw.length > 2) {
    return `${month}/${year}`;
  }
  return month;
};

export const parseMonthYearFilter = (value) => {
  const match = String(value ?? "").match(/^(\d{2})[-/]?(\d{4})$/);
  if (!match) return null;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  if (month < 1 || month > 12) return null;
  return { month, year };
};

export const matchesMonthYear = (dateString, filterMonth, filterYear) => {
  if (!dateString) return false;
  const d = new Date(`${dateString}T12:00:00`);
  return d.getMonth() + 1 === filterMonth && d.getFullYear() === filterYear;
};

export const matchesProgressiveMonthYear = (dateString, filterString) => {
  if (!dateString || !filterString) return false;
  const d = new Date(`${dateString}T12:00:00`);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${m}/${y}`.includes(filterString);
};

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
