import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "spend-limit-chart": {
    name: "Spend Limit Chart",
    component: "SpendLimitChart",
    description:
      "Daily spend split into within-limit and over-limit amounts, with keyboard inspection and an exact data table.",
    code: "<SpendLimitChart days={days} dailyLimitCents={7000} />",
    rows: [
      {
        prop: "days",
        type: "SpendDay[]",
        desc: "Unique id, display label and non-negative integer cents. USD only. Invalid data displays an error instead of silently omitting it.",
      },
      {
        prop: "dailyLimitCents",
        type: "number",
        desc: "Non-negative integer cents; zero means all spending is over the reporting threshold. This does not enforce a spending cap.",
      },
    ],
  },
  "secret-field": {
    name: "Secret Field",
    component: "SecretField",
    description:
      "A masked, read-only secret with reveal, hide and asynchronous copy feedback.",
    code: '<SecretField value="demo_only_example" label="API key" />',
    rows: [
      {
        prop: "value / label",
        type: "string / string?",
        desc: "The host owns secret lifetime. Changing value resets reveal and copy state. Masking is presentation only; the value remains in browser memory.",
      },
      {
        prop: "onCopy",
        type: "(value: string) => Promise<void>",
        desc: "Defaults to navigator.clipboard.writeText. Resolve only after success; rejection gives an explicit manual-copy fallback.",
      },
    ],
  },
  "api-key-table": {
    name: "API Key Table",
    component: "ApiKeyTable",
    description:
      "Key metadata, permission badges, last-used timestamps and host-owned row actions. Full secrets never belong in this table.",
    code: "<ApiKeyTable keys={keys} actions={key => <RevokeAction keyId={key.id} />} />",
    rows: [
      {
        prop: "keys",
        type: "ApiKeyRecord[]",
        desc: "id, name, permission (Read only, Send only, Full access), suffix, lastUsed, optional revoked. Only the final four suffix characters render.",
      },
      {
        prop: "actions",
        type: "(key: ApiKeyRecord) => ReactNode",
        desc: "Optional host-owned actions. The template composes InlineConfirm for deliberate revocation. Empty data reuses AgentWorkspaceState.",
      },
    ],
  },
};
export function SupportConsoleDocs({ nav }: { nav: DocsNav }) {
  const entry =
    entries[nav.active as keyof typeof entries] ?? entries["spend-limit-chart"];
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
              href="/support-console"
              className="mt-4 inline-block text-sm underline"
            >
              Open Support Console ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${entry.component} } from "@/components/support-console";\n\n${entry.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={entry.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The complete template reuses InboxNotification, Attachment,
              ToolCall, EmailDraft, BudgetMeter and InlineConfirm. Base UI owns
              tab navigation, dialog focus and dismissal. All data is local to
              the demo: no messages, refunds, usage limits or real API
              credentials are changed. New keys are visibly demo-only; the full
              value is discarded when the creation dialog closes. Reload
              restores fixtures.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Values map to Oreo background, border, palette and status tokens.
              Chart heights and geometry are custom because existing miniature
              bars do not support absolute daily amounts split at a limit. No
              new timed entrance animation is introduced.
            </p>
            <a
              href="https://x.com/arlanoska/status/2110824051912683637"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm underline"
            >
              Video reference by arlan ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
