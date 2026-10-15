import { useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, closestCorners, pointerWithin, useDroppable, useSensor, useSensors, type CollisionDetection, type DragOverEvent, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { kanbanCard, kanbanCell } from "./kanban.variants";
import { moveKanbanCard, type KanbanBoardProps, type KanbanCard, type KanbanColumn, type KanbanPerson, type KanbanView } from "./types";
import "./kanban.css";

const settle = { type: "spring", duration: 0.4, bounce: 0.15 } as const;
const zoneId = (column: string, lane?: string) => `zone:${JSON.stringify([column, lane ?? null])}`;

function CardContent({ card, person, onOpen, handle }: { card: KanbanCard; person?: KanbanPerson; onOpen?: () => void; handle?: React.ReactNode }) {
  return <>
    <div className="mb-2 flex items-center justify-between gap-2 text-xs text-text-tertiary">
      <span className="flex items-center gap-1">{handle}<span className="truncate font-mono text-[11px]">{card.id}</span></span>
      {card.label && <span className="flex min-w-0 items-center gap-1.5"><span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: `var(--color-palette-${card.label.color}-text)` }} /><span className="truncate">{card.label.name}</span></span>}
    </div>
    <p className="text-sm font-medium leading-5 tracking-tight">{onOpen ? <button type="button" className="oreo-kanban-open w-full text-left" onClick={onOpen}>{card.title}</button> : card.title}</p>
    <div className="mt-3 flex min-h-5 items-center gap-2.5 text-[11px] text-text-tertiary">
      {card.date && <span className="flex items-center gap-1"><Icon name="calendar" className="size-3" />{card.date}</span>}
      {card.checklist && <span className="flex items-center gap-1" aria-label={`${card.checklist.done} of ${card.checklist.total} subtasks complete`}><Icon name="list-checks" className="size-3" />{card.checklist.done}/{card.checklist.total}</span>}
      {card.points != null && <span>{card.points} pt</span>}
      {person && <Avatar name={person.name} src={person.avatar} color={person.color} size="xs" className="ml-auto size-5 shrink-0 text-[8px]" />}
    </div>
  </>;
}

function SortableCard({ card, person, reduce, keyboard, onCardOpen }: { card: KanbanCard; person?: KanbanPerson; reduce: boolean; keyboard: boolean; onCardOpen?: (card: KanbanCard) => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id, data: { columnId: card.columnId, assigneeId: card.assigneeId },
    transition: reduce || keyboard ? null : { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
  });
  return <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }}>
    <motion.div
      layoutId={`card:${card.id}`} layout="position"
      transition={reduce || keyboard ? { duration: 0 } : settle}
      className={kanbanCard({ dragging: isDragging })}
      style={{ touchAction: "pan-y" }}
      {...(onCardOpen ? {} : attributes)} {...(onCardOpen ? {} : listeners)}
      aria-label={onCardOpen ? undefined : `Drag ${card.id}: ${card.title}`}
      data-testid={`kanban-card-${card.id}`}
    >
      <div className={isDragging ? "invisible" : undefined}><CardContent card={card} person={person} onOpen={onCardOpen ? () => onCardOpen(card) : undefined} handle={onCardOpen ? <button type="button" className="oreo-kanban-handle" ref={setActivatorNodeRef} style={{touchAction:"none"}} {...attributes} {...listeners} aria-label={`Drag ${card.id}: ${card.title}`}><Icon name="grip-vertical" size="sm"/></button> : undefined} /></div>
    </motion.div>
  </div>;
}

function AddCard({ column, lane, onAdd, open, onOpenChange }: { column: KanbanColumn; lane?: string; onAdd: (title: string, column: string, lane?: string) => void; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => { setTitle(""); onOpenChange(false); requestAnimationFrame(() => trigger.current?.focus()); };
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), column.id, lane);
    close();
  }
  return <>
    {open && <form onSubmit={submit} className="rounded-card-small border border-border-default bg-bg-base p-3 shadow-[var(--shadow-default)]" onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}>
      <textarea autoFocus aria-label={`New card title in ${column.title}`} rows={2} placeholder="What needs to be done?" value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if(title.trim()) { onAdd(title.trim(), column.id, lane); close(); } } }} className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-text-placeholder" />
      <div className="mt-2 flex items-center gap-2"><button type="submit" disabled={!title.trim()} className="oreo-kanban-action rounded-control bg-bg-inverse px-3 py-1.5 text-xs text-text-on-inverse disabled:opacity-40">Add card</button><button type="button" onClick={close} className="oreo-kanban-action px-2 py-1.5 text-xs text-text-secondary">Cancel</button></div>
    </form>}
    <button ref={trigger} type="button" aria-label={`Add card to ${column.title}${lane ? ` for ${lane}` : ""}`} aria-expanded={open} onClick={() => onOpenChange(!open)} className="oreo-kanban-action flex w-full items-center gap-1.5 px-2 py-2 text-left text-sm text-text-tertiary"><Icon name="plus" size="sm" />Add card</button>
  </>;
}

function Cell({ column, cards, people, lane, compact, overLimit, reduce, keyboard, onAdd, adding, setAdding, onCardOpen }: {
  column: KanbanColumn; cards: KanbanCard[]; people: KanbanPerson[]; lane?: string; compact: boolean; overLimit: boolean; reduce: boolean; keyboard: boolean;
  onCardOpen?: (card: KanbanCard) => void;
  onAdd: (title: string, column: string, lane?: string) => void; adding: string | null; setAdding: (zone: string | null) => void;
}) {
  const id = zoneId(column.id, lane);
  const { setNodeRef, isOver } = useDroppable({ id, data: { columnId: column.id, assigneeId: lane, zone: true } });
  return <section ref={setNodeRef} aria-label={`${column.title}${lane ? ` — ${people.find(p => p.id === lane)?.name ?? "Unassigned"}` : ""}`} data-testid={id} className={kanbanCell({ compact, overLimit, over: isOver })}>
    <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
      {cards.map(card => <SortableCard key={card.id} card={card} person={people.find(p => p.id === card.assigneeId)} reduce={reduce} keyboard={keyboard} onCardOpen={onCardOpen} />)}
    </SortableContext>
    {(!compact || adding === id) && <AddCard column={column} lane={lane} onAdd={onAdd} open={adding === id} onOpenChange={open => setAdding(open ? id : null)} />}
    {cards.length === 0 && !compact && adding !== id && <p className="px-2 py-6 text-center text-xs text-text-tertiary">Drop a card here</p>}
  </section>;
}

/** Controlled board. Drag previews are local; only a valid drop commits a change. */
export function KanbanBoard({ title, cards, columns, people = [], onCardsChange, onCardOpen, defaultView = "status", className }: KanbanBoardProps) {
  const id = useId();
  const reduce = Boolean(useReducedMotion());
  const [view, setView] = useState<KanbanView>(defaultView);
  const [draft, setDraft] = useState<KanbanCard[] | null>(null);
  const draftRef = useRef<KanbanCard[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const current = draft ?? cards;
  const activeCard = activeId ? current.find(c => c.id === activeId) : undefined;
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const collision: CollisionDetection = (args) => {
    if (!args.pointerCoordinates) return closestCorners(args);
    const hits = pointerWithin(args);
    const cardHits = hits.filter(hit => !String(hit.id).startsWith("zone:"));
    return cardHits.length ? cardHits : hits;
  };
  function preview(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const items = draftRef.current;
    if (!items) return;
    const target = over.data.current;
    if (!target?.columnId) return;
    const card = items.find(item => item.id === String(active.id));
    if (!card) return;
    const assigneeId = view === "swimlanes" ? target.assigneeId ?? undefined : card.assigneeId;
    const isZone = target.zone === true;
    // A column background is an append target only when changing containers.
    if (isZone && card.columnId === target.columnId && card.assigneeId === assigneeId) return;
    const translated = active.rect.current.translated;
    const after = Boolean(translated && translated.top + translated.height / 2 > over.rect.top + over.rect.height / 2);
    const next = moveKanbanCard(items, card.id, target.columnId, assigneeId, isZone ? undefined : String(over.id), after);
    draftRef.current = next;
    setDraft(next);
  }
  function finish(event?: DragEndEvent) {
    if (event?.over && draftRef.current) {
      // Keyboard drops may land in a new cell without a final onDragOver frame.
      preview(event);
      onCardsChange(draftRef.current);
      const moved = draftRef.current.find(c => c.id === String(event.active.id));
      setAnnouncement(`${moved?.title} moved to ${columns.find(c => c.id === moved?.columnId)?.title}.`);
    } else setAnnouncement("Move cancelled. Card returned to its original position.");
    setActiveId(null); setDraft(null); draftRef.current = null;
  }
  function add(title: string, columnId: string, assigneeId?: string) {
    onCardsChange([...cards, { id: `NEW-${crypto.randomUUID().slice(0, 6).toUpperCase()}`, title, columnId, assigneeId }]);
    setAnnouncement(`Added ${title} to ${columns.find(c => c.id === columnId)?.title}.`);
  }
  const count = (column: KanbanColumn) => current.filter(c => c.columnId === column.id).length;
  const overLimit = (column: KanbanColumn) => column.limit != null && count(column) > column.limit;
  const unknownAssignee = current.some(c => !people.some(p => p.id === c.assigneeId));
  const lanes: Array<KanbanPerson | undefined> = view === "status" ? [undefined] : [...people, ...(unknownAssignee || !people.length ? [undefined] : [])];

  return <div className={cn("oreo-kanban rounded-3xl border border-border-subtle bg-bg-base p-4 text-text-primary sm:p-6", className)} style={{ "--kanban-columns": columns.length } as CSSProperties}>
    <LayoutGroup id={id}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-3"><h2 className="text-xl font-semibold tracking-tight">{title}</h2><span className="text-sm tabular-nums text-text-tertiary">{current.length} cards</span></div>
        <div role="group" aria-label="Board view" className="flex rounded-full border border-border-subtle bg-bg-elevated p-1">
          {(["status", "swimlanes"] as const).map(mode => <button type="button" key={mode} aria-pressed={view === mode} disabled={activeId != null} onClick={event => { setKeyboard(event.detail === 0); setView(mode); setAdding(null); }} className="oreo-kanban-action relative rounded-full px-3 py-1.5 text-xs text-text-secondary">
            {view === mode && <motion.span layoutId="view-indicator" transition={reduce || keyboard ? { duration: 0 } : settle} className="absolute inset-0 rounded-full border border-border-subtle bg-bg-base shadow-[var(--shadow-default)]" />}
            <span className="relative">{mode === "status" ? "Status" : "Swimlanes"}</span>
          </button>)}
        </div>
      </header>
      <DndContext id={id} sensors={sensors} collisionDetection={collision} onDragStart={event => { setKeyboard(event.activatorEvent.type === "keydown"); setActiveId(String(event.active.id)); draftRef.current = cards; setDraft(cards); setAdding(null); }} onDragOver={preview} onDragEnd={finish} onDragCancel={() => finish()} accessibility={{ screenReaderInstructions: { draggable: "Press Space to pick up a card. Use arrow keys to move it, Space to drop, or Escape to cancel." } }}>
        <div className="overflow-x-auto pb-2" role="region" aria-label={`${title} kanban board`} tabIndex={0}>
          <div className="oreo-kanban-grid mb-4">
            {columns.map(column => <div key={column.id} className="flex items-center gap-2 px-2">
              <h3 className="text-sm font-medium">{column.title}</h3>
              <span className={cn("text-sm tabular-nums text-text-tertiary", overLimit(column) && "text-palette-orange-text")}>{count(column)}{column.limit != null && `/${column.limit}`}</span>
              {overLimit(column) && <span className="rounded-full bg-palette-orange-bg px-2 py-0.5 text-[10px] font-medium text-palette-orange-text">Over limit</span>}
              <button type="button" aria-label={`New card in ${column.title}`} onClick={() => { setView("status"); setAdding(zoneId(column.id)); }} className="oreo-kanban-action ml-auto flex size-7 shrink-0 items-center justify-center text-text-tertiary"><Icon name="plus" size="sm" /></button>
            </div>)}
          </div>
          <div className="space-y-5">
            {lanes.map(lane => <div key={lane?.id ?? "unassigned"}>
              {view === "swimlanes" && <div className="mb-3 flex items-center gap-2 px-2 text-sm"><Avatar name={lane?.name ?? "Unassigned"} src={lane?.avatar} color={lane?.color} size="xs" /><h3 className="font-medium">{lane?.name ?? "Unassigned"}</h3><span className="tabular-nums text-text-tertiary">{current.filter(c => lane ? c.assigneeId === lane.id : !people.some(p => p.id === c.assigneeId)).length}</span></div>}
              <div className="oreo-kanban-grid">
                {columns.map(column => <Cell key={column.id} column={column} lane={lane?.id} cards={current.filter(c => c.columnId === column.id && (view === "status" || (lane ? c.assigneeId === lane.id : !people.some(p => p.id === c.assigneeId))))} people={people} compact={view === "swimlanes"} overLimit={overLimit(column)} reduce={reduce} keyboard={keyboard} onAdd={add} adding={adding} setAdding={setAdding} onCardOpen={onCardOpen} />)}
              </div>
            </div>)}
          </div>
        </div>
        <DragOverlay dropAnimation={reduce || keyboard ? null : { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}>
          {activeCard && <motion.div aria-hidden initial={{ transform: "scale(1) rotate(0deg)" }} animate={{ transform: reduce || keyboard ? "scale(1) rotate(0deg)" : "scale(1.025) rotate(3deg)" }} transition={reduce || keyboard ? { duration: 0 } : { duration: 0.18, ease: easeOut }} className={kanbanCard({ overlay: true })}><CardContent card={activeCard} person={people.find(p => p.id === activeCard.assigneeId)} /></motion.div>}
        </DragOverlay>
      </DndContext>
    </LayoutGroup>
    <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
  </div>;
}
