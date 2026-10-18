import { useState } from "react";
import { KanbanBoard, type KanbanCard, type KanbanColumn, type KanbanPerson } from "@/components/kanban";
import { Sidebar } from "@/docs/Sidebar";
import { CodeBlock, PropsTable, Section } from "@/docs/primitives";
import type { DocsNav } from "@/docs/DocsPage";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";

const PEOPLE: KanbanPerson[] = [
  { id: "emma", name: "Emma Collins", color: "orange" },
  { id: "marcus", name: "Marcus Johnson", color: "mint" },
  { id: "chloe", name: "Chloe Nguyen", color: "purple" },
  { id: "daniel", name: "Daniel Kim", color: "blue" },
];
const COLUMNS: KanbanColumn[] = [
  { id: "backlog", title: "Backlog" }, { id: "progress", title: "In progress", limit: 3 },
  { id: "review", title: "In review", limit: 2 }, { id: "done", title: "Done" },
];
const billing = { name: "Billing", color: "orange" } as const;
const design = { name: "Design", color: "purple" } as const;
const api = { name: "API", color: "blue" } as const;
const INITIAL: KanbanCard[] = [
  { id: "BIL-142", title: "Proration preview when seats change mid-cycle", columnId: "backlog", assigneeId: "daniel", label: billing, date: "Oct 2", checklist: { done: 0, total: 3 }, points: 5 },
  { id: "BIL-151", title: "Dunning emails for failed renewals", columnId: "backlog", assigneeId: "chloe", label: { name: "Lifecycle", color: "brown" }, date: "Oct 6", points: 3 },
  { id: "BIL-155", title: "Tax ID field for EU customers", columnId: "backlog", assigneeId: "marcus", label: billing, points: 2 },
  { id: "BIL-160", title: "Empty state for invoices list", columnId: "backlog", assigneeId: "emma", label: design, points: 1 },
  { id: "BIL-128", title: "Usage meter on the billing page", columnId: "progress", assigneeId: "emma", label: design, date: "Sep 26", checklist: { done: 2, total: 4 }, points: 3 },
  { id: "BIL-133", title: "Webhook retries for invoice.paid", columnId: "progress", assigneeId: "daniel", label: api, date: "Sep 25", checklist: { done: 1, total: 2 }, points: 5 },
  { id: "BIL-137", title: "Coupon stacking rules", columnId: "progress", assigneeId: "marcus", label: billing, date: "Sep 30", points: 3 },
  { id: "BIL-119", title: "Annual plan switch keeps credits", columnId: "review", assigneeId: "chloe", label: billing, date: "Sep 24", checklist: { done: 2, total: 3 }, points: 3 },
  { id: "BIL-124", title: "Invoice PDF uses workspace logo", columnId: "review", assigneeId: "emma", label: design, points: 2 },
  { id: "BIL-102", title: "Migrate prices to the new catalog", columnId: "done", assigneeId: "daniel", label: api, points: 8 },
  { id: "BIL-108", title: "Billing settings information architecture", columnId: "done", assigneeId: "emma", label: design, points: 3 },
  { id: "BIL-111", title: "Payment method update flow", columnId: "done", assigneeId: "marcus", label: billing, points: 5 },
];

export function KanbanDocs({ nav }: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  const [cards, setCards] = useState(INITIAL);
  const [resetKey, setResetKey] = useState(0);
  return <div className={dark ? "theme-dark min-h-screen bg-bg-elevated" : "min-h-screen bg-bg-elevated"}>
    <div className="mx-auto flex bg-bg-elevated text-text-primary">
      <Sidebar nav={nav} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 text-xs text-text-secondary">Components <span className="px-1">/</span> <span className="text-text-primary">Kanban</span></div>
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-2xl font-semibold tracking-tight">Kanban</h1><p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">Drag cards between columns or group tasks by assignee.</p></div>
          <div className="flex items-center gap-2">
            <Button type="tertiary" size="sm" leadingIcon={<Icon name="reset" size="sm" />} onClick={() => { setCards(INITIAL); setResetKey(k => k + 1); }}>Reset demo</Button>
            <Button type="secondary" size="sm" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} leadingIcon={<Icon name={dark ? "sun" : "moon"} size="sm" />} onClick={() => setDark(d => !d)}>{dark ? "Light" : "Dark"}</Button>
          </div>
        </header>
        <KanbanBoard key={resetKey} title="Billing v2" columns={COLUMNS} cards={cards} people={PEOPLE} onCardsChange={setCards} />
        <div className="mb-10 mt-4 flex flex-wrap justify-between gap-2 text-xs leading-5 text-text-tertiary"><p>Drag to reorder · Space to pick up · Arrows to move · Esc to cancel</p><p>Demo changes stay on this page.</p></div>
        <div className="max-w-3xl">
          <Section id="interaction" title="Interaction" description="Switch between a status board and assignee swimlanes without losing your place.">
            <div className="grid gap-5 text-sm leading-6 text-text-secondary sm:grid-cols-3">
              <p><strong className="block font-medium text-text-primary">Drag and drop.</strong>Cards lift from the board, leave a quiet placeholder, and make room as you move. Escape restores the original order.</p>
              <p><strong className="block font-medium text-text-primary">Soft limits.</strong>Going over a column’s limit adds a gentle warning. It never blocks the move. Counts follow the drag preview.</p>
              <p><strong className="block font-medium text-text-primary">Assignee swimlanes.</strong>Swimlanes group the same cards by person. Moving between lanes updates the assignee as well as the status.</p>
            </div>
          </Section>
          <Section id="usage" title="Usage" description="A controlled component. You own the cards; the board owns the interaction.">
            <CodeBlock code={`import { KanbanBoard } from "@/components/kanban";

const [cards, setCards] = useState(initialCards);

<KanbanBoard
  title="Billing v2"
  columns={columns}
  people={people}
  cards={cards}
  onCardsChange={setCards}
/>`} />
          </Section>
          <Section id="api" title="API Reference" description="Uses Oreo tokens, Avatar and Icon, with the existing dnd kit and Motion dependencies.">
            <div className="overflow-x-auto"><div className="min-w-2xl"><PropsTable rows={[
              { prop: "title", type: "string", desc: "The board heading." },
              { prop: "columns", type: "KanbanColumn[]", desc: "Ordered columns with id, title and an optional soft limit." },
              { prop: "cards", type: "KanbanCard[]", desc: "Ordered cards. Every id must be unique and refer to an existing columnId." },
              { prop: "people", type: "KanbanPerson[]", def: "[]", desc: "Assignee names, optional avatar URLs and Oreo palette colors. Unknown assignees appear in Unassigned." },
              { prop: "onCardsChange", type: "(cards: KanbanCard[]) => void", desc: "Called when a drop commits or a card is added. Cancelled drags do not write changes." },
              { prop: "onCardOpen", type: "(card: KanbanCard) => void", desc: "Optional task-details action. Adds a title button and separate keyboard-accessible drag handle; without it the entire card remains draggable." },
              { prop: "defaultView", type: '"status" | "swimlanes"', def: '"status"', desc: "The initial grouping." },
              { prop: "className", type: "string", desc: "Additional classes for the board surface." },
            ]} /></div></div>
          </Section>
          <footer className="border-t border-border-subtle py-6 text-xs leading-6 text-text-secondary">Recreated from <a href="https://x.com/eliakuratli/status/2109299245891416065" target="_blank" rel="noreferrer" className="underline underline-offset-4">Elia’s Kanban interaction study</a>. Built independently with Oreo UI components. Sample people use Oreo initials avatars.</footer>
        </div>
      </main>
    </div>
  </div>;
}
