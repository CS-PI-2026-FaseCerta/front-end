import React from "react";
import FinancePage from "../../components/page/FinancePage.jsx";
import FinanceTableFooter from "../../components/table/FinanceTableFooter.jsx";
import TransferActionMenu from "./components/TransferActionMenu.jsx";
import TransferAdvancedFilters from "./components/TransferAdvancedFilters.jsx";
import TransferTable from "./components/TransferTable.jsx";
import TransferToolbar from "./components/TransferToolbar.jsx";
import useTransferListController from "./hooks/useTransferListController.js";
import TransferDialogs from "./modals/TransferDialogs.jsx";
import { formatMonth } from "./utils/transferList.utils.js";
import "./TransfersList.css";

const TransfersList = (props) => {
    const state =
        useTransferListController(
            props,
        );

    return (
        <>
            <FinancePage
                title="FINANCEIRO"
                eyebrow="Financeiro"
                ariaLabel="Financeiro - Transferências"
                className="transfers-list-page"
                panelClassName="transfers-list"
                footer={
                    <FinanceTableFooter
                        visibleCount={
                            state.visibleRows
                                .length
                        }
                        totalCount={
                            state.filteredRows
                                .length
                        }
                        itemLabel="transferências"
                        rowsPerPageInput={
                            state.rowsPerPageInput
                        }
                        onRowsPerPageInputChange={
                            state.setRowsPerPageInput
                        }
                        onCommitRowsPerPage={
                            state.commitRowsPerPage
                        }
                        page={state.page}
                        totalPages={
                            state.totalPages
                        }
                        onPageChange={
                            state.setPage
                        }
                    />
                }
            >
                <TransferToolbar
                    monthLabel={formatMonth(
                        state.month,
                    )}
                    onPreviousMonth={() =>
                        state.changeMonth(
                            -1,
                        )
                    }
                    onNextMonth={() =>
                        state.changeMonth(
                            1,
                        )
                    }
                    onTabChange={
                        props.onTabChange
                    }
                    onOpenFilters={
                        state.openAdvancedFilters
                    }
                    hasFilters={
                        state.hasFilters
                    }
                />

                <TransferTable
                    visibleRows={
                        state.visibleRows
                    }
                    month={state.month}
                    sort={state.sort}
                    onSort={
                        state.toggleSort
                    }
                    inlineFilters={
                        state.inlineFilters
                    }
                    onInlineFilterChange={
                        state.updateInlineFilter
                    }
                    onClearFilters={
                        state.clearFilters
                    }
                    hasFilters={
                        state.hasFilters
                    }
                    menuRowId={
                        state.menuRowId
                    }
                    onToggleRowMenu={
                        state.toggleRowMenu
                    }
                    onTogglePaid={
                        state.togglePaid
                    }
                    onRegisterTransfer={
                        props.onRegisterTransfer
                    }
                />

                <TransferAdvancedFilters
                    isOpen={
                        state.isAdvancedOpen
                    }
                    values={
                        state.advancedFilters
                    }
                    onChange={
                        state.setAdvancedFilters
                    }
                    onClear={
                        state.clearFilters
                    }
                    onClose={() =>
                        state.setIsAdvancedOpen(
                            false,
                        )
                    }
                />
            </FinancePage>

            <TransferActionMenu
                transfer={
                    state.activeMenuTransfer
                }
                position={
                    state.menuPosition
                }
                onGenerateReceipt={
                    state.generateReceiptAndClose
                }
                onEdit={(transfer) =>
                    state.openTransferDialog(
                        "edit",
                        transfer,
                    )
                }
                onDetails={(transfer) =>
                    state.openTransferDialog(
                        "details",
                        transfer,
                    )
                }
                onAttachments={(transfer) =>
                    state.openTransferDialog(
                        "attachments",
                        transfer,
                    )
                }
                onDuplicate={
                    state.duplicateTransfer
                }
                onMove={(transfer) =>
                    state.openTransferDialog(
                        "move",
                        transfer,
                    )
                }
                onRecurring={(transfer) =>
                    state.openTransferDialog(
                        "recurring",
                        transfer,
                    )
                }
                onInstallments={(transfer) =>
                    state.openTransferDialog(
                        "installments",
                        transfer,
                    )
                }
                onDelete={(transfer) =>
                    state.openTransferDialog(
                        "delete",
                        transfer,
                    )
                }
            />

            {state.notice ? (
                <div
                    className="transfers-list__toast finance-surface-theme"
                    role="status"
                >
                    {state.notice}
                </div>
            ) : null}

            <TransferDialogs
                dialog={state.dialog}
                transfer={
                    state.activeTransfer
                }
                onClose={() =>
                    state.setDialog(
                        null,
                    )
                }
                onEditSubmit={
                    state.handleEditSubmit
                }
                onAttachmentAdd={
                    state.handleAttachmentAdd
                }
                onAttachmentRemove={
                    state.handleAttachmentRemove
                }
                onMoveSubmit={
                    state.submitMove
                }
                onRecurringSubmit={
                    state.submitRecurring
                }
                onInstallmentsSubmit={
                    state.submitInstallments
                }
                onDeleteConfirm={
                    state.confirmDelete
                }
            />
        </>
    );
};

export default TransfersList;