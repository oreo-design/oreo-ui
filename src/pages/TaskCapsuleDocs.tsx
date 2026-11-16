import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function TaskCapsuleDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Task Capsule"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "properties", label: "Properties" },
        { id: "rules", label: "States & composition" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold">Task Capsule</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A compact project summary opens into a checklist and a recessed
              action footer. Inspired by the{" "}
              <a
                className="underline"
                href="https://www.pinterest.com/pin/440086194863073715/"
              >
                Pinterest interaction
              </a>{" "}
              posted by Julio Caggiano.
            </p>
            <a
              href="/task-capsule-workspace"
              className="inline-block mt-4 underline"
            >
              Open the complete workspace →
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                'const [items, setItems] = useState(initialItems);\nconst [status, setStatus] = useState<CapsuleStatus>("progress");\n\n<TaskCapsule title="Onboarding flow" items={items} status={status}\n  onItemsChange={setItems} onStatusChange={setStatus}\n  people={team} due="Oct 24" onOpen={openProject} />'
              }
            />
          </Section>
          <Section id="properties" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "TaskCapsule",
                  type: "title, items, status, people?, due?",
                  desc: "The host owns identity, checkbox items, status and member metadata. Completion is derived from items; status never changes the checklist or vice versa.",
                },
                {
                  prop: "Disclosure",
                  type: "open?, defaultOpen?, onOpenChange?",
                  desc: "Controlled or uncontrolled disclosure. The title toggles the checklist. Status has a separate inline disclosure with Escape focus return. Keep at least the title visible and meaningful.",
                },
                {
                  prop: "Actions",
                  type: "onItemsChange, onStatusChange, onOpen?, disabled?",
                  desc: "Change callbacks are controlled. Optional Open launches host-owned details. Disabled blocks disclosure, status, checks and Open; metadata remains readable.",
                },
                {
                  prop: "SegmentedTaskProgress",
                  type: "value, total",
                  desc: "Finite integer counts clamped to total. Zero items shows an empty ring; above 24 items uses 24 proportional segments. Exact count remains available to assistive technology.",
                },
                {
                  prop: "CompactTaskChecklist",
                  type: "items, people?, onChange, disabled?, label?",
                  desc: "Native checkbox labels with optional member identities. Uses the existing Subtask model plus optional assigneeId. No add/remove editor is hidden inside the compact summary.",
                },
                {
                  prop: "TaskStatusChoices",
                  type: "value, onChange, disabled?, label?",
                  desc: "Native radio group for To do, In progress, In review and Done. Arrow keys follow radio conventions. TaskRow labels and palette are reused.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="States, copy and layout">
            <div className="space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Properties are independent: status is a workflow decision,
                completion is a count, and expanded is presentation state. Done
                with unfinished items is allowed, as in the source. Empty
                checklists say “No checklist items yet.” The footer reports
                remaining items or “All done.” A zero-item list is never
                reported as complete.
              </p>
              <p>
                Use concise task and checklist titles; long titles wrap instead
                of clipping. Member names remain accessible even in the
                overlapping group. Due is display copy supplied by the host, not
                a date validator. Provide translated copy in the host when
                adapting this English reference.
              </p>
              <p>
                The face groups summary and checklist; the darker recessed
                footer is part of the same outer card. Shared corners are
                derived from the outer radius and actual inset. The template
                reuses TaskDetailPanel and TaskSubtasks for editing, with
                explicit return focus. Narrow layouts scroll the detail into
                view; filters and search stay immediately responsive.
              </p>
              <p>
                Measured 200ms height disclosure follows the existing
                ConnectionRow recipe. Keyboard actions are immediate; reduced
                motion drops height interpolation. No looping animation,
                hover-only operation, synthetic loading or backend-save claim is
                introduced. These fixtures live in the current tab and reset on
                reload.
              </p>
              <p>
                Use the component for occasional compact project review; use
                existing TaskRow for dense lists and TaskSubtasks for add/remove
                editing. Source status colors are mapped to the existing Oreo
                TaskRow palette so equivalent task states keep one meaning.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
