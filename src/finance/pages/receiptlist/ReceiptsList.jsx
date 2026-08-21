// ExpenseList — tabela responsiva com paginação confirmada
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaBackspace,
  FaCalculator,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCopy,
  FaEllipsisV,
  FaExchangeAlt,
  FaFileInvoice,
  FaFilter,
  FaListUl,
  FaMoneyBillWave,
  FaPaperclip,
  FaPen,
  FaPlus,
  FaRegCircle,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import './ReceiptsList.css';
import { receivablesMockData } from "./receivablesMock.js";
import {
  MONTHS,
  createId,
  parseMonth,
  formatMonth,
  formatDate,
  formatCurrency,
  normalize,
  includesNormalized,
  escapeHtml,
  getVisiblePages,
  CALCULATOR_KEYS,
  normalizeCalculatorExpression,
  formatCalculatorNumber,
  evaluateCalculatorExpression
} from "./receiptUtils.js";


import Footer from "../../../global/components/Footer/Footer.jsx";


const PAYMENT_TYPES = ["À vista", "Parcelado", "Recorrente"];
const PAYMENT_MODES = [
  "Boleto",
  "Carteira Digital",
  "Cartão Pré-pago",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Cheque",
  "Criptomoeda",
  "Depósito Bancário",
  "Dinheiro",
  "Pix",
  "Transferência Bancária",
];
const CATEGORIES = [
  "Infraestrutura",
  "Mensalidade",
  "Suprimentos",
  "Tecnologia",
  "Marketing",
  "Impostos",
  "Serviços",
  "Pessoal",
  "Viagens",
  "Outros",
];















const Dialog = ({ title, children, onClose, className = "" }) => (
  <div className="expense-list__overlay" role="presentation" onMouseDown={onClose}>
    <section
      className={`expense-list__dialog ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => event.stopPropagotion()}
    >
      <header className="expense-list__dialog-header">
        <h2>{title}</h2>
        <button
          type="button"
          className="expense-list__icon-button"
          onClick={onClose}
          aria-label="Fechar"
        >
          <FaTimes aria-hidden="true" />
        </button>
      </header>
      {children}
    </section>
  </div>
);

const Field = ({ label, children, className = "" }) => (
  <label className={`expense-list__form-field ${className}`.trim()}>
    <span>{label}</span>
    {children}
  </label>
);

const FilterSelect = ({ value, onChange, children, ariaLabel }) => (
  <div className="expense-list__select-wrap">
    <select value={value} onChange={onChange} aria-label={ariaLabel}>
      {children}
    </select>
    <FaChevronDown className="expense-list__select-chevron" aria-hidden="true" />
  </div>
);

const ReceiptsList = ({
  receivables = receivablesMockData,
  initialMonth = "2026-05-01",
  pageSize = 4,
  onMonthChange,
  onTabChange,
  onOpenAdvancedFilters,
  onGenerateReceipt,
  onEditReceipt,
  onViewValueDetails,
  onAttachmentsChange,
  onDuplicateReceipt,
  onMoveReceipt,
  onRecurringReceipt,
  onInstallmentReceipt,
  onDeleteReceipt,
}) => {
  const [rows, setRows] = useState(() => receivables.map((item) => ({ ...item })));
  const [month, setMonth] = useState(() => parseMonth(initialMonth));
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const parsedPageSize = Number(pageSize);
    return Number.isFinite(parsedPageSize) && parsedPageSize > 0
      ? Math.floor(parsedPageSize)
      : 4;
  });
  const [rowsPerPageInput, setRowsPerPageInput] = useState(() => String(
    Number.isFinite(Number(pageSize)) && Number(pageSize) > 0
      ? Math.floor(Number(pageSize))
      : 4,
  ));
  const [sort, setSort] = useState({ key: "date", direction: "asc" });
  const [menuRowId, setMenuRowId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [inlineFilters, setInlineFilters] = useState({
    date: "",
    description: "",
    client: "",
    category: "",
    value: "",
    paymentType: "",
    paymentMethod: "",
    paid: "",
  });
  const [draftInlineFilters, setDraftInlineFilters] = useState({
    date: "",
    description: "",
    client: "",
    category: "",
    value: "",
    paymentType: "",
    paymentMethod: "",
    paid: "",
  });
  const [calculator, setCalculator] = useState({
    open: false,
    expression: "",
    error: "",
    left: 0,
    top: 0,
    placement: "below",
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    minValue: "",
    maxValue: "",
    onlyWithAttachments: false,
  });

  useEffect(() => {
    setRows(receivables.map((item) => ({ ...item })));
  }, [receivables]);

  useEffect(() => {
    const parsedPageSize = Number(pageSize);
    if (!Number.isFinite(parsedPageSize) || parsedPageSize <= 0) return;

    const normalizedPageSize = Math.floor(parsedPageSize);
    setRowsPerPage(normalizedPageSize);
    setRowsPerPageInput(String(normalizedPageSize));
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest("[data-expense-row-menu]")) {
        setMenuRowId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  useEffect(() => {
    if (!menuRowId) return undefined;

    const closeFloatingMenu = (event) => {
      if (
        event?.target instanceof Element &&
        event.target.closest("[data-expense-row-menu]")
      ) {
        return;
      }

      setMenuRowId(null);
      setMenuPosition(null);
    };

    window.addEventListener("resize", closeFloatingMenu);
    window.addEventListener("scroll", closeFloatingMenu, true);

    return () => {
      window.removeEventListener("resize", closeFloatingMenu);
      window.removeEventListener("scroll", closeFloatingMenu, true);
    };
  }, [menuRowId]);

  useLayoutEffect(() => {
    if (!menuRowId || !menuPosition || typeof document === "undefined") return;

    const menuElement = document.querySelector(
      ".expense-list__action-menu--portal[data-expense-row-menu]",
    );
    if (!menuElement) return;

    const viewportPadding = 12;
    const gap = 8;
    const menuRect = menuElement.getBoundingClientRect();
    const menuHeight = Math.min(menuRect.height, window.innerHeight - viewportPadding * 2);
    const availableBelow =
      window.innerHeight - menuPosition.triggerBottom - gap - viewportPadding;
    const availableAbove = menuPosition.triggerTop - gap - viewportPadding;
    const placeAbove =
      availableAbove >= menuHeight ||
      (availableAbove > availableBelow && availableBelow < menuHeight);

    const idealTop = placeAbove
      ? menuPosition.triggerTop - gap - menuHeight
      : menuPosition.triggerBottom + gap;
    const top = Math.max(
      viewportPadding,
      Math.min(idealTop, window.innerHeight - viewportPadding - menuHeight),
    );

    setMenuPosition((current) => {
      if (!current) return current;
      const nextPlacement = placeAbove ? "above" : "below";
      if (Math.abs(current.top - top) < 0.5 && current.placement === nextPlacement) {
        return current;
      }
      return { ...current, top, placement: nextPlacement };
    });
  }, [menuRowId, menuPosition?.triggerBottom, menuPosition?.triggerTop]);

  useEffect(() => {
    if (!calculator.open) return undefined;

    const closeOnPointerDown = (event) => {
      if (
        event?.target instanceof Element &&
        event.target.closest("[data-expense-calculator]")
      ) {
        return;
      }
      closeCalculator();
    };

    const closeOnViewportChange = () => closeCalculator();

    document.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [calculator.open]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const updateInlineFilter = (key, value) => {
    setDraftInlineFilters((current) => ({ ...current, [key]: value }));
  };

  const applyInlineFilters = () => {
    setInlineFilters({ ...draftInlineFilters });
    setPage(1);
    setCalculator((current) => ({ ...current, open: false, error: "" }));
  };

  const filteredRows = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    return rows
      .filter((row) => {
        const rowDate = new Date(`${row.date}T12:00:00`);
        if (
          rowDate.getFullYear() !== year ||
          rowDate.getMonth() !== monthIndex
        ) {
          return false;
        }

        if (inlineFilters.date && row.date !== inlineFilters.date) return false;
        if (
          inlineFilters.description &&
          !includesNormalized(row.description, inlineFilters.description)
        ) {
          return false;
        }
        if (
          inlineFilters.client &&
          !includesNormalized(row.client, inlineFilters.client)
        ) {
          return false;
        }
        if (
          inlineFilters.category &&
          row.category !== inlineFilters.category
        ) {
          return false;
        }
        if (inlineFilters.value) {
          const rawValueQuery = String(inlineFilters.value).trim().replace(/\s/g, "");
          const normalizedValueQuery = rawValueQuery.includes(",")
            ? rawValueQuery.replace(/\./g, "").replace(",", ".")
            : rawValueQuery;
          const numericRowValue = Number(row.value);
          const valueCandidates = Number.isFinite(numericRowValue)
            ? [String(numericRowValue), numericRowValue.toFixed(2)]
            : [String(row.value ?? "")];

          if (!valueCandidates.some((candidate) => candidate.includes(normalizedValueQuery))) {
            return false;
          }
        }
        if (
          inlineFilters.paymentType &&
          row.paymentType !== inlineFilters.paymentType
        ) {
          return false;
        }
        if (
          inlineFilters.paymentMethod &&
          row.paymentMethod !== inlineFilters.paymentMethod
        ) {
          return false;
        }
        if (
          inlineFilters.paid === "paid" &&
          !row.paid
        ) {
          return false;
        }
        if (
          inlineFilters.paid === "pending" &&
          row.paid
        ) {
          return false;
        }

        if (advancedFilters.dateFrom && row.date < advancedFilters.dateFrom) {
          return false;
        }
        if (advancedFilters.dateTo && row.date > advancedFilters.dateTo) {
          return false;
        }
        if (
          advancedFilters.minValue &&
          Number(row.value) < Number(advancedFilters.minValue)
        ) {
          return false;
        }
        if (
          advancedFilters.maxValue &&
          Number(row.value) > Number(advancedFilters.maxValue)
        ) {
          return false;
        }
        if (
          advancedFilters.onlyWithAttachments &&
          !(row.attachments?.length > 0)
        ) {
          return false;
        }

        return true;
      })
      .sort((left, right) => {
        const leftValue = left[sort.key];
        const rightValue = right[sort.key];

        if (leftValue == null && rightValue == null) return 0;
        if (leftValue == null) return 1;
        if (rightValue == null) return -1;

        const comparison =
          typeof leftValue === "number"
            ? leftValue - rightValue
            : String(leftValue).localeCompare(String(rightValue), "pt-BR", {
                numeric: true,
                sensitivity: "base",
              });

        return sort.direction === "asc" ? comparison : -comparison;
      });
  }, [advancedFilters, inlineFilters, month, rows, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );
  const visiblePages = getVisiblePages(safePage, totalPages);

  const commitRowsPerPage = () => {
    const normalizedInput = rowsPerPageInput.trim();

    if (!/^\d+$/.test(normalizedInput)) {
      setRowsPerPageInput(String(rowsPerPage));
      return;
    }

    const parsedValue = Number(normalizedInput);
    if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
      setRowsPerPageInput(String(rowsPerPage));
      return;
    }

    setRowsPerPage(parsedValue);
    setRowsPerPageInput(String(parsedValue));
    setPage(1);
  };

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const hasFilters = useMemo(
    () =>
      Object.values(inlineFilters).some(Boolean) ||
      Boolean(
        advancedFilters.dateFrom ||
          advancedFilters.dateTo ||
          advancedFilters.minValue ||
          advancedFilters.maxValue ||
          advancedFilters.onlyWithAttachments,
      ),
    [advancedFilters, inlineFilters],
  );

  const hasDraftInlineFilters = useMemo(
    () => Object.values(draftInlineFilters).some(Boolean),
    [draftInlineFilters],
  );

  const hasPendingInlineChanges = useMemo(
    () => JSON.stringify(draftInlineFilters) !== JSON.stringify(inlineFilters),
    [draftInlineFilters, inlineFilters],
  );

  const openCalculator = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = 320;
    const estimatedHeight = 430;
    const gap = 8;
    const viewportPadding = 12;
    const availableBelow = window.innerHeight - rect.bottom;
    const placeAbove = availableBelow < estimatedHeight && rect.top > availableBelow;
    const left = Math.max(
      viewportPadding,
      Math.min(rect.right - width, window.innerWidth - width - viewportPadding),
    );

    setCalculator({
      open: true,
      expression: draftInlineFilters.value || "",
      error: "",
      left,
      top: placeAbove ? rect.top - gap : rect.bottom + gap,
      placement: placeAbove ? "above" : "below",
    });
  };

  const closeCalculator = () => {
    setCalculator((current) => ({ ...current, open: false, error: "" }));
  };

  const calculateExpression = (expression = calculator.expression) => {
    try {
      const result = evaluateCalculatorExpression(expression);
      const formatted = formatCalculatorNumber(result);
      setCalculator((current) => ({ ...current, expression: formatted, error: "" }));
      return formatted;
    } catch (error) {
      setCalculator((current) => ({ ...current, error: "Expressão inválida" }));
      return null;
    }
  };

  const handleCalculatorKey = (key) => {
    if (key === "C") {
      setCalculator((current) => ({ ...current, expression: "", error: "" }));
      return;
    }

    if (key === "backspace") {
      setCalculator((current) => ({
        ...current,
        expression: current.expression.slice(0, -1),
        error: "",
      }));
      return;
    }

    if (key === "=") {
      const result = calculateExpression();
      if (result != null) {
        updateInlineFilter("value", result);
      }
      return;
    }

    setCalculator((current) => ({
      ...current,
      expression: `${current.expression}${key}`,
      error: "",
    }));
  };

  const useCalculatorValue = () => {
    const result = calculateExpression();
    if (result == null) return;
    updateInlineFilter("value", result);
    closeCalculator();
  };

  const changeMonth = (direction) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + direction, 1);
    setMonth(nextMonth);
    setPage(1);
    setMenuRowId(null);
    setMenuPosition(null);
    onMonthChange?.(nextMonth);
  };

  const toggleSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setInlineFilters({
      date: "",
      description: "",
      client: "",
      category: "",
      value: "",
      paymentType: "",
      paymentMethod: "",
      paid: "",
    });
    setDraftInlineFilters({
      date: "",
      description: "",
      client: "",
      category: "",
      value: "",
      paymentType: "",
      paymentMethod: "",
      paid: "",
    });
    setAdvancedFilters({
      dateFrom: "",
      dateTo: "",
      minValue: "",
      maxValue: "",
      onlyWithAttachments: false,
    });
    setCalculator((current) => ({ ...current, open: false, expression: "", error: "" }));
    setPage(1);
  };

  const openAdvancedFilters = () => {
    if (onOpenAdvancedFilters) {
      onOpenAdvancedFilters({
        values: advancedFilters,
        onChange: setAdvancedFilters,
        clear: clearFilters,
      });
      return;
    }
    setIsAdvancedOpen(true);
  };

  const getReceipt = (id) => rows.find((item) => item.id === id);

  const closeRowMenu = () => {
    setMenuRowId(null);
    setMenuPosition(null);
  };

  const toggleRowMenu = (event, receiptId) => {
    if (menuRowId === receiptId) {
      closeRowMenu();
      return;
    }

    const triggerRect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 276;
    const viewportPadding = 12;
    const gap = 8;
    const availableBelow = window.innerHeight - triggerRect.bottom;
    const availableAbove = triggerRect.top;
    const placeAbove = availableBelow < 430 && availableAbove > availableBelow;
    const left = Math.max(
      viewportPadding,
      Math.min(
        triggerRect.right - menuWidth,
        window.innerWidth - menuWidth - viewportPadding,
      ),
    );

    const estimatedMenuHeight = Math.min(430, window.innerHeight - viewportPadding * 2);
    const initialTop = placeAbove
      ? triggerRect.top - gap - estimatedMenuHeight
      : triggerRect.bottom + gap;

    setMenuRowId(receiptId);
    setMenuPosition({
      left,
      top: Math.max(
        viewportPadding,
        Math.min(initialTop, window.innerHeight - viewportPadding - estimatedMenuHeight),
      ),
      placement: placeAbove ? "above" : "below",
      triggerTop: triggerRect.top,
      triggerBottom: triggerRect.bottom,
    });
  };

  const replaceReceipt = (nextReceipt) => {
    setRows((current) =>
      current.map((item) => (item.id === nextReceipt.id ? nextReceipt : item)),
    );
  };

  const generateReceipt = (receipt) => {
    onGenerateReceipt?.(receipt);

    if (onGenerateReceipt) {
      setNotice("Solicitação de recibo enviada.");
      return;
    }

    const receiptWindow = window.open("", "_blank", "width=760,height=820");
    if (!receiptWindow) {
      setNotice("O navegador bloqueou a abertura do recibo.");
      return;
    }

    receiptWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Recibo - ${escapeHtml(receipt.description)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 48px; color: #202235; }
            .card { border: 1px solid #dadce8; border-radius: 18px; padding: 28px; }
            h1 { margin-top: 0; font-size: 24px; }
            dl { display: grid; grid-template-columns: 180px 1fr; gap: 12px 24px; }
            dt { color: #666b7d; font-weight: 700; }
            dd { margin: 0; }
            .amount { font-size: 28px; font-weight: 800; margin: 24px 0; }
            .status { font-weight: 700; color: ${receipt.paid ? "#5d7700" : "#7c5b14"}; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Comprovante de recebimento</h1>
            <p class="amount">${escapeHtml(formatCurrency(receipt.value))}</p>
            <dl>
              <dt>Data</dt><dd>${escapeHtml(formatDate(receipt.date))}</dd>
              <dt>Descrição</dt><dd>${escapeHtml(receipt.description)}</dd>
              <dt>Cliente</dt><dd>${escapeHtml(receipt.client)}</dd>
              <dt>Categoria</dt><dd>${escapeHtml(receipt.category)}</dd>
              <dt>Tipo de pagamento</dt><dd>${escapeHtml(receipt.paymentType)}</dd>
              <dt>Forma de pagamento</dt><dd>${escapeHtml(receipt.paymentMethod)}</dd>
              <dt>Status</dt><dd class="status">${receipt.paid ? "Pago" : "Pendente"}</dd>
            </dl>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  const handleEditSubmit = (event, receipt) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updated = {
      ...receipt,
      date: formData.get("date"),
      description: formData.get("description"),
      client: formData.get("client"),
      category: formData.get("category"),
      value: Number(formData.get("value")),
      paymentType: formData.get("paymentType"),
      paymentMethod: formData.get("paymentMethod"),
      paid: formData.get("paid") === "on",
    };

    replaceReceipt(updated);
    onEditReceipt?.(updated);
    setDialog(null);
    setNotice("Recebimento atualizada.");
  };

  const handleAttachmentAdd = (receipt, files) => {
    if (!files?.length) return;
    const newAttachments = [...(receipt.attachments ?? [])].concat(
      [...files].map((file) => ({
        id: createId(),
        name: file.name,
        size: file.size,
        file,
      })),
    );
    const updated = { ...receipt, attachments: newAttachments };
    replaceReceipt(updated);
    onAttachmentsChange?.(updated, newAttachments);
    setDialog({ type: "attachments", receiptId: updated.id });
  };

  const duplicateReceipt = (receipt) => {
    const copy = {
      ...receipt,
      id: createId(),
      description: `${receipt.description} (cópia)`,
      paid: false,
      attachments: [],
    };
    setRows((current) => [copy, ...current]);
    onDuplicateReceipt?.(copy, receipt);
    closeRowMenu();
    setNotice("Recebimento duplicada.");
  };

  const submitMove = (event, receipt) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const destination = formData.get("destination");
    const category = formData.get("category");

    if (destination === "expenses") {
      const updated = { ...receipt, category };
      replaceReceipt(updated);
      onMoveReceipt?.({ receipt: updated, destination, category });
      setNotice("Recebimento reclassificada.");
    } else {
      setRows((current) => current.filter((item) => item.id !== receipt.id));
      onMoveReceipt?.({ receipt, destination, category: null });
      setNotice(
        destination === "receipts"
          ? "Item movido para Recebimentos."
          : "Item movido para Transferências.",
      );
    }
    setDialog(null);
  };

  const submitRecurring = (event, receipt) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updated = {
      ...receipt,
      paymentType: "Recorrente",
      recurrence: {
        frequency: formData.get("frequency"),
        startDate: formData.get("startDate"),
      },
    };
    replaceReceipt(updated);
    onRecurringReceipt?.(updated);
    setDialog(null);
    setNotice("Recebimento configurada como recorrente.");
  };

  const submitInstallments = (event, receipt) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const installmentCount = Math.max(2, Number(formData.get("installments")) || 2);
    const firstDate = new Date(`${formData.get("firstDate")}T12:00:00`);
    const totalCents = Math.round(Number(receipt.value) * 100);
    const baseCents = Math.floor(totalCents / installmentCount);
    const remainder = totalCents % installmentCount;

    const installments = Array.from({ length: installmentCount }, (_, index) => {
      const dueDate = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth() + index,
        firstDate.getDate(),
      );
      const cents = baseCents + (index < remainder ? 1 : 0);

      return {
        ...receipt,
        id: index === 0 ? receipt.id : createId(),
        date: dueDate.toISOString().slice(0, 10),
        description: `${receipt.description} (${index + 1}/${installmentCount})`,
        value: cents / 100,
        paymentType: "Parcelado",
        paid: index === 0 ? receipt.paid : false,
        installment: {
          current: index + 1,
          total: installmentCount,
        },
      };
    });

    setRows((current) => [
      ...current.filter((item) => item.id !== receipt.id),
      ...installments,
    ]);
    onInstallmentReceipt?.(installments, receipt);
    setDialog(null);
    setNotice(`Recebimento dividida em ${installmentCount} parcelas.`);
  };

  const confirmDelete = (receipt) => {
    setRows((current) => current.filter((item) => item.id !== receipt.id));
    onDeleteReceipt?.({ ...receipt, deletedAt: new Date().toISOString() });
    setDialog(null);
    setNotice("Recebimento excluída.");
  };

  const activeReceipt = dialog?.receiptId ? getReceipt(dialog.receiptId) : null;
  const activeMenuReceipt = menuRowId ? getReceipt(menuRowId) : null;

  return (
    <main className="expense-list-page">
      <section className="expense-list" aria-label="Financeiro - Recebimentos">
        <header className="expense-list__title-bar">
          <div>
            <span className="expense-list__eyebrow">Financeiro</span>
            <h1>FINANCEIRO</h1>
          </div>
        </header>

        <div className="expense-list__content">
          <div className="expense-list__toolbar">
            <div className="expense-list__month-control" aria-label="Navegação por mês">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Mês anterior"
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
              <strong>{formatMonth(month)}</strong>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Próximo mês"
              >
                <FaChevronRight aria-hidden="true" />
              </button>
            </div>

            <div className="expense-list__toolbar-right">
              <nav className="expense-list__tabs" aria-label="Tipo de movimentação">
                <button type="button" className="is-active" aria-current="page">Recebimentos</button>
                <button type="button" onClick={() => onTabChange?.("expenses")}>Despesas</button>
                <button type="button" onClick={() => onTabChange?.("transfers")}>Transferências</button>
              </nav>

              <button
                type="button"
                className={`expense-list__filters-button ${hasFilters ? "has-filters" : ""}`.trim()}
                onClick={openAdvancedFilters}
              >
                <FaFilter aria-hidden="true" />
                <span>Filtros</span>
                {hasFilters ? <i aria-hidden="true" /> : null}
              </button>
            </div>
          </div>

          <div className="expense-list__table-shell">
            <div className="expense-list__table-scroll">
              <table className="expense-list__table">
                <thead>
                  <tr className="expense-list__header-row">
                    {[
                      ["date", "Data"],
                      ["description", "Descrição"],
                      ["client", "Cliente"],
                      ["category", "Categoria"],
                      ["value", "Valor"],
                      ["paymentType", "Tipo pagamento"],
                      ["paymentMethod", "Forma de pagamento"],
                      ["paid", "Pago?"],
                    ].map(([key, label]) => (
                      <th key={key} scope="col" aria-sort={sort.key === key ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
                        <button
                          type="button"
                          className="expense-list__sort-button"
                          onClick={() => toggleSort(key)}
                        >
                          {label}
                          <span className={sort.key === key ? "is-sorted" : ""} aria-hidden="true">↕</span>
                        </button>
                      </th>
                    ))}
                    <th scope="col" aria-label="Ações" />
                  </tr>

                  <tr className="expense-list__filter-row" onKeyDown={(event) => { if (event.key === "Enter") applyInlineFilters(); }}>
                    <th>
                      <input
                        type="date"
                        value={draftInlineFilters.date}
                        onChange={(event) => updateInlineFilter("date", event.target.value)}
                        aria-label="Filtrar por data"
                      />
                    </th>
                    <th>
                      <input
                        type="search"
                        value={draftInlineFilters.description}
                        onChange={(event) => updateInlineFilter("description", event.target.value)}
                        placeholder="Pesquisar"
                        aria-label="Filtrar por descrição"
                      />
                    </th>
                    <th>
                      <input
                        type="search"
                        value={draftInlineFilters.client}
                        onChange={(event) => updateInlineFilter("client", event.target.value)}
                        placeholder="Pesquisar"
                        aria-label="Filtrar por favorecido"
                      />
                    </th>
                    <th>
                      <FilterSelect
                        value={draftInlineFilters.category}
                        onChange={(event) => updateInlineFilter("category", event.target.value)}
                        ariaLabel="Filtrar por categoria"
                      >
                        <option value="">Todas</option>
                        {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                      </FilterSelect>
                    </th>
                    <th>
                      <div className="expense-list__value-filter" data-expense-calculator>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={draftInlineFilters.value}
                          onChange={(event) => updateInlineFilter("value", event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") applyInlineFilters();
                          }}
                          placeholder="0,00"
                          aria-label="Filtrar por valor"
                        />
                        <button
                          type="button"
                          className={`expense-list__calculator-trigger ${calculator.open ? "is-open" : ""}`.trim()}
                          onClick={openCalculator}
                          title="Abrir calculadora"
                          aria-label="Abrir calculadora de valor"
                          aria-expanded={calculator.open}
                        >
                          <FaCalculator aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                    <th>
                      <FilterSelect
                        value={draftInlineFilters.paymentType}
                        onChange={(event) => updateInlineFilter("paymentType", event.target.value)}
                        ariaLabel="Filtrar por tipo de pagamento"
                      >
                        <option value="">Todos</option>
                        {PAYMENT_TYPES.map((type) => <option key={type}>{type}</option>)}
                      </FilterSelect>
                    </th>
                    <th>
                      <FilterSelect
                        value={draftInlineFilters.paymentMethod}
                        onChange={(event) => updateInlineFilter("paymentMethod", event.target.value)}
                        ariaLabel="Filtrar por modo de pagamento"
                      >
                        <option value="">Todos</option>
                        {PAYMENT_MODES.map((mode) => <option key={mode}>{mode}</option>)}
                      </FilterSelect>
                    </th>
                    <th>
                      <FilterSelect
                        value={draftInlineFilters.paid}
                        onChange={(event) => updateInlineFilter("paid", event.target.value)}
                        ariaLabel="Filtrar por status de pagamento"
                      >
                        <option value="">Todos</option>
                        <option value="paid">Pagos</option>
                        <option value="pending">Pendentes</option>
                      </FilterSelect>
                    </th>
                    <th>
                      <div className="expense-list__filter-actions" aria-label="Ações dos filtros inline">
                        <button
                          type="button"
                          className="expense-list__apply-inline"
                          onClick={applyInlineFilters}
                          title="Aplicar filtros"
                          aria-label="Aplicar filtros"
                          disabled={!hasPendingInlineChanges}
                        >
                          <FaCheck aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="expense-list__clear-inline"
                          onClick={clearFilters}
                          title="Limpar todos os filtros"
                          aria-label="Limpar todos os filtros"
                          disabled={!hasFilters && !hasDraftInlineFilters}
                        >
                          <FaTimes aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRows.length > 0 ? (
                    visibleRows.map((receipt) => (
                      <tr key={receipt.id}>
                        <td>{formatDate(receipt.date)}</td>
                        <td className="expense-list__description-cell">{receipt.description}</td>
                        <td>{receipt.client}</td>
                        <td>{receipt.category}</td>
                        <td className="expense-list__value-cell">{formatCurrency(receipt.value)}</td>
                        <td>{receipt.paymentType}</td>
                        <td>{receipt.paymentMethod}</td>
                        <td>
                          <button
                            type="button"
                            className={`expense-list__paid-status ${receipt.paid ? "is-paid" : "is-pending"}`}
                            onClick={() => {
                              const updated = { ...receipt, paid: !receipt.paid };
                              replaceReceipt(updated);
                              onEditReceipt?.(updated);
                            }}
                            title={receipt.paid ? "Marcar como pendente" : "Marcar como pago"}
                            aria-label={receipt.paid ? "Recebimento pago" : "Recebimento pendente"}
                          >
                            {receipt.paid ? <FaCheckCircle aria-hidden="true" /> : <FaRegCircle aria-hidden="true" />}
                          </button>
                        </td>
                        <td className="expense-list__actions-cell">
                          <div className="expense-list__row-menu" data-expense-row-menu>
                            <button
                              type="button"
                              className={`expense-list__kebab ${menuRowId === receipt.id ? "is-open" : ""}`.trim()}
                              onClick={(event) => toggleRowMenu(event, receipt.id)}
                              aria-haspopup="menu"
                              aria-expanded={menuRowId === receipt.id}
                              aria-label={`Ações da recebimento ${receipt.description}`}
                            >
                              <FaEllipsisV aria-hidden="true" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="expense-list__empty-cell">
                        <div className="expense-list__empty-state">
                          <div className="expense-list__empty-icon">
                            <FaMoneyBillWave aria-hidden="true" />
                          </div>
                          <h2>Nenhum recebimento neste período</h2>
                          <p>
                            {hasFilters
                              ? "Não encontramos recebimentos com os filtros aplicados."
                              : `Ainda não há recebimentos registrados em ${formatMonth(month)}.`}
                          </p>
                          {hasFilters ? (
                            <button type="button" onClick={clearFilters}>Limpar filtros</button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            
          </div>

          
        </div>

        <footer className="expense-list__footer">
          <div className="expense-list__footer-summary">
            <p>
              Mostrando <strong>{visibleRows.length}</strong> de <strong>{filteredRows.length}</strong> recebimentos
            </p>

            <label className="expense-list__page-size">
              <span>Linhas por página</span>
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={rowsPerPageInput}
                onChange={(event) => setRowsPerPageInput(event.target.value)}
                onBlur={commitRowsPerPage}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitRowsPerPage();
                    event.currentTarget.blur();
                  }
                }}
                aria-label="Linhas por página"
              />
            </label>
          </div>

          <div className="expense-list__pagination" aria-label="Paginação de recebimentos">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage <= 1}
              aria-label="Página anterior"
            >
              <FaChevronLeft aria-hidden="true" />
            </button>

            {visiblePages.map((pageNumber, index) => {
              const previous = visiblePages[index - 1];
              const showGap = previous && pageNumber - previous > 1;
              return (
                <React.Fragment key={pageNumber}>
                  {showGap ? <span className="expense-list__page-gap">…</span> : null}
                  <button
                    type="button"
                    className={safePage === pageNumber ? "is-active" : ""}
                    onClick={() => setPage(pageNumber)}
                    aria-current={safePage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                </React.Fragment>
              );
            })}

            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={safePage >= totalPages}
              aria-label="Próxima página"
            >
              <FaChevronRight aria-hidden="true" />
            </button>
          </div>
        </footer>
      </section>

      {calculator.open && typeof document !== "undefined"
        ? createPortal(
            <section
              className={`expense-list__calculator-popover expense-list__calculator-popover--portal ${calculator.placement === "above" ? "is-above" : "is-below"}`.trim()}
              style={{ left: `${calculator.left}px`, top: `${calculator.top}px` }}
              data-expense-calculator
              role="dialog"
              aria-label="Calculadora de valor"
            >
              <header className="expense-list__calculator-header">
                <div>
                  <span>Calculadora</span>
                  <strong>Valor da recebimento</strong>
                </div>
                <button type="button" onClick={closeCalculator} aria-label="Fechar calculadora">
                  <FaTimes aria-hidden="true" />
                </button>
              </header>

              <div className={`expense-list__calculator-display ${calculator.error ? "has-error" : ""}`.trim()}>
                <input
                  value={calculator.expression}
                  onChange={(event) =>
                    setCalculator((current) => ({
                      ...current,
                      expression: event.target.value,
                      error: "",
                    }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleCalculatorKey("=");
                    }
                  }}
                  inputMode="decimal"
                  aria-label="Expressão da calculadora"
                  placeholder="0"
                  autoFocus
                />
                <span>{calculator.error || "Use +, −, ×, ÷ e parênteses"}</span>
              </div>

              <div className="expense-list__calculator-grid">
                {CALCULATOR_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`expense-list__calculator-key ${key === "=" ? "is-equals" : ""} ${key === "C" ? "is-clear" : ""} ${["÷", "×", "−", "+"].includes(key) ? "is-operator" : ""}`.trim()}
                    onClick={() => handleCalculatorKey(key)}
                    aria-label={key === "backspace" ? "Apagor último caractere" : key}
                  >
                    {key === "backspace" ? <FaBackspace aria-hidden="true" /> : key}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="expense-list__calculator-use"
                onClick={useCalculatorValue}
              >
                <FaCheck aria-hidden="true" />
                <span>Usar valor no filtro</span>
              </button>
            </section>,
            document.body,
          )
        : null}

      {menuRowId && activeMenuReceipt && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              className={`expense-list__action-menu expense-list__action-menu--portal ${menuPosition.placement === "above" ? "is-above" : "is-below"}`.trim()}
              data-expense-row-menu
              role="menu"
              style={{ left: `${menuPosition.left}px`, top: `${menuPosition.top}px` }}
            >
              <button type="button" role="menuitem" onClick={() => { generateReceipt(activeMenuReceipt); closeRowMenu(); }}>
                <FaFileInvoice aria-hidden="true" />
                <span>Gerar recibo</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "edit", receiptId: activeMenuReceipt.id }); closeRowMenu(); }}>
                <FaPen aria-hidden="true" />
                <span>Editar detalhes</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { onViewValueDetails?.(activeMenuReceipt); setDialog({ type: "details", receiptId: activeMenuReceipt.id }); closeRowMenu(); }}>
                <FaListUl aria-hidden="true" />
                <span>Detalhar valor</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "attachments", receiptId: activeMenuReceipt.id }); closeRowMenu(); }}>
                <FaPaperclip aria-hidden="true" />
                <span>Anexos</span>
                {activeMenuReceipt.attachments?.length ? <small>{activeMenuReceipt.attachments.length}</small> : null}
              </button>
              <button type="button" role="menuitem" onClick={() => duplicateReceipt(activeMenuReceipt)}>
                <FaCopy aria-hidden="true" />
                <span>Duplicar</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "move", receiptId: activeMenuReceipt.id }); closeRowMenu(); }}>
                <FaExchangeAlt aria-hidden="true" />
                <span>Mover para...</span>
              </button>
              <div className="expense-list__menu-divider" />
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "recurring", receiptId: activeMenuReceipt.id }); closeRowMenu(); }}>
                <FaClock aria-hidden="true" />
                <span>Tornar recorrente...</span>
              </button>
              <div className="expense-list__menu-divider" />
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "installments", receiptId: activeMenuReceipt.id }); closeRowMenu(); }}>
                <FaMoneyBillWave aria-hidden="true" />
                <span>Parcelar...</span>
              </button>
              <div className="expense-list__menu-divider" />
              <button type="button" role="menuitem" className="is-danger" onClick={() => { setDialog({ type: "delete", receiptId: activeMenuReceipt.id }); closeRowMenu(); }}>
                <FaTrash aria-hidden="true" />
                <span>Excluir</span>
              </button>
            </div>,
            document.body,
          )
        : null}

      {notice ? (
        <div className="expense-list__toast" role="status">{notice}</div>
      ) : null}

      {isAdvancedOpen ? (
        <div className="expense-list__drawer-backdrop" onMouseDown={() => setIsAdvancedOpen(false)} role="presentation">
          <aside className="expense-list__drawer" onMouseDown={(event) => event.stopPropagotion()} aria-label="Filtros avançados">
            <header>
              <div>
                <span>HU08-E07</span>
                <h2>Filtros avançados</h2>
              </div>
              <button type="button" className="expense-list__icon-button" onClick={() => setIsAdvancedOpen(false)} aria-label="Fechar filtros">
                <FaTimes aria-hidden="true" />
              </button>
            </header>

            <div className="expense-list__drawer-body">
              <div className="expense-list__drawer-grid">
                <Field label="Data inicial">
                  <input type="date" value={advancedFilters.dateFrom} onChange={(event) => setAdvancedFilters((current) => ({ ...current, dateFrom: event.target.value }))} />
                </Field>
                <Field label="Data final">
                  <input type="date" value={advancedFilters.dateTo} onChange={(event) => setAdvancedFilters((current) => ({ ...current, dateTo: event.target.value }))} />
                </Field>
                <Field label="Valor mínimo">
                  <input type="number" min="0" step="0.01" value={advancedFilters.minValue} onChange={(event) => setAdvancedFilters((current) => ({ ...current, minValue: event.target.value }))} placeholder="0,00" />
                </Field>
                <Field label="Valor máximo">
                  <input type="number" min="0" step="0.01" value={advancedFilters.maxValue} onChange={(event) => setAdvancedFilters((current) => ({ ...current, maxValue: event.target.value }))} placeholder="0,00" />
                </Field>
              </div>

              <label className="expense-list__checkbox-row">
                <input type="checkbox" checked={advancedFilters.onlyWithAttachments} onChange={(event) => setAdvancedFilters((current) => ({ ...current, onlyWithAttachments: event.target.checked }))} />
                <span>Somente recebimentos com anexos</span>
              </label>
            </div>

            <footer>
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={clearFilters}>Limpar filtros</button>
              <button type="button" className="expense-list__button expense-list__button--primary" onClick={() => setIsAdvancedOpen(false)}>Aplicar filtros</button>
            </footer>
          </aside>
        </div>
      ) : null}

      {dialog?.type === "edit" && activeReceipt ? (
        <Dialog title="Editar detalhes da recebimento" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => handleEditSubmit(event, activeReceipt)}>
            <div className="expense-list__form-grid">
              <Field label="Data">
                <input name="date" type="date" defaultValue={activeReceipt.date} required />
              </Field>
              <Field label="Valor">
                <input name="value" type="number" step="0.01" min="0" defaultValue={activeReceipt.value} required />
              </Field>
              <Field label="Descrição" className="is-wide">
                <input name="description" defaultValue={activeReceipt.description} required />
              </Field>
              <Field label="Cliente" className="is-wide">
                <input name="client" defaultValue={activeReceipt.client} required />
              </Field>
              <Field label="Categoria">
                <select name="category" defaultValue={activeReceipt.category}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
              </Field>
              <Field label="Tipo de pagamento">
                <select name="paymentType" defaultValue={activeReceipt.paymentType}>{PAYMENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
              </Field>
              <Field label="Forma de pagamento" className="is-wide">
                <select name="paymentMethod" defaultValue={activeReceipt.paymentMethod}>{PAYMENT_MODES.map((mode) => <option key={mode}>{mode}</option>)}</select>
              </Field>
            </div>

            <label className="expense-list__checkbox-row">
              <input name="paid" type="checkbox" defaultChecked={activeReceipt.paid} />
              <span>Recebimento pago</span>
            </label>

            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Salvar alterações</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "details" && activeReceipt ? (
        <Dialog title="Detalhamento do valor" onClose={() => setDialog(null)}>
          <div className="expense-list__details-card">
            <span>Valor total da recebimento</span>
            <strong>{formatCurrency(activeReceipt.value)}</strong>
          </div>
          <dl className="expense-list__details-list">
            <div><dt>Descrição</dt><dd>{activeReceipt.description}</dd></div>
            <div><dt>Cliente</dt><dd>{activeReceipt.client}</dd></div>
            <div><dt>Categoria</dt><dd>{activeReceipt.category}</dd></div>
            <div><dt>Tipo</dt><dd>{activeReceipt.paymentType}</dd></div>
            <div><dt>Modo</dt><dd>{activeReceipt.paymentMethod}</dd></div>
            <div><dt>Status</dt><dd>{activeReceipt.paid ? "Pago" : "Pendente"}</dd></div>
          </dl>
        </Dialog>
      ) : null}

      {dialog?.type === "attachments" && activeReceipt ? (
        <Dialog title="Anexos da recebimento" onClose={() => setDialog(null)}>
          <div className="expense-list__attachments">
            <label className="expense-list__upload-box">
              <FaPlus aria-hidden="true" />
              <span>Adicionar nota fiscal, boleto ou comprovante</span>
              <input type="file" multiple onChange={(event) => handleAttachmentAdd(activeReceipt, event.target.files)} />
            </label>

            {activeReceipt.attachments?.length ? (
              <ul>
                {activeReceipt.attachments.map((attachment) => (
                  <li key={attachment.id ?? attachment.name}>
                    <FaPaperclip aria-hidden="true" />
                    <span>{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextAttachments = activeReceipt.attachments.filter((item) => item !== attachment);
                        const updated = { ...activeReceipt, attachments: nextAttachments };
                        replaceReceipt(updated);
                        onAttachmentsChange?.(updated, nextAttachments);
                        setDialog({ type: "attachments", receiptId: updated.id });
                      }}
                      aria-label={`Remover ${attachment.name}`}
                    >
                      <FaTimes aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="expense-list__muted">Nenhum arquivo anexado a esta recebimento.</p>
            )}
          </div>
        </Dialog>
      ) : null}

      {dialog?.type === "move" && activeReceipt ? (
        <Dialog title="Mover recebimento" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => submitMove(event, activeReceipt)}>
            <Field label="Mover para">
              <select name="destination" defaultValue="receivables">
                <option value="expenses">Recebimentos (reclassificar)</option>
                <option value="receipts">Recebimentos</option>
                <option value="transfers">Transferências</option>
              </select>
            </Field>
            <Field label="Categoria de destino">
              <select name="category" defaultValue={activeReceipt.category}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
            </Field>
            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Mover</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "recurring" && activeReceipt ? (
        <Dialog title="Tornar recorrente" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => submitRecurring(event, activeReceipt)}>
            <Field label="Frequência">
              <select name="frequency" defaultValue="monthly">
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </Field>
            <Field label="Iniciar em">
              <input name="startDate" type="date" defaultValue={activeReceipt.date} required />
            </Field>
            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Confirmar recorrência</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "installments" && activeReceipt ? (
        <Dialog title="Parcelar recebimento" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => submitInstallments(event, activeReceipt)}>
            <div className="expense-list__details-card expense-list__details-card--compact">
              <span>Valor a parcelar</span>
              <strong>{formatCurrency(activeReceipt.value)}</strong>
            </div>
            <Field label="Número de parcelas">
              <input name="installments" type="number" min="2" max="60" defaultValue="2" required />
            </Field>
            <Field label="Vencimento da primeira parcela">
              <input name="firstDate" type="date" defaultValue={activeReceipt.date} required />
            </Field>
            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Criar parcelas</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "delete" && activeReceipt ? (
        <Dialog title="Excluir recebimento" onClose={() => setDialog(null)} className="expense-list__dialog--small">
          <div className="expense-list__delete-copy">
            <div className="expense-list__danger-icon"><FaTrash aria-hidden="true" /></div>
            <p>Tem certeza que deseja excluir <strong>{activeReceipt.description}</strong>?</p>
            <span>A exclusão é lógica e pode ser tratada pela API por meio do callback <code>onDeleteReceipt</code>.</span>
          </div>
          <div className="expense-list__dialog-actions">
            <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
            <button type="button" className="expense-list__button expense-list__button--danger" onClick={() => confirmDelete(activeReceipt)}>Excluir recebimento</button>
          </div>
        </Dialog>
      ) : null}
    </main>
  );
};

export default ReceiptsList;