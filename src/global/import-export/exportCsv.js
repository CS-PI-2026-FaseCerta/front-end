const escapeCsvValue = (value) => {
    const text = String(value ?? "");
    const escaped = text.replace(/"/g, '""');

    return `"${escaped}"`;
};

const flattenValue = (value) => {
    if (value == null) {
        return "";
    }

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map(flattenValue).filter(Boolean).join(" ");
    }

    if (typeof value === "object") {
        return [value.label, value.title, value.name, value.value]
            .map(flattenValue)
            .filter(Boolean)
            .join(" ");
    }

    return String(value);
};

const resolveColumnValue = (row, column, rowIndex) => {
    if (!column) {
        return "";
    }

    if (typeof column.exportValue === "function") {
        return column.exportValue(row, rowIndex);
    }

    if (column.exportValue != null) {
        return column.exportValue;
    }

    if (typeof column.accessor === "function") {
        return column.accessor(row, rowIndex);
    }

    if (column.accessor && row) {
        return row[column.accessor];
    }

    if (column.key && row) {
        return row[column.key];
    }

    return "";
};

const resolveColumns = (rows = [], columns = []) => {
    if (Array.isArray(columns) && columns.length > 0) {
        return columns;
    }

    if (rows.length > 0) {
        return Object.keys(rows[0]).map((key) => ({ key, header: key }));
    }

    return [];
};

export const toCsv = (rows = [], columns = [], options = {}) => {
    const resolvedColumns = resolveColumns(rows, columns);
    const delimiter = options.delimiter || ";";

    const headers = resolvedColumns.map(
        (column) => column.header ?? column.label ?? column.key,
    );
    const lines = [headers.map(escapeCsvValue).join(delimiter)];

    rows.forEach((row, rowIndex) => {
        const values = resolvedColumns.map((column) =>
            escapeCsvValue(flattenValue(resolveColumnValue(row, column, rowIndex))),
        );

        lines.push(values.join(delimiter));
    });

    return lines.join("\n");
};

export const downloadCsv = (csvContent, filename = "exportacao.csv") => {
    if (typeof document === "undefined") {
        return;
    }

    const blob = new Blob(["\ufeff", csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export const buildTemplateRows = (columns = []) => [
    Object.fromEntries(columns.map((column) => [column.key, ""])),
];

export const exportCsv = (rows = [], options = {}) => {
    const csvContent = toCsv(rows, options.columns, options);

    downloadCsv(csvContent, options.filename);

    return csvContent;
};

export const exportTemplateCsv = (columns = [], options = {}) => {
    const csvContent = toCsv(buildTemplateRows(columns), columns, options);

    downloadCsv(csvContent, options.filename || "modelo-importacao.csv");

    return csvContent;
};

export default exportCsv;