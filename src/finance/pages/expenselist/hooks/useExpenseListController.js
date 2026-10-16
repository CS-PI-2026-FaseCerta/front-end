
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  canDeleteExpense,
  createExpense,
  deleteExpense,
  getExpense,
  listExpenses,
  updateExpense,
} from "../../../services/despesasService.js";
import { getExpenseErrorMessage } from "../../../services/despesasErrors.js";
import {
  labelFor,
  PAYMENT_MODES,
  PAYMENT_TYPES,
} from "../expenseList.constants.js";
import {
  evaluateCalculatorExpression,
  formatCalculatorNumber,
  includesNormalized,
  matchesCurrencyFilter,
  matchesProgressiveMonthYear,
  parseMonthYearFilter,
} from "../utils/expenseList.utils.js";

const PAGE_SIZE_STORAGE_KEY = "finance_tables_page_size";
const API_FETCH_LIMIT = 100;

const toUiExpense = (item) => ({
  id: item.id,
  date: item.data ?? "",
  description: item.descricao ?? "",
  payee: item.pago_a ?? "",
  category: item.categoria ?? "",
  value: Number(item.valor) || 0,
  paymentType: labelFor(PAYMENT_TYPES, item.tipo_pagamento),
  paymentTypeValue: item.tipo_pagamento ?? "",
  paymentMode: labelFor(PAYMENT_MODES, item.modo_pagamento),
  paymentModeValue: item.modo_pagamento ?? "",
  paid: Boolean(item.pago),
  attachments: Array.isArray(item.anexos) ? item.anexos : [],
});

const getStoredRowsPerPage = (fallback) => {
  const defaultValue =
    Number.isSafeInteger(Number(fallback)) && Number(fallback) > 0
      ? Math.floor(Number(fallback))
      : 20;

  if (typeof window === "undefined") return defaultValue;

  try {
    const stored = Number(
      window.localStorage.getItem(PAGE_SIZE_STORAGE_KEY),
    );

    return Number.isSafeInteger(stored) && stored > 0
      ? stored
      : defaultValue;
  } catch {
    return defaultValue;
  }
};

const toIsoDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const monthRange = (date) => [
  toIsoDate(new Date(date.getFullYear(), date.getMonth(), 1)),
  toIsoDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
];

export default function useExpenseListController({
  pageSize = 20,
  onMonthChange,
} = {}) {
  const [rows, setRows] = useState([]);
  const [month, setMonth] = useState(() => new Date());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(() =>
    getStoredRowsPerPage(pageSize),
  );
  const [rowsPerPageInput, setRowsPerPageInput] = useState(() =>
    String(getStoredRowsPerPage(pageSize)),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [menuRowId, setMenuRowId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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

  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    minValue: "",
    maxValue: "",
    onlyWithAttachments: false,
  });

  const [calculator, setCalculator] = useState({
    open: false,
    expression: "",
    error: "",
    left: 0,
    top: 0,
    placement: "below",
    anchorTop: null,
    anchorBottom: null,
  });

  const [sort, setSort] = useState({
    key: "date",
    direction: "desc",
  });

  const latestListRequestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++latestListRequestRef.current;
    const [monthStart, monthEnd] = monthRange(month);
    const hasAdvancedDateRange = Boolean(
      advancedFilters.dateFrom || advancedFilters.dateTo,
    );

    setLoading(true);
    setError(null);

    try {
      const query = {
        categoria: inlineFilters.category,
        pago:
          inlineFilters.paid === "paid"
            ? true
            : inlineFilters.paid === "pending"
              ? false
              : "",
        tipo_pagamento: inlineFilters.paymentType,
        modo_pagamento: inlineFilters.paymentMode,
        data_inicial: hasAdvancedDateRange
          ? advancedFilters.dateFrom || undefined
          : monthStart,
        data_final: hasAdvancedDateRange
          ? advancedFilters.dateTo || undefined
          : monthEnd,
      };

      const firstPage = await listExpenses({
        ...query,
        page: 1,
        limit: API_FETCH_LIMIT,
      });

      let allItems = Array.isArray(firstPage.items)
        ? firstPage.items
        : [];

      const pageCount = Math.max(
        1,
        Number(firstPage.totalPages) || 1,
      );

      for (
        let currentPage = 2;
        currentPage <= pageCount;
        currentPage += 1
      ) {
        const response = await listExpenses({
          ...query,
          page: currentPage,
          limit: API_FETCH_LIMIT,
        });

        allItems = allItems.concat(
          Array.isArray(response.items) ? response.items : [],
        );

        if (requestId !== latestListRequestRef.current) return;
      }

      if (requestId !== latestListRequestRef.current) return;

      setRows(allItems.map(toUiExpense));
    } catch (requestError) {
      if (requestId !== latestListRequestRef.current) return;

      setRows([]);
      setError({
        title: "Não foi possível carregar as despesas",
        message: getExpenseErrorMessage(
          requestError,
          "Não foi possível conectar à API de despesas.",
        ),
      });
    } finally {
      if (requestId === latestListRequestRef.current) {
        setLoading(false);
      }
    }
  }, [
    month,
    inlineFilters.category,
    inlineFilters.paid,
    inlineFilters.paymentType,
    inlineFilters.paymentMode,
    advancedFilters.dateFrom,
    advancedFilters.dateTo,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return undefined;

    const timeout = window.setTimeout(() => setNotice(""), 4000);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  const closeMenu = useCallback(() => {
    setMenuRowId(null);
    setMenuPosition(null);
  }, []);

  useEffect(() => {
    if (!menuRowId) return undefined;

    const closeFloatingMenu = () => closeMenu();

    window.addEventListener("resize", closeFloatingMenu);
    window.addEventListener("scroll", closeFloatingMenu, true);

    return () => {
      window.removeEventListener("resize", closeFloatingMenu);
      window.removeEventListener("scroll", closeFloatingMenu, true);
    };
  }, [menuRowId, closeMenu]);

  useLayoutEffect(() => {
    if (!menuRowId || !menuPosition || typeof document === "undefined") {
      return;
    }

    const element = document.querySelector(
      ".expense-action-menu[data-expense-row-menu]",
    );

    if (!element) return;

    const padding = 12;
    const gap = 8;
    const rect = element.getBoundingClientRect();
    const height = Math.min(rect.height, window.innerHeight - padding * 2);
    const triggerTop = menuPosition.triggerTop;
    const triggerBottom = menuPosition.triggerBottom;
    const below = window.innerHeight - triggerBottom - gap - padding;
    const above = triggerTop - gap - padding;

    const placeAbove =
      above >= height || (above > below && below < height);

    const idealTop = placeAbove
      ? triggerTop - gap - height
      : triggerBottom + gap;

    const top = Math.max(
      padding,
      Math.min(idealTop, window.innerHeight - padding - height),
    );

    setMenuPosition((current) => {
      if (!current) return current;

      const placement = placeAbove ? "above" : "below";

      if (
        Math.abs(current.top - top) < 0.5 &&
        current.placement === placement
      ) {
        return current;
      }

      return { ...current, top, placement };
    });
  }, [menuRowId, menuPosition]);

  const closeCalculator = useCallback(() => {
    setCalculator((current) => ({
      ...current,
      open: false,
      error: "",
    }));
  }, []);

  useEffect(() => {
    if (!calculator.open) return undefined;

    const onPointerDown = (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-expense-calculator]")
      ) {
        return;
      }

      closeCalculator();
    };

    const closeOnViewportChange = () => closeCalculator();

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [calculator.open, closeCalculator]);

  const updateInlineFilter = (key, value) => {
    setInlineFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setPage(1);

    if (key === "date") {
      const parsed = parseMonthYearFilter(value);

      if (parsed) {
        const nextMonth = new Date(
          parsed.year,
          parsed.month - 1,
          1,
        );

        setMonth(nextMonth);
        onMonthChange?.(nextMonth);
      }
    }
  };

  const changeMonth = (delta) => {
    const nextMonth = new Date(
      month.getFullYear(),
      month.getMonth() + delta,
      1,
    );

    setMonth(nextMonth);
    setPage(1);
    onMonthChange?.(nextMonth);
  };

  const updateAdvancedFilters = (updater) => {
    setAdvancedFilters((current) =>
      typeof updater === "function" ? updater(current) : updater,
    );

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

    setPage(1);
  };

  const commitRowsPerPage = () => {
    const input = rowsPerPageInput.trim();

    if (
      !/^\d+$/.test(input) ||
      !Number.isSafeInteger(Number(input)) ||
      Number(input) < 1
    ) {
      setRowsPerPageInput(String(rowsPerPage));
      return;
    }

    const nextSize = Number(input);

    setRowsPerPage(nextSize);
    setRowsPerPageInput(String(nextSize));
    setPage(1);

    try {
      window.localStorage.setItem(
        PAGE_SIZE_STORAGE_KEY,
        String(nextSize),
      );
    } catch {
      // O armazenamento local pode estar indisponível.
    }
  };

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
    [inlineFilters, advancedFilters],
  );

  const filteredRows = useMemo(
    () =>
      rows
        .filter((row) => {
          if (
            inlineFilters.date &&
            !matchesProgressiveMonthYear(row.date, inlineFilters.date)
          ) {
            return false;
          }

          if (
            inlineFilters.description &&
            !includesNormalized(
              row.description,
              inlineFilters.description,
            )
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
            !matchesCurrencyFilter(row.value, inlineFilters.value)
          ) {
            return false;
          }

          if (
            inlineFilters.paymentType &&
            row.paymentTypeValue !== inlineFilters.paymentType
          ) {
            return false;
          }

          if (
            inlineFilters.paymentMode &&
            row.paymentModeValue !== inlineFilters.paymentMode
          ) {
            return false;
          }

          if (inlineFilters.paid === "paid" && !row.paid) {
            return false;
          }

          if (inlineFilters.paid === "pending" && row.paid) {
            return false;
          }

          if (
            advancedFilters.dateFrom &&
            row.date < advancedFilters.dateFrom
          ) {
            return false;
          }

          if (
            advancedFilters.dateTo &&
            row.date > advancedFilters.dateTo
          ) {
            return false;
          }

          if (
            advancedFilters.minValue !== "" &&
            row.value < Number(advancedFilters.minValue)
          ) {
            return false;
          }

          if (
            advancedFilters.maxValue !== "" &&
            row.value > Number(advancedFilters.maxValue)
          ) {
            return false;
          }

          if (
            advancedFilters.onlyWithAttachments &&
            !row.attachments.length
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          const left = a[sort.key];
          const right = b[sort.key];
          let comparison = 0;

          if (left == null && right != null) {
            comparison = 1;
          } else if (right == null && left != null) {
            comparison = -1;
          } else if (
            typeof left === "number" &&
            typeof right === "number"
          ) {
            comparison = left - right;
          } else if (
            typeof left === "boolean" &&
            typeof right === "boolean"
          ) {
            comparison = Number(left) - Number(right);
          } else {
            comparison = String(left ?? "").localeCompare(
              String(right ?? ""),
              "pt-BR",
              {
                numeric: true,
                sensitivity: "base",
              },
            );
          }

          return sort.direction === "asc"
            ? comparison
            : -comparison;
        }),
    [rows, inlineFilters, advancedFilters, sort],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / rowsPerPage),
  );

  const safePage = Math.min(page, totalPages);

  const visibleRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const openCalculator = (event) => {
    const rect = event?.currentTarget?.getBoundingClientRect?.();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 12;
    const gap = 8;

    const width = Math.min(320, viewportWidth - padding * 2);
    const estimatedHeight = Math.min(430, viewportHeight - padding * 2);

    const left = rect
      ? Math.max(
        padding,
        Math.min(
          rect.right - width,
          viewportWidth - width - padding,
        ),
      )
      : Math.max(padding, (viewportWidth - width) / 2);

    const availableBelow = rect
      ? viewportHeight - rect.bottom - gap - padding
      : viewportHeight - 100 - gap - padding;

    const availableAbove = rect
      ? rect.top - gap - padding
      : 0;

    const placeAbove =
      Boolean(rect) &&
      availableBelow < estimatedHeight &&
      availableAbove > availableBelow;

    const proposedTop = placeAbove
      ? rect.top - estimatedHeight - gap
      : (rect?.bottom ?? 100) + gap;

    const top = Math.max(
      padding,
      Math.min(
        proposedTop,
        viewportHeight - estimatedHeight - padding,
      ),
    );

    setCalculator({
      open: true,
      expression: inlineFilters.value || "",
      error: "",
      left,
      top,
      placement: placeAbove ? "above" : "below",
      anchorTop: rect?.top ?? null,
      anchorBottom: rect?.bottom ?? null,
    });
  };

  useLayoutEffect(() => {
    if (!calculator.open || typeof document === "undefined") return;

    const element = document.querySelector("[data-expense-calculator]");
    if (!element) return;

    const padding = 12;
    const gap = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = element.getBoundingClientRect();

    const width = Math.min(rect.width, viewportWidth - padding * 2);
    const height = Math.min(rect.height, viewportHeight - padding * 2);

    const left = Math.max(
      padding,
      Math.min(calculator.left, viewportWidth - width - padding),
    );

    const availableBelow =
      calculator.anchorBottom == null
        ? viewportHeight - calculator.top - padding
        : viewportHeight - calculator.anchorBottom - gap - padding;

    const availableAbove =
      calculator.anchorTop == null
        ? 0
        : calculator.anchorTop - gap - padding;

    const placeAbove =
      calculator.anchorTop != null &&
      height > availableBelow &&
      availableAbove > availableBelow;

    const proposedTop =
      calculator.anchorTop == null
        ? calculator.top
        : placeAbove
          ? calculator.anchorTop - height - gap
          : calculator.anchorBottom + gap;

    const top = Math.max(
      padding,
      Math.min(proposedTop, viewportHeight - height - padding),
    );

    const placement = placeAbove ? "above" : "below";

    if (
      Math.abs(calculator.left - left) > 0.5 ||
      Math.abs(calculator.top - top) > 0.5 ||
      calculator.placement !== placement
    ) {
      setCalculator((current) => ({
        ...current,
        left,
        top,
        placement,
      }));
    }
  }, [
    calculator.open,
    calculator.left,
    calculator.top,
    calculator.placement,
    calculator.anchorTop,
    calculator.anchorBottom,
  ]);

  const updateCalculatorExpression = (expression) => {
    setCalculator((current) => ({
      ...current,
      expression,
      error: "",
    }));
  };

  const calculateExpression = (expression = calculator.expression) => {
    try {
      const result = evaluateCalculatorExpression(expression);

      if (!Number.isFinite(result)) {
        throw new Error("Resultado inválido");
      }

      const formatted = formatCalculatorNumber(result);

      setCalculator((current) => ({
        ...current,
        expression: formatted,
        error: "",
      }));

      return formatted;
    } catch (calculationError) {
      setCalculator((current) => ({
        ...current,
        error: calculationError.message || "Expressão inválida",
      }));

      return null;
    }
  };

  const handleCalculatorKey = (key) => {
    if (key === "C") {
      setCalculator((current) => ({
        ...current,
        expression: "",
        error: "",
      }));
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
      calculateExpression();
      return;
    }

    setCalculator((current) => ({
      ...current,
      expression: current.expression + key,
      error: "",
    }));
  };

  const useCalculatorValue = () => {
    const result = calculateExpression();

    if (result == null) return;

    updateInlineFilter("value", result);
    closeCalculator();
  };

  const toggleSort = (key) => {
    setSort((current) =>
      current.key === key
        ? {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        }
        : { key, direction: "asc" },
    );
  };

  const toggleRowMenu = (event, id) => {
    if (menuRowId === id) {
      closeMenu();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const width = 276;
    const left = Math.max(
      12,
      Math.min(rect.right - width, window.innerWidth - width - 12),
    );

    setMenuRowId(id);
    setMenuPosition({
      left,
      top: rect.bottom + 8,
      triggerTop: rect.top,
      triggerBottom: rect.bottom,
      placement: "below",
    });
  };

  const getRow = (id) =>
    rows.find((row) => String(row.id) === String(id));

  const openExpenseDialog = async (type, expense) => {
    closeMenu();

    if (!expense) return;

    if (type === "delete" && !canDeleteExpense()) {
      setNotice("Você não tem permissão para excluir despesas.");
      return;
    }

    if (type === "edit" || type === "details") {
      setLoading(true);

      try {
        const fresh = toUiExpense(await getExpense(expense.id));

        setRows((current) =>
          current.map((row) =>
            String(row.id) === String(fresh.id) ? fresh : row,
          ),
        );

        setDialog({
          type,
          expenseId: fresh.id,
        });
      } catch (requestError) {
        setNotice(
          getExpenseErrorMessage(
            requestError,
            "Não foi possível carregar a despesa.",
          ),
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    setDialog({
      type,
      expenseId: expense.id,
    });
  };

  const handleEditSubmit = async (event, expense) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const value = Number(form.get("value"));

    if (!Number.isFinite(value) || value <= 0) {
      setNotice("O valor deve ser numérico e maior que zero.");
      return;
    }

    const payload = {
      data: form.get("date"),
      descricao: String(form.get("description") ?? "").trim(),
      pago_a: String(form.get("payee") ?? "").trim(),
      categoria: form.get("category"),
      valor: value,
      tipo_pagamento: form.get("paymentType"),
      modo_pagamento: form.get("paymentMode"),
      pago: form.get("paid") === "on",
    };

    setLoading(true);

    try {
      const saved = toUiExpense(
        await updateExpense(expense.id, payload),
      );

      setRows((current) =>
        current.map((row) =>
          String(row.id) === String(saved.id) ? saved : row,
        ),
      );

      setDialog(null);
      setNotice("Despesa atualizada.");

      await load();
    } catch (requestError) {
      setNotice(
        getExpenseErrorMessage(
          requestError,
          "Não foi possível atualizar a despesa.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePaid = async (expense) => {
    try {
      const saved = toUiExpense(
        await updateExpense(expense.id, {
          pago: !expense.paid,
        }),
      );

      setRows((current) =>
        current.map((row) =>
          String(row.id) === String(saved.id) ? saved : row,
        ),
      );

      setNotice(
        saved.paid
          ? "Despesa marcada como paga."
          : "Despesa marcada como pendente.",
      );
    } catch (requestError) {
      setNotice(
        getExpenseErrorMessage(
          requestError,
          "Não foi possível atualizar a situação de pagamento.",
        ),
      );
    }
  };

  const confirmDelete = async (expense) => {
    if (!canDeleteExpense()) {
      setDialog(null);
      setNotice("Você não tem permissão para excluir despesas.");
      return;
    }

    setLoading(true);

    try {
      await deleteExpense(expense.id);

      setDialog(null);
      setNotice("Despesa excluída.");

      await load();
    } catch (requestError) {
      setNotice(
        getExpenseErrorMessage(
          requestError,
          "Não foi possível excluir a despesa.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const duplicateExpense = async (expense) => {
    closeMenu();
    setLoading(true);

    try {
      await createExpense({
        data: expense.date,
        descricao: expense.description,
        pago_a: expense.payee,
        categoria: expense.category,
        valor: expense.value,
        tipo_pagamento: expense.paymentTypeValue,
        modo_pagamento: expense.paymentModeValue,
        pago: false,
      });

      setNotice("Despesa duplicada.");
      await load();
    } catch (requestError) {
      setNotice(
        getExpenseErrorMessage(
          requestError,
          "Não foi possível duplicar a despesa.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const outOfScope = () => {
    closeMenu();
    setNotice("Esta ação ainda não está integrada à API de despesas.");
  };

  const generateReceiptAndClose = (expense) => {
    closeMenu();

    const content = [
      `Despesa: ${expense.description}`,
      `Pago a: ${expense.payee}`,
      `Data: ${expense.date}`,
      `Valor: R$ ${Number(expense.value).toFixed(2)}`,
      `Categoria: ${expense.category}`,
    ].join("\n");

    const printWindow = window.open(
      "",
      "_blank",
      "width=600,height=500",
    );

    if (!printWindow) {
      setNotice("Permita a abertura de janelas para gerar o recibo.");
      return;
    }

    printWindow.opener = null;

    const escapedContent = content
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

    printWindow.document.write(
      `<pre style="font:16px Arial;white-space:pre-wrap;padding:24px">${escapedContent}</pre>`,
    );

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
    activeMenuExpense: getRow(menuRowId),
    generateReceiptAndClose,
    openExpenseDialog,
    duplicateExpense,
    togglePaid,
    notice,
    isAdvancedOpen,
    setIsAdvancedOpen,
    advancedFilters,
    updateAdvancedFilters,
    openAdvancedFilters: () => setIsAdvancedOpen(true),
    dialog,
    activeExpense: getRow(dialog?.expenseId),
    setDialog,
    handleEditSubmit,
    handleAttachmentAdd: outOfScope,
    handleAttachmentRemove: outOfScope,
    submitMove: outOfScope,
    submitRecurring: outOfScope,
    submitInstallments: outOfScope,
    confirmDelete,
    changeMonth,
    loading,
    error,
    reload: load,
    sort,
    toggleSort,
  };
}
