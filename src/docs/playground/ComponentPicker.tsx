import { PlaygroundIcon } from "@/components/icon";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { catalogHref, searchCatalog, type CatalogView } from "@/lib/catalog";
import type { DocsNav } from "@/docs/DocsPage";
import { Modal } from "./Tools";


const PickerTriggerContext = createContext<RefObject<HTMLButtonElement | null> | null>(null);

/** The current breadcrumb replaces the pending one without replacing this ref. */
export function useComponentPickerTrigger() {
  const fallback = useRef<HTMLButtonElement>(null);
  return useContext(PickerTriggerContext) ?? fallback;
}

const PickerContext = createContext<((onClose: () => void) => void) | null>(null);

/** A single dialog survives route/adapter loading, preserving typed query,
 * input focus and selection when the content beneath it becomes ready. */
export function ComponentPickerProvider({ nav, children }: { nav: DocsNav; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const onClose = useRef<(() => void) | undefined>(undefined);
  const request = useRef((close: () => void) => { onClose.current = close; setOpen(true); }).current;
  const changeOpen = (next: boolean) => { setOpen(next); if (!next) onClose.current?.(); };
  return <PickerTriggerContext.Provider value={triggerRef}><PickerContext.Provider value={request}>{children}<PickerDialog nav={nav} open={open} setOpen={changeOpen} finalFocus={triggerRef} /></PickerContext.Provider></PickerTriggerContext.Provider>;
}

export function ComponentPicker(props: { open: boolean; setOpen: (open: boolean) => void; nav: DocsNav }) {
  const request = useContext(PickerContext);
  useEffect(() => {
    if (props.open && request) request(() => props.setOpen(false));
  }, [props.open, props.setOpen, request]);
  return request ? null : <PickerDialog {...props} />;
}

function PickerDialog({
  open,
  setOpen,
  nav,
  finalFocus,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  nav: DocsNav;
  finalFocus?: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<CatalogView | "">("");
  const groups = searchCatalog(query, view || undefined);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Find a component"
      className="pg-picker"
      finalFocus={finalFocus}
    >
      <input
        autoFocus
        type="search"
        aria-label="Find a component"
        placeholder="Search components and templates…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <label className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
        <span>Show</span>
        <select
          aria-label="Page type"
          className="oreo-squircle min-w-0 flex-1 border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs text-[var(--color-text-primary)] outline-none oreo-focus-field"
          value={view}
          onChange={(event) => setView(event.target.value as CatalogView | "")}
        >
          <option value="">All pages</option>
          <option value="playground">Component playgrounds</option>
          <option value="template">Templates</option>
          <option value="gallery">Galleries</option>
          <option value="docs">Documentation</option>
          <option value="demo">Standalone demos</option>
          <option value="remixes">Remix examples</option>
        </select>
      </label>
      <div className="pg-picker-results">
        {groups.length ? (
          groups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <a
                  className="oreo-squircle oreo-state-layer"
                  key={item.page}
                  href={catalogHref(item.page, view || undefined)}
                  aria-current={item.page === nav.active ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey || event.button !== 0
                    )
                      return;
                    event.preventDefault();
                    setOpen(false);
                    setQuery("");
                    setView("");
                    nav.onNavigate(item.page, view || undefined);
                  }}
                >
                  <div className="min-w-0 pr-3">
                    <div>{item.label}</div>
                    {item.summary && <p className="mt-1 text-xs leading-5 text-text-secondary">{item.summary}</p>}
                    {item.hint && <p className="mt-1 text-xs text-text-tertiary">{item.hint}</p>}
                  </div>
                  <span aria-hidden="true" className="shrink-0 pt-0.5">
                    <PlaygroundIcon name={item.page === nav.active ? "check" : "arrow-out"} />
                  </span>
                </a>
              ))}
            </section>
          ))
        ) : (
          <div className="pg-empty">
            <p>{query ? `No results for “${query}”` : "No matching pages"}</p>
            <button onClick={() => { setQuery(""); setView(""); }}>Clear search and filters</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
