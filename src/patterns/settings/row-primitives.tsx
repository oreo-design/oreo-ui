import type { ReactNode } from "react";
import { RowLayout } from "@/components/row-layout";
import { cn } from "@/lib/cn";

export { RowLabel } from "@/components/row-layout";

/** Compatibility entry: preserve Settings' local divider override without extra DOM. */
export function RowShell({ children, className }: { children: ReactNode; className?: string }) {
  return <RowLayout className={cn("[--row-divider:var(--settings-hairline,var(--color-border-subtle))]", className)}>{children}</RowLayout>;
}
