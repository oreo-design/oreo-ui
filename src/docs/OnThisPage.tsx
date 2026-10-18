import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type TocItem = { id: string; label: string };

export function OnThisPage({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="sticky top-0 hidden h-screen w-52 shrink-0 overflow-y-auto py-10 pl-6 xl:block">
      <div className="text-xs font-medium text-[var(--color-text-secondary)]">
        On this page
      </div>
      <ul className="mt-3 space-y-1.5 border-l border-[var(--color-border-subtle)]">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={cn(
                "-ml-px block border-l-2 pl-3 text-[12px] transition-colors",
                active === i.id
                  ? "border-[var(--color-text-primary)] font-medium text-[var(--color-text-primary)]"
                  : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
