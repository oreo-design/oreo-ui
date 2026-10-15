import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  InboxFilters,
  InboxGroup,
  InboxNotification,
  type InboxFilter,
} from "@/components/studio-inbox";
import { AgentWorkspaceState } from "@/components/automation";
import { NOTIFICATIONS } from "@/patterns/studio-inbox/data";
export function StudioInboxDocs({ nav }: { nav: DocsNav }) {
  const [filter, setFilter] = useState<InboxFilter>("All");
  const [selected, setSelected] = useState("dez");
  const shown = NOTIFICATIONS.filter(
    (n) => filter === "All" || n.category === filter,
  );
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Studio Inbox"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "notifications", label: "Notifications" },
        { id: "composition", label: "Composition" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">
              Less noise. More music.
            </h1>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              A notification family for collaboration: typed filters, date
              groups and selectable rows with explicit unread state.
            </p>
            <p className="mt-3 text-sm text-text-tertiary">
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/designflyio/status/2110486258640372119"
                target="_blank"
                rel="noreferrer"
              >
                Brad’s Inbox
              </a>
              . Built on Oreo Avatar and semantic color tokens.
            </p>
            <Button
              className="my-6"
              tapScale={1}
              render={<a href="/studio-inbox" />}
            >
              Open Studio Inbox ↗
            </Button>
          </header>
          <Section
            id="notifications"
            title="A place for every update"
            description="Selection and read state are controlled independently. Filter buttons update this one list; they are not navigation tabs."
          >
            <div className="overflow-hidden rounded-card-medium border border-border-subtle bg-bg-base">
              <InboxFilters value={filter} onChange={setFilter} />
              <div className="p-4">
                {["Today", "Yesterday"].map((day) => {
                  const group = shown.filter((n) => n.day === day);
                  return group.length ? (
                    <InboxGroup key={day} title={day} count={group.length}>
                      {group.map((item) => (
                        <InboxNotification
                          key={item.id}
                          item={item}
                          selected={item.id === selected}
                          onSelect={setSelected}
                        />
                      ))}
                    </InboxGroup>
                  ) : null;
                })}
                {!shown.length && (
                  <AgentWorkspaceState
                    title="No updates"
                    description="Try a different notification type."
                  />
                )}
              </div>
            </div>
          </Section>
          <Section
            id="composition"
            title="One conversation, shared components"
            description="The template reuses ChatBubble, AudioClip and CollaborationComposer from Project Chat. Notifications open the discussion inline; on small screens, a Back to inbox action returns to the list. Audio is a local sample, and replies and approvals reset on reload."
          >
            <CodeBlock
              code={
                '<InboxFilters value={filter} onChange={setFilter} />\n<InboxGroup title="Today" count={items.length}>\n  {items.map(item => (\n    <InboxNotification key={item.id} item={item}\n      selected={item.id === selected} onSelect={open} />\n  ))}\n</InboxGroup>'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "InboxNotification.item",
                  type: "InboxItem",
                  desc: "Author, action, preview, project, category, time, day and unread state.",
                },
                {
                  prop: "selected / onSelect",
                  type: "boolean / (id) => void",
                  def: "false",
                  desc: "Controlled selection. The caller decides when to mark an item read.",
                },
                {
                  prop: "InboxGroup",
                  type: "title, count, children",
                  desc: "Labelled section with a stable accessible heading.",
                },
                {
                  prop: "InboxFilters",
                  type: "value, onChange",
                  desc: "All, Mentions, Comments, Approvals, Versions or Releases.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
