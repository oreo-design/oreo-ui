import { SourceReference } from "@/docs/SourceReference";
import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import {
  ThreadList,
  ThreadListSection,
  ThreadListNew,
  ThreadListItem,
  ThreadListItemAction,
} from "@/components/thread-list";
import { Icon } from "@/components/icon";

const TOC: TocItem[] = [
  { id: "thread-list", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "basic", label: "Basic" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "ThreadListItem.title", type: "ReactNode", desc: "Thread title, truncated." },
  { prop: "meta", type: "ReactNode", desc: "Right-edge caption (time); hides while actions show." },
  { prop: "active / unread", type: "boolean", desc: "Selection tint / unread dot." },
  { prop: "actions", type: "ReactNode", desc: "ThreadListItemAction buttons revealed on hover or focus." },
  { prop: "onSelect", type: "() => void", desc: "Row activation (click / Enter / Space)." },
  { prop: "ThreadListSection", type: "—", desc: "Date-group label; ThreadListNew is the new-chat entry." },
];

const CODE = `import { ThreadList, ThreadListSection, ThreadListNew, ThreadListItem, ThreadListItemAction } from "@/components/thread-list";

<ThreadList>
  <ThreadListNew />
  <ThreadListSection>Today</ThreadListSection>
  <ThreadListItem
    title="Grid vs flexbox"
    meta="2h"
    active
    actions={<>
      <ThreadListItemAction aria-label="Rename"><Icon name="pencil" /></ThreadListItemAction>
      <ThreadListItemAction aria-label="Delete"><Icon name="trash" /></ThreadListItemAction>
    </>}
  />
</ThreadList>`;

const THREADS = [
  { id: 1, title: "Grid vs flexbox decision", meta: "2h", section: "Today", unread: false },
  { id: 2, title: "Debug the hydration mismatch", meta: "5h", section: "Today", unread: true },
  { id: 3, title: "Migration plan for the tokens", meta: "Mon", section: "Last week", unread: false },
  { id: 4, title: "Naming the palette scales", meta: "Sun", section: "Last week", unread: false },
];

function Demo() {
  const [items, setItems] = useState(THREADS);
  const [active, setActive] = useState(1);
  const sections = [...new Set(items.map((t) => t.section))];
  return (
    <div className="w-full max-w-[250px]">
      <ThreadList>
        <ThreadListNew onClick={() => setActive(-1)} />
        {sections.map((section) => (
          <div key={section} className="contents">
            <ThreadListSection>{section}</ThreadListSection>
            {items
              .filter((t) => t.section === section)
              .map((t) => (
                <ThreadListItem
                  key={t.id}
                  title={t.title}
                  meta={t.meta}
                  unread={t.unread}
                  active={t.id === active}
                  onSelect={() => setActive(t.id)}
                  actions={
                    <>
                      <ThreadListItemAction aria-label={`Rename ${t.title}`}>
                        <Icon name="pencil" />
                      </ThreadListItemAction>
                      <ThreadListItemAction
                        aria-label={`Delete ${t.title}`}
                        onClick={() => setItems((p) => p.filter((x) => x.id !== t.id))}
                      >
                        <Icon name="trash" />
                      </ThreadListItemAction>
                    </>
                  }
                />
              ))}
          </div>
        ))}
      </ThreadList>
    </div>
  );
}

export function ThreadListDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Shell", "Thread List"]} nav={nav}>
      {() => (
        <>
          <header id="thread-list" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Thread List</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Conversation history for the sidebar: date sections, a new-chat entry, and rows whose
              time (and unread dot) swap to rename/delete actions on hover — the pattern every chat
              shell needs.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="thread-list" />
          </Section>

          <Section id="basic" title="Basic" description="Hover a row: the meta swaps to actions. Delete removes; the unread dot hides on the active row.">
            <PreviewTabs code={CODE} preview={<Demo />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
