import * as React from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { threadList } from "./thread-list.variants";

export function ThreadList({ className, ...rest }: React.ComponentPropsWithoutRef<"nav">) {
  const slots = threadList();
  return <nav className={cn(slots.root(), className)} {...rest} />;
}

/** Date-group label — "Today", "Last week". */
export function ThreadListSection({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  const slots = threadList();
  return <div className={cn(slots.section(), className)} {...rest} />;
}

/** The new-conversation entry, styled as the first item. */
export function ThreadListNew({
  children = "New chat",
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"button">) {
  const slots = threadList();
  return (
    <button type="button" className={cn(slots.item({ active: false }), className)} {...rest}>
      <Icon name="plus" size="sm" weight="bold" className="shrink-0" />
      <span className={slots.title()}>{children}</span>
    </button>
  );
}

export type ThreadListItemProps = {
  title: React.ReactNode;
  /** Right-edge caption — relative time. Hidden while actions show. */
  meta?: React.ReactNode;
  active?: boolean;
  unread?: boolean;
  /** Hover/focus actions — ThreadListItemAction buttons. */
  actions?: React.ReactNode;
  onSelect?: () => void;
  className?: string;
};

export function ThreadListItem({
  title,
  meta,
  active = false,
  unread = false,
  actions,
  onSelect,
  className,
}: ThreadListItemProps) {
  const slots = threadList({ active });
  return (
    // A div with button semantics — real <button> can't nest the action buttons.
    <div
      role="button"
      tabIndex={0}
      aria-current={active ? "true" : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(slots.item(), "cursor-pointer", className)}
    >
      <span className={slots.title()}>{title}</span>
      {(meta != null || unread) && (
        <span className={cn(slots.meta(), actions != null && "group-hover/thread:hidden group-focus-within/thread:hidden")}>
          {unread && !active && <span aria-hidden className={slots.unread()} />}
          {meta}
        </span>
      )}
      {actions != null && <span className={slots.actions()}>{actions}</span>}
    </div>
  );
}

/** Small round ghost action revealed on item hover — rename, archive, delete. */
export function ThreadListItemAction({
  "aria-label": ariaLabel,
  className,
  onClick,
  children,
}: {
  "aria-label": string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={cn(
        "grid size-5 place-items-center rounded-full text-[var(--color-text-secondary)]",
        "transition-colors hover:bg-[var(--color-state-press)] hover:text-[var(--color-text-primary)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        "[&_svg]:size-3",
        className,
      )}
    >
      {children}
    </button>
  );
}
