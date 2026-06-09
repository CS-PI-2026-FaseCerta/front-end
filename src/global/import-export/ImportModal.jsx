import React, { useMemo, useState } from "react";
import { FaFileImport, FaTimes, FaUpload } from "react-icons/fa";
import LoadingOverlay from "../components/loading/LoadingOverlay";
import { parseCsvFile } from "./importCsv";
import { parseXlsxFile } from "./importXlsx";
import { exportTemplateCsv } from "./exportCsv";
import { exportTemplateXlsx } from "./exportXlsx";
import { validateImport } from "./validateImport";
import "./ImportModal.css";

const MAX_PREVIEW_ROWS = 8;

const getProgressStage = (stage) => {
  switch (stage) {
    case "reading":
      return { progress: 25, label: "Lendo arquivo" };
    case "validating":
      return { progress: 60, label: "Validando estrutura" };
    case "ready":
      return { progress: 100, label: "Arquivo pronto para importar" };
    default:
      return { progress: 0, label: "Aguardando arquivo" };
  }
};

const resolveParserByName = (name) => {
  const normalized = String(name ?? "").toLowerCase();

  if (normalized.endsWith(".xlsx") || normalized.endsWith(".xls")) {
    return "xlsx";
  }

  return "csv";
};

const ImportModal = ({
  isOpen,
  title = "Importar planilha",
  columns = [],
  requiredColumns = [],
  allowUnknownColumns = false,
  onClose,
  onConfirm,
  templateBaseName = "modelo-importacao",
  enableTemplateXlsx = true,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stage, setStage] = useState("idle");
  const [globalError, setGlobalError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const stageInfo = useMemo(() => getProgressStage(stage), [stage]);

  if (!isOpen) {
    return null;
  }

  const resetState = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setStage("idle");
    setGlobalError("");
    setIsConfirming(false);
  };

  const closeModal = () => {
    resetState();
    onClose?.();
  };

  const processFile = async (file) => {
    if (!file) {
      return;
    }

    try {
      setGlobalError("");
      setSelectedFile(file);
      setAnalysisResult(null);
      setStage("reading");

      const parser = resolveParserByName(file.name);
      const parsedFile =
        parser === "xlsx"
          ? await parseXlsxFile(file)
          : await parseCsvFile(file);

      setStage("validating");

      const validatedResult = validateImport({
        headers: parsedFile.headers,
        rows: parsedFile.rows,
        columns,
        requiredColumns,
        allowUnknownColumns,
      });

      setAnalysisResult({
        parser,
        parsedFile,
        validatedResult,
      });

      setStage("ready");
    } catch (error) {
      setStage("idle");
      setGlobalError(
        error?.message ||
          "Não foi possível processar o arquivo. Verifique o formato e tente novamente.",
      );
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    await processFile(file);
  };

  const handleConfirmImport = async () => {
    if (!analysisResult || isConfirming) {
      return;
    }

    setIsConfirming(true);

    try {
      // TODO: quando o backend estiver disponível, trocar o destino mock pelo endpoint da API.
      await onConfirm?.({
        file: selectedFile,
        parser: analysisResult.parser,
        headers: analysisResult.parsedFile.headers,
        rows: analysisResult.validatedResult.mappedRows,
        rawRows: analysisResult.parsedFile.rows,
        summary: analysisResult.validatedResult.summary,
        errors: analysisResult.validatedResult.errors,
        warnings: analysisResult.validatedResult.warnings,
      });

      closeModal();
    } finally {
      setIsConfirming(false);
    }
  };

  const summary = analysisResult?.validatedResult?.summary;
  const errors = analysisResult?.validatedResult?.errors || [];
  const warnings = analysisResult?.validatedResult?.warnings || [];
  const previewRows =
    analysisResult?.validatedResult?.mappedRows?.slice(0, MAX_PREVIEW_ROWS) ||
    [];
  const hasBlockingErrors = errors.length > 0;

  return (
    <div
      className="import-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {(stage === "reading" || stage === "validating" || isConfirming) && (
        <LoadingOverlay
          label={isConfirming ? "Importando" : stageInfo.label}
          description={
            isConfirming
              ? "Consolidando os dados para o próximo passo."
              : "Aguarde enquanto analisamos a planilha."
          }
          fullscreen={false}
          className="import-modal__loading"
        />
      )}

      <div
        className="import-modal__backdrop"
        onClick={closeModal}
        aria-hidden="true"
      />

      <div className="import-modal__panel">
        <header className="import-modal__header">
          <div>
            <h3>{title}</h3>
            <p>
              Suporte para CSV e XLSX com validação por configuração de colunas.
            </p>
          </div>
          <button
            type="button"
            className="import-modal__close"
            onClick={closeModal}
            aria-label="Fechar modal"
          >
            <FaTimes />
          </button>
        </header>

        <section className="import-modal__progress" aria-live="polite">
          <div className="import-modal__progress-meta">
            <span>{stageInfo.label}</span>
            <strong>{stageInfo.progress}%</strong>
          </div>
          <div className="import-modal__progress-track" aria-hidden="true">
            <span style={{ width: `${stageInfo.progress}%` }} />
          </div>
        </section>

        <section className="import-modal__section">
          <label className="import-modal__file-input">
            <FaUpload aria-hidden="true" />
            <span>
              {selectedFile
                ? selectedFile.name
                : "Selecionar arquivo (CSV ou XLSX)"}
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={
                isConfirming || stage === "reading" || stage === "validating"
              }
            />
          </label>

          <div className="import-modal__templates">
            <button
              type="button"
              className="import-modal__template-button"
              onClick={() =>
                exportTemplateCsv(columns, {
                  filename: `${templateBaseName}-csv`,
                })
              }
            >
              Baixar modelo CSV
            </button>
            {enableTemplateXlsx ? (
              <button
                type="button"
                className="import-modal__template-button"
                onClick={() =>
                  exportTemplateXlsx(columns, {
                    filename: `${templateBaseName}-xlsx`,
                  })
                }
              >
                Baixar modelo XLSX
              </button>
            ) : null}
          </div>
        </section>

        {globalError ? (
          <p className="import-modal__global-error">{globalError}</p>
        ) : null}

        {summary ? (
          <section className="import-modal__summary">
            <h4>Resumo da importação</h4>
            <div className="import-modal__summary-grid">
              <span>Total de linhas: {summary.totalRows}</span>
              <span>Linhas válidas: {summary.validRows}</span>
              <span>Linhas inválidas: {summary.invalidRows}</span>
              <span>Linhas vazias: {summary.emptyRows}</span>
            </div>
          </section>
        ) : null}

        {errors.length > 0 ? (
          <section className="import-modal__messages import-modal__messages--error">
            <h4>Erros encontrados</h4>
            <ul>
              {errors.slice(0, 12).map((error, index) => (
                <li key={`${error.code}-${index}`}>
                  Linha {error.line}: {error.message}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {warnings.length > 0 ? (
          <section className="import-modal__messages import-modal__messages--warning">
            <h4>Avisos</h4>
            <ul>
              {warnings.slice(0, 8).map((warning, index) => (
                <li key={`${warning.code}-${index}`}>
                  Linha {warning.line}: {warning.message}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {previewRows.length > 0 ? (
          <section className="import-modal__preview">
            <h4>Pré-visualização (até {MAX_PREVIEW_ROWS} linhas)</h4>
            <div className="import-modal__preview-table-wrap">
              <table className="import-modal__preview-table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>
                        {column.label ?? column.header ?? column.key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, rowIndex) => (
                    <tr key={`${rowIndex}-${row.id ?? "preview"}`}>
                      {columns.map((column) => (
                        <td key={`${column.key}-${rowIndex}`}>
                          {String(row[column.key] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <footer className="import-modal__footer">
          <button
            type="button"
            className="import-modal__button import-modal__button--ghost"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="import-modal__button import-modal__button--primary"
            onClick={handleConfirmImport}
            disabled={!summary || hasBlockingErrors || isConfirming}
          >
            <FaFileImport aria-hidden="true" />
            <span>
              {isConfirming ? "Importando..." : "Confirmar importação"}
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ImportModal;
