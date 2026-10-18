import type { MouseEvent } from "react";

type View = "playground" | "docs" | "remixes";
export function PageViews({ slug, active, onPlayground, onDocumentation, onRemixes }: {
  slug: string; active: View; onPlayground?: () => void; onDocumentation?: () => void; onRemixes?: () => void;
}) {
  const items: { view: View; label: string; action?: () => void }[] = [
    { view: "playground", label: "Playground", action: onPlayground },
    { view: "docs", label: "Documentation", action: onDocumentation },
    { view: "remixes", label: "AI remixes", action: onRemixes },
  ];
  const navigate = (event: MouseEvent<HTMLAnchorElement>, action?: () => void) => {
    if (!action || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); action();
  };
  return <nav className="site-views" aria-label="Page view">{items.filter(item => item.action || item.view === active).map(item => <a key={item.view} href={`/${slug}${item.view === "playground" ? "" : `?view=${item.view}`}`} aria-current={item.view === active ? "page" : undefined} onClick={event => navigate(event, item.view === active ? () => {} : item.action)}>{item.label}</a>)}</nav>;
}
