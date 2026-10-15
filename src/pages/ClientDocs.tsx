import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "client-summary": {
    name: "Client Summary",
    description:
      "Company identity and compact facts, with shared status tags and host-supplied project and revenue totals.",
    code: "<ClientSummary client={client} projectCount={6} activeProjects={3} revenueCents={7970000} />",
    rows: [
      {
        prop: "client",
        type: "ClientProfile",
        desc: "Company name, industry, specialty, taxId, teamSize and active state. Contact fields are shared with ClientContactStrip.",
      },
      {
        prop: "projectCount / activeProjects / revenueCents",
        type: "number",
        desc: "Host-derived totals. Revenue is an integer minor-unit amount; the workspace derives it from paid invoices.",
      },
      {
        prop: "currency",
        type: '"USD" | "EUR"',
        desc: "Default USD. Currency used to format paid revenue.",
      },
    ],
  },
  "client-contact-strip": {
    name: "Client Contact Strip",
    description:
      "A responsive definition list for location, website, email, phone and account owner. Long values wrap without hiding contact information.",
    code: "<ClientContactStrip client={client} />",
    rows: [
      {
        prop: "client",
        type: "ClientProfile",
        desc: "Uses location, website, email, phone and owner. Empty values display Not provided. Values are rendered as text, not links that send messages or open destinations.",
      },
    ],
  },
  "client-finance-summary": {
    name: "Client Finance Summary",
    description:
      "Invoiced, paid, outstanding and next-payment totals derived from a single invoice dataset.",
    code: '<ClientFinanceSummary invoices={invoices} asOf="2026-01-16" currency="USD" />',
    rows: [
      {
        prop: "invoices",
        type: "Invoice[]",
        desc: "Positive safe-integer amountCents and valid ISO dates. Invoiced includes paid and pending; drafts and cancellations are excluded. Outstanding includes overdue.",
      },
      {
        prop: "asOf",
        type: "string",
        desc: "Explicit ISO snapshot date. Next payment selects the earliest pending due date on or after the snapshot, with ID as the tie-breaker; older pending invoices count as overdue.",
      },
      {
        prop: "currency",
        type: '"USD" | "EUR"',
        desc: "Default USD. Empty datasets show zero totals and no upcoming payment. All invoices must use one currency; no conversion is performed.",
      },
    ],
  },
};
export function ClientDocs({ nav }: { nav: DocsNav }) {
  const entry =
    entries[nav.active as keyof typeof entries] ?? entries["client-summary"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", entry.name]}
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
              {entry.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {entry.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/client-workspace"
            >
              Open Client Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${entry.name.replaceAll(" ", "")} } from "@/components/client";\n\n${entry.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={entry.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Client Workspace combines these components with the existing
              InvoiceTable, Avatar, Tag, Button, Menu and shared empty state.
              Six sections share local sample data: Financial, Projects,
              Documents, Contacts, Activity and Notes. Invoices support
              create/edit, marking as paid, draft duplication, deletion and
              undo. Duplicate drafts are created only when saved. Search and
              status filters affect the table, while summary cards show all
              client invoices. Tabs support arrow, Home and End keys. The editor
              uses Base UI focus trapping, Escape and return focus. Data resets
              on reload; no invoice, payment or message is sent.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The reference supplies the composition, not a verified financial
              ledger. Amounts in this template are calculated from the sample
              invoices at the explicit January 16, 2026 snapshot. Project counts
              are calculated from the six local projects. Existing Invoice
              Workspace still defaults to EUR.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/Tanjim38/status/2110407786957795338"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Tanjim ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
