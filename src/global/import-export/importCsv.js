const DEFAULT_DELIMITERS = [";", ",", "\t"];

const stripBom = (value = "") => value.replace(/^\uFEFF/, "");

const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

const countDelimiterOutsideQuotes = (text, delimiter) => {
  let count = 0;
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (!inQuotes && character === delimiter) {
      count += 1;
    }
  }

  return count;
};

const detectDelimiter = (headerLine = "", delimiters = DEFAULT_DELIMITERS) => {
  const scores = delimiters.map((delimiter) => ({
    delimiter,
    score: countDelimiterOutsideQuotes(headerLine, delimiter),
  }));

  scores.sort((left, right) => right.score - left.score);

  return scores[0]?.score > 0 ? scores[0].delimiter : ";";
};

const parseCsvLine = (line, delimiter) => {
  const values = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (!inQuotes && character === delimiter) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());

  return values;
};

export const parseCsvContent = (csvContent, options = {}) => {
  const normalizedText = stripBom(String(csvContent ?? "")).replace(
    /\r\n/g,
    "\n",
  );
  const lines = normalizedText.split("\n").filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return {
      headers: [],
      rows: [],
      delimiter: ";",
    };
  }

  const delimiter =
    options.delimiter || detectDelimiter(lines[0], options.delimiters);
  const headers = parseCsvLine(lines[0], delimiter).map((header) =>
    header.trim(),
  );
  const rawRows = lines.slice(1).map((line) => parseCsvLine(line, delimiter));

  return {
    headers,
    rows: rawRows,
    delimiter,
    normalizedHeaders: headers.map(normalizeHeader),
  };
};

export const parseCsvFile = async (file, options = {}) => {
  const content = await file.text();

  return parseCsvContent(content, options);
};

export { normalizeHeader };