import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function AgentHandoffDocs({ nav }: { nav: DocsNav }) {
  const composer = nav.active === "agent-mention-composer";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={[
        "Components",
        composer ? "Agent Mention Composer" : "Agent Session Card",
      ]}
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
              {composer ? "Agent Mention Composer" : "Agent Session Card"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {composer
                ? "Turn a work item comment into an agent handoff with a controlled mention and caret-aware suggestions."
                : "Keep agent progress, clarification, recovery and a reviewable result beside the work that started it."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/engineering-handoff"
            >
              Open Engineering Handoff ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                composer
                  ? 'import { AgentMentionComposer } from "@/components/agent-handoff";\n\n<AgentMentionComposer agents={agents} agentId={agentId} onAgentChange={setAgentId} onSend={sendCommentOrDelegate} />'
                  : 'import { AgentSessionCard } from "@/components/agent-handoff";\n\n<AgentSessionCard agent="Claude" status="awaiting" messages={messages} reply={<CommentComposer onSend={reply} />} onStop={stop} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                composer
                  ? [
                      {
                        prop: "agents / agentId / onAgentChange",
                        type: "HandoffAgent[] / string / callback",
                        desc: "Unique agent IDs, names, descriptions and availability; one controlled selected agent. Empty ID means an ordinary comment. Unavailable agents cannot be selected.",
                      },
                      {
                        prop: "onSend",
                        type: "(body, agentId) => void | Promise<void>",
                        desc: "Trimmed text of 1–2,000 characters. Pending sends block duplicates. Rejections retain the draft and show an error. Host owns connection and active-session validation.",
                      },
                      {
                        prop: "disabled",
                        type: "boolean",
                        desc: "Disables input and controls without clearing the draft.",
                      },
                    ]
                  : [
                      {
                        prop: "agent / status / messages",
                        type: "string / HandoffStatus / ThreadComment[]",
                        desc: "Controlled lifecycle and shared comment rows. States: idle, analyzing, awaiting, implementing, review, completed, failed and stopped.",
                      },
                      {
                        prop: "reply / result / resultTitle",
                        type: "ReactNode / ReactNode / string",
                        desc: "Host-owned reply form and result content. Optional resultTitle defaults to Execution result. Result uses the canonical AgentResultCard disclosure and appears only in review/completed states.",
                      },
                      {
                        prop: "onStop / onRetry / loading",
                        type: "callback / callback / boolean",
                        desc: "Actions exist only when supplied and relevant. Failed and stopped sessions reuse AgentWorkspaceState; loading shows a static skeleton.",
                      },
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Type @ and use arrow keys, Enter and Escape to select an agent;
              Cmd/Ctrl + Enter sends. Selection removes only the active mention
              query and preserves surrounding prose. The listbox keeps focus in
              the textarea. Use plain comments for context and the session reply
              composer for clarification.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Engineering Handoff includes local comments, activity filters,
              connection and failure fixtures, stop/retry, review feedback,
              completion and JSON export. Timer events carry session and attempt
              IDs so stale work cannot complete a stopped or newer session. New
              session clears the old run; export it first to retain a copy. Data
              resets on reload. The sample patch and review checklist are
              illustrative: no code execution, agent connection or remote pull
              request is performed.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/planepowers/status/2110763968792780851"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Plane ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
