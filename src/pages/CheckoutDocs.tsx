import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const docs = {
  "saved-payment-methods": {
    title: "Saved Payment Methods",
    description:
      "Selectable payment identities with separate edit and remove actions. Native radio buttons support keyboard selection without nested controls.",
    code: "<SavedPaymentMethods methods={methods} value={selected}\n  onValueChange={setSelected} onEdit={edit} onRemove={remove} />",
    rows: [
      {
        prop: "methods / value / onValueChange",
        type: "SavedMethod[] / string? / callback",
        desc: "Controlled selection. Store display metadata, never full payment credentials.",
      },
      {
        prop: "onEdit / onRemove / onAdd",
        type: "callbacks?",
        desc: "Host owns editing, removal and empty-state recovery.",
      },
      {
        prop: "disabled / loading / error / onRetry",
        type: "state and callback",
        desc: "Initial row-shaped skeleton, refresh retains rows; explicit failure and empty states.",
      },
    ],
  },
  "discount-code-field": {
    title: "Discount Code Field",
    description:
      "An explicit apply action separates a draft code from an accepted discount. Errors and applied status stay adjacent to the input.",
    code: "<DiscountCodeField value={code} onValueChange={setCode}\n  onApply={apply} applied={acceptedCode} error={error} onRemove={clear} />",
    rows: [
      {
        prop: "value / onValueChange / onApply",
        type: "controlled props",
        desc: "Host validates codes. Enter invokes apply. Editing should invalidate the accepted code.",
      },
      {
        prop: "applied / error / disabled / onRemove",
        type: "state and callback",
        desc: "Accepted code, readable error, disabled controls and optional removal.",
      },
    ],
  },
  "checkout-summary": {
    title: "Checkout Summary",
    description:
      "Item, period, discount, tax and due-today totals in a reusable checkout panel. A named tax basis makes the arithmetic clear.",
    code: '<CheckoutSummary item="4 × Pro licenses (annual)"\n  period="12 months · billed annually"\n  quote={quoteCheckout(11520, 4, 2000, 1000)}\n  action={<Button onClick={confirm}>Confirm demo upgrade</Button>} />',
    rows: [
      {
        prop: "item / period / title",
        type: "string",
        desc: "Accessible summary title and readable purchase description.",
      },
      {
        prop: "quote",
        type: "CheckoutQuote",
        desc: "Integer cents from quoteCheckout. Rates use basis points; tax basis is subtotal or discounted.",
      },
      {
        prop: "children / action",
        type: "ReactNode",
        desc: "Optional discount field and host-owned confirmation action.",
      },
    ],
  },
};
export function CheckoutDocs({ nav }: { nav: DocsNav }) {
  const doc =
    docs[nav.active as keyof typeof docs] ?? docs["saved-payment-methods"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", doc.title]}
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
              {doc.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {doc.description}
            </p>
            <a
              href="/plan-upgrade"
              className="mt-4 inline-block text-sm underline"
            >
              Open Plan Upgrade ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock code={doc.code} />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={doc.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Import from @/components/checkout. Plan Upgrade composes these
              components with Oreo Button, IconButton, Avatar, Tag, StepProgress
              and AgentWorkspaceState. All actions use local sample state;
              nothing is charged, uploaded or persisted.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The default sample is 4 annual seats at $115.20 each, FRIENDS at
              20% off and demo tax at 10% of the original subtotal, producing
              $414.72. This reproduces the reference arithmetic, not a tax rule.
              Set taxBasis to discounted when your host requires it. Invalid
              amounts and rates throw RangeError. Apply discount validation in
              the host; never trust client totals for a real charge.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              SavedMethod contains only a display name, network, last four
              digits and expiry (or wallet identity). Production payment fields
              belong to your payment provider. Demo imports use metadata only.
              The source is static, so no source animation is inferred or added.
            </p>
            <a
              href="https://x.com/jordanphughes/status/2110767174008574457"
              className="mt-4 inline-block text-sm underline"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Jordan Hughes ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
