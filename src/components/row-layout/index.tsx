import * as React from "react";
import { cn } from "@/lib/cn";

/** Shared row geometry; the host owns controls, semantics and available width. */
export function RowLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6 border-b-[0.5px] border-[var(--row-divider,var(--color-border-subtle))] py-4 last:border-b-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function RowLabel({
  title,
  description,
  strong,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className={cn(strong ? "text-[15px] font-semibold leading-5" : "text-[13px] font-medium leading-[18px]")}>
        {title}
      </div>
      {description && (
        <div className="max-w-[52ch] text-[13px] leading-5 tracking-[0.01em] text-[var(--color-text-secondary)]">
          {description}
        </div>
      )}
    </div>
  );
}
