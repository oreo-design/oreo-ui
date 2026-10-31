import { ComponentRules } from "@/docs/ComponentRules";
import { treeStepperRules } from "@/components/tree-stepper/rules";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function TreeStepperDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Tree Stepper"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
        { id: "component-rules", label: "Usage rules" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              Tree Stepper
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A long checklist, one branch at a time. Selection opens the
              complete ancestor path and closes sibling branches. Completed and
              flagged checks keep their meaning when you move elsewhere.
            </p>
            <p className="mt-3 text-sm">
              <a href="/security-review" className="underline">
                Open Security Review ↗
              </a>{" "}
              ·{" "}
              <a
                href="https://x.com/FaizalSukaimi/status/2110366307787108463"
                className="underline"
              >
                Reference by Faizal
              </a>
            </p>
          </header>
          <Section
            id="usage"
            title="Usage"
            description="Copy tree-stepper, Icon, Tag and AgentWorkspaceState with Oreo tokens. Uses the installed Base UI Accordion."
          >
            <CodeBlock
              code={
                'import { TreeStepper, getTreeSteps } from "@/components/tree-stepper";\n\nconst nodes = [{ id: "setup", label: "Setup", children: [\n  { id: "profile", label: "Profile" },\n  { id: "team", label: "Team" },\n]}];\n\n<TreeStepper nodes={nodes} value={step} onValueChange={setStep}\n  completed={["profile"]} />\n\n// Depth-first navigation order, excluding disabled nodes.\nconst steps = getTreeSteps(nodes);'
              }
            />
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              This is navigation composed of native leaf buttons and nested Base
              UI accordion headers. Tab visits checks; Enter or Space selects or
              expands. Arrow keys move between sibling accordion headers. It
              does not impersonate an ARIA tree widget. Keyboard changes are
              instant; pointer disclosures use a 200ms height transition, with
              no geometry animation under reduced motion.
            </p>
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "nodes",
                  type: "TreeStepNode[]",
                  desc: "Unique global id, label, optional icon, count, badge, disabled and recursive children.",
                },
                {
                  prop: "value / onValueChange",
                  type: "string / (id: string) => void",
                  desc: "Controlled leaf selection. New selection opens its ancestor path.",
                },
                {
                  prop: "completed / attention",
                  type: "string[]",
                  def: "[]",
                  desc: "Leaf IDs with recorded outcomes. Attention takes visual precedence over complete.",
                },
                {
                  prop: "disabled",
                  type: "boolean",
                  def: "false",
                  desc: "Disables disclosure and step selection.",
                },
                {
                  prop: "label",
                  type: "string",
                  def: "Review steps",
                  desc: "Accessible name for the navigation region.",
                },
                {
                  prop: "getTreeSteps(nodes)",
                  type: "TreeStep[]",
                  desc: "Enabled leaves with parent nodes in depth-first order; use for Previous/Next navigation.",
                },
              ]}
            />
          </Section>
        <ComponentRules rule={treeStepperRules} />
          </>
      )}
    </DocsPage>
  );
}
