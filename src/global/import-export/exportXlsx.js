import * as XLSX from "xlsx";

const resolveColumns = (rows = [], columns = []) => {
    if (Array.isArray(columns) && columns.length > 0) {
        return columns;
    }

    if (rows.length > 0) {
        return Object.keys(rows[0]).map((key) => ({ key, header: key }));
    }

    return [];
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
        return value;
    }

    if (Array.isArray(value)) {
        return value.join(" ");
    }

    if (typeof value === "object") {
        return [value.label, value.title, value.name, value.value]
            .filter(Boolean)
            .join(" ");
    }

    return String(value);
};

const resolveColumnValue = (row, column, rowIndex) => {
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

    return row?.[column.key] ?? "";
};

const toMatrix = (rows = [], columns = []) => {
    const resolvedColumns = resolveColumns(rows, columns);
    const headers = resolvedColumns.map(
        (column) => column.header ?? column.label ?? column.key,
    );

    const dataRows = rows.map((row, rowIndex) =>
        resolvedColumns.map((column) =>
            flattenValue(resolveColumnValue(row, column, rowIndex)),
        ),
    );

    return {
        resolvedColumns,
        matrix: [headers, ...dataRows],
    };
};

const normalizeFileName = (filename, extension) => {
    if (!filename) {
        return `exportacao.${extension}`;
    }

    return filename.endsWith(`.${extension}`)
        ? filename
        : `${filename}.${extension}`;
};

export const exportXlsx = (rows = [], options = {}) => {
    const { matrix } = toMatrix(rows, options.columns);
    const worksheet = XLSX.utils.aoa_to_sheet(matrix);
    const workbook = XLSX.utils.book_new();
    const sheetName = options.sheetName || "Dados";
    const fileName = normalizeFileName(options.filename || "exportacao", "xlsx");

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);

    return workbook;
};

export const exportTemplateXlsx = (columns = [], options = {}) => {
    const templateRow = Object.fromEntries(
        columns.map((column) => [column.key, ""]),
    );

    return exportXlsx([templateRow], {
        ...options,
        columns,
        filename: options.filename || "modelo-importacao",
        sheetName: options.sheetName || "Template",
    });
};

export default exportXlsx;