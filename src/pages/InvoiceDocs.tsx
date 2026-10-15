import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const docs: Record<
  string,
  {
    title: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "invoice-status-badge": {
    title: "Invoice Status Badge",
    description:
      "A small payment-state label composed from the canonical Oreo Tag. Text remains the primary status signal.",
    code: '<InvoiceStatusBadge status="pending" />',
    rows: [
      {
        prop: "status",
        type: "InvoiceStatus",
        desc: "pending, overdue, cancelled, paid or draft. Pending uses orange, paid mint, cancelled pink; overdue and draft remain neutral like the reference.",
      },
    ],
  },
  "invoice-table": {
    title: "Invoice Table",
    description:
      "A compact, sortable invoice table with gradient customer avatars, payment states and keyboard-accessible row actions.",
    code: '<InvoiceTable invoices={invoices} asOf="2026-10-15"\n  sort={sort} onSortChange={setSort}\n  onAction={handleAction} onClearFilters={clearFilters} />',
    rows: [
      {
        prop: "invoices",
        type: "Invoice[]",
        desc: "id, client, description, dueDate (YYYY-MM-DD), amountCents (positive safe integer), status (draft/pending/paid/cancelled), optional gradient avatar and notes. All amounts are EUR.",
      },
      {
        prop: "asOf",
        type: "string",
        desc: "Required valid ISO date. Pending invoices with an earlier dueDate display Overdue; other lifecycle states keep their status.",
      },
      {
        prop: "sort / onSortChange",
        type: "InvoiceSort / callback",
        desc: "Controlled column and direction. Table sorts a copy; ties resolve by ID. Status order: Pending, Overdue, Cancelled, Paid, Draft. Headers expose aria-sort.",
      },
      {
        prop: "onAction",
        type: "(invoice, action, trigger) => void",
        desc: "open, paid, duplicate or delete. The component emits callbacks; the host owns data changes and confirmation. Trigger is supplied for dialog return focus.",
      },
      {
        prop: "compact",
        type: "boolean",
        desc: "Hides due date/description and reduces row height. Remaining columns stay horizontally scrollable on narrow screens.",
      },
      {
        prop: "onClearFilters",
        type: "() => void",
        desc: "Optional recovery action in the shared empty state. Search and filtering are owned by the host.",
      },
    ],
  },
  "invoice-totals": {
    title: "Invoice Totals",
    description:
      "Four derived totals for a local billing overview. Outstanding includes overdue invoices, so the cards are not mutually exclusive.",
    code: '<InvoiceTotals invoices={invoices} asOf="2026-10-15" />',
    rows: [
      {
        prop: "invoices",
        type: "Invoice[]",
        desc: "Same invoice model and EUR cents as InvoiceTable. Host supplies the filtered or complete dataset intentionally.",
      },
      {
        prop: "asOf",
        type: "string",
        desc: "Explicit ISO snapshot date for overdue detection. Empty data displays zero amounts and counts; cancelled invoices do not contribute to the four cards.",
      },
    ],
  },
};
export function InvoiceDocs({ nav }: { nav: DocsNav }) {
  const item = docs[nav.active] ?? docs["invoice-table"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", item.title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {item.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {item.description}
            </p>
            <a
              href="/invoice-workspace"
              className="mt-4 inline-block text-sm underline"
            >
              Open Invoice Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${item.title.replaceAll(" ", "")} } from "@/components/invoice";\n\n${item.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={item.rows} />
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              The complete template provides List, Board, Simple and Overview
              views over the same local dataset, plus filtering, edits, draft
              duplication, deletion/undo and safe CSV export. Data resets on
              reload. No invoices, reminders or payments are sent. Board cards
              open the same editor; status changes are explicit, not
              drag-and-drop.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Search, sorting and view changes are immediate. Menus reuse Oreo
              Menu and preserve the local theme. Dialogs use Base UI focus
              trapping, Escape and return focus; a stable create button receives
              focus if a filtered or deleted trigger no longer exists.
            </p>
            <a
              href="https://x.com/louisnstudio/status/2110442646607122924"
              className="mt-4 inline-block text-sm underline"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Louis ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
