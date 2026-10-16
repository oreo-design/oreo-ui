import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "agent-run-card": {
    name: "Agent Run Card",
    description:
      "A run summary with explicit status, elapsed time, query and tool counts, plus a controlled activity disclosure.",
    code: "<AgentRunCard run={run} expanded={open}\n  onExpandedChange={setOpen} onStatusChange={requestStatus} />",
    rows: [
      {
        prop: "run",
        type: "InboxRun",
        desc: "Unique id, title, summary, status (waiting / failed / running / done), elapsed seconds, query/tool counts, model and activity.",
      },
      {
        prop: "expanded / onExpandedChange",
        type: "boolean / callback",
        desc: "Host-owned disclosure. Without callback, title is static. The expanded state reveals the complete summary and run activity.",
      },
      {
        prop: "onStatusChange / handle",
        type: "callback / ReactNode",
        desc: "Optional status request and drag-handle slot. Native select gives an accessible alternative to dragging; host is responsible for permission, validation and actual execution.",
      },
    ],
  },
  "agent-run-activity": {
    name: "Agent Run Activity",
    description:
      "A compact, readable timeline of model activity with a quiet time column and a final-step marker.",
    code: '<AgentRunActivity model="Review agent · Pro" items={activity} />',
    rows: [
      {
        prop: "model",
        type: "string",
        desc: "Model or agent identity, supplied by the host.",
      },
      {
        prop: "items",
        type: "RunActivity[]",
        desc: "Ordered entries with unique id, readable text and formatted time. No implicit sorting, timers or network fetching. Empty arrays show No activity yet.",
      },
    ],
  },
  "agent-inbox-board": {
    name: "Agent Inbox Board",
    description:
      "Three status groups with synchronized board/list views, expandable run cards and cancellable cross-group dragging.",
    code: "<AgentInboxBoard runs={runs} view={view} onViewChange={setView}\n  expandedId={expandedId} onExpandedChange={setExpandedId}\n  onStatusChange={requestStatus} />",
    rows: [
      {
        prop: "runs",
        type: "InboxRun[]",
        desc: "Unique IDs required. Waiting and failed runs share Needs you. The host filters before passing runs; counts describe the supplied subset.",
      },
      {
        prop: "view / onViewChange",
        type: "board | list / callback",
        desc: "Controlled presentation of the same data. Board stacks at narrow widths; no horizontal page overflow.",
      },
      {
        prop: "expandedId / onExpandedChange",
        type: "string | null / callback",
        desc: "Controlled expanded card. Click, Enter or Space reveal complete history and native status selection.",
      },
      {
        prop: "onStatusChange",
        type: "(id, status) => void",
        desc: "Host-owned mutation request. Pointer/touch drag commits only on valid cross-group drop; Escape cancels. Dropping into Needs you requests waiting. It does not reorder within a group. Keyboard users use the expanded status menu. Read-only when omitted.",
      },
      {
        prop: "loading / error / onRetry",
        type: "boolean / string / callback",
        desc: "Content-shaped initial loading; refresh retains runs with aria-busy and disables status changes. Failure uses the shared explicit error state and optional retry.",
      },
      {
        prop: "filtered / onClearFilters",
        type: "boolean / callback",
        desc: "Distinguishes no matching runs from an empty inbox, with an optional clear action.",
      },
    ],
  },
};
export function AgentInboxDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["agent-inbox-board"];
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
              className="mt-4 inline-block text-sm underline"
              href="/agent-inbox"
            >
              Open Agent Inbox ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name.replaceAll(" ", "")} } from "@/components/agent-inbox";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template runs entirely on sample data. Approve, retry, mark
              done, reopen and manual moves update local status/history; no
              production systems or agents are called. Timings are fixed sample
              durations. One-step undo restores the previous data snapshot;
              reload resets everything. Pointer movement uses transform-based
              layout settling; keyboard changes and reduced-motion preference
              settle immediately. Details use explicit disclosure instead of
              hover-only expansion.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/componest/status/2110750797755773328"
              target="_blank"
              rel="noreferrer"
            >
              Reference: @flohoeller via Componest ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
