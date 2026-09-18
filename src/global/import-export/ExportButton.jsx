import React, { useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { exportCsv } from "./exportCsv";
import { exportXlsx } from "./exportXlsx";
import "./ExportButton.css";

const normalizeFormats = (formats = []) => {
  if (!Array.isArray(formats) || formats.length === 0) {
    return ["csv"];
  }

  const validFormats = formats
    .map((item) => String(item).toLowerCase().trim())
    .filter((item) => item === "csv" || item === "xlsx");

  return validFormats.length > 0 ? Array.from(new Set(validFormats)) : ["csv"];
};

const ExportButton = ({
  rows = [],
  columns = [],
  filename = "exportacao",
  formats = ["csv"],
  disabled = false,
  busy = false,
  label,
  className = "",
  onExport,
}) => {
  const availableFormats = useMemo(() => normalizeFormats(formats), [formats]);
  const [selectedFormat, setSelectedFormat] = useState(availableFormats[0]);

  const isDisabled = disabled || busy || rows.length === 0;
  const actionLabel = label || (busy ? "Exportando..." : "Exportar");

  const handleExport = async () => {
    if (isDisabled) {
      return;
    }

    const payload = {
      rows,
      columns,
      filename,
      format: selectedFormat,
    };

    if (typeof onExport === "function") {
      await onExport(payload);
      return;
    }

    if (selectedFormat === "xlsx") {
      exportXlsx(rows, {
        columns,
        filename,
      });
      return;
    }

    exportCsv(rows, {
      columns,
      filename,
    });
  };

  return (
    <div className={`global-export-button ${className}`.trim()}>
      {availableFormats.length > 1 ? (
        <label className="global-export-button__format">
          <span>Formato</span>
          <select
            value={selectedFormat}
            onChange={(event) => setSelectedFormat(event.target.value)}
            disabled={busy}
          >
            {availableFormats.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <button
        type="button"
        className="global-export-button__action"
        onClick={handleExport}
        disabled={isDisabled}
        aria-label={actionLabel}
        title={actionLabel}
        aria-busy={busy}
      >
        <FaDownload aria-hidden="true" />
        <span>{actionLabel}</span>
      </button>
    </div>
  );
};

export default ExportButton;
