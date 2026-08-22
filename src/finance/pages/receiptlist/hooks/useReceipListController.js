import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { receivablesMockData } from "../receivablesMock.js";
import {
  formatCalculatorNumber,
  evaluateCalculatorExpression,
  formatMonth,
  includesNormalized,
  matchesCurrencyFilter,
  matchesMonthYear,
  matchesProgressiveMonthYear,
  parseMonth,
  parseMonthYearFilter,
} from "../../expenselist/utils/expenseList.utils.js";

const emptyInlineFilters = {
  date: "",
  description: "",
  payee: "",
  category: "",
  value: "",
  paymentType: "",
  paymentMode: "",
  paid: "",
};

const normalizeReceipt = (receipt) => ({
  ...receipt,
  payee: receipt.client,
  paymentMode: receipt.paymentMethod,
  attachments: receipt.attachments ?? [],
});

export default function useReceipListController({
  receipts = receivablesMockData,
  initialMonth = "2026-05-01",
  pageSize = 4,
  onMonthChange,
  onEditReceipt,
  onAttachmentsChange,
  onDuplicateReceipt,
  onMoveReceipt,
  onRecurringReceipt,
  onInstallmentReceipt,
  onDeleteReceipt,
  onGenerateReceipt,
}) {
  const [rows, setRows] = useState(() => receipts.map(normalizeReceipt));
  const [month, setMonth] = useState(() => new Date());
  const [page, setPage] = useState(1);
  
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem("financeiro_recebimentos_page_size");
    const parsed = Number(saved);
    if (Number.isSafeInteger(parsed) && parsed > 0) return parsed;
    const initial = Number(pageSize);
    return Number.isSafeInteger(initial) && initial > 0 ? initial : 4;
  });
  
  const [rowsPerPageInput, setRowsPerPageInput] = useState(() => String(rowsPerPage));
  const [sort, setSort] = useState({ key: "date", direction: "asc" });
  const [inlineFilters, setInlineFilters] = useState(emptyInlineFilters);
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
  });
  const [menuRowId, setMenuRowId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
      const placement = placeAbove ? "above" : "below";
      if (
        Math.abs(current.top - top) < 0.5 &&
        current.placement === placement
      ) {
        return current;
      }
      return { ...current, top, placement };
    });
  }, [menuPosition, menuRowId]);

  const filteredRows = useMemo(
    () =>
      rows
        .filter((row) => {
          const rowDate = new Date(`${row.date}T12:00:00`);
          if (
            rowDate.getFullYear() !== month.getFullYear() ||
            rowDate.getMonth() !== month.getMonth()
          )
            return false;
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
          )
            return false;
          if (
            inlineFilters.payee &&
            !includesNormalized(row.payee, inlineFilters.payee)
          )
            return false;
          if (inlineFilters.category && row.category !== inlineFilters.category)
            return false;
          if (
            inlineFilters.value &&
            !matchesCurrencyFilter(row.value, inlineFilters.value)
          )
            return false;
          if (
            inlineFilters.paymentType &&
            row.paymentType !== inlineFilters.paymentType
          )
            return false;
          if (
            inlineFilters.paymentMode &&
            row.paymentMode !== inlineFilters.paymentMode
          )
            return false;
          if (inlineFilters.paid === "paid" && !row.paid) return false;
          if (inlineFilters.paid === "pending" && row.paid) return false;
          if (advancedFilters.dateFrom && row.date < advancedFilters.dateFrom)
            return false;
          if (advancedFilters.dateTo && row.date > advancedFilters.dateTo)
            return false;
          if (
            advancedFilters.minValue &&
            row.value < Number(advancedFilters.minValue)
          )
            return false;
          if (
            advancedFilters.maxValue &&
            row.value > Number(advancedFilters.maxValue)
          )
            return false;
          if (advancedFilters.onlyWithAttachments && !row.attachments.length)
            return false;
          return true;
        })
        .sort((left, right) => {
          const comparison =
            typeof left[sort.key] === "number"
              ? left[sort.key] - right[sort.key]
              : String(left[sort.key] ?? "").localeCompare(
                  String(right[sort.key] ?? ""),
                  "pt-BR",
                  { numeric: true, sensitivity: "base" },
                );
          return sort.direction === "asc" ? comparison : -comparison;
        }),
    [advancedFilters, inlineFilters, month, rows, sort],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );
  const hasFilters =
    Object.values(inlineFilters).some(Boolean) ||
    Object.values(advancedFilters).some(Boolean);

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

  const clearFilters = () => {
    setInlineFilters(emptyInlineFilters);
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
  const changeMonth = (direction) => {
    const next = new Date(month.getFullYear(), month.getMonth() + direction, 1);
    setMonth(next);
    setPage(1);
    onMonthChange?.(next);
  };
  const toggleSort = (key) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };
  const replaceRow = (nextRow) =>
    setRows((current) =>
      current.map((row) => (row.id === nextRow.id ? nextRow : row)),
    );
  const closeMenu = () => {
    setMenuRowId(null);
    setMenuPosition(null);
  };
  const toggleRowMenu = (event, id) => {
    if (menuRowId === id) return closeMenu();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuRowId(id);
    setMenuPosition({
      left: Math.max(12, rect.right - 276),
      top: rect.bottom + 8,
      placement: "below",
      triggerTop: rect.top,
      triggerBottom: rect.bottom,
    });
  };
  const activeExpense = rows.find((row) => row.id === menuRowId);
  const activeDialogExpense = dialog
    ? rows.find((row) => row.id === dialog.expenseId)
    : null;
  const togglePaid = (row) => replaceRow({ ...row, paid: !row.paid });
  const openExpenseDialog = (type, row) => {
    closeMenu();
    setDialog({ type, expenseId: row.id });
  };
  const updateCalculatorExpression = (expression) =>
    setCalculator((current) => ({ ...current, expression }));
  const handleCalculatorKey = (key) =>
    setCalculator((current) => ({
      ...current,
      expression: key === "C" ? "" : `${current.expression}${key}`,
    }));
  const openCalculator = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCalculator({
      open: true,
      expression: inlineFilters.value,
      error: "",
      left: rect.left,
      top: rect.bottom + 8,
      placement: "below",
    });
  };
  const closeCalculator = () =>
    setCalculator((current) => ({ ...current, open: false }));
  const useCalculatorValue = () => {
    try {
      const value = formatCalculatorNumber(
        evaluateCalculatorExpression(calculator.expression),
      );
      updateInlineFilter("value", value);
      closeCalculator();
    } catch {
      setCalculator((current) => ({ ...current, error: "Expressão inválida" }));
    }
  };
  const setPageSize = () => {
    const value = Number(rowsPerPageInput);
    if (Number.isSafeInteger(value) && value > 0) {
      setRowsPerPage(value);
      setRowsPerPageInput(String(value));
      setPage(1);
      localStorage.setItem("financeiro_recebimentos_page_size", String(value));
    } else setRowsPerPageInput(String(rowsPerPage));
  };

  const editSubmit = (event, row) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updated = normalizeReceipt({
      ...row,
      date: data.get("date"),
      description: data.get("description"),
      client: data.get("payee"),
      category: data.get("category"),
      value: Number(data.get("value")),
      paymentType: data.get("paymentType"),
      paymentMethod: data.get("paymentMode"),
      paid: data.get("paid") === "on",
    });
    replaceRow(updated);
    onEditReceipt?.(updated);
    setDialog(null);
    setNotice("Recebimento atualizado.");
  };
  const duplicate = (row) => {
    const copy = {
      ...row,
      id: `receipt-${Date.now()}`,
      description: `${row.description} (cópia)`,
      paid: false,
      attachments: [],
    };
    setRows((current) => [copy, ...current]);
    onDuplicateReceipt?.(copy, row);
    closeMenu();
  };
  const remove = (row) => {
    setRows((current) => current.filter((item) => item.id !== row.id));
    onDeleteReceipt?.(row);
    setDialog(null);
    setNotice("Recebimento excluído.");
  };

  return {
    rows,
    month,
    visibleRows,
    filteredRows,
    totalPages,
    page: safePage,
    setPage,
    rowsPerPageInput,
    setRowsPerPageInput,
    setPageSize,
    sort,
    toggleSort,
    inlineFilters,
    updateInlineFilter,
    clearFilters,
    hasFilters,
    advancedFilters,
    setAdvancedFilters,
    isAdvancedOpen,
    setIsAdvancedOpen,
    openAdvancedFilters: () => setIsAdvancedOpen(true),
    changeMonth,
    calculator,
    openCalculator,
    closeCalculator,
    updateCalculatorExpression,
    handleCalculatorKey,
    useCalculatorValue,
    menuRowId,
    menuPosition,
    activeMenuExpense: activeExpense,
    toggleRowMenu,
    onTogglePaid: togglePaid,
    dialog,
    activeExpense: activeDialogExpense,
    openExpenseDialog,
    setDialog,
    notice,
    handleEditSubmit: editSubmit,
    handleAttachmentAdd: (row, files) => {
      const updated = {
        ...row,
        attachments: [
          ...row.attachments,
          ...[...files].map((file) => ({
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
            file,
          })),
        ],
      };
      replaceRow(updated);
      onAttachmentsChange?.(updated, updated.attachments);
    },
    handleAttachmentRemove: (row, attachment) => {
      const updated = {
        ...row,
        attachments: row.attachments.filter((item) => item !== attachment),
      };
      replaceRow(updated);
      onAttachmentsChange?.(updated, updated.attachments);
    },
    duplicateExpense: duplicate,
    confirmDelete: remove,
    generateReceiptAndClose: (row) => {
      onGenerateReceipt?.(row);
      closeMenu();
      setNotice("Solicitação de recibo enviada.");
    },
    submitMove: (event, row) => {
      event.preventDefault();
      onMoveReceipt?.(row);
      setDialog(null);
    },
    submitRecurring: (event, row) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const frequency = formData.get("frequency");
      const startDate = new Date(`${formData.get("startDate")}T12:00:00`);
      
      let copiesCount = 0;
      let monthIncrement = 0;
      let daysIncrement = 0;

      if (frequency === "weekly") {
        copiesCount = 12;
        daysIncrement = 7;
      } else if (frequency === "monthly") {
        copiesCount = 6;
        monthIncrement = 1;
      } else if (frequency === "quarterly") {
        copiesCount = 3;
        monthIncrement = 3;
      } else if (frequency === "yearly") {
        copiesCount = 3;
        monthIncrement = 12;
      }

      const copies = Array.from({ length: copiesCount }, (_, index) => {
        const copyDate = new Date(startDate);
        if (daysIncrement) {
          copyDate.setDate(copyDate.getDate() + (daysIncrement * (index + 1)));
        } else if (monthIncrement) {
          copyDate.setMonth(copyDate.getMonth() + (monthIncrement * (index + 1)));
        }
        
        return {
          ...row,
          id: `receipt-${Date.now()}-${index}`,
          date: copyDate.toISOString().slice(0, 10),
          paid: false,
          attachments: [],
        };
      });

      setRows((current) => [...current, ...copies]);
      onRecurringReceipt?.(row, copies);
      setDialog(null);
      setNotice(`Recorrência criada com ${copiesCount} ocorrências.`);
    },
    submitInstallments: (event, row) => {
      event.preventDefault();
      onInstallmentReceipt?.(row);
      setDialog(null);
    },
    formatMonth,
  };
}
