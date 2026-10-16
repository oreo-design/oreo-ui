import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PropsTable, CodeBlock } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "segment-rule-builder": {
    name: "SegmentRuleBuilder",
    description:
      "Editable typed condition rows with ALL/ANY matching, searchable fields and explicit validation.",
    code: "<SegmentRuleBuilder fields={fields} rules={rules} mode={mode}\n onRulesChange={setRules} onModeChange={setMode} />",
    rows: [
      {
        prop: "fields / rules",
        type: "QueryField[] / QueryCondition[]",
        desc: "Reuses the trace-query schema. Unique rule IDs, compatible operators and valid enum/number values are required.",
      },
      {
        prop: "mode / onModeChange / onRulesChange",
        type: "all | any / callbacks",
        desc: "Controlled state. Field changes reset incompatible operator/value. Up to ten rules can be added in the UI. Empty rules match all active customers.",
      },
    ],
  },
  "segment-preview": {
    name: "SegmentPreview",
    description:
      "A computed segment summary with customer count, MRR, full-month tenure, risk count and leg distribution.",
    code: '<SegmentPreview customers={customers} plans={plans} legs={legs}\n segment={{rules,mode}} today="2026-10-16" />',
    rows: [
      {
        prop: "customers / plans / legs",
        type: "Customer[] / Plan[] / Leg[]",
        desc: "The host owns valid unique IDs and references. Monetary plan amounts are integer cents; monthly recurring revenue excludes inactive and future-start records.",
      },
      {
        prop: "segment / today",
        type: "{rules, mode} / YYYY-MM-DD",
        desc: "Pass an explicit as-of date. Invalid rules return no matches; the template displays validation rather than treating incomplete rules as a valid preview.",
      },
    ],
  },
  "subscription-plan-picker": {
    name: "SubscriptionPlanPicker",
    description:
      "A controlled, keyboard-accessible group of monthly subscription choices.",
    code: "<SubscriptionPlanPicker plans={plans} value={planId}\n onValueChange={setPlanId} />",
    rows: [
      {
        prop: "plans",
        type: "Plan[]",
        desc: "Unique id, name, integer cents and description. Prices use USD formatting.",
      },
      {
        prop: "value / onValueChange / disabled",
        type: "string / callback / boolean",
        desc: "Native radio semantics: Arrow keys choose, Tab enters the group. Disabled state disables every option.",
      },
    ],
  },
  "revenue-target-editor": {
    name: "RevenueTargetEditor",
    description:
      "A monthly MRR target with per-leg allocation that always sums to the target cent.",
    code: '<RevenueTargetEditor value={target} onChange={setTarget}\n customers={customers} plans={plans} legs={legs} today="2026-10-16" />',
    rows: [
      {
        prop: "value / onChange",
        type: "Target / callback",
        desc: "Controlled amount string in USD, month and split toggle. Blank/negative/overprecision amounts and past months are invalid. Host validates before persistence.",
      },
      {
        prop: "customers / plans / legs / today",
        type: "fixture arrays / explicit date",
        desc: "Current MRR determines shares. Largest-remainder rounding preserves total cents; zero MRR splits equally. ARPU gap is an estimate, not a forecast or billing schedule.",
      },
    ],
  },
};
export function SubscriptionOperationsDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["segment-rule-builder"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", s.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{s.name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {s.description}
            </p>
            <a
              href="/subscription-workspace"
              className="mt-4 inline-block text-sm underline"
            >
              Open Subscription Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name} } from "@/components/subscription-operations";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The complete template adds four Base UI dialogs: create/edit
              segment, set revenue target, add customer and add member. Drafts
              commit only on Save; Cancel and Escape discard them and return
              focus. Segment tabs recompute as customers change. A future
              first-payment date does not increase current MRR. Monthly renewal
              dates clamp to the last day of short months. Member legs derive
              from the chosen sponsor; new members start at Platinum.
              Welcome-kit requests are only local metadata. Undo reverses the
              last saved change. All sample data resets on reload; no payment,
              messaging or membership service is connected.
            </p>
            <a
              href="https://x.com/jubayer6910/status/2110770177428058596"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm underline"
            >
              Reference by Jubayer ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
