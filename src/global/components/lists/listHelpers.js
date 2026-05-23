export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 15, 20];
export const DEFAULT_PAGE_SIZE = 10;

export const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const getRowKey = (row, rowKey, index) => {
  if (typeof rowKey === "function") {
    return rowKey(row, index);
  }

  if (row && Object.prototype.hasOwnProperty.call(row, rowKey)) {
    return row[rowKey];
  }

  return index;
};

export const getColumnValue = (row, column, rowIndex) => {
  if (!column) {
    return undefined;
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

  return undefined;
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
    return value.map(flattenValue).join(" ");
  }

  if (typeof value === "object") {
    return [value.label, value.title, value.name, value.value]
      .map(flattenValue)
      .filter(Boolean)
      .join(" ");
  }

  return String(value);
};

export const resolveBadge = (value, column = {}) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const label = value.label ?? value.title ?? value.name ?? value.value;
    const variant =
      value.variant ?? value.tone ?? column.defaultBadgeVariant ?? "neutral";

    return {
      label: label != null ? String(label) : "",
      variant,
      icon: value.icon,
    };
  }

  if (column.badgeMap) {
    const mapped =
      column.badgeMap[value] ??
      column.badgeMap[String(value ?? "").toLowerCase()];

    if (mapped) {
      if (typeof mapped === "string") {
        return {
          label: mapped,
          variant: column.defaultBadgeVariant ?? "neutral",
        };
      }

      return {
        label: mapped.label ?? String(value ?? ""),
        variant:
          mapped.variant ??
          mapped.tone ??
          column.defaultBadgeVariant ??
          "neutral",
        icon: mapped.icon,
      };
    }
  }

  if (value == null || value === "") {
    return null;
  }

  return {
    label: String(value),
    variant: column.defaultBadgeVariant ?? "neutral",
  };
};

export const filterRows = (rows, columns, searchTerm, filterValues) => {
  const normalizedSearch = normalizeText(searchTerm);

  return rows.filter((row, rowIndex) => {
    const matchesSearch =
      !normalizedSearch ||
      columns.some((column) => {
        if (column.searchable === false) {
          return false;
        }

        const value = getColumnValue(row, column, rowIndex);
        return normalizeText(flattenValue(value)).includes(normalizedSearch);
      });

    if (!matchesSearch) {
      return false;
    }

    return Object.entries(filterValues).every(([filterKey, filterValue]) => {
      if (filterValue == null || filterValue === "") {
        return true;
      }

      const filterColumn = columns.find((column) => column.key === filterKey);
      const rowValue = filterColumn
        ? getColumnValue(row, filterColumn, rowIndex)
        : row?.[filterKey];

      if (Array.isArray(filterValue)) {
        return filterValue.length === 0 || filterValue.includes(rowValue);
      }

      return normalizeText(flattenValue(rowValue)).includes(
        normalizeText(filterValue),
      );
    });
  });
};

export const paginateRows = (rows, page, pageSize) => {
  const safePageSize = Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE);
  const safePage = Math.max(1, Number(page) || 1);
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const boundedPage = Math.min(safePage, totalPages);
  const startIndex = (boundedPage - 1) * safePageSize;

  return {
    page: boundedPage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex: startIndex + safePageSize,
    rows: rows.slice(startIndex, startIndex + safePageSize),
  };
};
