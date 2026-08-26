import React from "react";
import FinancePage from "../../components/page/FinancePage.jsx";
import FinanceTableFooter from "../../components/table/FinanceTableFooter.jsx";
import ExpenseActionMenu from "../expenselist/components/ExpenseActionMenu.jsx";
import ExpenseAdvancedFilters from "../expenselist/components/ExpenseAdvancedFilters.jsx";
import ExpenseCalculator from "../expenselist/components/ExpenseCalculator.jsx";
import ExpenseDialogs from "../expenselist/modals/ExpenseDialogs.jsx";
import ReceiptTable from "./components/ReceiptTable.jsx";
import ReceiptToolbar from "./components/ReceiptToolbar.jsx";
import useReceipListController from "./hooks/useReceipListController.js";
import "./ReceipList.css";

export default function ReceipList(props) {
  const state = useReceipListController(props);
  return (
    <>
      <FinancePage
        title="FINANCEIRO"
        eyebrow="Financeiro"
        ariaLabel="Financeiro - Recebimentos"
        className="receipt-list-page"
        panelClassName="expense-list"
        footer={
          <FinanceTableFooter
            visibleCount={state.visibleRows.length}
            totalCount={state.filteredRows.length}
            itemLabel="recebimentos"
            rowsPerPageInput={state.rowsPerPageInput}
            onRowsPerPageInputChange={state.setRowsPerPageInput}
            onCommitRowsPerPage={state.setPageSize}
            page={state.page}
            totalPages={state.totalPages}
            onPageChange={state.setPage}
          />
        }
      >
        <ReceiptToolbar
          monthLabel={state.formatMonth(state.month)}
          onPreviousMonth={() => state.changeMonth(-1)}
          onNextMonth={() => state.changeMonth(1)}
          onTabChange={props.onTabChange}
          onOpenFilters={state.openAdvancedFilters}
          hasFilters={state.hasFilters}
        />
        <ReceiptTable
          {...state}
          onSort={state.toggleSort}
          onInlineFilterChange={state.updateInlineFilter}
          onClearFilters={state.clearFilters}
          onOpenCalculator={state.openCalculator}
          onToggleRowMenu={state.toggleRowMenu}
        />
      </FinancePage>
      <ExpenseCalculator
        calculator={state.calculator}
        onClose={state.closeCalculator}
        onExpressionChange={state.updateCalculatorExpression}
        onKey={state.handleCalculatorKey}
        onUseValue={state.useCalculatorValue}
      />
      <ExpenseActionMenu
        isReceipt={true}
        expense={state.activeMenuExpense}
        position={state.menuPosition}
        onGenerateReceipt={state.generateReceiptAndClose}
        onEdit={(row) => state.openExpenseDialog("edit", row)}
        onDetails={(row) => state.openExpenseDialog("details", row)}
        onAttachments={(row) => state.openExpenseDialog("attachments", row)}
        onDuplicate={state.duplicateExpense}
        onMove={(row) => state.openExpenseDialog("move", row)}
        onRecurring={(row) => state.openExpenseDialog("recurring", row)}
        onInstallments={(row) => state.openExpenseDialog("installments", row)}
        onDelete={(row) => state.openExpenseDialog("delete", row)}
      />
      {state.notice ? (
        <div
          className="expense-list__toast finance-surface-theme"
          role="status"
        >
          {state.notice}
        </div>
      ) : null}
      <ExpenseAdvancedFilters
        isOpen={state.isAdvancedOpen}
        values={state.advancedFilters}
        onChange={state.setAdvancedFilters}
        onClear={state.clearFilters}
        onClose={() => state.setIsAdvancedOpen(false)}
      />
      <ExpenseDialogs
        isReceipt={true}
        dialog={state.dialog}
        expense={state.activeExpense}
        onClose={() => state.setDialog(null)}
        onEditSubmit={state.handleEditSubmit}
        onAttachmentAdd={state.handleAttachmentAdd}
        onAttachmentRemove={state.handleAttachmentRemove}
        onMoveSubmit={state.submitMove}
        onRecurringSubmit={state.submitRecurring}
        onInstallmentsSubmit={state.submitInstallments}
        onDeleteConfirm={state.confirmDelete}
      />
    </>
  );
}
