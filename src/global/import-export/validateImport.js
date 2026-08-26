import { normalizeHeader } from "./importCsv";

const normalizeValue = (value) => {
  if (value == null) {
    return "";
  }

  return String(value).trim();
};

const defaultError = (line, message, code = "validation") => ({
  code,
  line,
  message,
});

const isEmptyRow = (row = []) =>
  row.every((cell) => normalizeValue(cell) === "");

const buildColumnAliases = (column) => {
  const aliases = [
    column.key,
    column.label,
    column.header,
    ...(Array.isArray(column.importAliases) ? column.importAliases : []),
  ]
    .map((value) => normalizeHeader(value))
    .filter(Boolean);

  return Array.from(new Set(aliases));
};

const buildColumnMap = (columns = []) => {
  const aliasToColumnKey = new Map();

  columns.forEach((column) => {
    const aliases = buildColumnAliases(column);

    aliases.forEach((alias) => {
      aliasToColumnKey.set(alias, column.key);
    });
  });

  return aliasToColumnKey;
};

const buildRequiredKeys = (columns = [], requiredColumns = []) => {
  const fromColumns = columns
    .filter((column) => column.required)
    .map((column) => column.key);
  return Array.from(new Set([...(requiredColumns || []), ...fromColumns]));
};

export const validateImport = ({
  headers = [],
  rows = [],
  columns = [],
  requiredColumns = [],
  allowUnknownColumns = false,
}) => {
  const errors = [];
  const warnings = [];
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));
  const aliasMap = buildColumnMap(columns);
  const requiredKeys = buildRequiredKeys(columns, requiredColumns);

  const columnByKey = new Map(columns.map((column) => [column.key, column]));

  const headerToKeyMap = headers.map((header, index) => {
    const mappedKey = aliasMap.get(normalizedHeaders[index]) ?? null;
    return {
      header,
      index,
      key: mappedKey,
    };
  });

  const unknownColumns = headerToKeyMap
    .filter((item) => !item.key)
    .map((item) => item.header);

  if (!allowUnknownColumns && unknownColumns.length > 0) {
    errors.push(
      defaultError(
        1,
        `Colunas não mapeadas encontradas: ${unknownColumns.join(", ")}. Revise o arquivo ou configure aliases de importação.`,
        "unknown-columns",
      ),
    );
  }

  const missingRequiredColumns = requiredKeys.filter((requiredKey) => {
    const foundIndex = headerToKeyMap.findIndex(
      (item) => item.key === requiredKey,
    );
    return foundIndex === -1;
  });

  if (missingRequiredColumns.length > 0) {
    errors.push(
      defaultError(
        1,
        `Colunas obrigatórias ausentes: ${missingRequiredColumns.join(", ")}.`,
        "missing-required-columns",
      ),
    );
  }

  const mappedRows = [];
  let emptyRows = 0;

  rows.forEach((row, rowIndex) => {
    const lineNumber = rowIndex + 2;

    if (isEmptyRow(row)) {
      emptyRows += 1;
      warnings.push(
        defaultError(lineNumber, "Linha vazia ignorada.", "empty-row"),
      );
      return;
    }

    const mappedRow = {};
    let hasRowError = false;

    columns.forEach((column) => {
      const matchingHeader = headerToKeyMap.find(
        (headerItem) => headerItem.key === column.key,
      );
      const cellValue = matchingHeader
        ? normalizeValue(row[matchingHeader.index])
        : "";

      const parsedValue =
        typeof column.parseImport === "function"
          ? column.parseImport(cellValue, row, rowIndex)
          : cellValue;

      mappedRow[column.key] = parsedValue;

      const isRequired = requiredKeys.includes(column.key);
      if (isRequired && normalizeValue(parsedValue) === "") {
        errors.push(
          defaultError(
            lineNumber,
            `A coluna "${column.label ?? column.header ?? column.key}" é obrigatória.`,
            "required-value",
          ),
        );
        hasRowError = true;
      }

      if (typeof column.validateImport === "function") {
        const validationResult = column.validateImport(
          parsedValue,
          mappedRow,
          rowIndex,
        );

        if (validationResult !== true) {
          errors.push(
            defaultError(
              lineNumber,
              typeof validationResult === "string"
                ? validationResult
                : `Valor inválido para a coluna "${column.label ?? column.header ?? column.key}".`,
              "invalid-value",
            ),
          );
          hasRowError = true;
        }
      }
    });

    if (!hasRowError) {
      mappedRows.push(mappedRow);
    }
  });

  const summary = {
    totalRows: rows.length,
    validRows: mappedRows.length,
    invalidRows: Math.max(rows.length - mappedRows.length - emptyRows, 0),
    emptyRows,
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    unknownColumns,
    missingRequiredColumns,
  };

  return {
    headers,
    rows,
    mappedRows,
    errors,
    warnings,
    summary,
    meta: {
      headerToKeyMap,
      requiredKeys,
      columnByKey,
    },
  };
};

export default validateImport;
