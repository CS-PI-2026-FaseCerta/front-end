import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    DEMO_TRANSFERS,
    EMPTY_TRANSFER_FILTERS,
} from "../transferList.constants.js";
import {
    createId,
    escapeHtml,
    formatCurrency,
    formatDate,
    includesNormalized,
    parseMonth,
} from "../utils/transferList.utils.js";

export default function useTransferListController({
    transfers = DEMO_TRANSFERS,
    initialMonth = "2026-05-01",
    pageSize = 4,
    onMonthChange,
    onRegisterTransfer,
    onGenerateReceipt,
    onEditTransfer,
    onViewTransfer,
    onAttachmentsChange,
    onDuplicateTransfer,
    onMoveTransfer,
    onRecurringTransfer,
    onInstallmentTransfer,
    onDeleteTransfer,
} = {}) {
    const [rows, setRows] = useState(() =>
        transfers.map((item) => ({
            ...item,
            attachments: item.attachments ?? [],
        })),
    );

    const [month, setMonth] = useState(() =>
        parseMonth(initialMonth),
    );

    const [page, setPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(pageSize);
    const [rowsPerPageInput, setRowsPerPageInput] = useState(
        String(pageSize),
    );

    const [sort, setSort] = useState({
        key: "date",
        direction: "asc",
    });

    const [inlineFilters, setInlineFilters] = useState(
        EMPTY_TRANSFER_FILTERS,
    );

    const [draftInlineFilters, setDraftInlineFilters] = useState(
        EMPTY_TRANSFER_FILTERS,
    );

    const [isAdvancedOpen, setIsAdvancedOpen] =
        useState(false);

    const [advancedFilters, setAdvancedFilters] =
        useState({
            dateFrom: "",
            dateTo: "",
            minValue: "",
            maxValue: "",
            onlyWithAttachments: false,
        });

    const [menuRowId, setMenuRowId] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);

    const [dialog, setDialog] = useState(null);

    const [notice, setNotice] = useState("");

    useEffect(() => {
        setRows(
            transfers.map((item) => ({
                ...item,
                attachments: item.attachments ?? [],
            })),
        );
    }, [transfers]);

    useEffect(() => {
        const closeMenu = (event) => {
            if (
                event.target instanceof Element &&
                event.target.closest("[data-transfer-row-menu]")
            ) {
                return;
            }

            setMenuRowId(null);
            setMenuPosition(null);
        };

        document.addEventListener(
            "pointerdown",
            closeMenu,
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                closeMenu,
            );
        };
    }, []);

    useEffect(() => {
        const closeMenuOnViewportChange = () => {
            setMenuRowId(null);
            setMenuPosition(null);
        };

        window.addEventListener(
            "resize",
            closeMenuOnViewportChange,
        );

        window.addEventListener(
            "scroll",
            closeMenuOnViewportChange,
            true,
        );

        return () => {
            window.removeEventListener(
                "resize",
                closeMenuOnViewportChange,
            );

            window.removeEventListener(
                "scroll",
                closeMenuOnViewportChange,
                true,
            );
        };
    }, []);

    useEffect(() => {
        if (!notice) return undefined;

        const timeout = window.setTimeout(
            () => setNotice(""),
            3200,
        );

        return () => window.clearTimeout(timeout);
    }, [notice]);

    const filteredRows = useMemo(() => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();

        return rows
            .filter((row) => {
                const rowDate = new Date(
                    `${row.date}T12:00:00`,
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
                        inlineFilters.description,
                    )
                ) {
                    return false;
                }

                if (
                    inlineFilters.originAccount &&
                    !includesNormalized(
                        row.originAccount,
                        inlineFilters.originAccount,
                    )
                ) {
                    return false;
                }

                if (
                    inlineFilters.destinationAccount &&
                    !includesNormalized(
                        row.destinationAccount,
                        inlineFilters.destinationAccount,
                    )
                ) {
                    return false;
                }

                if (inlineFilters.value) {
                    const rawQuery = String(
                        inlineFilters.value,
                    )
                        .trim()
                        .replace(/\s/g, "");

                    const normalizedQuery =
                        rawQuery.includes(",")
                            ? rawQuery
                                .replace(/\./g, "")
                                .replace(",", ".")
                            : rawQuery;

                    const numericValue = Number(row.value);

                    const candidates = [
                        String(numericValue),
                        numericValue.toFixed(2),
                        formatCurrency(numericValue),
                    ].map((value) =>
                        value
                            .replace(/\s/g, "")
                            .toLocaleLowerCase("pt-BR"),
                    );

                    if (
                        !candidates.some((candidate) =>
                            candidate.includes(
                                normalizedQuery.toLocaleLowerCase("pt-BR"),
                            ),
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
                    advancedFilters.minValue &&
                    Number(row.value) <
                    Number(advancedFilters.minValue)
                ) {
                    return false;
                }

                if (
                    advancedFilters.maxValue &&
                    Number(row.value) >
                    Number(advancedFilters.maxValue)
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

                if (
                    leftValue == null &&
                    rightValue == null
                ) {
                    return 0;
                }

                if (leftValue == null) return 1;
                if (rightValue == null) return -1;

                let comparison;

                if (typeof leftValue === "number") {
                    comparison =
                        leftValue - Number(rightValue);
                } else if (
                    typeof leftValue === "boolean"
                ) {
                    comparison =
                        Number(leftValue) -
                        Number(rightValue);
                } else {
                    comparison = String(leftValue).localeCompare(
                        String(rightValue),
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
            });
    }, [
        advancedFilters,
        inlineFilters,
        month,
        rows,
        sort,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredRows.length / rowsPerPage,
        ),
    );

    const safePage = Math.min(
        page,
        totalPages,
    );

    const visibleRows = filteredRows.slice(
        (safePage - 1) * rowsPerPage,
        safePage * rowsPerPage,
    );

    useEffect(() => {
        if (page !== safePage) {
            setPage(safePage);
        }
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
        () =>
            Object.values(draftInlineFilters).some(Boolean),
        [draftInlineFilters],
    );

    const hasPendingInlineChanges = useMemo(
        () =>
            JSON.stringify(draftInlineFilters) !==
            JSON.stringify(inlineFilters),
        [
            draftInlineFilters,
            inlineFilters,
        ],
    );

    const updateInlineFilter = (key, value) => {
        setDraftInlineFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const applyInlineFilters = () => {
        setInlineFilters({
            ...draftInlineFilters,
        });

        setPage(1);
    };

    const clearFilters = () => {
        setInlineFilters(EMPTY_TRANSFER_FILTERS);
        setDraftInlineFilters(EMPTY_TRANSFER_FILTERS);

        setAdvancedFilters({
            dateFrom: "",
            dateTo: "",
            minValue: "",
            maxValue: "",
            onlyWithAttachments: false,
        });

        setPage(1);
    };

    const openAdvancedFilters = () => {
        setIsAdvancedOpen(true);
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
                current.key === key &&
                    current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));

        setPage(1);
    };

    const commitRowsPerPage = () => {
        const normalizedInput =
            rowsPerPageInput.trim();

        if (!/^\d+$/.test(normalizedInput)) {
            setRowsPerPageInput(
                String(rowsPerPage),
            );
            return;
        }

        const parsedValue = Number(
            normalizedInput,
        );

        if (
            !Number.isSafeInteger(parsedValue) ||
            parsedValue < 1
        ) {
            setRowsPerPageInput(
                String(rowsPerPage),
            );
            return;
        }

        setRowsPerPage(parsedValue);
        setRowsPerPageInput(
            String(parsedValue),
        );
        setPage(1);
    };

    const replaceTransfer = (transfer) => {
        setRows((current) =>
            current.map((item) =>
                item.id === transfer.id
                    ? transfer
                    : item,
            ),
        );
    };

    const getTransfer = (id) =>
        rows.find((item) => item.id === id);

    const closeRowMenu = () => {
        setMenuRowId(null);
        setMenuPosition(null);
    };

    const toggleRowMenu = (
        event,
        transferId,
    ) => {
        if (menuRowId === transferId) {
            closeRowMenu();
            return;
        }

        const rect =
            event.currentTarget.getBoundingClientRect();

        const menuWidth = 276;
        const estimatedMenuHeight = 430;
        const viewportPadding = 12;
        const gap = 8;

        const availableBelow =
            window.innerHeight - rect.bottom;

        const availableAbove = rect.top;

        const placeAbove =
            availableBelow < estimatedMenuHeight &&
            availableAbove > availableBelow;

        const left = Math.max(
            viewportPadding,
            Math.min(
                rect.right - menuWidth,
                window.innerWidth -
                menuWidth -
                viewportPadding,
            ),
        );

        const idealTop = placeAbove
            ? rect.top -
            gap -
            estimatedMenuHeight
            : rect.bottom + gap;

        const top = Math.max(
            viewportPadding,
            Math.min(
                idealTop,
                window.innerHeight -
                viewportPadding -
                estimatedMenuHeight,
            ),
        );

        setMenuRowId(transferId);

        setMenuPosition({
            left,
            top,
        });
    };

    const openTransferDialog = (
        type,
        transfer,
    ) => {
        closeRowMenu();

        if (!transfer) return;

        setDialog({
            type,
            transferId: transfer.id,
        });
    };

    const togglePaid = (transfer) => {
        if (!transfer) return;

        const updated = {
            ...transfer,
            paid: !transfer.paid,
        };

        replaceTransfer(updated);
        onEditTransfer?.(updated);

        setNotice(
            updated.paid
                ? "Transferência marcada como efetivada."
                : "Transferência marcada como pendente.",
        );
    };

    const generateReceiptAndClose = (transfer) => {
        generateReceipt(transfer);
        closeRowMenu();
    };

    const generateReceipt = (transfer) => {
        onGenerateReceipt?.(transfer);

        if (onGenerateReceipt) {
            setNotice("Solicitação de recibo enviada.");
            return;
        }

        const receiptWindow = window.open(
            "",
            "_blank",
            "width=760,height=820",
        );

        if (!receiptWindow) {
            setNotice(
                "O navegador bloqueou a abertura do recibo.",
            );
            return;
        }

        receiptWindow.document.write(`
            <!doctype html>
            <html lang="pt-BR">
                <head>
                    <meta charset="utf-8" />
                    <title>
                        Recibo - ${escapeHtml(
            transfer.description,
        )}
                    </title>
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
                            grid-template-columns:
                                180px 1fr;
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
                        .status {
                            font-weight: 700;
                            color: ${transfer.paid
                ? "#5d7700"
                : "#7c5b14"
            };
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>
                            Comprovante de transferência
                        </h1>
                        <p class="amount">
                            ${escapeHtml(
                formatCurrency(
                    transfer.value,
                ),
            )}
                        </p>
                        <dl>
                            <dt>Data</dt>
                            <dd>
                                ${escapeHtml(
                formatDate(
                    transfer.date,
                ),
            )}
                            </dd>
                            <dt>Descrição</dt>
                            <dd>
                                ${escapeHtml(
                transfer.description,
            )}
                            </dd>
                            <dt>Conta de origem</dt>
                            <dd>
                                ${escapeHtml(
                transfer.originAccount,
            )}
                            </dd>
                            <dt>Conta de destino</dt>
                            <dd>
                                ${escapeHtml(
                transfer.destinationAccount,
            )}
                            </dd>
                            <dt>Status</dt>
                            <dd class="status">
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

    const duplicateTransfer = (
        transfer,
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
            transfer,
        );

        setNotice(
            "Transferência duplicada.",
        );
    };

    const handleEditSubmit = (
        event,
        transfer,
    ) => {
        event.preventDefault();

        if (!transfer) return;

        const formData = new FormData(
            event.currentTarget,
        );

        const updated = {
            ...transfer,
            date: formData.get("date"),
            description: formData.get("description"),
            originAccount: formData.get(
                "originAccount",
            ),
            destinationAccount: formData.get(
                "destinationAccount",
            ),
            value: Number(
                formData.get("value"),
            ),
            paid:
                formData.get("paid") === "on",
        };

        replaceTransfer(updated);
        onEditTransfer?.(updated);

        setDialog(null);

        setNotice(
            "Transferência atualizada.",
        );
    };

    const createAttachmentId = () =>
        typeof crypto !== "undefined" &&
            crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`;

    const handleAttachmentAdd = (
        transfer,
        fileList,
    ) => {
        if (!transfer || !fileList?.length) {
            return;
        }

        const attachments = [
            ...(transfer.attachments ?? []),
            ...Array.from(fileList).map(
                (file) => ({
                    id: createAttachmentId(),
                    name: file.name,
                    size: file.size,
                    file,
                }),
            ),
        ];

        const updated = {
            ...transfer,
            attachments,
        };

        replaceTransfer(updated);

        onAttachmentsChange?.(
            updated,
            attachments,
        );

        setDialog({
            type: "attachments",
            transferId: updated.id,
        });

        setNotice(
            "Anexo(s) adicionado(s).",
        );
    };

    const handleAttachmentRemove = (
        transfer,
        attachment,
    ) => {
        if (!transfer || !attachment) {
            return;
        }

        const attachments = (
            transfer.attachments ?? []
        ).filter(
            (item) => item.id !== attachment.id,
        );

        const updated = {
            ...transfer,
            attachments,
        };

        replaceTransfer(updated);

        onAttachmentsChange?.(
            updated,
            attachments,
        );

        setDialog({
            type: "attachments",
            transferId: updated.id,
        });
    };

    const submitMove = (
        event,
        transfer,
    ) => {
        event.preventDefault();

        if (!transfer) return;

        const formData = new FormData(
            event.currentTarget,
        );

        const updated = {
            ...transfer,
            originAccount: formData.get(
                "originAccount",
            ),
            destinationAccount: formData.get(
                "destinationAccount",
            ),
        };

        replaceTransfer(updated);
        onMoveTransfer?.(updated);

        setDialog(null);

        setNotice(
            "Transferência movida.",
        );
    };

    const submitRecurring = (
        event,
        transfer,
    ) => {
        event.preventDefault();

        if (!transfer) return;

        const formData = new FormData(
            event.currentTarget,
        );

        const updated = {
            ...transfer,
            recurring: {
                frequency: formData.get(
                    "frequency",
                ),
                startDate: formData.get(
                    "startDate",
                ),
            },
        };

        replaceTransfer(updated);
        onRecurringTransfer?.(updated);

        setDialog(null);

        setNotice(
            "Transferência configurada como recorrente.",
        );
    };

    const submitInstallments = (
        event,
        transfer,
    ) => {
        event.preventDefault();

        if (!transfer) return;

        const formData = new FormData(
            event.currentTarget,
        );

        const installments = Number(
            formData.get("installments"),
        );

        const firstDate =
            formData.get("firstDate");

        if (
            !Number.isInteger(installments) ||
            installments < 2 ||
            installments > 60 ||
            !firstDate
        ) {
            return;
        }

        const totalCents = Math.round(
            Number(transfer.value) * 100,
        );

        const baseCents = Math.floor(
            totalCents / installments,
        );

        const remainder =
            totalCents % installments;

        const first = new Date(
            `${firstDate}T12:00:00`,
        );

        const generated = Array.from(
            { length: installments },
            (_, index) => {
                const date = new Date(
                    first.getFullYear(),
                    first.getMonth() + index,
                    first.getDate(),
                );

                const cents =
                    baseCents +
                    (index < remainder ? 1 : 0);

                return {
                    ...transfer,
                    id:
                        index === 0
                            ? transfer.id
                            : createId(),
                    date: date
                        .toISOString()
                        .slice(0, 10),
                    description: `${transfer.description} (${index + 1}/${installments})`,
                    value: cents / 100,
                    paid:
                        index === 0
                            ? transfer.paid
                            : false,
                };
            },
        );

        setRows((current) => [
            ...current.filter(
                (item) =>
                    item.id !== transfer.id,
            ),
            ...generated,
        ]);

        onInstallmentTransfer?.(
            generated,
            transfer,
        );

        setDialog(null);

        setNotice(
            `Transferência dividida em ${installments} parcelas.`,
        );
    };

    const confirmDelete = (
        transfer,
    ) => {
        if (!transfer) return;

        setRows((current) =>
            current.filter(
                (item) =>
                    item.id !== transfer.id,
            ),
        );

        onDeleteTransfer?.({
            ...transfer,
            deletedAt:
                new Date().toISOString(),
        });

        setDialog(null);

        setNotice(
            "Transferência excluída.",
        );
    };

    const activeTransfer = dialog?.transferId
        ? getTransfer(dialog.transferId)
        : null;

    const activeMenuTransfer = menuRowId
        ? getTransfer(menuRowId)
        : null;

    return {
        rows,
        month,
        page,
        setPage,
        rowsPerPageInput,
        setRowsPerPageInput,
        sort,
        filteredRows,
        visibleRows,
        totalPages,
        safePage,

        inlineFilters,
        draftInlineFilters,

        isAdvancedOpen,
        setIsAdvancedOpen,
        advancedFilters,
        setAdvancedFilters,

        menuRowId,
        menuPosition,
        activeMenuTransfer,

        dialog,
        setDialog,
        activeTransfer,

        notice,

        hasFilters,
        hasDraftInlineFilters,
        hasPendingInlineChanges,

        updateInlineFilter,
        applyInlineFilters,
        clearFilters,
        openAdvancedFilters,

        changeMonth,
        toggleSort,
        commitRowsPerPage,

        toggleRowMenu,
        openTransferDialog,
        togglePaid,

        generateReceiptAndClose,
        duplicateTransfer,

        handleEditSubmit,
        handleAttachmentAdd,
        handleAttachmentRemove,
        submitMove,
        submitRecurring,
        submitInstallments,
        confirmDelete,
    };
}