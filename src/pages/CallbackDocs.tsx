import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function CallbackDocs({ nav }: { nav: DocsNav }) {
  const title =
    nav.active === "callback-priority"
      ? "Callback Priority"
      : nav.active === "callback-board"
        ? "Callback Board"
        : "Callback Card";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Service callbacks with a clear priority, reported date, technician
              and cost. Inspired by Nizam’s operational callback board, using
              Oreo Avatar, Icon, Button and empty states.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/callback-workspace"
            >
              Open Callback Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                nav.active === "callback-priority"
                  ? '<CallbackPriority priority="Critical" />'
                  : nav.active === "callback-board"
                    ? "<CallbackBoard callbacks={callbacks} people={people}\n  onOpen={openDetails} onCreate={createCallback} />"
                    : "<CallbackCard callback={callback} person={technician}\n  onOpen={() => openDetails(callback)} showBranch />"
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                nav.active === "callback-priority"
                  ? [
                      {
                        prop: "priority",
                        type: '"Low" | "Medium" | "High" | "Critical"',
                        desc: "Default Medium. Visible label and four bars; Critical uses the shared error tone.",
                      },
                    ]
                  : nav.active === "callback-board"
                    ? [
                        {
                          prop: "callbacks / people",
                          type: "Callback[] / CallbackPerson[]",
                          desc: "Host-owned records and technician identities. Counts always derive from the supplied records.",
                        },
                        {
                          prop: "stages",
                          type: "CallbackStage[]",
                          desc: "Defaults new, review, scheduled. Include resolved to show closed records.",
                        },
                        {
                          prop: "onOpen / onCreate",
                          type: "(record) => void / (stage) => void",
                          desc: "onOpen required; optional onCreate shows stage add buttons. This board does not implement dragging.",
                        },
                        {
                          prop: "showBranch",
                          type: "boolean",
                          desc: "Default false. Adds the record’s branch to each card.",
                        },
                      ]
                    : [
                        {
                          prop: "callback",
                          type: "Callback",
                          desc: "id, customer, issue, stage, priority, reported (ISO date), cost (USD), ownerId, branch, repeat, awaitingParts and notes.",
                        },
                        {
                          prop: "person",
                          type: "CallbackPerson",
                          desc: "Optional technician id and name. Omission renders Unassigned.",
                        },
                        {
                          prop: "onOpen",
                          type: "() => void",
                          desc: "Required host action. The entire card is one keyboard-operable button.",
                        },
                        {
                          prop: "showBranch",
                          type: "boolean",
                          desc: "Optional branch metadata; default false.",
                        },
                      ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Dates are reported dates, not scheduled appointments. The
              workspace uses an October 6, 2026 snapshot; search, counts, costs
              and age filters derive from the visible local records. Changes
              reset on reload. Details use the same Base UI dialog behavior as
              Project Workspace. No customer contact or real service scheduling
              occurs.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/nizamdesign/status/2110279441683235256"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Nizam ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
