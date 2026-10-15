import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "recipient-search": {
    name: "Recipient Search",
    description:
      "A searchable recipient list with masked account summaries, controlled selection and an inline create entry.",
    code: "<RecipientSearch recipients={recipients} query={query} onQueryChange={setQuery} selectedId={selectedId} onSelect={selectRecipient} onCreate={openForm} creating={formOpen} />",
    rows: [
      {
        prop: "recipients / selectedId",
        type: "Recipient[] / string",
        desc: "Host-owned records and selected identity. Results match name or email. Destinations mask account numbers, IBANs and wallet addresses.",
      },
      {
        prop: "query / onQueryChange",
        type: "string / (query:string) => void",
        desc: "Controlled search text. Results use ordinary native buttons with pressed state and Tab/Enter activation, not a simulated combobox.",
      },
      {
        prop: "onSelect / onCreate",
        type: "(recipient:Recipient) => void / (name:string) => void",
        desc: "Host-owned selection and optional creation. Without creation, no results renders the canonical centered empty state.",
      },
      {
        prop: "creating",
        type: "boolean",
        desc: "Read-only search context while an inline form is open; hides the result list and duplicate create action. Defaults false.",
      },
    ],
  },
  "payment-rail-picker": {
    name: "Payment Rail Picker",
    description:
      "Four accessible radio cards for USD ACH/wire, USD SWIFT, EUR SEPA and USDC destinations.",
    code: "<PaymentRailPicker value={rail} onValueChange={setRail} />",
    rows: [
      {
        prop: "value / onValueChange",
        type: '"ach" | "swift" | "sepa" | "usdc" / callback',
        desc: "Controlled selection with native radio keyboard navigation. Currency labels, marks and a check indicator complement the selected border.",
      },
      {
        prop: "disabled",
        type: "boolean",
        desc: "Disables the fieldset and all options; no payment availability or eligibility is implied by the presentation.",
      },
    ],
  },
  "recipient-form": {
    name: "Recipient Form",
    description:
      "An inline recipient editor that preserves business/individual and payment-rail fields while switching. Validation and focus recovery stay close to each field.",
    code: '<RecipientForm key={editingId ?? "new"} initialName={query} initialValue={editingRecipient} onSave={saveRecipient} onCancel={closeForm} />',
    rows: [
      {
        prop: "initialName / initialValue",
        type: "string / RecipientDraft",
        desc: "Seeds a local draft on mount. InitialValue takes precedence. Remount with a key when changing the edited record. Hidden identity/rail fields are preserved; only active fields are validated.",
      },
      {
        prop: "onSave / onCancel",
        type: "(draft:RecipientDraft) => void / () => void",
        desc: "Save runs required-field and basic format checks then calls the host. Invalid submit focuses the first invalid field. Host owns persistence, dismissal and focus return.",
      },
    ],
  },
};
export function RecipientDocs({ nav }: { nav: DocsNav }) {
  const e =
    entries[nav.active as keyof typeof entries] ?? entries["recipient-search"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", e.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{e.name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {e.description}
            </p>
            <a
              href="/payment-workspace"
              className="mt-4 inline-block text-sm underline"
            >
              Open Payment Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${e.name.replaceAll(" ", "")} } from "@/components/recipient";\n\n${e.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={e.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template reuses TreeStepper, Button, IconButton, Tag and
              AgentWorkspaceState. Five local steps cover recipient, funding
              source, amount, details and review. Earlier edits invalidate later
              completion. Amount parsing retains up to two decimal places for
              USD/EUR or six for USDC without floating-point rounding. The four
              countries and four EVM networks are demo options, not an
              availability list.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Format checks do not validate bank account ownership, routing
              checksums, IBAN checksums, postal addresses, wallet networks or
              payment eligibility. No balances, fees or currency conversion are
              calculated. Data is memory-only and resets on reload; saving
              creates a local draft and never sends money. Production hosts must
              supply their own domain validation and secure persistence.
            </p>
            <a
              href="https://x.com/tikhbana/status/2110486416086159469"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm underline"
            >
              Recipient-flow reference by Atikh Bana ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
