/** Family-owned preview adapters and local export bindings. */
import { InvoiceStatusBadge, InvoiceTable, InvoiceTotals, INVOICE_STATUSES, type InvoiceSortKey } from "@/components/invoice";
import { INITIAL_INVOICES, INVOICE_TODAY } from "@/patterns/invoice-workspace/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"invoice-status-badge": { ...define("Invoice Status Badge",{status:select(INVOICE_STATUSES,"pending")},v=><InvoiceStatusBadge status={v.status}/>),source:"invoice" },
"invoice-table": { ...define("Invoice Table",{compact:toggle(false),empty:toggle(false),sortKey:select(["dueDate","id","status","description","client","amountCents"],"status"),direction:select(["asc","desc"],"asc"),action:text("")},(v,set)=><div className="w-full"><InvoiceTable invoices={v.empty?[]:INITIAL_INVOICES.slice(0,9)} asOf={INVOICE_TODAY} sort={{key:v.sortKey as InvoiceSortKey,direction:v.direction}} onSortChange={sort=>{set("sortKey",sort.key);set("direction",sort.direction);}} compact={v.compact} onAction={(invoice,action)=>set("action",`${invoice.id}: ${action}`)} onClearFilters={()=>set("empty",false)}/><p className="mt-4 text-xs text-text-secondary" role="status">{v.action?`Host callback: ${v.action}`:"Actions emit callbacks in this isolated preview. Open the template to edit invoices."}</p></div>),source:"invoice" },
"invoice-totals": { ...define("Invoice Totals",{empty:toggle(false)},v=><div className="w-full"><InvoiceTotals invoices={v.empty?[]:INITIAL_INVOICES} asOf={INVOICE_TODAY}/></div>),source:"invoice" }
};
const exports = {
"invoice": { InvoiceStatusBadge, InvoiceTable, InvoiceTotals }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "invoice"; spec.exports = exports; }
export default playgrounds;
