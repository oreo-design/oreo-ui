import { useState } from "react";
import { NAV } from "@/docs/Sidebar";
import type { DocsNav } from "@/docs/DocsPage";
import { Modal } from "./Tools";

export function ComponentPicker({
  open,
  setOpen,
  nav,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  nav: DocsNav;
}) {
  const [query, setQuery] = useState("");
  const groups = NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase().trim()),
    ),
  })).filter((group) => group.items.length);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Find a component"
      className="pg-picker"
    >
      <input
        autoFocus
        type="search"
        aria-label="Find a component"
        placeholder="Search components and templates…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="pg-picker-results">
        {groups.length ? (
          groups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <a
                  key={item.page}
                  href={`/${item.page}`}
                  aria-current={item.page === nav.active ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    setOpen(false);
                    setQuery("");
                    nav.onNavigate(item.page);
                  }}
                >
                  {item.label}
                  <span aria-hidden="true">
                    {item.page === nav.active ? "✓" : "↗"}
                  </span>
                </a>
              ))}
            </section>
          ))
        ) : (
          <div className="pg-empty">
            <p>No results for “{query}”</p>
            <button onClick={() => setQuery("")}>Clear search</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
