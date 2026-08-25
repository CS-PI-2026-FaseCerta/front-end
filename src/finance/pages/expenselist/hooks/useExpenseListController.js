import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { DEMO_EXPENSES } from "../expenseList.constants.js";
import {
  createId,
  escapeHtml,
  evaluateCalculatorExpression,
  formatCalculatorNumber,
  formatCurrency,
  formatDate,
  formatMonth,
  includesNormalized,
  matchesCurrencyFilter,
  matchesMonthYear,
  matchesProgressiveMonthYear,
  parseMonth,
  parseMonthYearFilter,
} from "../utils/expenseList.utils.js";

export default function useExpenseListController({
  expenses = DEMO_EXPENSES,
  initialMonth = "2026-05-01",
  pageSize = 4,
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
}) {
  const [rows, setRows] = useState(() => expenses.map((item) => ({ ...item })));
  const [month, setMonth] = useState(() => new Date());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem("financeiro_despesas_page_size");
    const parsedSaved = Number(saved);
    if (Number.isFinite(parsedSaved) && parsedSaved > 0) {
      return Math.floor(parsedSaved);
    }
    const parsedPageSize = Number(pageSize);
    return Number.isFinite(parsedPageSize) && parsedPageSize > 0
      ? Math.floor(parsedPageSize)
      : 4;
  });
  const [rowsPerPageInput, setRowsPerPageInput] = useState(() =>
    String(rowsPerPage),
  );
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
      ".expense-action-menu[data-expense-row-menu]",
    );
    if (!menuElement) return;

    const viewportPadding = 12;
    const gap = 8;
    const menuRect = menuElement.getBoundingClientRect();
    const menuHeight = Math.min(
      menuRect.height,
      window.innerHeight - viewportPadding * 2,
    );
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
      if (
        Math.abs(current.top - top) < 0.5 &&
        current.placement === nextPlacement
      ) {
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
    setInlineFilters((current) => ({ ...current, [key]: value }));
    setPage(1);

    if (key === "date") {
      const parsed = parseMonthYearFilter(value);
      if (parsed) {
        const newMonth = new Date(parsed.year, parsed.month - 1, 1);
        setMonth(newMonth);
        onMonthChange?.(newMonth);
      }
    }
  };

  const filteredRows = useMemo(() => {
    return rows
      .filter((row) => {
        const rowDate = new Date(`${row.date}T12:00:00`);
        if (
          rowDate.getFullYear() !== month.getFullYear() ||
          rowDate.getMonth() !== month.getMonth()
        ) {
          return false;
        }

        if (inlineFilters.date) {
          const parsed = parseMonthYearFilter(inlineFilters.date);
          if (parsed) {
            if (!matchesMonthYear(row.date, parsed.month, parsed.year)) {
              return false;
            }
          } else {
            if (!matchesProgressiveMonthYear(row.date, inlineFilters.date)) {
              return false;
            }
          }
        }
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
        if (inlineFilters.category && row.category !== inlineFilters.category) {
          return false;
        }
        if (
          inlineFilters.value &&
          !matchesCurrencyFilter(row.value, inlineFilters.value)
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
        if (inlineFilters.paid === "paid" && !row.paid) {
          return false;
        }
        if (inlineFilters.paid === "pending" && row.paid) {
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
    localStorage.setItem("financeiro_despesas_page_size", String(parsedValue));
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

  const openCalculator = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = 320;
    const estimatedHeight = 430;
    const gap = 8;
    const viewportPadding = 12;
    const availableBelow = window.innerHeight - rect.bottom;
    const placeAbove =
      availableBelow < estimatedHeight && rect.top > availableBelow;
    const left = Math.max(
      viewportPadding,
      Math.min(rect.right - width, window.innerWidth - width - viewportPadding),
    );

    setCalculator({
      open: true,
      expression: inlineFilters.value || "",
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
      setCalculator((current) => ({
        ...current,
        expression: formatted,
        error: "",
      }));
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
    const nextMonth = new Date(
      month.getFullYear(),
      month.getMonth() + direction,
      1,
    );
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
    setAdvancedFilters({
      dateFrom: "",
      dateTo: "",
      minValue: "",
      maxValue: "",
      onlyWithAttachments: false,
    });
    setCalculator((current) => ({
      ...current,
      open: false,
      expression: "",
      error: "",
    }));
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

    const estimatedMenuHeight = Math.min(
      430,
      window.innerHeight - viewportPadding * 2,
    );
    const initialTop = placeAbove
      ? triggerRect.top - gap - estimatedMenuHeight
      : triggerRect.bottom + gap;

    setMenuRowId(expenseId);
    setMenuPosition({
      left,
      top: Math.max(
        viewportPadding,
        Math.min(
          initialTop,
          window.innerHeight - viewportPadding - estimatedMenuHeight,
        ),
      ),
      placement: placeAbove ? "above" : "below",
      triggerTop: triggerRect.top,
      triggerBottom: triggerRect.bottom,
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

  const handleAttachmentRemove = (expense, attachment) => {
    const nextAttachments = (expense.attachments ?? []).filter(
      (item) => item !== attachment,
    );
    const updated = { ...expense, attachments: nextAttachments };
    replaceExpense(updated);
    onAttachmentsChange?.(updated, nextAttachments);
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
    const installmentCount = Math.max(
      2,
      Number(formData.get("installments")) || 2,
    );
    const firstDate = new Date(`${formData.get("firstDate")}T12:00:00`);
    const totalCents = Math.round(Number(expense.value) * 100);
    const baseCents = Math.floor(totalCents / installmentCount);
    const remainder = totalCents % installmentCount;

    const installments = Array.from(
      { length: installmentCount },
      (_, index) => {
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
      },
    );

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

  const togglePaid = (expense) => {
    const updated = { ...expense, paid: !expense.paid };
    replaceExpense(updated);
    onEditExpense?.(updated);
  };

  const openExpenseDialog = (type, expense) => {
    if (type === "details") onViewValueDetails?.(expense);
    setDialog({ type, expenseId: expense.id });
    closeRowMenu();
  };

  const generateReceiptAndClose = (expense) => {
    generateReceipt(expense);
    closeRowMenu();
  };

  const updateCalculatorExpression = (expression) => {
    setCalculator((current) => ({ ...current, expression, error: "" }));
  };

  return {
    month,
    page: safePage,
    totalPages,
    visibleRows,
    filteredRows,
    rowsPerPageInput,
    setRowsPerPageInput,
    commitRowsPerPage,
    setPage,
    sort,
    toggleSort,
    inlineFilters,
    updateInlineFilter,
    clearFilters,
    hasFilters,
    calculator,
    openCalculator,
    closeCalculator,
    updateCalculatorExpression,
    handleCalculatorKey,
    useCalculatorValue,
    menuRowId,
    menuPosition,
    toggleRowMenu,
    activeMenuExpense,
    generateReceiptAndClose,
    openExpenseDialog,
    duplicateExpense,
    togglePaid,
    notice,
    isAdvancedOpen,
    setIsAdvancedOpen,
    advancedFilters,
    setAdvancedFilters,
    openAdvancedFilters,
    dialog,
    activeExpense,
    setDialog,
    handleEditSubmit,
    handleAttachmentAdd,
    handleAttachmentRemove,
    submitMove,
    submitRecurring,
    submitInstallments,
    confirmDelete,
    changeMonth,
  };
}
