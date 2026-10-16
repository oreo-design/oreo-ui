import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function ProjectActivityDocs({ nav }: { nav: DocsNav }) {
  const row = nav.active === "activity-event-row",
    title = row ? "Activity Event Row" : "Grouped Activity Feed";
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
              {row
                ? "A compact actor, action, subject and project record with exact timestamps, unread state and an optional detail action."
                : "A chronological project feed with UTC day groups, shared empty/error recovery and list-shaped loading."}
            </p>
            <a
              href="/project-feed"
              className="mt-4 inline-block underline text-sm"
            >
              Open Project Feed ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                row
                  ? '<ActivityEventRow event={event} now={clock}\n  currentUserId="alex" unread onOpen={openDetails} />'
                  : '<GroupedActivityFeed events={events} now={clock}\n  currentUserId="alex" readIds={readIds}\n  onOpen={openDetails} onReset={resetFilters} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: row ? "event" : "events",
                  type: row ? "ActivityEvent" : "ActivityEvent[]",
                  desc: "Stable ID, actor and project identity, subject ID/title, action, ISO timestamp; optional before/after values, body or attachment metadata.",
                },
                {
                  prop: "now / currentUserId",
                  type: "string / string?",
                  desc: "Explicit reference clock for deterministic grouping and relative labels. Matching actor is displayed as You. Dates group in UTC; exact timestamp appears on hover and in details.",
                },
                {
                  prop: row
                    ? "unread / selected / onOpen"
                    : "readIds / selectedId / onOpen",
                  type: "controlled state and callback?",
                  desc: "Identity and state remain host-owned. Without onOpen, rows are noninteractive. A single row button avoids nested links.",
                },
                ...(!row
                  ? [
                      {
                        prop: "loading / error / onReset",
                        type: "state and callback?",
                        desc: "Initial skeleton, preserved events on refresh, centered no-matches/error states. Invalid dates or duplicate IDs render an explicit error.",
                      },
                    ]
                  : []),
              ]}
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Import from @/components/project-activity. filterActivity and
              groupActivity are exported pure helpers. Status changes include
              moved, completed, priority and assignment; created tasks and
              attachments remain in All. Search matches actor, subject, project,
              comment and filename. Latest timestamps sort first with ID as a
              stable tie-break.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The template imports the existing Project Workspace's
              project/member identities, and reuses Avatar, Button, IconButton,
              Tag, AgentWorkspaceState and Base UI Dialog. Filters combine; Mark
              view as read and export operate on all matching records, including
              those beyond Load more. Comments add local feed events and can be
              undone; reload resets changes. No messages are sent. Attachment
              details show fixture metadata, not downloadable files.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The source is a static dark screenshot. Light theme, mobile
              navigation, detail panels, discussion, read state and error
              recovery are implemented behavior, not claims about the source. No
              custom timed animation is introduced.
            </p>
            <a
              href="https://x.com/zahragr8r/status/2110632965361529237"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block underline text-sm"
            >
              Reference by Zahra ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
