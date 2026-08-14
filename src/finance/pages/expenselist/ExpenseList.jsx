// ExpenseList v4 — fundo global do tema sem overlay e footer preservado
import React, { useEffect, useMemo, useState } from "react";
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
import './ExpenseList.css';

import Footer from "../../../global/components/Footer/Footer.jsx";

const MONTHS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

const PAYMENT_TYPES = ["À vista", "Parcelado", "Recorrente"];
const PAGE_SIZE_OPTIONS = [4, 10, 20, 50];
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

const DEMO_EXPENSES = [
  {
    id: "exp-001",
    date: "2026-05-01",
    description: "#OS-8821",
    payee: "Ana Costa & Associados",
    category: "Infraestrutura",
    value: 180,
    paymentType: "À vista",
    paymentMode: "Boleto",
    paid: true,
    attachments: [],
  },
  {
    id: "exp-002",
    date: "2026-05-03",
    description: "#OS-8821",
    payee: "Visa Crédito Brasil",
    category: "Mensalidade",
    value: 180,
    paymentType: "Recorrente",
    paymentMode: "Pix",
    paid: false,
    attachments: [],
  },
  {
    id: "exp-003",
    date: "2026-05-14",
    description: "#OS-8823",
    payee: "Juliana Lopes de Almeida",
    category: "Suprimentos",
    value: 180,
    paymentType: "À vista",
    paymentMode: "Cartão de Débito",
    paid: false,
    attachments: [],
  },
  {
    id: "exp-004",
    date: "2026-05-27",
    description: "#OS-8821",
    payee: "Global Soluções LTDA",
    category: "Tecnologia",
    value: 180,
    paymentType: "À vista",
    paymentMode: "Cartão de Crédito",
    paid: true,
    attachments: [],
  },
  {
    id: "exp-005",
    date: "2026-05-29",
    description: "Hospedagem do site",
    payee: "Cloud Services Brasil",
    category: "Tecnologia",
    value: 349.9,
    paymentType: "Recorrente",
    paymentMode: "Cartão de Crédito",
    paid: true,
    attachments: [],
  },
  {
    id: "exp-006",
    date: "2026-05-30",
    description: "Materiais de escritório",
    payee: "Papelaria Central",
    category: "Suprimentos",
    value: 226.5,
    paymentType: "À vista",
    paymentMode: "Pix",
    paid: false,
    attachments: [],
  },
];

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const parseMonth = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), 1);
  }

  if (typeof value === "string") {
    const parsed = new Date(`${value.slice(0, 7)}-01T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
  }

  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const formatMonth = (date) => `${MONTHS[date.getMonth()]}/${date.getFullYear()}`;

const formatDate = (value) => {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

const includesNormalized = (value, query) =>
  normalize(value).includes(normalize(query));

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return [...pages]
    .filter((page) => page > 0 && page <= totalPages)
    .sort((a, b) => a - b);
};

const CALCULATOR_KEYS = [
  "backspace",
  "(",
  ")",
  "÷",
  "7",
  "8",
  "9",
  "×",
  "4",
  "5",
  "6",
  "−",
  "1",
  "2",
  "3",
  "+",
  "C",
  "0",
  ",",
  "=",
];

const normalizeCalculatorExpression = (value) =>
  String(value ?? "")
    .replaceAll(",", ".")
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-");

const formatCalculatorNumber = (value) => {
  const rounded = Math.round((Number(value) + Number.EPSILON) * 100000000) / 100000000;
  return String(rounded).replace(".", ",");
};

const evaluateCalculatorExpression = (value) => {
  const normalized = normalizeCalculatorExpression(value).trim();

  if (!normalized || !/^[0-9+\-*/().\s]+$/.test(normalized)) {
    throw new Error("Expressão inválida");
  }

  // A expressão é limitada pelo regex acima a números, parênteses e operadores aritméticos.
  const result = Function(`"use strict"; return (${normalized});`)();

  if (!Number.isFinite(result)) {
    throw new Error("Resultado inválido");
  }

  return result;
};

const Dialog = ({ title, children, onClose, className = "" }) => (
  <div className="expense-list__overlay" role="presentation" onMouseDown={onClose}>
    <section
      className={`expense-list__dialog ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => event.stopPropagation()}
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

const ExpenseList = ({
  expenses = DEMO_EXPENSES,
  initialMonth = "2026-05-01",
  pageSize = 4,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  onMonthChange,
  onTabChange,
  onOpenAdvancedFilters,
  onGenerateReceipt,
  onEditExpense,
  onViewValueDetails,
  onAttachmentsChange,
  onDuplicateExpense,
  onMoveExpense,
  onRecurringExpense,
  onInstallmentExpense,
  onDeleteExpense,
}) => {
  const [rows, setRows] = useState(() => expenses.map((item) => ({ ...item })));
  const [month, setMonth] = useState(() => parseMonth(initialMonth));
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const parsedPageSize = Number(pageSize);
    return Number.isFinite(parsedPageSize) && parsedPageSize > 0
      ? Math.floor(parsedPageSize)
      : 4;
  });
  const [sort, setSort] = useState({ key: "date", direction: "asc" });
  const [menuRowId, setMenuRowId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [inlineFilters, setInlineFilters] = useState({
    date: "",
    description: "",
    payee: "",
    category: "",
    value: "",
    paymentType: "",
    paymentMode: "",
    paid: "",
  });
  const [draftInlineFilters, setDraftInlineFilters] = useState({
    date: "",
    description: "",
    payee: "",
    category: "",
    value: "",
    paymentType: "",
    paymentMode: "",
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
    setRows(expenses.map((item) => ({ ...item })));
  }, [expenses]);

  useEffect(() => {
    const parsedPageSize = Number(pageSize);
    if (!Number.isFinite(parsedPageSize) || parsedPageSize <= 0) return;

    setRowsPerPage(Math.floor(parsedPageSize));
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
          inlineFilters.payee &&
          !includesNormalized(row.payee, inlineFilters.payee)
        ) {
          return false;
        }
        if (
          inlineFilters.category &&
          row.category !== inlineFilters.category
        ) {
          return false;
        }
        if (
          inlineFilters.value &&
          !String(row.value).includes(String(inlineFilters.value).replace(",", "."))
        ) {
          return false;
        }
        if (
          inlineFilters.paymentType &&
          row.paymentType !== inlineFilters.paymentType
        ) {
          return false;
        }
        if (
          inlineFilters.paymentMode &&
          row.paymentMode !== inlineFilters.paymentMode
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

  const availablePageSizes = useMemo(() => {
    const configuredOptions = Array.isArray(pageSizeOptions) ? pageSizeOptions : [];

    return [...new Set([rowsPerPage, ...configuredOptions]
      .map(Number)
      .filter((value) => Number.isFinite(value) && value > 0)
      .map(Math.floor))]
      .sort((left, right) => left - right);
  }, [pageSizeOptions, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );
  const visiblePages = getVisiblePages(safePage, totalPages);

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
      payee: "",
      category: "",
      value: "",
      paymentType: "",
      paymentMode: "",
      paid: "",
    });
    setDraftInlineFilters({
      date: "",
      description: "",
      payee: "",
      category: "",
      value: "",
      paymentType: "",
      paymentMode: "",
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

  const getExpense = (id) => rows.find((item) => item.id === id);

  const closeRowMenu = () => {
    setMenuRowId(null);
    setMenuPosition(null);
  };

  const toggleRowMenu = (event, expenseId) => {
    if (menuRowId === expenseId) {
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

    setMenuRowId(expenseId);
    setMenuPosition({
      left,
      top: placeAbove ? triggerRect.top - gap : triggerRect.bottom + gap,
      placement: placeAbove ? "above" : "below",
    });
  };

  const replaceExpense = (nextExpense) => {
    setRows((current) =>
      current.map((item) => (item.id === nextExpense.id ? nextExpense : item)),
    );
  };

  const generateReceipt = (expense) => {
    onGenerateReceipt?.(expense);

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
          <title>Recibo - ${escapeHtml(expense.description)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 48px; color: #202235; }
            .card { border: 1px solid #dadce8; border-radius: 18px; padding: 28px; }
            h1 { margin-top: 0; font-size: 24px; }
            dl { display: grid; grid-template-columns: 180px 1fr; gap: 12px 24px; }
            dt { color: #666b7d; font-weight: 700; }
            dd { margin: 0; }
            .amount { font-size: 28px; font-weight: 800; margin: 24px 0; }
            .status { font-weight: 700; color: ${expense.paid ? "#5d7700" : "#7c5b14"}; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Comprovante de despesa</h1>
            <p class="amount">${escapeHtml(formatCurrency(expense.value))}</p>
            <dl>
              <dt>Data</dt><dd>${escapeHtml(formatDate(expense.date))}</dd>
              <dt>Descrição</dt><dd>${escapeHtml(expense.description)}</dd>
              <dt>Pago a</dt><dd>${escapeHtml(expense.payee)}</dd>
              <dt>Categoria</dt><dd>${escapeHtml(expense.category)}</dd>
              <dt>Tipo de pagamento</dt><dd>${escapeHtml(expense.paymentType)}</dd>
              <dt>Modo de pagamento</dt><dd>${escapeHtml(expense.paymentMode)}</dd>
              <dt>Status</dt><dd class="status">${expense.paid ? "Pago" : "Pendente"}</dd>
            </dl>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  const handleEditSubmit = (event, expense) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updated = {
      ...expense,
      date: formData.get("date"),
      description: formData.get("description"),
      payee: formData.get("payee"),
      category: formData.get("category"),
      value: Number(formData.get("value")),
      paymentType: formData.get("paymentType"),
      paymentMode: formData.get("paymentMode"),
      paid: formData.get("paid") === "on",
    };

    replaceExpense(updated);
    onEditExpense?.(updated);
    setDialog(null);
    setNotice("Despesa atualizada.");
  };

  const handleAttachmentAdd = (expense, files) => {
    if (!files?.length) return;
    const newAttachments = [...(expense.attachments ?? [])].concat(
      [...files].map((file) => ({
        id: createId(),
        name: file.name,
        size: file.size,
        file,
      })),
    );
    const updated = { ...expense, attachments: newAttachments };
    replaceExpense(updated);
    onAttachmentsChange?.(updated, newAttachments);
    setDialog({ type: "attachments", expenseId: updated.id });
  };

  const duplicateExpense = (expense) => {
    const copy = {
      ...expense,
      id: createId(),
      description: `${expense.description} (cópia)`,
      paid: false,
      attachments: [],
    };
    setRows((current) => [copy, ...current]);
    onDuplicateExpense?.(copy, expense);
    closeRowMenu();
    setNotice("Despesa duplicada.");
  };

  const submitMove = (event, expense) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const destination = formData.get("destination");
    const category = formData.get("category");

    if (destination === "expenses") {
      const updated = { ...expense, category };
      replaceExpense(updated);
      onMoveExpense?.({ expense: updated, destination, category });
      setNotice("Despesa reclassificada.");
    } else {
      setRows((current) => current.filter((item) => item.id !== expense.id));
      onMoveExpense?.({ expense, destination, category: null });
      setNotice(
        destination === "receipts"
          ? "Item movido para Recebimentos."
          : "Item movido para Transferências.",
      );
    }
    setDialog(null);
  };

  const submitRecurring = (event, expense) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updated = {
      ...expense,
      paymentType: "Recorrente",
      recurrence: {
        frequency: formData.get("frequency"),
        startDate: formData.get("startDate"),
      },
    };
    replaceExpense(updated);
    onRecurringExpense?.(updated);
    setDialog(null);
    setNotice("Despesa configurada como recorrente.");
  };

  const submitInstallments = (event, expense) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const installmentCount = Math.max(2, Number(formData.get("installments")) || 2);
    const firstDate = new Date(`${formData.get("firstDate")}T12:00:00`);
    const totalCents = Math.round(Number(expense.value) * 100);
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
        ...expense,
        id: index === 0 ? expense.id : createId(),
        date: dueDate.toISOString().slice(0, 10),
        description: `${expense.description} (${index + 1}/${installmentCount})`,
        value: cents / 100,
        paymentType: "Parcelado",
        paid: index === 0 ? expense.paid : false,
        installment: {
          current: index + 1,
          total: installmentCount,
        },
      };
    });

    setRows((current) => [
      ...current.filter((item) => item.id !== expense.id),
      ...installments,
    ]);
    onInstallmentExpense?.(installments, expense);
    setDialog(null);
    setNotice(`Despesa dividida em ${installmentCount} parcelas.`);
  };

  const confirmDelete = (expense) => {
    setRows((current) => current.filter((item) => item.id !== expense.id));
    onDeleteExpense?.({ ...expense, deletedAt: new Date().toISOString() });
    setDialog(null);
    setNotice("Despesa excluída.");
  };

  const activeExpense = dialog?.expenseId ? getExpense(dialog.expenseId) : null;
  const activeMenuExpense = menuRowId ? getExpense(menuRowId) : null;

  return (
    <main className="expense-list-page">
      <section className="expense-list" aria-label="Financeiro - Despesas">
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
                <button type="button" onClick={() => onTabChange?.("receipts")}>Recebimentos</button>
                <button type="button" className="is-active" aria-current="page">Despesas</button>
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
                      ["payee", "Pago a"],
                      ["category", "Categoria"],
                      ["value", "Valor"],
                      ["paymentType", "Tipo pagamento"],
                      ["paymentMode", "Modo do pagamento"],
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
                        value={draftInlineFilters.payee}
                        onChange={(event) => updateInlineFilter("payee", event.target.value)}
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
                        value={draftInlineFilters.paymentMode}
                        onChange={(event) => updateInlineFilter("paymentMode", event.target.value)}
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
                        <option value="paid">Pagas</option>
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
                    visibleRows.map((expense) => (
                      <tr key={expense.id}>
                        <td>{formatDate(expense.date)}</td>
                        <td className="expense-list__description-cell">{expense.description}</td>
                        <td>{expense.payee}</td>
                        <td>{expense.category}</td>
                        <td className="expense-list__value-cell">{formatCurrency(expense.value)}</td>
                        <td>{expense.paymentType}</td>
                        <td>{expense.paymentMode}</td>
                        <td>
                          <button
                            type="button"
                            className={`expense-list__paid-status ${expense.paid ? "is-paid" : "is-pending"}`}
                            onClick={() => {
                              const updated = { ...expense, paid: !expense.paid };
                              replaceExpense(updated);
                              onEditExpense?.(updated);
                            }}
                            title={expense.paid ? "Marcar como pendente" : "Marcar como paga"}
                            aria-label={expense.paid ? "Despesa paga" : "Despesa pendente"}
                          >
                            {expense.paid ? <FaCheckCircle aria-hidden="true" /> : <FaRegCircle aria-hidden="true" />}
                          </button>
                        </td>
                        <td className="expense-list__actions-cell">
                          <div className="expense-list__row-menu" data-expense-row-menu>
                            <button
                              type="button"
                              className={`expense-list__kebab ${menuRowId === expense.id ? "is-open" : ""}`.trim()}
                              onClick={(event) => toggleRowMenu(event, expense.id)}
                              aria-haspopup="menu"
                              aria-expanded={menuRowId === expense.id}
                              aria-label={`Ações da despesa ${expense.description}`}
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
                          <h2>Nenhuma despesa neste período</h2>
                          <p>
                            {hasFilters
                              ? "Não encontramos despesas com os filtros aplicados."
                              : `Ainda não há despesas registradas em ${formatMonth(month)}.`}
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
              Mostrando <strong>{visibleRows.length}</strong> de <strong>{filteredRows.length}</strong> despesas
            </p>

            <label className="expense-list__page-size">
              <span>Linhas por página</span>
              <div className="expense-list__select-wrap">
                <select
                  value={rowsPerPage}
                  onChange={(event) => {
                    setRowsPerPage(Number(event.target.value));
                    setPage(1);
                  }}
                  aria-label="Linhas por página"
                >
                  {availablePageSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <FaChevronDown className="expense-list__select-chevron" aria-hidden="true" />
              </div>
            </label>
          </div>

          <div className="expense-list__pagination" aria-label="Paginação de despesas">
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
                  <strong>Valor da despesa</strong>
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
                    aria-label={key === "backspace" ? "Apagar último caractere" : key}
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

      {menuRowId && activeMenuExpense && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              className={`expense-list__action-menu expense-list__action-menu--portal ${menuPosition.placement === "above" ? "is-above" : "is-below"}`.trim()}
              data-expense-row-menu
              role="menu"
              style={{ left: `${menuPosition.left}px`, top: `${menuPosition.top}px` }}
            >
              <button type="button" role="menuitem" onClick={() => { generateReceipt(activeMenuExpense); closeRowMenu(); }}>
                <FaFileInvoice aria-hidden="true" />
                <span>Gerar recibo</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "edit", expenseId: activeMenuExpense.id }); closeRowMenu(); }}>
                <FaPen aria-hidden="true" />
                <span>Editar detalhes</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { onViewValueDetails?.(activeMenuExpense); setDialog({ type: "details", expenseId: activeMenuExpense.id }); closeRowMenu(); }}>
                <FaListUl aria-hidden="true" />
                <span>Detalhar valor</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "attachments", expenseId: activeMenuExpense.id }); closeRowMenu(); }}>
                <FaPaperclip aria-hidden="true" />
                <span>Anexos</span>
                {activeMenuExpense.attachments?.length ? <small>{activeMenuExpense.attachments.length}</small> : null}
              </button>
              <button type="button" role="menuitem" onClick={() => duplicateExpense(activeMenuExpense)}>
                <FaCopy aria-hidden="true" />
                <span>Duplicar</span>
              </button>
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "move", expenseId: activeMenuExpense.id }); closeRowMenu(); }}>
                <FaExchangeAlt aria-hidden="true" />
                <span>Mover para...</span>
              </button>
              <div className="expense-list__menu-divider" />
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "recurring", expenseId: activeMenuExpense.id }); closeRowMenu(); }}>
                <FaClock aria-hidden="true" />
                <span>Tornar recorrente...</span>
              </button>
              <div className="expense-list__menu-divider" />
              <button type="button" role="menuitem" onClick={() => { setDialog({ type: "installments", expenseId: activeMenuExpense.id }); closeRowMenu(); }}>
                <FaMoneyBillWave aria-hidden="true" />
                <span>Parcelar...</span>
              </button>
              <div className="expense-list__menu-divider" />
              <button type="button" role="menuitem" className="is-danger" onClick={() => { setDialog({ type: "delete", expenseId: activeMenuExpense.id }); closeRowMenu(); }}>
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
          <aside className="expense-list__drawer" onMouseDown={(event) => event.stopPropagation()} aria-label="Filtros avançados">
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
                <span>Somente despesas com anexos</span>
              </label>
            </div>

            <footer>
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={clearFilters}>Limpar filtros</button>
              <button type="button" className="expense-list__button expense-list__button--primary" onClick={() => setIsAdvancedOpen(false)}>Aplicar filtros</button>
            </footer>
          </aside>
        </div>
      ) : null}

      {dialog?.type === "edit" && activeExpense ? (
        <Dialog title="Editar detalhes da despesa" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => handleEditSubmit(event, activeExpense)}>
            <div className="expense-list__form-grid">
              <Field label="Data">
                <input name="date" type="date" defaultValue={activeExpense.date} required />
              </Field>
              <Field label="Valor">
                <input name="value" type="number" step="0.01" min="0" defaultValue={activeExpense.value} required />
              </Field>
              <Field label="Descrição" className="is-wide">
                <input name="description" defaultValue={activeExpense.description} required />
              </Field>
              <Field label="Pago a" className="is-wide">
                <input name="payee" defaultValue={activeExpense.payee} required />
              </Field>
              <Field label="Categoria">
                <select name="category" defaultValue={activeExpense.category}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
              </Field>
              <Field label="Tipo de pagamento">
                <select name="paymentType" defaultValue={activeExpense.paymentType}>{PAYMENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
              </Field>
              <Field label="Modo de pagamento" className="is-wide">
                <select name="paymentMode" defaultValue={activeExpense.paymentMode}>{PAYMENT_MODES.map((mode) => <option key={mode}>{mode}</option>)}</select>
              </Field>
            </div>

            <label className="expense-list__checkbox-row">
              <input name="paid" type="checkbox" defaultChecked={activeExpense.paid} />
              <span>Despesa paga</span>
            </label>

            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Salvar alterações</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "details" && activeExpense ? (
        <Dialog title="Detalhamento do valor" onClose={() => setDialog(null)}>
          <div className="expense-list__details-card">
            <span>Valor total da despesa</span>
            <strong>{formatCurrency(activeExpense.value)}</strong>
          </div>
          <dl className="expense-list__details-list">
            <div><dt>Descrição</dt><dd>{activeExpense.description}</dd></div>
            <div><dt>Favorecido</dt><dd>{activeExpense.payee}</dd></div>
            <div><dt>Categoria</dt><dd>{activeExpense.category}</dd></div>
            <div><dt>Tipo</dt><dd>{activeExpense.paymentType}</dd></div>
            <div><dt>Modo</dt><dd>{activeExpense.paymentMode}</dd></div>
            <div><dt>Status</dt><dd>{activeExpense.paid ? "Pago" : "Pendente"}</dd></div>
          </dl>
        </Dialog>
      ) : null}

      {dialog?.type === "attachments" && activeExpense ? (
        <Dialog title="Anexos da despesa" onClose={() => setDialog(null)}>
          <div className="expense-list__attachments">
            <label className="expense-list__upload-box">
              <FaPlus aria-hidden="true" />
              <span>Adicionar nota fiscal, boleto ou comprovante</span>
              <input type="file" multiple onChange={(event) => handleAttachmentAdd(activeExpense, event.target.files)} />
            </label>

            {activeExpense.attachments?.length ? (
              <ul>
                {activeExpense.attachments.map((attachment) => (
                  <li key={attachment.id ?? attachment.name}>
                    <FaPaperclip aria-hidden="true" />
                    <span>{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextAttachments = activeExpense.attachments.filter((item) => item !== attachment);
                        const updated = { ...activeExpense, attachments: nextAttachments };
                        replaceExpense(updated);
                        onAttachmentsChange?.(updated, nextAttachments);
                        setDialog({ type: "attachments", expenseId: updated.id });
                      }}
                      aria-label={`Remover ${attachment.name}`}
                    >
                      <FaTimes aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="expense-list__muted">Nenhum arquivo anexado a esta despesa.</p>
            )}
          </div>
        </Dialog>
      ) : null}

      {dialog?.type === "move" && activeExpense ? (
        <Dialog title="Mover despesa" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => submitMove(event, activeExpense)}>
            <Field label="Mover para">
              <select name="destination" defaultValue="expenses">
                <option value="expenses">Despesas (reclassificar)</option>
                <option value="receipts">Recebimentos</option>
                <option value="transfers">Transferências</option>
              </select>
            </Field>
            <Field label="Categoria de destino">
              <select name="category" defaultValue={activeExpense.category}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
            </Field>
            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Mover</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "recurring" && activeExpense ? (
        <Dialog title="Tornar recorrente" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => submitRecurring(event, activeExpense)}>
            <Field label="Frequência">
              <select name="frequency" defaultValue="monthly">
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </Field>
            <Field label="Iniciar em">
              <input name="startDate" type="date" defaultValue={activeExpense.date} required />
            </Field>
            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Confirmar recorrência</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "installments" && activeExpense ? (
        <Dialog title="Parcelar despesa" onClose={() => setDialog(null)}>
          <form className="expense-list__form" onSubmit={(event) => submitInstallments(event, activeExpense)}>
            <div className="expense-list__details-card expense-list__details-card--compact">
              <span>Valor a parcelar</span>
              <strong>{formatCurrency(activeExpense.value)}</strong>
            </div>
            <Field label="Número de parcelas">
              <input name="installments" type="number" min="2" max="60" defaultValue="2" required />
            </Field>
            <Field label="Vencimento da primeira parcela">
              <input name="firstDate" type="date" defaultValue={activeExpense.date} required />
            </Field>
            <div className="expense-list__dialog-actions">
              <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
              <button type="submit" className="expense-list__button expense-list__button--primary">Criar parcelas</button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {dialog?.type === "delete" && activeExpense ? (
        <Dialog title="Excluir despesa" onClose={() => setDialog(null)} className="expense-list__dialog--small">
          <div className="expense-list__delete-copy">
            <div className="expense-list__danger-icon"><FaTrash aria-hidden="true" /></div>
            <p>Tem certeza que deseja excluir <strong>{activeExpense.description}</strong>?</p>
            <span>A exclusão é lógica e pode ser tratada pela API por meio do callback <code>onDeleteExpense</code>.</span>
          </div>
          <div className="expense-list__dialog-actions">
            <button type="button" className="expense-list__button expense-list__button--secondary" onClick={() => setDialog(null)}>Cancelar</button>
            <button type="button" className="expense-list__button expense-list__button--danger" onClick={() => confirmDelete(activeExpense)}>Excluir despesa</button>
          </div>
        </Dialog>
      ) : null}
    </main>
  );
};

export default ExpenseList;
