import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function BrowserSessionDocs({ nav }: { nav: DocsNav }) {
  const tabs = nav.active === "browser-session-tabs",
    title = tabs ? "Browser Session Tabs" : "Browser Control Bar";
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
              {tabs
                ? "Keep the working browser tab visible, even when another view is selected. A shared pixel signal replaces the favicon during activity; a subtle light beneath the tab reinforces the state."
                : "Show who owns the browser and keep pause, takeover and recovery actions close to the current activity."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/browser-agent"
            >
              Open Browser Agent ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                tabs
                  ? 'import { BrowserSessionTabs } from "@/components/browser-session";\n\n<BrowserSessionTabs tabs={tabs} value={selected} onValueChange={setSelected}\n  onClose={closeTab} onAdd={openTab}\n  renderPanel={tab => <PageContent tab={tab} />} />'
                  : 'import { BrowserControlBar } from "@/components/browser-session";\n\n<BrowserControlBar status={run.status} action="reading" target="Browser guide"\n  onPause={pause} onResume={resume} onTakeOver={takeOver}\n  onReturnControl={returnControl} onStop={stop} onRetry={retry} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                tabs
                  ? [
                      {
                        prop: "tabs",
                        type: "BrowserTab[]",
                        desc: "Unique id, title, optional icon, closable and activity { status, action }. Empty arrays show the shared recoverable empty state.",
                      },
                      {
                        prop: "value / onValueChange",
                        type: "string / callback",
                        desc: "Controlled selection. Missing selection displays the first available tab. Base UI owns arrow-key navigation and panel relationships.",
                      },
                      {
                        prop: "renderPanel",
                        type: "(tab) => ReactNode",
                        desc: "Optional host-owned content; defaults to the tab title. Inactive panels unmount: preserve durable state in the host.",
                      },
                      {
                        prop: "onClose / onAdd",
                        type: "callback?",
                        desc: "Optional explicit actions. Running tabs cannot close. Set closable=false for pinned or otherwise protected tabs.",
                      },
                    ]
                  : [
                      {
                        prop: "status",
                        type: "BrowserRunStatus",
                        desc: "ready, running, paused, user, complete, error or stopped.",
                      },
                      {
                        prop: "action / target / detail",
                        type: "BrowserAction / string? / string?",
                        desc: "Navigating, reading, searching, typing or waiting; optional target and a host-provided description or error.",
                      },
                      {
                        prop: "onStart / onPause / onResume",
                        type: "callback?",
                        desc: "Actions appear only in applicable states and only when their callback exists.",
                      },
                      {
                        prop: "onTakeOver / onReturnControl / onStop / onRetry",
                        type: "callback?",
                        desc: "Host-owned ownership transfer, cancellation and recovery. This presentation component never operates a browser.",
                      },
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template reuses ThinkingState, Plan, Button, IconButton, Tag
              and AgentWorkspaceState. Its two sample tasks operate on local
              guide pages, with manual or automatic progression, editable notes,
              tab selection, pause, stop and recoverable errors. Reload and
              fresh runs reset session data. There is no browser automation
              service or AI request.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The included advanceRun helper ignores late ticks outside the
              running state. Hosts own timers and must cancel obsolete work on
              pause, takeover, stop and unmount. Activity is independent of tab
              selection. The 2.4s transform loop signals ongoing work rather
              than a delayed interaction; reduced motion keeps a static light
              and hidden pages pause motion. The 20px indicator slot and 2px
              light are intentional small-scale signal geometry using the
              existing Oreo palette.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The reference establishes favicon activity and a colored tab
              light. Ownership controls, local sample pages and the activity
              sidebar are reusable template extensions.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/yogesharc/status/2110796597454102593"
              target="_blank"
              rel="noreferrer"
            >
              Browser activity reference by Yogesh ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
