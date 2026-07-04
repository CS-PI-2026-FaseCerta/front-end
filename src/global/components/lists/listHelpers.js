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

const getRawSortValue = (row, column, rowIndex) => {
    if (!column) {
        return undefined;
    }

    if (typeof column.sortAccessor === "function") {
        return column.sortAccessor(row, rowIndex);
    }

    if (typeof column.sortAccessor === "string" && row) {
        return row[column.sortAccessor];
    }

    return getColumnValue(row, column, rowIndex);
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

const toComparableNumber = (value) => {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime())
            ? Number.NEGATIVE_INFINITY
            : value.getTime();
    }

    const text = flattenValue(value).trim();

    if (!text) {
        return Number.NEGATIVE_INFINITY;
    }

    const compactText = text.replace(/\s/g, "");
    const hasComma = compactText.includes(",");
    const hasDot = compactText.includes(".");

    let normalizedText = compactText.replace(/[^\d,.-]/g, "");

    if (hasComma && hasDot) {
        normalizedText = normalizedText.replace(/\./g, "").replace(/,/g, ".");
    } else if (hasComma) {
        normalizedText = normalizedText.replace(/,/g, ".");
    }

    const numericValue = Number(normalizedText);

    return Number.isNaN(numericValue) ? Number.NEGATIVE_INFINITY : numericValue;
};

const toComparableDate = (value) => {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime())
            ? Number.NEGATIVE_INFINITY
            : value.getTime();
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
    }

    const timestamp = Date.parse(flattenValue(value));
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

const resolveStatusOrder = (column = {}) => {
    const { sortOrder } = column;

    if (Array.isArray(sortOrder)) {
        return new Map(
            sortOrder.map((entry, index) => [
                normalizeText(flattenValue(entry)),
                index,
            ]),
        );
    }

    if (sortOrder && typeof sortOrder === "object") {
        return new Map(
            Object.entries(sortOrder).map(([entry, index]) => [
                normalizeText(entry),
                index,
            ]),
        );
    }

    return null;
};

const compareComparableValues = (leftValue, rightValue, sortType, column) => {
    const leftEmpty = leftValue == null || leftValue === "";
    const rightEmpty = rightValue == null || rightValue === "";

    if (leftEmpty && rightEmpty) {
        return 0;
    }

    if (leftEmpty) {
        return 1;
    }

    if (rightEmpty) {
        return -1;
    }

    if (sortType === "number" || sortType === "currency") {
        return toComparableNumber(leftValue) - toComparableNumber(rightValue);
    }

    if (sortType === "date") {
        return toComparableDate(leftValue) - toComparableDate(rightValue);
    }

    if (sortType === "status") {
        const statusOrder = resolveStatusOrder(column);

        if (statusOrder) {
            const leftKey = normalizeText(flattenValue(leftValue));
            const rightKey = normalizeText(flattenValue(rightValue));
            const leftIndex = statusOrder.has(leftKey)
                ? statusOrder.get(leftKey)
                : Number.POSITIVE_INFINITY;
            const rightIndex = statusOrder.has(rightKey)
                ? statusOrder.get(rightKey)
                : Number.POSITIVE_INFINITY;

            if (leftIndex !== rightIndex) {
                return leftIndex - rightIndex;
            }
        }
    }

    const leftText = normalizeText(flattenValue(leftValue));
    const rightText = normalizeText(flattenValue(rightValue));

    return leftText.localeCompare(rightText, "pt-BR", {
        sensitivity: "base",
        numeric: true,
    });
};

export const sortRows = (rows, columns, sortConfig) => {
    if (!Array.isArray(rows) || rows.length <= 1) {
        return Array.isArray(rows) ? [...rows] : [];
    }

    if (!sortConfig?.key || !sortConfig.direction) {
        return [...rows];
    }

    const column = columns.find((item) => item.key === sortConfig.key);

    if (!column?.sortable) {
        return [...rows];
    }

    const sortType = column.sortType ?? "string";
    const directionMultiplier = sortConfig.direction === "desc" ? -1 : 1;

    return rows
        .map((row, index) => ({ row, index }))
        .sort((left, right) => {
            const leftValue = getRawSortValue(left.row, column, left.index);
            const rightValue = getRawSortValue(right.row, column, right.index);
            const comparison = compareComparableValues(
                leftValue,
                rightValue,
                sortType,
                column,
            );

            if (comparison !== 0) {
                return comparison * directionMultiplier;
            }

            return left.index - right.index;
        })
        .map(({ row }) => row);
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