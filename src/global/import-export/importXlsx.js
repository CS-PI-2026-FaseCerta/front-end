import * as XLSX from "xlsx";

const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

const toCellText = (value) => {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return String(value).trim();
};

const parseWorksheet = (worksheet) => {
  const matrix = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: false,
    defval: "",
    raw: false,
  });

  if (!Array.isArray(matrix) || matrix.length === 0) {
    return {
      headers: [],
      rows: [],
      normalizedHeaders: [],
    };
  }

  const [headerRow, ...bodyRows] = matrix;
  const headers = (headerRow || []).map(toCellText);
  const rows = bodyRows.map((row) =>
    Array.isArray(row) ? row.map(toCellText) : [],
  );

  return {
    headers,
    rows,
    normalizedHeaders: headers.map(normalizeHeader),
  };
};

export const parseXlsxFile = async (file, options = {}) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const sheetName = options.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    return {
      headers: [],
      rows: [],
      sheetName: null,
      sheetNames: workbook.SheetNames,
      normalizedHeaders: [],
    };
  }

  const parsedSheet = parseWorksheet(worksheet);

  return {
    ...parsedSheet,
    sheetName,
    sheetNames: workbook.SheetNames,
  };
};

export { normalizeHeader };
