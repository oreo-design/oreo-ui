export type LinkedDocument = {
  id: string;
  name: string;
  kind: string;
  size: string;
  added: string;
  owner: string;
};
export type LinkState = {
  documents: LinkedDocument[];
  selectedId: string | null;
  removed: { document: LinkedDocument; index: number }[];
  notice: string;
};
export type LinkAction =
  | { type: "select" | "unlink"; id: string }
  | { type: "undo" }
  | { type: "reset"; documents: LinkedDocument[] };
export function linkReducer(state: LinkState, action: LinkAction): LinkState {
  if (action.type === "reset")
    return {
      documents: [...action.documents],
      selectedId: action.documents[0]?.id ?? null,
      removed: [],
      notice: "Sample documents restored.",
    };
  if (action.type === "select")
    return state.documents.some((d) => d.id === action.id)
      ? { ...state, selectedId: action.id }
      : state;
  if (action.type === "unlink") {
    const index = state.documents.findIndex((d) => d.id === action.id);
    if (index < 0) return state;
    const document = state.documents[index],
      documents = state.documents.filter((d) => d.id !== action.id);
    return {
      ...state,
      documents,
      selectedId:
        state.selectedId === action.id
          ? (documents[Math.min(index, documents.length - 1)]?.id ?? null)
          : state.selectedId,
      removed: [...state.removed, { document, index }],
      notice: `${document.name} unlinked. Original file kept.`,
    };
  }
  const last = state.removed.at(-1);
  if (!last) return state;
  const documents = [...state.documents];
  documents.splice(Math.min(last.index, documents.length), 0, last.document);
  return {
    ...state,
    documents,
    selectedId: state.selectedId ?? last.document.id,
    removed: state.removed.slice(0, -1),
    notice: `${last.document.name} linked again.`,
  };
}
