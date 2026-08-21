import { MONTHS } from "../transferList.constants.js";

export const createId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `transfer-${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

export const formatMonth = (date) =>
    `${MONTHS[date.getMonth()]}/${date.getFullYear()}`;

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

export const normalize = (value) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();

export const includesNormalized = (value, query) =>
    normalize(value).includes(normalize(query));

export const getVisiblePages = (currentPage, totalPages) => {
    if (totalPages <= 5) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1,
        );
    }

    return [...new Set([
        1,
        totalPages,
        currentPage - 1,
        currentPage,
        currentPage + 1,
    ])]
        .filter(
            (page) => page > 0 && page <= totalPages,
        )
        .sort((a, b) => a - b);
};