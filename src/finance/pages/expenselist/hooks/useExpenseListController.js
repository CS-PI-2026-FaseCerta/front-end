import { useCallback, useEffect, useRef, useState } from "react";
import { deleteExpense, getExpense, listExpenses, updateExpense } from "../../../services/despesasService.js";
import { labelFor, PAYMENT_MODES, PAYMENT_TYPES } from "../expenseList.constants.js";
import { parseMonthYearFilter } from "../utils/expenseList.utils.js";

const toUiExpense = (item) => ({
  id: item.id, date: item.data, description: item.descricao, payee: item.pago_a,
  category: item.categoria, value: Number(item.valor), paymentType: labelFor(PAYMENT_TYPES, item.tipo_pagamento),
  paymentTypeValue: item.tipo_pagamento, paymentMode: labelFor(PAYMENT_MODES, item.modo_pagamento),
  paymentModeValue: item.modo_pagamento, paid: Boolean(item.pago), attachments: [],
});
const monthRange = (date) => {
  const y = date.getFullYear(); const m = date.getMonth();
  const first = new Date(y, m, 1); const last = new Date(y, m + 1, 0);
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  return [iso(first), iso(last)];
};

export default function useExpenseListController({ pageSize = 20, onMonthChange } = {}) {
  const [rows, setRows] = useState([]); const [month, setMonth] = useState(() => new Date());
  const [page, setPage] = useState(1); const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [rowsPerPageInput, setRowsPerPageInput] = useState(String(pageSize)); const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1); const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(""); const [menuRowId, setMenuRowId] = useState(null); const [menuPosition, setMenuPosition] = useState(null);
  const [dialog, setDialog] = useState(null); const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [inlineFilters, setInlineFilters] = useState({ date:"", category:"", paymentType:"", paymentMode:"", paid:"" });
  const [advancedFilters, setAdvancedFilters] = useState({ dateFrom:"", dateTo:"" });
  const calculator = { open:false, expression:"", error:"", left:0, top:0, placement:"below" };
  const latestListRequestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++latestListRequestRef.current;
    const [monthStart, monthEnd] = monthRange(month);
    setLoading(true);
    try {
      const data = await listExpenses({ page, limit: rowsPerPage, categoria:inlineFilters.category,
        pago:inlineFilters.paid === "paid" ? true : inlineFilters.paid === "pending" ? false : "",
        tipo_pagamento:inlineFilters.paymentType, modo_pagamento:inlineFilters.paymentMode,
        data_inicial:advancedFilters.dateFrom || monthStart, data_final:advancedFilters.dateTo || monthEnd });
      if (requestId !== latestListRequestRef.current) return;
      const nextTotalPages = Math.max(1, data.totalPages || 1);
      setRows((data.items || []).map(toUiExpense));
      setTotal(data.total || 0);
      setTotalPages(nextTotalPages);
      setPage((current) => Math.min(current, nextTotalPages));
    } catch (error) {
      if (requestId !== latestListRequestRef.current) return;
      setRows([]); setTotal(0); setTotalPages(1); setNotice(error.message);
    } finally {
      if (requestId === latestListRequestRef.current) setLoading(false);
    }
  }, [page, rowsPerPage, month, inlineFilters.category, inlineFilters.paid, inlineFilters.paymentType, inlineFilters.paymentMode, advancedFilters.dateFrom, advancedFilters.dateTo]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!notice) return; const t=setTimeout(()=>setNotice(""),4000); return()=>clearTimeout(t); },[notice]);

  const updateInlineFilter = (key,value) => { setInlineFilters(c=>({...c,[key]:value})); setPage(1); if(key==="date"){ const p=parseMonthYearFilter(value); if(p){const d=new Date(p.year,p.month-1,1);setMonth(d);onMonthChange?.(d);} } };
  const changeMonth = (delta) => { const d=new Date(month.getFullYear(),month.getMonth()+delta,1); setMonth(d);setPage(1);onMonthChange?.(d); };
  const updateAdvancedFilters = (updater) => { setAdvancedFilters(current => typeof updater === "function" ? updater(current) : updater); setPage(1); };
  const clearFilters = () => { setInlineFilters({date:"",category:"",paymentType:"",paymentMode:"",paid:""}); setAdvancedFilters({dateFrom:"",dateTo:""}); setPage(1); };
  const hasFilters = Boolean(inlineFilters.date || inlineFilters.category || inlineFilters.paid || inlineFilters.paymentType || inlineFilters.paymentMode || advancedFilters.dateFrom || advancedFilters.dateTo);
  const commitRowsPerPage = () => { const n=Number(rowsPerPageInput); if(Number.isInteger(n)&&n>0){setRowsPerPage(n);setPage(1);}else setRowsPerPageInput(String(rowsPerPage)); };
  const toggleRowMenu = (event,id) => { if(menuRowId===id){setMenuRowId(null);return;} const r=event.currentTarget.getBoundingClientRect(); const menuHeight=Math.min(430,window.innerHeight-24); const left=Math.max(12,Math.min(r.right-276,window.innerWidth-12-276)); const top=Math.max(12,Math.min(r.bottom+8,window.innerHeight-12-menuHeight));setMenuRowId(id);setMenuPosition({left,top}); };
  const closeMenu=()=>{setMenuRowId(null);setMenuPosition(null)}; const getRow=(id)=>rows.find(r=>r.id===id);
  const openExpenseDialog = async (type, expense) => { closeMenu(); if(type==="edit"){setLoading(true);try{const fresh=toUiExpense(await getExpense(expense.id));setRows(c=>c.map(r=>r.id===fresh.id?fresh:r));setDialog({type,expenseId:fresh.id});}catch(e){setNotice(e.status===404?"Despesa não encontrada.":e.message);}finally{setLoading(false);}}else setDialog({type,expenseId:expense.id}); };
  const handleEditSubmit = async (event,expense) => { event.preventDefault();const f=new FormData(event.currentTarget);const value=Number(f.get("value"));if(!Number.isFinite(value)||value<=0){setNotice("O valor deve ser numérico e maior que zero.");return;} setLoading(true);try{const saved=toUiExpense(await updateExpense(expense.id,{data:f.get("date"),descricao:f.get("description"),pago_a:f.get("payee"),categoria:f.get("category"),valor:value,tipo_pagamento:f.get("paymentType"),modo_pagamento:f.get("paymentMode"),pago:f.get("paid")==="on"}));setRows(c=>c.map(r=>r.id===saved.id?saved:r));setDialog(null);setNotice("Despesa atualizada.");await load();}catch(e){setNotice(e.status===404?"Despesa não encontrada.":e.message);}finally{setLoading(false);} };
  const togglePaid = async (expense) => { try{const saved=toUiExpense(await updateExpense(expense.id,{pago:!expense.paid}));setRows(c=>c.map(r=>r.id===saved.id?saved:r));}catch(e){setNotice(e.message);} };
  const confirmDelete = async (expense) => { setLoading(true);try{await deleteExpense(expense.id);setDialog(null);setNotice("Despesa excluída.");await load();}catch(e){setNotice(e.status===403?"Você não tem autorização para excluir despesas.":e.message);}finally{setLoading(false);} };
  const outOfScope=()=>{closeMenu();setNotice("Ação fora do escopo desta integração.");};
  return {month,page,totalPages,visibleRows:rows,filteredRows:{length:total},rowsPerPageInput,setRowsPerPageInput,commitRowsPerPage,setPage,inlineFilters,updateInlineFilter,clearFilters,hasFilters,calculator,openCalculator:()=>{},closeCalculator:()=>{},updateCalculatorExpression:()=>{},handleCalculatorKey:()=>{},useCalculatorValue:()=>{},menuRowId,menuPosition,toggleRowMenu,activeMenuExpense:getRow(menuRowId),generateReceiptAndClose:outOfScope,openExpenseDialog,duplicateExpense:outOfScope,togglePaid,notice,isAdvancedOpen,setIsAdvancedOpen,advancedFilters,updateAdvancedFilters,openAdvancedFilters:()=>setIsAdvancedOpen(true),dialog,activeExpense:getRow(dialog?.expenseId),setDialog,handleEditSubmit,handleAttachmentAdd:outOfScope,handleAttachmentRemove:outOfScope,submitMove:outOfScope,submitRecurring:outOfScope,submitInstallments:outOfScope,confirmDelete,changeMonth,loading,reload:load};
}
