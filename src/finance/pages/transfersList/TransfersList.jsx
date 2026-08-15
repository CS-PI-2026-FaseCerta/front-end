import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { createPortal } from "react-dom";

import {
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
    FaPaperclip,
    FaPen,
    FaPlus,
    FaRegCircle,
    FaTimes,
    FaTrash,
} from "react-icons/fa";

import "./TransfersList.css";

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

const DEMO_TRANSFERS = [
    {
        id: "transfer-001",
        date: "2026-05-02",
        description: "Transferência para folha de pagamento",
        originAccount: "Conta Corrente Banco do Brasil",
        destinationAccount: "Conta Salários",
        value: 5000,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-002",
        date: "2026-05-05",
        description: "Transferência entre bancos",
        originAccount: "Conta Operacional",
        destinationAccount: "Caixa Operacional",
        value: 10000,
        paid: false,
        attachments: [],
    },
    {
        id: "transfer-003",
        date: "2026-05-14",
        description: "Depósito para compra de materiais",
        originAccount: "Investimentos CDB",
        destinationAccount: "Conta Compras",
        value: 15000,
        paid: false,
        attachments: [],
    },
    {
        id: "transfer-004",
        date: "2026-05-27",
        description: "Transferência para filial de Curitiba",
        originAccount: "Conta Principal",
        destinationAccount: "Conta Compras",
        value: 8000,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-005",
        date: "2026-05-29",
        description: "Reserva para pagamento de fornecedores",
        originAccount: "Conta Principal",
        destinationAccount: "Conta Operacional",
        value: 12500,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-006",
        date: "2026-05-30",
        description: "Reforço de caixa",
        originAccount: "Conta Corrente Banco do Brasil",
        destinationAccount: "Caixa Operacional",
        value: 3500,
        paid: false,
        attachments: [],
    },
    {
        id: "transfer-007",
        date: "2026-05-31",
        description: "Reserva financeira mensal",
        originAccount: "Conta Operacional",
        destinationAccount: "Investimentos CDB",
        value: 7500,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-008",
        date: "2026-05-31",
        description: "Transferência para conta salários",
        originAccount: "Conta Principal",
        destinationAccount: "Conta Salários",
        value: 9200,
        paid: false,
        attachments: [],
    },
    {
        id: "transfer-009",
        date: "2026-05-10",
        description: "Capitalização da conta operacional",
        originAccount: "Conta Principal",
        destinationAccount: "Conta Operacional",
        value: 6200,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-010",
        date: "2026-05-12",
        description: "Transferência para investimentos",
        originAccount: "Conta Corrente Banco do Brasil",
        destinationAccount: "Investimentos CDB",
        value: 18000,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-011",
        date: "2026-05-18",
        description: "Transferência para filial",
        originAccount: "Conta Principal",
        destinationAccount: "Conta Filial Curitiba",
        value: 4500,
        paid: false,
        attachments: [],
    },
    {
        id: "transfer-012",
        date: "2026-05-23",
        description: "Recomposição de caixa",
        originAccount: "Investimentos CDB",
        destinationAccount: "Caixa Operacional",
        value: 3000,
        paid: true,
        attachments: [],
    },
];

const ACCOUNTS = [
    "Conta Principal",
    "Conta Corrente Banco do Brasil",
    "Conta Operacional",
    "Conta Salários",
    "Conta Compras",
    "Caixa Operacional",
    "Investimentos CDB",
    "Conta Filial Curitiba",
];

const createId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `transfer-${Date.now()}-${Math.random().toString(16).slice(2)}`;


const parseMonth = (value) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value.getFullYear(), value.getMonth(), 1);
    }

    if (typeof value === "string") {
        const parsed = new Date(`${value.slice(0, 7)}-01T12:00:00`);

        if (!Number.isNaN(parsed.getTime())) {
            return new Date(
                parsed.getFullYear(),
                parsed.getMonth(),
                1
            );
        }
    }

    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );
};

const formatMonth = (date) =>
    `${MONTHS[date.getMonth()]}/${date.getFullYear()}`;


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


const getVisiblePages = (currentPage, totalPages) => {
    if (totalPages <= 5) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    const pages = new Set([
        1,
        totalPages,
        currentPage - 1,
        currentPage,
        currentPage + 1,
    ]);

    return [...pages]
        .filter(
            (page) =>
                page > 0 &&
                page <= totalPages
        )
        .sort((a, b) => a - b);
};

const Dialog = ({
    title,
    children,
    onClose,
    className = "",
}) => (
    <div
        className="transfer-list__overlay"
        role="presentation"
        onMouseDown={onClose}
    >
        <section
            className={`transfer-list__dialog ${className}`.trim()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(event) =>
                event.stopPropagation()
            }
        >
            <header className="transfer-list__dialog-header">
                <h2>{title}</h2>

                <button
                    type="button"
                    className="transfer-list__icon-button"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    <FaTimes />
                </button>
            </header>

            {children}
        </section>
    </div>
);

const Field = ({
    label,
    children,
    className = "",
}) => (
    <label
        className={`transfer-list__form-field ${className}`.trim()}
    >
        <span>{label}</span>
        {children}
    </label>
);

const FilterSelect = ({
    value,
    onChange,
    children,
    ariaLabel,
}) => (
    <div className="transfer-list__select-wrap">
        <select
            value={value}
            onChange={onChange}
            aria-label={ariaLabel}
        >
            {children}
        </select>

        <FaChevronDown
            className="transfer-list__select-chevron"
            aria-hidden="true"
        />
    </div>
);

const TransferList = ({
    transfers = DEMO_TRANSFERS,
    initialMonth = "2026-05-01",
    pageSize = 4,

    onMonthChange,
    onTabChange,
    onOpenAdvancedFilters,

    onGenerateReceipt,
    onEditTransfer,
    onViewTransferDetails,
    onAttachmentsChange,
    onDuplicateTransfer,
    onMoveTransfer,
    onRecurringTransfer,
    onInstallmentTransfer,
    onDeleteTransfer,
    onRegisterTransfer,
}) => {
    const [rows, setRows] = useState(() =>
        transfers.map((item) => ({
            ...item,
        }))
    );

    const [month, setMonth] = useState(() =>
        parseMonth(initialMonth)
    );

    const [page, setPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(() => {
        const parsed = Number(pageSize);

        return Number.isFinite(parsed) && parsed > 0
            ? Math.floor(parsed)
            : 4;
    });

    const [rowsPerPageInput, setRowsPerPageInput] =
        useState(() =>
            String(
                Number.isFinite(Number(pageSize)) &&
                    Number(pageSize) > 0
                    ? Math.floor(Number(pageSize))
                    : 4
            )
        );

    const [sort, setSort] = useState({
        key: "date",
        direction: "asc",
    });

    const [menuRowId, setMenuRowId] = useState(null);

    const [menuPosition, setMenuPosition] =
        useState(null);

    const [dialog, setDialog] = useState(null);

    const [isAdvancedOpen, setIsAdvancedOpen] =
        useState(false);

    const [notice, setNotice] = useState("");

    const initialFilters = {
        date: "",
        description: "",
        originAccount: "",
        destinationAccount: "",
        value: "",
        paid: "",
    };

    const [inlineFilters, setInlineFilters] =
        useState(initialFilters);

    const [draftInlineFilters, setDraftInlineFilters] =
        useState(initialFilters);

    const [advancedFilters, setAdvancedFilters] =
        useState({
            dateFrom: "",
            dateTo: "",
            minValue: "",
            maxValue: "",
            originAccount: "",
            destinationAccount: "",
            paid: "",
        });

    useEffect(() => {
        setRows(
            transfers.map((item) => ({
                ...item,
            }))
        );
    }, [transfers]);

    useEffect(() => {
        const parsed = Number(pageSize);

        if (!Number.isFinite(parsed) || parsed <= 0) {
            return;
        }

        const normalized = Math.floor(parsed);

        setRowsPerPage(normalized);
        setRowsPerPageInput(String(normalized));
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        if (!notice) return undefined;

        const timeout = window.setTimeout(
            () => setNotice(""),
            3200
        );

        return () =>
            window.clearTimeout(timeout);
    }, [notice]);

    useEffect(() => {
        const closeMenu = (event) => {
            if (
                !event.target.closest(
                    "[data-transfer-row-menu]"
                )
            ) {
                setMenuRowId(null);
                setMenuPosition(null);
            }
        };

        document.addEventListener(
            "pointerdown",
            closeMenu
        );

        return () =>
            document.removeEventListener(
                "pointerdown",
                closeMenu
            );
    }, []);

    useEffect(() => {
        if (!menuRowId) return undefined;

        const closeFloatingMenu = (event) => {
            if (
                event?.target instanceof Element &&
                event.target.closest(
                    "[data-transfer-row-menu]"
                )
            ) {
                return;
            }

            setMenuRowId(null);
            setMenuPosition(null);
        };

        window.addEventListener(
            "resize",
            closeFloatingMenu
        );

        window.addEventListener(
            "scroll",
            closeFloatingMenu,
            true
        );

        return () => {
            window.removeEventListener(
                "resize",
                closeFloatingMenu
            );

            window.removeEventListener(
                "scroll",
                closeFloatingMenu,
                true
            );
        };
    }, [menuRowId]);

    useLayoutEffect(() => {
        if (
            !menuRowId ||
            !menuPosition ||
            typeof document === "undefined"
        ) {
            return;
        }

        const menuElement =
            document.querySelector(
                ".transfer-list__action-menu--portal[data-transfer-row-menu]"
            );

        if (!menuElement) return;

        const viewportPadding = 12;
        const gap = 8;

        const menuRect =
            menuElement.getBoundingClientRect();

        const menuHeight = Math.min(
            menuRect.height,
            window.innerHeight -
            viewportPadding * 2
        );

        const availableBelow =
            window.innerHeight -
            menuPosition.triggerBottom -
            gap -
            viewportPadding;

        const availableAbove =
            menuPosition.triggerTop -
            gap -
            viewportPadding;

        const placeAbove =
            availableAbove >= menuHeight ||
            (
                availableAbove > availableBelow &&
                availableBelow < menuHeight
            );

        const idealTop = placeAbove
            ? menuPosition.triggerTop -
            gap -
            menuHeight
            : menuPosition.triggerBottom +
            gap;

        const top = Math.max(
            viewportPadding,
            Math.min(
                idealTop,
                window.innerHeight -
                viewportPadding -
                menuHeight
            )
        );

        setMenuPosition((current) => {
            if (!current) return current;

            const placement = placeAbove
                ? "above"
                : "below";

            if (
                Math.abs(current.top - top) < 0.5 &&
                current.placement === placement
            ) {
                return current;
            }

            return {
                ...current,
                top,
                placement,
            };
        });
    }, [
        menuRowId,
        menuPosition?.triggerBottom,
        menuPosition?.triggerTop,
    ]);

    const updateInlineFilter = (
        key,
        value
    ) => {
        setDraftInlineFilters(
            (current) => ({
                ...current,
                [key]: value,
            })
        );
    };

    const applyInlineFilters = () => {
        setInlineFilters({
            ...draftInlineFilters,
        });

        setPage(1);
    };

    const clearFilters = () => {
        setInlineFilters(initialFilters);
        setDraftInlineFilters(initialFilters);

        setAdvancedFilters({
            dateFrom: "",
            dateTo: "",
            minValue: "",
            maxValue: "",
            originAccount: "",
            destinationAccount: "",
            paid: "",
        });

        setPage(1);
    };

    const hasFilters = useMemo(
        () =>
            Object.values(inlineFilters).some(
                Boolean
            ) ||
            Object.values(advancedFilters).some(
                Boolean
            ),
        [
            inlineFilters,
            advancedFilters,
        ]
    );

    const hasDraftInlineFilters = useMemo(
        () =>
            Object.values(
                draftInlineFilters
            ).some(Boolean),
        [draftInlineFilters]
    );

    const hasPendingInlineChanges = useMemo(
        () =>
            JSON.stringify(
                draftInlineFilters
            ) !==
            JSON.stringify(
                inlineFilters
            ),
        [
            draftInlineFilters,
            inlineFilters,
        ]
    );

    const filteredRows = useMemo(() => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();

        return rows
            .filter((row) => {
                const rowDate = new Date(
                    `${row.date}T12:00:00`
                );

                if (
                    rowDate.getFullYear() !== year ||
                    rowDate.getMonth() !== monthIndex
                ) {
                    return false;
                }

                if (
                    inlineFilters.date &&
                    row.date !== inlineFilters.date
                ) {
                    return false;
                }

                if (
                    inlineFilters.description &&
                    !includesNormalized(
                        row.description,
                        inlineFilters.description
                    )
                ) {
                    return false;
                }

                if (
                    inlineFilters.originAccount &&
                    row.originAccount !==
                    inlineFilters.originAccount
                ) {
                    return false;
                }

                if (
                    inlineFilters.destinationAccount &&
                    row.destinationAccount !==
                    inlineFilters.destinationAccount
                ) {
                    return false;
                }

                if (inlineFilters.value) {
                    const query =
                        String(
                            inlineFilters.value
                        )
                            .trim()
                            .replace(",", ".");

                    const numericValue =
                        Number(row.value);

                    if (
                        !String(numericValue).includes(
                            query
                        )
                    ) {
                        return false;
                    }
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

                if (
                    advancedFilters.dateFrom &&
                    row.date <
                    advancedFilters.dateFrom
                ) {
                    return false;
                }

                if (
                    advancedFilters.dateTo &&
                    row.date >
                    advancedFilters.dateTo
                ) {
                    return false;
                }

                if (
                    advancedFilters.minValue &&
                    Number(row.value) <
                    Number(
                        advancedFilters.minValue
                    )
                ) {
                    return false;
                }

                if (
                    advancedFilters.maxValue &&
                    Number(row.value) >
                    Number(
                        advancedFilters.maxValue
                    )
                ) {
                    return false;
                }

                if (
                    advancedFilters.originAccount &&
                    row.originAccount !==
                    advancedFilters.originAccount
                ) {
                    return false;
                }

                if (
                    advancedFilters.destinationAccount &&
                    row.destinationAccount !==
                    advancedFilters.destinationAccount
                ) {
                    return false;
                }

                if (
                    advancedFilters.paid === "paid" &&
                    !row.paid
                ) {
                    return false;
                }

                if (
                    advancedFilters.paid === "pending" &&
                    row.paid
                ) {
                    return false;
                }

                return true;
            })
            .sort((left, right) => {
                const leftValue =
                    left[sort.key];

                const rightValue =
                    right[sort.key];

                if (
                    leftValue == null &&
                    rightValue == null
                ) {
                    return 0;
                }

                if (leftValue == null) {
                    return 1;
                }

                if (rightValue == null) {
                    return -1;
                }
                let comparison;
                if (
                    typeof leftValue === "number"
                ) {
                    comparison =
                        leftValue - rightValue;
                } else {
                    comparison =
                        String(leftValue).localeCompare(
                            String(rightValue),
                            "pt-BR",
                            {
                                numeric: true,
                                sensitivity: "base",
                            }
                        );
                }
                return sort.direction === "asc"
                    ? comparison
                    : -comparison;
            });
    }, [
        rows,
        month,
        inlineFilters,
        advancedFilters,
        sort,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredRows.length /
            rowsPerPage
        )
    );

    const safePage = Math.min(
        page,
        totalPages
    );

    const visibleRows =
        filteredRows.slice(
            (safePage - 1) *
            rowsPerPage,
            safePage *
            rowsPerPage
        );

    const visiblePages =
        getVisiblePages(
            safePage,
            totalPages
        );

    useEffect(() => {
        if (page !== safePage) {
            setPage(safePage);
        }
    }, [page, safePage]);

    const commitRowsPerPage = () => {
        const value =
            rowsPerPageInput.trim();

        if (!/^\d+$/.test(value)) {
            setRowsPerPageInput(
                String(rowsPerPage)
            );
            return;
        }

        const parsed = Number(value);

        if (
            !Number.isSafeInteger(parsed) ||
            parsed < 1
        ) {
            setRowsPerPageInput(
                String(rowsPerPage)
            );
            return;
        }
        setRowsPerPage(parsed);
        setRowsPerPageInput(
            String(parsed)
        );
        setPage(1);
    };

    const changeMonth = (direction) => {
        const nextMonth = new Date(
            month.getFullYear(),
            month.getMonth() +
            direction,
            1
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
                current.key === key &&
                    current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));

        setPage(1);
    };

    const closeRowMenu = () => {
        setMenuRowId(null);
        setMenuPosition(null);
    };

    const toggleRowMenu = (
        event,
        transferId
    ) => {
        if (
            menuRowId === transferId
        ) {
            closeRowMenu();
            return;
        }

        const rect =
            event.currentTarget.getBoundingClientRect();

        const menuWidth = 276;
        const viewportPadding = 12;
        const gap = 8;

        const left = Math.max(
            viewportPadding,
            Math.min(
                rect.right -
                menuWidth,
                window.innerWidth -
                menuWidth -
                viewportPadding
            )
        );

        const estimatedHeight = 430;

        const availableBelow =
            window.innerHeight -
            rect.bottom;

        const availableAbove =
            rect.top;

        const placeAbove =
            availableBelow <
            estimatedHeight &&
            availableAbove >
            availableBelow;

        const initialTop = placeAbove
            ? rect.top -
            gap -
            estimatedHeight
            : rect.bottom + gap;

        setMenuRowId(transferId);

        setMenuPosition({
            left,
            top: Math.max(
                viewportPadding,
                Math.min(
                    initialTop,
                    window.innerHeight -
                    viewportPadding -
                    estimatedHeight
                )
            ),
            placement: placeAbove
                ? "above"
                : "below",
            triggerTop: rect.top,
            triggerBottom: rect.bottom,
        });
    };

    const getTransfer = (id) =>
        rows.find(
            (item) => item.id === id
        );


    const activeTransfer =
        dialog?.transferId
            ? getTransfer(
                dialog.transferId
            )
            : null;

    const activeMenuTransfer =
        menuRowId
            ? getTransfer(menuRowId)
            : null;


    const replaceTransfer = (
        nextTransfer
    ) => {
        setRows((current) =>
            current.map((item) =>
                item.id ===
                    nextTransfer.id
                    ? nextTransfer
                    : item
            )
        );
    };

    const generateReceipt = (
        transfer
    ) => {
        onGenerateReceipt?.(transfer);

        if (onGenerateReceipt) {
            setNotice(
                "Solicitação de recibo enviada."
            );
            return;
        }

        const receiptWindow =
            window.open(
                "",
                "_blank",
                "width=760,height=820"
            );

        if (!receiptWindow) {
            setNotice(
                "O navegador bloqueou a abertura do recibo."
            );
            return;
        }
        receiptWindow.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Recibo de transferência</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 48px;
              color: #202235;
            }
            .card {
              border: 1px solid #dadce8;
              border-radius: 18px;
              padding: 28px;
            }
            h1 {
              margin-top: 0;
              font-size: 24px;
            }
            dl {
              display: grid;
              grid-template-columns: 180px 1fr;
              gap: 12px 24px;
            }
            dt {
              color: #666b7d;
              font-weight: 700;
            }
            dd {
              margin: 0;
            }
            .amount {
              font-size: 28px;
              font-weight: 800;
              margin: 24px 0;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Comprovante de transferência</h1>
            <p class="amount">
              ${formatCurrency(
            transfer.value
        )}
            </p>
            <dl>
              <dt>Data</dt>
              <dd>${formatDate(
            transfer.date
        )}</dd>
              <dt>Descrição</dt>
              <dd>${transfer.description}</dd>
              <dt>Conta de origem</dt>
              <dd>${transfer.originAccount}</dd>
              <dt>Conta de destino</dt>
              <dd>${transfer.destinationAccount}</dd>
              <dt>Status</dt>
              <dd>
                ${transfer.paid
                ? "Efetivada"
                : "Pendente"
            }
              </dd>
            </dl>
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
        receiptWindow.document.close();
    };


    const handleEditSubmit = (
        event,
        transfer
    ) => {
        event.preventDefault();
        const formData =
            new FormData(
                event.currentTarget
            );

        const updated = {
            ...transfer,
            date: formData.get("date"),
            description:
                formData.get("description"),
            originAccount:
                formData.get(
                    "originAccount"
                ),
            destinationAccount:
                formData.get(
                    "destinationAccount"
                ),
            value: Number(
                formData.get("value")
            ),
            paid:
                formData.get("paid") ===
                "on",
        };
        replaceTransfer(updated);
        onEditTransfer?.(updated);
        setDialog(null);
        setNotice(
            "Transferência atualizada."
        );
    };


    const handleAttachmentAdd = (
        transfer,
        files
    ) => {
        if (!files?.length) return;

        const newAttachments = [
            ...(transfer.attachments ?? []),
            ...[...files].map(
                (file) => ({
                    id: createId(),
                    name: file.name,
                    size: file.size,
                    file,
                })
            ),
        ];

        const updated = {
            ...transfer,
            attachments:
                newAttachments,
        };
        replaceTransfer(updated);
        onAttachmentsChange?.(
            updated,
            newAttachments
        );
        setDialog({
            type: "attachments",
            transferId: updated.id,
        });
    };


    const duplicateTransfer = (
        transfer
    ) => {
        const copy = {
            ...transfer,
            id: createId(),
            description: `${transfer.description} (cópia)`,
            paid: false,
            attachments: [],
        };
        setRows((current) => [
            copy,
            ...current,
        ]);
        onDuplicateTransfer?.(
            copy,
            transfer
        );
        closeRowMenu();
        setNotice(
            "Transferência duplicada."
        );
    };


    const submitMove = (
        event,
        transfer
    ) => {
        event.preventDefault();

        const formData =
            new FormData(
                event.currentTarget
            );

        const destination =
            formData.get("destination");

        if (
            destination ===
            "transfers"
        ) {
            setNotice(
                "Transferência mantida na movimentação interna."
            );
        } else {
            setRows((current) =>
                current.filter(
                    (item) =>
                        item.id !==
                        transfer.id
                )
            );

            onMoveTransfer?.({
                transfer,
                destination,
            });

            setNotice(
                destination ===
                    "receipts"
                    ? "Transferência movida para Recebimentos."
                    : "Transferência movida para Despesas."
            );
        }

        setDialog(null);
    };


    const submitRecurring = (
        event,
        transfer
    ) => {
        event.preventDefault();

        const formData =
            new FormData(
                event.currentTarget
            );

        const updated = {
            ...transfer,
            recurring: {
                frequency:
                    formData.get(
                        "frequency"
                    ),
                startDate:
                    formData.get(
                        "startDate"
                    ),
            },
        };
        replaceTransfer(updated);
        onRecurringTransfer?.(
            updated
        );
        setDialog(null);
        setNotice(
            "Transferência configurada como recorrente."
        );
    };


    const submitInstallments = (
        event,
        transfer
    ) => {
        event.preventDefault();

        const formData =
            new FormData(
                event.currentTarget
            );

        const count = Math.max(
            2,
            Number(
                formData.get(
                    "installments"
                )
            ) || 2
        );

        const firstDate =
            new Date(
                `${formData.get(
                    "firstDate"
                )}T12:00:00`
            );

        const totalCents =
            Math.round(
                Number(
                    transfer.value
                ) * 100
            );

        const baseCents =
            Math.floor(
                totalCents / count
            );

        const remainder =
            totalCents % count;

        const installments =
            Array.from(
                { length: count },
                (_, index) => {
                    const dueDate =
                        new Date(
                            firstDate.getFullYear(),
                            firstDate.getMonth() +
                            index,
                            firstDate.getDate()
                        );

                    const cents =
                        baseCents +
                        (index < remainder
                            ? 1
                            : 0);

                    return {
                        ...transfer,

                        id:
                            index === 0
                                ? transfer.id
                                : createId(),

                        date:
                            dueDate
                                .toISOString()
                                .slice(0, 10),

                        description:
                            `${transfer.description} (${index + 1}/${count})`,

                        value:
                            cents / 100,

                        paid:
                            index === 0
                                ? transfer.paid
                                : false,

                        installment: {
                            current:
                                index + 1,
                            total: count,
                        },
                    };
                }
            );

        setRows((current) => [
            ...current.filter(
                (item) =>
                    item.id !==
                    transfer.id
            ),
            ...installments,
        ]);
        onInstallmentTransfer?.(
            installments,
            transfer
        );

        setDialog(null);
        setNotice(
            `Transferência dividida em ${count} parcelas.`
        );
    };

    const confirmDelete = (
        transfer
    ) => {
        setRows((current) =>
            current.filter(
                (item) =>
                    item.id !==
                    transfer.id
            )
        );
        onDeleteTransfer?.({
            ...transfer,
            deletedAt:
                new Date().toISOString(),
        });
        setDialog(null);
        setNotice(
            "Transferência excluída."
        );
    };

    return (
        <main className="transfer-list-page">
            <section
                className="transfer-list"
                aria-label="Financeiro - Transferências"
            >
                <header className="transfer-list__title-bar">
                    <div>
                        <span className="transfer-list__eyebrow">
                            Financeiro
                        </span>

                        <h1>FINANCEIRO</h1>
                    </div>
                </header>

                <div className="transfer-list__content">
                    <div className="transfer-list__toolbar">
                        <div
                            className="transfer-list__month-control"
                            aria-label="Navegação por mês"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(-1)
                                }
                                aria-label="Mês anterior"
                            >
                                <FaChevronLeft />
                            </button>
                            <strong>
                                {formatMonth(month)}
                            </strong>
                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(1)
                                }
                                aria-label="Próximo mês"
                            >
                                <FaChevronRight />
                            </button>
                        </div>

                        <div className="transfer-list__toolbar-right">
                            <nav
                                className="transfer-list__tabs"
                                aria-label="Tipo de movimentação"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        onTabChange?.(
                                            "receipts"
                                        )
                                    }
                                >
                                    Recebimentos
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onTabChange?.(
                                            "expenses"
                                        )
                                    }
                                >
                                    Despesas
                                </button>
                                <button
                                    type="button"
                                    className="is-active"
                                    aria-current="page"
                                >
                                    Transferências
                                </button>
                            </nav>

                            <button
                                type="button"
                                className={`transfer-list__filters-button ${hasFilters
                                        ? "has-filters"
                                        : ""
                                    }`}
                                onClick={() => {
                                    if (
                                        onOpenAdvancedFilters
                                    ) {
                                        onOpenAdvancedFilters({
                                            values:
                                                advancedFilters,
                                            onChange:
                                                setAdvancedFilters,
                                            clear:
                                                clearFilters,
                                        });

                                        return;
                                    }
                                    setIsAdvancedOpen(
                                        true
                                    );
                                }}
                            >
                                <FaFilter />
                                <span>
                                    Filtros
                                </span>
                                {hasFilters ? (
                                    <i aria-hidden="true" />
                                ) : null}
                            </button>
                        </div>
                    </div>

                    <div className="transfer-list__table-shell">
                        <div className="transfer-list__table-scroll">
                            <table className="transfer-list__table">
                                <thead>
                                    <tr className="transfer-list__header-row">
                                        {[
                                            ["date", "Data"],
                                            [
                                                "description",
                                                "Descrição",
                                            ],
                                            [
                                                "originAccount",
                                                "Conta de origem",
                                            ],
                                            [
                                                "destinationAccount",
                                                "Conta de destino",
                                            ],
                                            ["value", "Valor"],
                                            ["paid", "Pago?"],
                                        ].map(
                                            ([
                                                key,
                                                label,
                                            ]) => (
                                                <th
                                                    key={key}
                                                    scope="col"
                                                    aria-sort={
                                                        sort.key ===
                                                            key
                                                            ? sort.direction ===
                                                                "asc"
                                                                ? "ascending"
                                                                : "descending"
                                                            : "none"
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className="transfer-list__sort-button"
                                                        onClick={() =>
                                                            toggleSort(
                                                                key
                                                            )
                                                        }
                                                    >
                                                        {label}

                                                        <span
                                                            className={
                                                                sort.key ===
                                                                    key
                                                                    ? "is-sorted"
                                                                    : ""
                                                            }
                                                        >
                                                            ↕
                                                        </span>
                                                    </button>
                                                </th>
                                            )
                                        )}
                                        <th
                                            scope="col"
                                            aria-label="Ações"
                                        />

                                    </tr>

                                    <tr
                                        className="transfer-list__filter-row"
                                        onKeyDown={(
                                            event
                                        ) => {
                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {
                                                applyInlineFilters();
                                            }
                                        }}
                                    >
                                        <th>
                                            <input
                                                type="date"
                                                value={
                                                    draftInlineFilters.date
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateInlineFilter(
                                                        "date",
                                                        event.target.value
                                                    )
                                                }
                                                aria-label="Filtrar por data"
                                            />
                                        </th>

                                        <th>
                                            <input
                                                type="search"
                                                value={
                                                    draftInlineFilters.description
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateInlineFilter(
                                                        "description",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Pesquisar"
                                                aria-label="Filtrar por descrição"
                                            />
                                        </th>

                                        <th>
                                            <FilterSelect
                                                value={
                                                    draftInlineFilters.originAccount
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateInlineFilter(
                                                        "originAccount",
                                                        event.target.value
                                                    )
                                                }
                                                ariaLabel="Filtrar por conta de origem"
                                            >
                                                <option value="">
                                                    Todas
                                                </option>

                                                {ACCOUNTS.map(
                                                    (account) => (
                                                        <option
                                                            key={account}
                                                            value={account}
                                                        >
                                                            {account}
                                                        </option>
                                                    )
                                                )}
                                            </FilterSelect>
                                        </th>

                                        <th>
                                            <FilterSelect
                                                value={
                                                    draftInlineFilters.destinationAccount
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateInlineFilter(
                                                        "destinationAccount",
                                                        event.target.value
                                                    )
                                                }
                                                ariaLabel="Filtrar por conta de destino"
                                            >
                                                <option value="">
                                                    Todas
                                                </option>

                                                {ACCOUNTS.map(
                                                    (account) => (
                                                        <option
                                                            key={account}
                                                            value={account}
                                                        >
                                                            {account}
                                                        </option>
                                                    )
                                                )}
                                            </FilterSelect>
                                        </th>

                                        <th>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={
                                                    draftInlineFilters.value
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateInlineFilter(
                                                        "value",
                                                        event.target.value
                                                    )
                                                }
                                                onKeyDown={(
                                                    event
                                                ) => {
                                                    if (
                                                        event.key ===
                                                        "Enter"
                                                    ) {
                                                        applyInlineFilters();
                                                    }
                                                }}
                                                placeholder="0,00"
                                                aria-label="Filtrar por valor"
                                            />
                                        </th>

                                        <th>
                                            <FilterSelect
                                                value={
                                                    draftInlineFilters.paid
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateInlineFilter(
                                                        "paid",
                                                        event.target.value
                                                    )
                                                }
                                                ariaLabel="Filtrar por status"
                                            >
                                                <option value="">
                                                    Todos
                                                </option>

                                                <option value="paid">
                                                    Efetivadas
                                                </option>

                                                <option value="pending">
                                                    Pendentes
                                                </option>
                                            </FilterSelect>
                                        </th>

                                        <th>
                                            <div className="transfer-list__filter-actions">
                                                <button
                                                    type="button"
                                                    className="transfer-list__apply-inline"
                                                    onClick={
                                                        applyInlineFilters
                                                    }
                                                    title="Aplicar filtros"
                                                    disabled={
                                                        !hasPendingInlineChanges
                                                    }
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="transfer-list__clear-inline"
                                                    onClick={
                                                        clearFilters
                                                    }
                                                    title="Limpar filtros"
                                                    disabled={
                                                        !hasFilters &&
                                                        !hasDraftInlineFilters
                                                    }
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {visibleRows.length > 0 ? (

                                        visibleRows.map(
                                            (transfer) => (
                                                <tr
                                                    key={
                                                        transfer.id
                                                    }
                                                >
                                                    <td>
                                                        {formatDate(
                                                            transfer.date
                                                        )}
                                                    </td>

                                                    <td className="transfer-list__description-cell">
                                                        {
                                                            transfer.description
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            transfer.originAccount
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            transfer.destinationAccount
                                                        }
                                                    </td>

                                                    <td className="transfer-list__value-cell">
                                                        {formatCurrency(
                                                            transfer.value
                                                        )}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className={`transfer-list__paid-status ${transfer.paid
                                                                    ? "is-paid"
                                                                    : "is-pending"
                                                                }`}
                                                            onClick={() => {
                                                                const updated =
                                                                {
                                                                    ...transfer,
                                                                    paid:
                                                                        !transfer.paid,
                                                                };

                                                                replaceTransfer(
                                                                    updated
                                                                );

                                                                onEditTransfer?.(
                                                                    updated
                                                                );
                                                            }}
                                                            title={
                                                                transfer.paid
                                                                    ? "Marcar como pendente"
                                                                    : "Marcar como efetivada"
                                                            }
                                                            aria-label={
                                                                transfer.paid
                                                                    ? "Transferência efetivada"
                                                                    : "Transferência pendente"
                                                            }
                                                        >
                                                            {transfer.paid ? (
                                                                <FaCheckCircle />
                                                            ) : (
                                                                <FaRegCircle />
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="transfer-list__actions-cell">
                                                        <div
                                                            className="transfer-list__row-menu"
                                                            data-transfer-row-menu
                                                        >
                                                            <button
                                                                type="button"
                                                                className={`transfer-list__kebab ${menuRowId ===
                                                                        transfer.id
                                                                        ? "is-open"
                                                                        : ""
                                                                    }`}
                                                                onClick={(
                                                                    event
                                                                ) =>
                                                                    toggleRowMenu(
                                                                        event,
                                                                        transfer.id
                                                                    )
                                                                }
                                                                aria-haspopup="menu"
                                                                aria-expanded={
                                                                    menuRowId ===
                                                                    transfer.id
                                                                }
                                                                aria-label={`Ações da transferência ${transfer.description}`}
                                                            >
                                                                <FaEllipsisV />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="transfer-list__empty-cell"
                                            >
                                                <div className="transfer-list__empty-state">
                                                    <div className="transfer-list__empty-icon">
                                                        <FaExchangeAlt />
                                                    </div>
                                                    <h2>
                                                        Nenhuma transferência neste período
                                                    </h2>
                                                    <p>
                                                        {hasFilters
                                                            ? "Não encontramos transferências com os filtros aplicados."
                                                            : `Ainda não há transferências registradas em ${formatMonth(
                                                                month
                                                            )}.`}
                                                    </p>
                                                    {hasFilters ? (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                clearFilters
                                                            }
                                                        >
                                                            Limpar filtros
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onRegisterTransfer
                                                                    ? onRegisterTransfer()
                                                                    : setNotice(
                                                                        "A ação Registrar transferência será integrada ao formulário de cadastro."
                                                                    )
                                                            }
                                                        >
                                                            <FaPlus />
                                                            Registrar transferência
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <footer className="transfer-list__footer">

                    <div className="transfer-list__footer-summary">

                        <p>
                            Mostrando{" "}
                            <strong>
                                {visibleRows.length}
                            </strong>{" "}
                            de{" "}
                            <strong>
                                {filteredRows.length}
                            </strong>{" "}
                            transferências
                        </p>

                        <label className="transfer-list__page-size">
                            <span>
                                Linhas por página
                            </span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                inputMode="numeric"
                                value={
                                    rowsPerPageInput
                                }
                                onChange={(
                                    event
                                ) =>
                                    setRowsPerPageInput(
                                        event.target.value
                                    )
                                }
                                onBlur={
                                    commitRowsPerPage
                                }
                                onKeyDown={(
                                    event
                                ) => {
                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {
                                        event.preventDefault();

                                        commitRowsPerPage();

                                        event.currentTarget.blur();
                                    }
                                }}
                                aria-label="Linhas por página"
                            />
                        </label>
                    </div>
                    <div
                        className="transfer-list__pagination"
                        aria-label="Paginação de transferências"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        Math.max(
                                            1,
                                            current - 1
                                        )
                                )
                            }
                            disabled={
                                safePage <= 1
                            }
                            aria-label="Página anterior"
                        >
                            <FaChevronLeft />
                        </button>

                        {visiblePages.map(
                            (
                                pageNumber,
                                index
                            ) => {
                                const previous =
                                    visiblePages[
                                    index - 1
                                    ];

                                const showGap =
                                    previous &&
                                    pageNumber -
                                    previous >
                                    1;

                                return (
                                    <React.Fragment
                                        key={
                                            pageNumber
                                        }
                                    >
                                        {showGap ? (
                                            <span className="transfer-list__page-gap">
                                                …
                                            </span>
                                        ) : null}
                                        <button
                                            type="button"
                                            className={
                                                safePage ===
                                                    pageNumber
                                                    ? "is-active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setPage(
                                                    pageNumber
                                                )
                                            }
                                            aria-current={
                                                safePage ===
                                                    pageNumber
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {pageNumber}
                                        </button>

                                    </React.Fragment>
                                );
                            }
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        Math.min(
                                            totalPages,
                                            current + 1
                                        )
                                )
                            }
                            disabled={
                                safePage >=
                                totalPages
                            }
                            aria-label="Próxima página"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </footer>
            </section>

            {menuRowId &&
                activeMenuTransfer &&
                menuPosition &&
                typeof document !==
                "undefined"
                ? createPortal(
                    <div
                        className={`transfer-list__action-menu transfer-list__action-menu--portal ${menuPosition.placement ===
                                "above"
                                ? "is-above"
                                : "is-below"
                            }`}
                        data-transfer-row-menu
                        role="menu"
                        style={{
                            left: `${menuPosition.left}px`,
                            top: `${menuPosition.top}px`,
                        }}
                    >
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                generateReceipt(
                                    activeMenuTransfer
                                );
                                closeRowMenu();
                            }}
                        >
                            <FaFileInvoice />
                            <span>
                                Gerar recibo
                            </span>
                        </button>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setDialog({
                                    type: "edit",
                                    transferId:
                                        activeMenuTransfer.id,
                                });

                                closeRowMenu();
                            }}
                        >
                            <FaPen />
                            <span>
                                Editar
                            </span>
                        </button>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                onViewTransferDetails?.(
                                    activeMenuTransfer
                                );
                                setDialog({
                                    type: "details",
                                    transferId:
                                        activeMenuTransfer.id,
                                });

                                closeRowMenu();
                            }}
                        >
                            <FaListUl />
                            <span>
                                Detalhar
                            </span>
                        </button>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setDialog({
                                    type: "attachments",
                                    transferId:
                                        activeMenuTransfer.id,
                                });

                                closeRowMenu();
                            }}
                        >
                            <FaPaperclip />
                            <span>
                                Anexos
                            </span>
                            {activeMenuTransfer
                                .attachments
                                ?.length ? (
                                <small>
                                    {
                                        activeMenuTransfer
                                            .attachments
                                            .length
                                    }
                                </small>
                            ) : null}
                        </button>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={() =>
                                duplicateTransfer(
                                    activeMenuTransfer
                                )
                            }
                        >
                            <FaCopy />
                            <span>
                                Duplicar
                            </span>
                        </button>

                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setDialog({
                                    type: "move",
                                    transferId:
                                        activeMenuTransfer.id,
                                });

                                closeRowMenu();
                            }}
                        >
                            <FaExchangeAlt />
                            <span>
                                Mover
                            </span>
                        </button>

                        <div className="transfer-list__menu-divider" />
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setDialog({
                                    type: "recurring",
                                    transferId:
                                        activeMenuTransfer.id,
                                });

                                closeRowMenu();
                            }}
                        >
                            <FaClock />
                            <span>
                                Recorrente
                            </span>
                        </button>

                        <div className="transfer-list__menu-divider" />
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setDialog({
                                    type: "installments",
                                    transferId:
                                        activeMenuTransfer.id,
                                });

                                closeRowMenu();
                            }}
                        >
                            <FaExchangeAlt />
                            <span>
                                Parcelar
                            </span>
                        </button>
                        <div className="transfer-list__menu-divider" />

                        <button
                            type="button"
                            role="menuitem"
                            className="is-danger"
                            onClick={() => {
                                setDialog({
                                    type: "delete",
                                    transferId:
                                        activeMenuTransfer.id,
                                });

                                closeRowMenu();
                            }}
                        >
                            <FaTrash />
                            <span>
                                Excluir
                            </span>
                        </button>

                    </div>,
                    document.body
                )
                : null}

            {notice ? (
                <div
                    className="transfer-list__toast"
                    role="status"
                >
                    {notice}
                </div>
            ) : null}

            {isAdvancedOpen ? (

                <div
                    className="transfer-list__drawer-backdrop"
                    onMouseDown={() =>
                        setIsAdvancedOpen(false)
                    }
                    role="presentation"
                >
                    <aside
                        className="transfer-list__drawer"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                        aria-label="Filtros avançados"
                    >
                        <header>
                            <div>
                                <span>
                                    HU08-E07
                                </span>

                                <h2>
                                    Filtros avançados
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="transfer-list__icon-button"
                                onClick={() =>
                                    setIsAdvancedOpen(
                                        false
                                    )
                                }
                                aria-label="Fechar filtros"
                            >
                                <FaTimes />
                            </button>
                        </header>

                        <div className="transfer-list__drawer-body">
                            <div className="transfer-list__drawer-grid">
                                <Field label="Data inicial">
                                    <input
                                        type="date"
                                        value={
                                            advancedFilters.dateFrom
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAdvancedFilters(
                                                (current) => ({
                                                    ...current,
                                                    dateFrom:
                                                        event.target.value,
                                                })
                                            )
                                        }
                                    />
                                </Field>

                                <Field label="Data final">
                                    <input
                                        type="date"
                                        value={
                                            advancedFilters.dateTo
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAdvancedFilters(
                                                (current) => ({
                                                    ...current,
                                                    dateTo:
                                                        event.target.value,
                                                })
                                            )
                                        }
                                    />
                                </Field>

                                <Field label="Valor mínimo">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            advancedFilters.minValue
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAdvancedFilters(
                                                (current) => ({
                                                    ...current,
                                                    minValue:
                                                        event.target.value,
                                                })
                                            )
                                        }
                                        placeholder="0,00"
                                    />
                                </Field>

                                <Field label="Valor máximo">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            advancedFilters.maxValue
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAdvancedFilters(
                                                (current) => ({
                                                    ...current,
                                                    maxValue:
                                                        event.target.value,
                                                })
                                            )
                                        }
                                        placeholder="0,00"
                                    />
                                </Field>

                                <Field label="Conta de origem">
                                    <select
                                        value={
                                            advancedFilters.originAccount
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAdvancedFilters(
                                                (current) => ({
                                                    ...current,
                                                    originAccount:
                                                        event.target.value,
                                                })
                                            )
                                        }
                                    >
                                        <option value="">
                                            Todas
                                        </option>

                                        {ACCOUNTS.map(
                                            (account) => (
                                                <option
                                                    key={account}
                                                    value={account}
                                                >
                                                    {account}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>

                                <Field label="Conta de destino">
                                    <select
                                        value={
                                            advancedFilters.destinationAccount
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAdvancedFilters(
                                                (current) => ({
                                                    ...current,
                                                    destinationAccount:
                                                        event.target.value,
                                                })
                                            )
                                        }
                                    >
                                        <option value="">
                                            Todas
                                        </option>
                                        {ACCOUNTS.map(
                                            (account) => (
                                                <option
                                                    key={account}
                                                    value={account}
                                                >
                                                    {account}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>
                                <Field label="Status">
                                    <select
                                        value={
                                            advancedFilters.paid
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setAdvancedFilters(
                                                (current) => ({
                                                    ...current,
                                                    paid:
                                                        event.target.value,
                                                })
                                            )
                                        }
                                    >
                                        <option value="">
                                            Todos
                                        </option>
                                        <option value="paid">
                                            Efetivadas
                                        </option>
                                        <option value="pending">
                                            Pendentes
                                        </option>
                                    </select>
                                </Field>
                            </div>
                        </div>
                        <footer>
                            <button
                                type="button"
                                className="transfer-list__button transfer-list__button--secondary"
                                onClick={
                                    clearFilters
                                }
                            >
                                Limpar filtros
                            </button>
                            <button
                                type="button"
                                className="transfer-list__button transfer-list__button--primary"
                                onClick={() =>
                                    setIsAdvancedOpen(
                                        false
                                    )
                                }
                            >
                                Aplicar filtros
                            </button>
                        </footer>
                    </aside>
                </div>
            ) : null}

            {dialog?.type ===
                "edit" &&
                activeTransfer ? (
                <Dialog
                    title="Editar transferência"
                    onClose={() =>
                        setDialog(null)
                    }
                >
                    <form
                        className="transfer-list__form"
                        onSubmit={(event) =>
                            handleEditSubmit(
                                event,
                                activeTransfer
                            )
                        }
                    >
                        <div className="transfer-list__form-grid">
                            <Field label="Data">
                                <input
                                    name="date"
                                    type="date"
                                    defaultValue={
                                        activeTransfer.date
                                    }
                                    required
                                />
                            </Field>
                            <Field label="Valor">
                                <input
                                    name="value"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={
                                        activeTransfer.value
                                    }
                                    required
                                />
                            </Field>
                            <Field
                                label="Descrição"
                                className="is-wide"
                            >
                                <input
                                    name="description"
                                    defaultValue={
                                        activeTransfer.description
                                    }
                                    required
                                />
                            </Field>
                            <Field label="Conta de origem">
                                <select
                                    name="originAccount"
                                    defaultValue={
                                        activeTransfer.originAccount
                                    }
                                >
                                    {ACCOUNTS.map(
                                        (account) => (
                                            <option
                                                key={account}
                                                value={account}
                                            >
                                                {account}
                                            </option>
                                        )
                                    )}
                                </select>
                            </Field>
                            <Field label="Conta de destino">
                                <select
                                    name="destinationAccount"
                                    defaultValue={
                                        activeTransfer.destinationAccount
                                    }
                                >
                                    {ACCOUNTS.map(
                                        (account) => (
                                            <option
                                                key={account}
                                                value={account}
                                            >
                                                {account}
                                            </option>
                                        )
                                    )}
                                </select>
                            </Field>
                        </div>
                        <label className="transfer-list__checkbox-row">
                            <input
                                name="paid"
                                type="checkbox"
                                defaultChecked={
                                    activeTransfer.paid
                                }
                            />
                            <span>
                                Transferência efetivada
                            </span>
                        </label>
                        <div className="transfer-list__dialog-actions">
                            <button
                                type="button"
                                className="transfer-list__button transfer-list__button--secondary"
                                onClick={() =>
                                    setDialog(null)
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="transfer-list__button transfer-list__button--primary"
                            >
                                Salvar alterações
                            </button>
                        </div>
                    </form>
                </Dialog>
            ) : null}

            {dialog?.type ===
                "details" &&
                activeTransfer ? (

                <Dialog
                    title="Detalhamento da transferência"
                    onClose={() =>
                        setDialog(null)
                    }
                >
                    <div className="transfer-list__details-card">
                        <span>
                            Valor da transferência
                        </span>
                        <strong>
                            {formatCurrency(
                                activeTransfer.value
                            )}
                        </strong>
                    </div>

                    <dl className="transfer-list__details-list">
                        <div>
                            <dt>Data</dt>
                            <dd>
                                {formatDate(
                                    activeTransfer.date
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt>Descrição</dt>
                            <dd>
                                {
                                    activeTransfer.description
                                }
                            </dd>
                        </div>
                        <div>
                            <dt>Conta de origem</dt>
                            <dd>
                                {
                                    activeTransfer.originAccount
                                }
                            </dd>
                        </div>
                        <div>
                            <dt>Conta de destino</dt>
                            <dd>
                                {
                                    activeTransfer.destinationAccount
                                }
                            </dd>
                        </div>
                        <div>
                            <dt>Status</dt>
                            <dd>
                                {activeTransfer.paid
                                    ? "Efetivada"
                                    : "Pendente"}
                            </dd>
                        </div>
                    </dl>
                </Dialog>
            ) : null}

            {dialog?.type ===
                "attachments" &&
                activeTransfer ? (
                <Dialog
                    title="Anexos da transferência"
                    onClose={() =>
                        setDialog(null)
                    }
                >
                    <div className="transfer-list__attachments">
                        <label className="transfer-list__upload-box">
                            <FaPlus />
                            <span>
                                Adicionar comprovante
                            </span>
                            <input
                                type="file"
                                multiple
                                onChange={(event) =>
                                    handleAttachmentAdd(
                                        activeTransfer,
                                        event.target.files
                                    )
                                }
                            />
                        </label>
                        {activeTransfer
                            .attachments?.length ? (
                            <ul>
                                {activeTransfer.attachments.map(
                                    (attachment) => (
                                        <li
                                            key={
                                                attachment.id ??
                                                attachment.name
                                            }
                                        >
                                            <FaPaperclip />
                                            <span>
                                                {
                                                    attachment.name
                                                }
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const nextAttachments =
                                                        activeTransfer.attachments.filter(
                                                            (item) =>
                                                                item !==
                                                                attachment
                                                        );
                                                    const updated = {
                                                        ...activeTransfer,
                                                        attachments:
                                                            nextAttachments,
                                                    };
                                                    replaceTransfer(
                                                        updated
                                                    );
                                                    onAttachmentsChange?.(
                                                        updated,
                                                        nextAttachments
                                                    );
                                                    setDialog({
                                                        type: "attachments",
                                                        transferId:
                                                            updated.id,
                                                    });
                                                }}
                                                aria-label={`Remover ${attachment.name}`}
                                            >
                                                <FaTimes />
                                            </button>

                                        </li>
                                    )
                                )}
                            </ul>
                        ) : (
                            <p className="transfer-list__muted">
                                Nenhum arquivo anexado a esta transferência.
                            </p>
                        )}
                    </div>
                </Dialog>
            ) : null}

            {dialog?.type ===
                "move" &&
                activeTransfer ? (
                <Dialog
                    title="Mover transferência"
                    onClose={() =>
                        setDialog(null)
                    }
                >
                    <form
                        className="transfer-list__form"
                        onSubmit={(event) =>
                            submitMove(
                                event,
                                activeTransfer
                            )
                        }
                    >
                        <Field label="Mover para">
                            <select
                                name="destination"
                                defaultValue="transfers"
                            >
                                <option value="transfers">
                                    Transferências
                                </option>
                                <option value="receipts">
                                    Recebimentos
                                </option>
                                <option value="expenses">
                                    Despesas
                                </option>
                            </select>
                        </Field>
                        <div className="transfer-list__dialog-actions">
                            <button
                                type="button"
                                className="transfer-list__button transfer-list__button--secondary"
                                onClick={() =>
                                    setDialog(null)
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="transfer-list__button transfer-list__button--primary"
                            >
                                Mover
                            </button>
                        </div>
                    </form>
                </Dialog>
            ) : null}

            {dialog?.type ===
                "recurring" &&
                activeTransfer ? (
                <Dialog
                    title="Tornar recorrente"
                    onClose={() =>
                        setDialog(null)
                    }
                >
                    <form
                        className="transfer-list__form"
                        onSubmit={(event) =>
                            submitRecurring(
                                event,
                                activeTransfer
                            )
                        }
                    >
                        <Field label="Frequência">
                            <select
                                name="frequency"
                                defaultValue="monthly"
                            >
                                <option value="weekly">
                                    Semanal
                                </option>
                                <option value="monthly">
                                    Mensal
                                </option>
                                <option value="quarterly">
                                    Trimestral
                                </option>
                                <option value="yearly">
                                    Anual
                                </option>
                            </select>
                        </Field>
                        <Field label="Iniciar em">
                            <input
                                name="startDate"
                                type="date"
                                defaultValue={
                                    activeTransfer.date
                                }
                                required
                            />
                        </Field>
                        <div className="transfer-list__dialog-actions">
                            <button
                                type="button"
                                className="transfer-list__button transfer-list__button--secondary"
                                onClick={() =>
                                    setDialog(null)
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="transfer-list__button transfer-list__button--primary"
                            >
                                Confirmar recorrência
                            </button>
                        </div>
                    </form>
                </Dialog>
            ) : null}

            {dialog?.type ===
                "installments" &&
                activeTransfer ? (
                <Dialog
                    title="Parcelar transferência"
                    onClose={() =>
                        setDialog(null)
                    }
                >
                    <form
                        className="transfer-list__form"
                        onSubmit={(event) =>
                            submitInstallments(
                                event,
                                activeTransfer
                            )
                        }
                    >
                        <div className="transfer-list__details-card transfer-list__details-card--compact">
                            <span>
                                Valor a parcelar
                            </span>
                            <strong>
                                {formatCurrency(
                                    activeTransfer.value
                                )}
                            </strong>
                        </div>
                        <Field label="Número de parcelas">
                            <input
                                name="installments"
                                type="number"
                                min="2"
                                max="60"
                                defaultValue="2"
                                required
                            />

                        </Field>
                        <Field label="Data da primeira parcela">
                            <input
                                name="firstDate"
                                type="date"
                                defaultValue={
                                    activeTransfer.date
                                }
                                required
                            />

                        </Field>
                        <div className="transfer-list__dialog-actions">
                            <button
                                type="button"
                                className="transfer-list__button transfer-list__button--secondary"
                                onClick={() =>
                                    setDialog(null)
                                }
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="transfer-list__button transfer-list__button--primary"
                            >
                                Criar parcelas
                            </button>
                        </div>
                    </form>
                </Dialog>
            ) : null}

            {dialog?.type ===
                "delete" &&
                activeTransfer ? (

                <Dialog
                    title="Excluir transferência"
                    className="transfer-list__dialog--small"
                    onClose={() =>
                        setDialog(null)
                    }
                >
                    <div className="transfer-list__delete-copy">
                        <div className="transfer-list__danger-icon">
                            <FaTrash />
                        </div>
                        <p>
                            Tem certeza que deseja excluir{" "}
                            <strong>
                                {
                                    activeTransfer.description
                                }
                            </strong>
                            ?
                        </p>
                        <span>
                            A transferência será removida da listagem.
                            A exclusão definitiva poderá ser tratada
                            pela API através do callback{" "}
                            <code>
                                onDeleteTransfer
                            </code>
                            .
                        </span>
                    </div>

                    <div className="transfer-list__dialog-actions">
                        <button
                            type="button"
                            className="transfer-list__button transfer-list__button--secondary"
                            onClick={() =>
                                setDialog(null)
                            }
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="transfer-list__button transfer-list__button--danger"
                            onClick={() =>
                                confirmDelete(
                                    activeTransfer
                                )
                            }
                        >
                            Excluir transferência
                        </button>
                    </div>
                </Dialog>
            ) : null}

        </main>
    );
};

export default TransferList;