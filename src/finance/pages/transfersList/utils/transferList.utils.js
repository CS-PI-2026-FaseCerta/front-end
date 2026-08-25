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

export const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

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

    const raw = String(value).replace(/\D/g, "");
    if (!raw) return "";

    let month = raw.slice(0, 2);
    const year = raw.slice(2, 6);

    if (month.length === 2) {
        const numericMonth = Number(month);

        if (numericMonth < 1) month = "01";
        if (numericMonth > 12) month = "12";
    }

    if (raw.length > 2) {
        return `${month}/${year}`;
    }

    return month;
};

export const parseMonthYearFilter = (value) => {
    const match = String(value ?? "").match(
        /^([0-9]{2})[-/]?([0-9]{4})$/,
    );

    if (!match) return null;

    const month = Number(match[1]);
    const year = Number(match[2]);

    if (month < 1 || month > 12) return null;

    return {
        month,
        year,
    };
};

export const matchesMonthYear = (
    dateString,
    filterMonth,
    filterYear,
) => {
    if (!dateString) return false;

    const date = new Date(
        `${dateString}T12:00:00`,
    );

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    return (
        date.getMonth() + 1 === filterMonth &&
        date.getFullYear() === filterYear
    );
};

export const matchesProgressiveMonthYear = (
    dateString,
    filterString,
) => {
    if (!dateString || !filterString) {
        return false;
    }

    const date = new Date(
        `${dateString}T12:00:00`,
    );

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const month = String(
        date.getMonth() + 1,
    ).padStart(2, "0");

    const year = date.getFullYear();

    return `${month}/${year}`.includes(
        filterString,
    );
};

export const matchesCurrencyFilter = (
    value,
    query,
) => {
    const rawQuery = String(
        query ?? "",
    )
        .trim()
        .replace(/\s/g, "");

    if (!rawQuery) return true;

    const normalizedQuery =
        rawQuery.includes(",")
            ? rawQuery
                .replace(/\./g, "")
                .replace(",", ".")
            : rawQuery;

    const numericValue = Number(value);

    const candidates =
        Number.isFinite(numericValue)
            ? [
                String(numericValue),
                numericValue.toFixed(2),
            ]
            : [
                String(value ?? ""),
            ];

    return candidates.some(
        (candidate) =>
            candidate.includes(
                normalizedQuery,
            ),
    );
};

export const normalize = (value) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();

export const includesNormalized = (
    value,
    query,
) =>
    normalize(value).includes(
        normalize(query),
    );

export const getVisiblePages = (
    currentPage,
    totalPages,
) => {
    if (totalPages <= 5) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1,
        );
    }

    return [
        ...new Set([
            1,
            totalPages,
            currentPage - 1,
            currentPage,
            currentPage + 1,
        ]),
    ]
        .filter(
            (page) =>
                page > 0 &&
                page <= totalPages,
        )
        .sort(
            (a, b) => a - b,
        );
};