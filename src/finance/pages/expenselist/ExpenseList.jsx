import React from "react";
import FinancePage from "../../components/page/FinancePage.jsx";
import FinanceTableFooter from "../../components/table/FinanceTableFooter.jsx";
import ExpenseActionMenu from "./components/ExpenseActionMenu.jsx";
import ExpenseAdvancedFilters from "./components/ExpenseAdvancedFilters.jsx";
import ExpenseCalculator from "./components/ExpenseCalculator.jsx";
import ExpenseTable from "./components/ExpenseTable.jsx";
import ExpenseToolbar from "./components/ExpenseToolbar.jsx";
import useExpenseListController from "./hooks/useExpenseListController.js";
import ExpenseDialogs from "./modals/ExpenseDialogs.jsx";
import { formatMonth } from "./utils/expenseList.utils.js";
import "./ExpenseList.css";

const ExpenseList = (props) => {
  const state = useExpenseListController(props);

  return (
    <>
      <FinancePage
        title="FINANCEIRO"
        eyebrow="Financeiro"
        ariaLabel="Financeiro - Despesas"
        className="expense-list-page"
        panelClassName="expense-list"
        footer={(
          <FinanceTableFooter
            visibleCount={state.visibleRows.length}
            totalCount={state.filteredRows.length}
            itemLabel="despesas"
            rowsPerPageInput={state.rowsPerPageInput}
            onRowsPerPageInputChange={state.setRowsPerPageInput}
            onCommitRowsPerPage={state.commitRowsPerPage}
            page={state.page}
            totalPages={state.totalPages}
            onPageChange={state.setPage}
          />
        )}
      >
        <ExpenseToolbar
          monthLabel={formatMonth(state.month)}
          onPreviousMonth={() => state.changeMonth(-1)}
          onNextMonth={() => state.changeMonth(1)}
          onTabChange={props.onTabChange}
          onOpenFilters={state.openAdvancedFilters}
          hasFilters={state.hasFilters}
        />

        <ExpenseTable
          visibleRows={state.visibleRows}
          month={state.month}
          sort={state.sort}
          onSort={state.toggleSort}
          draftInlineFilters={state.draftInlineFilters}
          onInlineFilterChange={state.updateInlineFilter}
          onApplyInlineFilters={state.applyInlineFilters}
          onClearFilters={state.clearFilters}
          hasPendingInlineChanges={state.hasPendingInlineChanges}
          hasFilters={state.hasFilters}
          hasDraftInlineFilters={state.hasDraftInlineFilters}
          calculatorOpen={state.calculator.open}
          onOpenCalculator={state.openCalculator}
          menuRowId={state.menuRowId}
          onToggleRowMenu={state.toggleRowMenu}
          onTogglePaid={state.togglePaid}
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
        expense={state.activeMenuExpense}
        position={state.menuPosition}
        onGenerateReceipt={state.generateReceiptAndClose}
        onEdit={(expense) => state.openExpenseDialog("edit", expense)}
        onDetails={(expense) => state.openExpenseDialog("details", expense)}
        onAttachments={(expense) => state.openExpenseDialog("attachments", expense)}
        onDuplicate={state.duplicateExpense}
        onMove={(expense) => state.openExpenseDialog("move", expense)}
        onRecurring={(expense) => state.openExpenseDialog("recurring", expense)}
        onInstallments={(expense) => state.openExpenseDialog("installments", expense)}
        onDelete={(expense) => state.openExpenseDialog("delete", expense)}
      />

      {state.notice ? (
        <div className="expense-list__toast finance-surface-theme" role="status">
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
};

export default ExpenseList;
