import type { PaletteColor } from "@/lib/palette";

export type KanbanPerson = { id: string; name: string; avatar?: string; color?: PaletteColor };
export type KanbanColumn = { id: string; title: string; limit?: number };
export type KanbanCard = {
  id: string;
  title: string;
  columnId: string;
  assigneeId?: string;
  label?: { name: string; color: PaletteColor };
  date?: string;
  checklist?: { done: number; total: number };
  points?: number;
};
export type KanbanView = "status" | "swimlanes";
export type KanbanBoardProps = {
  title: string;
  columns: KanbanColumn[];
  cards: KanbanCard[];
  people?: KanbanPerson[];
  onCardsChange: (cards: KanbanCard[]) => void;
  /** Optional details action; gives dragging its own accessible handle. */
  onCardOpen?: (card: KanbanCard) => void;
  defaultView?: KanbanView;
  className?: string;
};

/** Immutable transfer: ordering, status and swimlane assignment change together. */
export function moveKanbanCard(cards: KanbanCard[], id: string, columnId: string, assigneeId: string | undefined, overId?: string, after = false): KanbanCard[] {
  const card = cards.find((item) => item.id === id);
  if (!card || id === overId) return cards;
  const next = cards.filter((item) => item.id !== id);
  const targetIndex = overId ? next.findIndex((item) => item.id === overId) : -1;
  const index = targetIndex < 0 ? next.length : targetIndex + Number(after);
  next.splice(index, 0, { ...card, columnId, assigneeId });
  if (next.every((item, i) => item.id === cards[i].id && item.columnId === cards[i].columnId && item.assigneeId === cards[i].assigneeId)) return cards;
  return next;
}
