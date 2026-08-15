import React, {
    useEffect,
    useMemo,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    FaCheck,
    FaChevronDown,
    FaEllipsisV,
    FaMoneyBillWave,
    FaRegCircle,
    FaTimes,
} from "react-icons/fa";

import FinanceHeader from "../../components/header/FinanceHeader";
import FinanceFooter from "../../components/footer/FinanceFooter";

import TransferActionMenu from "../../modals/TransferActionMenu";

import TransferEditModal from "../../modals/TransferEditModal";
import TransferDetailsModal from "../../modals/TransferDetailsModal";
import TransferAttachmentsModal from "../../modals/TransferAttachmentsModal";
import TransferMoveModal from "../../modals/TransferMoveModal";
import TransferRecurringModal from "../../modals/TransferRecurringModal";
import TransferInstallmentsModal from "../../modals/TransferInstallmentsModal";
import TransferDeleteModal from "../../modals/TransferDeleteModal";

import "./Transfers.css";

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
        destinationAccount: "Investimentos CDB",
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
        date: "2026-05-28",
        description: "Reserva para fornecedores",
        originAccount: "Conta Principal",
        destinationAccount: "Conta Fornecedores",
        value: 3500,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-006",
        date: "2026-05-29",
        description: "Transferência para caixa",
        originAccount: "Conta Corrente",
        destinationAccount: "Caixa Operacional",
        value: 2500,
        paid: false,
        attachments: [],
    },
    {
        id: "transfer-007",
        date: "2026-05-30",
        description: "Transferência para investimentos",
        originAccount: "Conta Principal",
        destinationAccount: "Investimentos CDB",
        value: 12000,
        paid: true,
        attachments: [],
    },
    {
        id: "transfer-008",
        date: "2026-05-31",
        description: "Reforço de capital operacional",
        originAccount: "Conta Investimentos",
        destinationAccount: "Conta Operacional",
        value: 7000,
        paid: false,
        attachments: [],
    },
];

const parseMonth = (value) => {
    if (value instanceof Date) {
        return new Date(
            value.getFullYear(),
            value.getMonth(),
            1
        );
    }

    const parsed = new Date(
        `${String(value).slice(0, 7)}-01T12:00:00`
    );

    if (!Number.isNaN(parsed.getTime())) {
        return new Date(
            parsed.getFullYear(),
            parsed.getMonth(),
            1
        );
    }

    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );
};

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

const createId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `transfer-${Date.now()}-${Math.random()}`;

const emptyFilters = {
    date: "",
    description: "",
    originAccount: "",
    destinationAccount: "",
    value: "",
    paid: "",
};

const Transfers = ({
    transfers = DEMO_TRANSFERS,
    initialMonth = "2026-05-01",
    pageSize = 4,

    onMonthChange,
    onTabChange,
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

    const [sort, setSort] = useState({
        key: "date",
        direction: "asc",
    });

    const [filters, setFilters] = useState(emptyFilters);

    const [draftFilters, setDraftFilters] =
        useState(emptyFilters);

    const [menuRowId, setMenuRowId] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);

    const [modal, setModal] = useState(null);

    const [notice, setNotice] = useState("");

    useEffect(() => {
        setRows(
            transfers.map((item) => ({
                ...item,
            }))
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
            closeMenu
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                closeMenu
            );
        };
    }, []);

    useEffect(() => {
        if (!notice) return;

        const timeout = window.setTimeout(
            () => setNotice(""),
            3000
        );

        return () => window.clearTimeout(timeout);
    }, [notice]);

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
                    filters.date &&
                    row.date !== filters.date
                ) {
                    return false;
                }

                if (
                    filters.description &&
                    !includesNormalized(
                        row.description,
                        filters.description
                    )
                ) {
                    return false;
                }

                if (
                    filters.originAccount &&
                    !includesNormalized(
                        row.originAccount,
                        filters.originAccount
                    )
                ) {
                    return false;
                }

                if (
                    filters.destinationAccount &&
                    !includesNormalized(
                        row.destinationAccount,
                        filters.destinationAccount
                    )
                ) {
                    return false;
                }

                if (filters.value) {
                    const query = normalize(
                        filters.value
                    ).replace(/\s/g, "");

                    const numericValue = Number(row.value);

                    const candidates = [
                        String(numericValue),
                        numericValue.toFixed(2),
                        formatCurrency(numericValue),
                    ].map(normalize);

                    if (
                        !candidates.some((item) =>
                            item.includes(query)
                        )
                    ) {
                        return false;
                    }
                }

                if (
                    filters.paid === "paid" &&
                    !row.paid
                ) {
                    return false;
                }

                if (
                    filters.paid === "pending" &&
                    row.paid
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
                    comparison = String(
                        leftValue
                    ).localeCompare(
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
    }, [filters, month, rows, sort]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredRows.length / pageSize
        )
    );

    const safePage = Math.min(
        page,
        totalPages
    );

    const visibleRows = filteredRows.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize
    );

    useEffect(() => {
        if (page !== safePage) {
            setPage(safePage);
        }
    }, [page, safePage]);

    const hasFilters = Object.values(filters).some(
        Boolean
    );

    const hasDraftFilters =
        Object.values(draftFilters).some(Boolean);

    const hasPendingChanges =
        JSON.stringify(filters) !==
        JSON.stringify(draftFilters);

    const updateFilter = (key, value) => {
        setDraftFilters((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const applyFilters = () => {
        setFilters({
            ...draftFilters,
        });

        setPage(1);
    };

    const clearFilters = () => {
        setFilters(emptyFilters);
        setDraftFilters(emptyFilters);
        setPage(1);
    };

    const changeMonth = (direction) => {
        const nextMonth = new Date(
            month.getFullYear(),
            month.getMonth() + direction,
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

    const replaceTransfer = (transfer) => {
        setRows((current) =>
            current.map((item) =>
                item.id === transfer.id
                    ? transfer
                    : item
            )
        );
    };

    const getTransfer = (id) =>
        rows.find((item) => item.id === id);

    const closeMenu = () => {
        setMenuRowId(null);
        setMenuPosition(null);
    };

    const toggleMenu = (event, transferId) => {
        if (menuRowId === transferId) {
            closeMenu();
            return;
        }

        const rect =
            event.currentTarget.getBoundingClientRect();

        const menuWidth = 276;
        const menuHeight = 430;
        const padding = 12;
        const gap = 8;

        const availableBelow =
            window.innerHeight - rect.bottom;

        const availableAbove = rect.top;

        const placeAbove =
            availableBelow < menuHeight &&
            availableAbove > availableBelow;

        const left = Math.max(
            padding,
            Math.min(
                rect.right - menuWidth,
                window.innerWidth -
                menuWidth -
                padding
            )
        );

        const top = placeAbove
            ? rect.top - gap - menuHeight
            : rect.bottom + gap;

        setMenuRowId(transferId);

        setMenuPosition({
            left,
            top: Math.max(
                padding,
                Math.min(
                    top,
                    window.innerHeight -
                    padding -
                    menuHeight
                )
            ),
        });
    };

    const handleMenuAction = (
        action,
        transfer
    ) => {
        closeMenu();

        switch (action) {
            case "receipt":
                onGenerateReceipt?.(transfer);
                setNotice(
                    "Solicitação de recibo enviada."
                );
                break;

            case "edit":
                setModal({
                    type: "edit",
                    transferId: transfer.id,
                });
                break;

            case "details":
                onViewTransfer?.(transfer);

                setModal({
                    type: "details",
                    transferId: transfer.id,
                });
                break;

            case "attachments":
                setModal({
                    type: "attachments",
                    transferId: transfer.id,
                });
                break;

            case "duplicate":
                duplicateTransfer(transfer);
                break;

            case "move":
                setModal({
                    type: "move",
                    transferId: transfer.id,
                });
                break;

            case "recurring":
                setModal({
                    type: "recurring",
                    transferId: transfer.id,
                });
                break;

            case "installments":
                setModal({
                    type: "installments",
                    transferId: transfer.id,
                });
                break;

            case "delete":
                setModal({
                    type: "delete",
                    transferId: transfer.id,
                });
                break;

            default:
                break;
        }
    };

    const saveTransfer = (updated) => {
        replaceTransfer(updated);
        onEditTransfer?.(updated);

        setModal(null);
        setNotice(
            "Transferência atualizada."
        );
    };

    const updateAttachments = (updated) => {
        replaceTransfer(updated);
        onAttachmentsChange?.(
            updated,
            updated.attachments || []
        );

        setModal({
            type: "attachments",
            transferId: updated.id,
        });
    };

    const duplicateTransfer = (transfer) => {
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

        setNotice(
            "Transferência duplicada."
        );
    };

    const moveTransfer = (updated) => {
        replaceTransfer(updated);

        onMoveTransfer?.(updated);

        setModal(null);

        setNotice(
            "Transferência movida."
        );
    };

    const makeRecurring = (updated) => {
        replaceTransfer(updated);

        onRecurringTransfer?.(updated);

        setModal(null);

        setNotice(
            "Transferência configurada como recorrente."
        );
    };

    const createInstallments = ({
        transfer,
        installments,
        firstDate,
    }) => {
        const totalCents = Math.round(
            Number(transfer.value) * 100
        );

        const baseCents = Math.floor(
            totalCents / installments
        );

        const remainder =
            totalCents % installments;

        const first = new Date(
            `${firstDate}T12:00:00`
        );

        const generated = Array.from(
            { length: installments },
            (_, index) => {
                const date = new Date(
                    first.getFullYear(),
                    first.getMonth() + index,
                    first.getDate()
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
                    installment: {
                        current: index + 1,
                        total: installments,
                    },
                };
            }
        );

        setRows((current) => [
            ...current.filter(
                (item) =>
                    item.id !== transfer.id
            ),
            ...generated,
        ]);

        onInstallmentTransfer?.(
            generated,
            transfer
        );

        setModal(null);

        setNotice(
            `Transferência dividida em ${installments} parcelas.`
        );
    };

    const deleteTransfer = (transfer) => {
        setRows((current) =>
            current.filter(
                (item) =>
                    item.id !== transfer.id
            )
        );

        onDeleteTransfer?.({
            ...transfer,
            deletedAt:
                new Date().toISOString(),
        });

        setModal(null);

        setNotice(
            "Transferência excluída."
        );
    };

    const activeTransfer = modal?.transferId
        ? getTransfer(modal.transferId)
        : null;

    const activeMenuTransfer = menuRowId
        ? getTransfer(menuRowId)
        : null;

    return (
        <main className="transfers-page">
            <section className="transfers">
                <FinanceHeader
                    month={month}
                    onMonthChange={changeMonth}
                    activeTab="transfers"
                    onTabChange={onTabChange}
                />

                <div className="transfers__content">
                    <div className="transfers__table-shell">
                        <div className="transfers__table-scroll">
                            <table className="transfers__table">
                                <thead>
                                    <tr className="transfers__header-row">
                                        <th
                                            scope="col"
                                            aria-sort={
                                                sort.key === "date"
                                                    ? sort.direction ===
                                                        "asc"
                                                        ? "ascending"
                                                        : "descending"
                                                    : "none"
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="transfers__sort-button"
                                                onClick={() =>
                                                    toggleSort("date")
                                                }
                                            >
                                                Data
                                                <span
                                                    className={
                                                        sort.key ===
                                                            "date"
                                                            ? "is-sorted"
                                                            : ""
                                                    }
                                                >
                                                    ↕
                                                </span>
                                            </button>
                                        </th>

                                        <th
                                            scope="col"
                                            aria-sort={
                                                sort.key ===
                                                    "description"
                                                    ? sort.direction ===
                                                        "asc"
                                                        ? "ascending"
                                                        : "descending"
                                                    : "none"
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="transfers__sort-button"
                                                onClick={() =>
                                                    toggleSort(
                                                        "description"
                                                    )
                                                }
                                            >
                                                Descrição
                                                <span
                                                    className={
                                                        sort.key ===
                                                            "description"
                                                            ? "is-sorted"
                                                            : ""
                                                    }
                                                >
                                                    ↕
                                                </span>
                                            </button>
                                        </th>

                                        <th scope="col">
                                            <button
                                                type="button"
                                                className="transfers__sort-button"
                                                onClick={() =>
                                                    toggleSort(
                                                        "originAccount"
                                                    )
                                                }
                                            >
                                                Conta de origem
                                                <span
                                                    className={
                                                        sort.key ===
                                                            "originAccount"
                                                            ? "is-sorted"
                                                            : ""
                                                    }
                                                >
                                                    ↕
                                                </span>
                                            </button>
                                        </th>

                                        <th scope="col">
                                            <button
                                                type="button"
                                                className="transfers__sort-button"
                                                onClick={() =>
                                                    toggleSort(
                                                        "destinationAccount"
                                                    )
                                                }
                                            >
                                                Conta de destino
                                                <span
                                                    className={
                                                        sort.key ===
                                                            "destinationAccount"
                                                            ? "is-sorted"
                                                            : ""
                                                    }
                                                >
                                                    ↕
                                                </span>
                                            </button>
                                        </th>

                                        <th scope="col">
                                            <button
                                                type="button"
                                                className="transfers__sort-button"
                                                onClick={() =>
                                                    toggleSort("value")
                                                }
                                            >
                                                Valor
                                                <span
                                                    className={
                                                        sort.key === "value"
                                                            ? "is-sorted"
                                                            : ""
                                                    }
                                                >
                                                    ↕
                                                </span>
                                            </button>
                                        </th>

                                        <th scope="col">
                                            <button
                                                type="button"
                                                className="transfers__sort-button"
                                                onClick={() =>
                                                    toggleSort("paid")
                                                }
                                            >
                                                Pago?
                                                <span
                                                    className={
                                                        sort.key === "paid"
                                                            ? "is-sorted"
                                                            : ""
                                                    }
                                                >
                                                    ↕
                                                </span>
                                            </button>
                                        </th>

                                        <th
                                            scope="col"
                                            aria-label="Ações"
                                        />
                                    </tr>

                                    <tr
                                        className="transfers__filter-row"
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === "Enter"
                                            ) {
                                                applyFilters();
                                            }
                                        }}
                                    >
                                        <th>
                                            <input
                                                type="date"
                                                value={
                                                    draftFilters.date
                                                }
                                                onChange={(event) =>
                                                    updateFilter(
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
                                                    draftFilters.description
                                                }
                                                onChange={(event) =>
                                                    updateFilter(
                                                        "description",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Pesquisar"
                                                aria-label="Filtrar por descrição"
                                            />
                                        </th>

                                        <th>
                                            <input
                                                type="search"
                                                value={
                                                    draftFilters.originAccount
                                                }
                                                onChange={(event) =>
                                                    updateFilter(
                                                        "originAccount",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Pesquisar"
                                                aria-label="Filtrar por conta de origem"
                                            />
                                        </th>

                                        <th>
                                            <input
                                                type="search"
                                                value={
                                                    draftFilters.destinationAccount
                                                }
                                                onChange={(event) =>
                                                    updateFilter(
                                                        "destinationAccount",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Pesquisar"
                                                aria-label="Filtrar por conta de destino"
                                            />
                                        </th>

                                        <th>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={
                                                    draftFilters.value
                                                }
                                                onChange={(event) =>
                                                    updateFilter(
                                                        "value",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="0,00"
                                                aria-label="Filtrar por valor"
                                            />
                                        </th>

                                        <th>
                                            <div className="transfers__select-wrap">
                                                <select
                                                    value={
                                                        draftFilters.paid
                                                    }
                                                    onChange={(event) =>
                                                        updateFilter(
                                                            "paid",
                                                            event.target.value
                                                        )
                                                    }
                                                    aria-label="Filtrar por status"
                                                >
                                                    <option value="">
                                                        Todos
                                                    </option>

                                                    <option value="paid">
                                                        Pagos
                                                    </option>

                                                    <option value="pending">
                                                        Pendentes
                                                    </option>
                                                </select>

                                                <FaChevronDown />
                                            </div>
                                        </th>

                                        <th>
                                            <div className="transfers__filter-actions">
                                                <button
                                                    type="button"
                                                    className="transfers__apply-filter"
                                                    onClick={applyFilters}
                                                    disabled={
                                                        !hasPendingChanges
                                                    }
                                                    title="Aplicar filtros"
                                                >
                                                    <FaCheck />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="transfers__clear-filter"
                                                    onClick={clearFilters}
                                                    disabled={
                                                        !hasFilters &&
                                                        !hasDraftFilters
                                                    }
                                                    title="Limpar filtros"
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
                                                    key={transfer.id}
                                                >
                                                    <td>
                                                        {formatDate(
                                                            transfer.date
                                                        )}
                                                    </td>

                                                    <td className="transfers__description">
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

                                                    <td className="transfers__value">
                                                        {formatCurrency(
                                                            transfer.value
                                                        )}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className={`transfers__paid ${transfer.paid
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
                                                                    : "Marcar como pago"
                                                            }
                                                            aria-label={
                                                                transfer.paid
                                                                    ? "Transferência efetivada"
                                                                    : "Transferência pendente"
                                                            }
                                                        >
                                                            {transfer.paid ? (
                                                                <span>
                                                                    ✓
                                                                </span>
                                                            ) : (
                                                                <FaRegCircle />
                                                            )}
                                                        </button>
                                                    </td>

                                                    <td className="transfers__actions">
                                                        <button
                                                            type="button"
                                                            className={`transfers__kebab ${menuRowId ===
                                                                    transfer.id
                                                                    ? "is-open"
                                                                    : ""
                                                                }`}
                                                            onClick={(event) =>
                                                                toggleMenu(
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
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="transfers__empty-cell"
                                            >
                                                <div className="transfers__empty">
                                                    <div className="transfers__empty-icon">
                                                        <FaMoneyBillWave />
                                                    </div>

                                                    <h2>
                                                        Nenhuma transferência
                                                        neste período
                                                    </h2>

                                                    <p>
                                                        {hasFilters
                                                            ? "Não encontramos transferências com os filtros aplicados."
                                                            : "Ainda não há transferências registradas neste período."}
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
                                                                onRegisterTransfer?.()
                                                            }
                                                        >
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

                <FinanceFooter
                    currentPage={safePage}
                    totalPages={totalPages}
                    visibleCount={visibleRows.length}
                    totalCount={filteredRows.length}
                    itemLabel="transferências"
                    onPageChange={setPage}
                />
            </section>

            {menuRowId &&
                activeMenuTransfer &&
                menuPosition &&
                typeof document !== "undefined"
                ? createPortal(
                    <TransferActionMenu
                        transfer={
                            activeMenuTransfer
                        }
                        position={menuPosition}
                        onAction={
                            handleMenuAction
                        }
                    />,
                    document.body
                )
                : null}

            {modal?.type === "edit" &&
                activeTransfer && (
                    <TransferEditModal
                        transfer={activeTransfer}
                        onClose={() =>
                            setModal(null)
                        }
                        onSave={saveTransfer}
                    />
                )}

            {modal?.type === "details" &&
                activeTransfer && (
                    <TransferDetailsModal
                        transfer={activeTransfer}
                        onClose={() =>
                            setModal(null)
                        }
                    />
                )}

            {modal?.type === "attachments" &&
                activeTransfer && (
                    <TransferAttachmentsModal
                        transfer={activeTransfer}
                        onClose={() =>
                            setModal(null)
                        }
                        onChange={
                            updateAttachments
                        }
                    />
                )}

            {modal?.type === "move" &&
                activeTransfer && (
                    <TransferMoveModal
                        transfer={activeTransfer}
                        onClose={() =>
                            setModal(null)
                        }
                        onSave={moveTransfer}
                    />
                )}

            {modal?.type === "recurring" &&
                activeTransfer && (
                    <TransferRecurringModal
                        transfer={activeTransfer}
                        onClose={() =>
                            setModal(null)
                        }
                        onSave={makeRecurring}
                    />
                )}

            {modal?.type === "installments" &&
                activeTransfer && (
                    <TransferInstallmentsModal
                        transfer={activeTransfer}
                        onClose={() =>
                            setModal(null)
                        }
                        onSave={
                            createInstallments
                        }
                    />
                )}

            {modal?.type === "delete" &&
                activeTransfer && (
                    <TransferDeleteModal
                        transfer={activeTransfer}
                        onClose={() =>
                            setModal(null)
                        }
                        onConfirm={
                            deleteTransfer
                        }
                    />
                )}

            {notice && (
                <div
                    className="transfers__toast"
                    role="status"
                >
                    {notice}
                </div>
            )}
        </main>
    );
};

export default TransfersList;