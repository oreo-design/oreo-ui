import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function AuroraAccordionDocs({ nav }: { nav: DocsNav }) {
  const title =
    nav.active === "aurora-surface" ? "Aurora Surface" : "Aurora Accordion";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "Properties" },
        { id: "rules", label: "States, copy & layout" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A question opens into its own softly lit card while the remaining
              rows stay together. Inspired by @stevelauda_’s Aurora Accordion,
              curated by{" "}
              <a
                className="underline"
                href="https://x.com/CollectUI/status/2112000783440814422"
              >
                CollectUI
              </a>
              .
            </p>
            <a
              className="inline-block mt-4 underline text-sm"
              href="/aurora-faq"
            >
              Open the complete FAQ template →
            </a>
          </header>
          <Section
            id="usage"
            title="Usage"
            description="Copy aurora-accordion with Icon, AgentWorkspaceState and Oreo tokens. Uses the installed Base UI Accordion; no new dependency."
          >
            <CodeBlock
              code={
                'import { AuroraAccordion, AuroraSurface } from "@/components/aurora-accordion";\n\n<AuroraAccordion items={questions} value={openId}\n  onValueChange={setOpenId} tone="spectrum" />\n\n<AuroraSurface active tone="mint" className="p-6">\n  Your content\n</AuroraSurface>'
              }
            />
          </Section>
          <Section id="api" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "items",
                  type: "readonly AuroraQuestion[]",
                  desc: "Stable unique nonempty id, question, ReactNode answer, optional semantic icon and disabled. Defaults to five studio fixture questions.",
                },
                {
                  prop: "value / defaultValue / onValueChange",
                  type: "string | null / string | null / callback",
                  desc: "One open question or null. Omitted value is uncontrolled; defaultValue is read on mount. Controlled callers must update value. Missing IDs render closed; a returning ID restores selection.",
                },
                {
                  prop: "tone / animated / disabled",
                  type: "spectrum | mint | neutral / boolean / boolean",
                  desc: "Defaults spectrum / true / false. Independent visual tone, transition permission and input availability. Disabled retains the current answer.",
                },
                {
                  prop: "label / emptyTitle / emptyDescription",
                  type: "string",
                  desc: "Accessible region name and host-localizable empty copy. Defaults Frequently asked questions / No questions yet / Add a question and its answer to get started.",
                },
                {
                  prop: "AuroraSurface: active / tone / animated",
                  type: "boolean / AuroraTone / boolean",
                  desc: "Defaults false / spectrum / true. Native div props including ref, children and className are forwarded. Active controls glow only, without imposing interaction or padding.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="States, copy and layout">
            <div className="space-y-3 text-sm leading-7 text-text-secondary">
              <p>
                Click, touch, Enter or Space toggles an answer. Opening another
                closes the previous one. Base UI owns aria-expanded, panel
                relationships, arrow navigation and Home/End. Focus stays on the
                trigger. Keyboard input is instant; pointer changes animate
                panel height and segment gaps for 220ms. Reduced Motion and
                animated=false remove transitions. No autoplay, artificial
                loading, request or error state.
              </p>
              <p>
                Questions use heading/trigger semantics and wrap without
                truncation. Supply short, specific questions and complete
                plain-language answers. Answers may include links; do not put
                nested controls in question text. Every ID must be unique and
                nonempty. Empty items use the shared AgentWorkspaceState. The
                independent surface is decorative and needs no empty or disabled
                state.
              </p>
              <p>
                Use one accordion region per topic. The 28rem maximum keeps
                answers readable; width shrinks to its host. Active items gain a
                16px separation; adjacent inactive items retain joined corners.
                The full FAQ page adds a real heading, responsive site
                navigation and source credit in normal document flow. No inner
                scroll. Tokens own spacing, radii, type and colors; custom
                gradient proportions and the subtle 24px dot grid reproduce the
                reference artwork. Semantic icon selection follows the shared
                icon library.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
