import { ComposerAsset } from "@/components/composer/assets";
import { StepDots } from "@/components/icon";
import * as React from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { cn } from "@/lib/cn";
import { SpinnerDots } from "@/components/attachment";
import { contextBar } from "./context-bar.variants";

const slots = contextBar();

type Status = "default" | "avatar" | "progress" | "loading" | "waiting" | "done" | "queue";

/* ------------------------------ Building blocks ------------------------------ */

const trailingButtonBase = [
  "flex shrink-0 cursor-pointer items-center outline-none select-none",
  "text-[var(--color-text-tertiary)] transition-colors duration-150",
  "hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
  "rounded-[var(--radius-control-tiny)]",
];

export type ContextBarTextButtonProps = {
  /** Optional 16px leading glyph (Steer uses the corner-down-right arrow). */
  icon?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">;

/** A quiet trailing text action — "Steer", "Upgrade plan". */
export function ContextBarTextButton({ icon, className, children, ...rest }: ContextBarTextButtonProps) {
  return (
    <button type="button" className={cn(trailingButtonBase, className)} {...rest}>
      {icon != null && <span className="grid size-5 place-items-center [&_svg]:size-4">{icon}</span>}
      <span className="text-[14px] leading-5 font-medium whitespace-nowrap">{children}</span>
    </button>
  );
}

export type ContextBarIconButtonProps = {
  "aria-label": string;
  icon: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children">;

/** A quiet 20px trailing icon action — remove, more. */
export function ContextBarIconButton({ icon, className, ...rest }: ContextBarIconButtonProps) {
  return (
    <button
      type="button"
      className={cn(trailingButtonBase, "size-5 justify-center rounded-[var(--radius-capsule)] [&_svg]:size-4", className)}
      {...rest}
    >
      {icon}
    </button>
  );
}

const STATUS_GLYPHS: Record<Exclude<Status, "avatar">, React.ReactNode> = {
  default: <ComposerAsset name="folder"/>,
  progress: <StepDots className="size-4" />,
  loading: <SpinnerDots className="size-4 animate-[spin_0.8s_steps(8)_infinite] motion-reduce:animate-none" />,
  waiting: <ComposerAsset name="taskWaiting"/>,
  done: <ComposerAsset name="taskCheck"/>,
  queue: <ComposerAsset name="grip"/>,
};

/* -------------------------------- Label row -------------------------------- */

export type ContextBarLabelProps = {
  /** Row appearance — picks the leading glyph and text treatment. */
  status?: Status;
  /** Override the leading glyph (a 16px node in a 20px box). */
  icon?: React.ReactNode;
  /** Leading content for `status="avatar"` — usually an `<AvatarGroup>`. */
  leading?: React.ReactNode;
  /** Tertiary label color (the docked footer treatment). */
  muted?: boolean;
  /** Renders the "↳ Steer" trailing action. */
  onSteer?: () => void;
  /** Renders the trash trailing action. */
  onRemove?: () => void;
  /** Renders the "…" trailing action. */
  onMore?: () => void;
  /** Custom trailing content — wins over the callback-derived actions. */
  trailing?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;

/**
 * One Context Bar row (the Figma "Status Label"): a status glyph or avatar
 * stack, a label, and quiet trailing actions.
 */
export function ContextBarLabel({
  status = "default",
  icon,
  leading,
  muted = false,
  onSteer,
  onRemove,
  onMore,
  trailing,
  className,
  children,
  ...rest
}: ContextBarLabelProps) {
  const rowSlots = contextBar({ status, muted });
  // `icon={null}` explicitly removes the leading glyph (the Upgrade row).
  const glyph = icon !== undefined ? icon : status === "avatar" ? null : STATUS_GLYPHS[status];
  const actions =
    trailing ??
    (onSteer || onRemove || onMore ? (
      <>
        {onSteer && (
          <ContextBarTextButton icon={<ComposerAsset name="steer"/>} onClick={onSteer}>
            Steer
          </ContextBarTextButton>
        )}
        {(onRemove || onMore) && (
          <span className={rowSlots.trailingIcons()}>
            {onRemove && <ContextBarIconButton aria-label="Remove" icon={<ComposerAsset name="trash"/>} onClick={onRemove} />}
            {onMore && <ContextBarIconButton aria-label="More" icon={<ComposerAsset name="more"/>} onClick={onMore} />}
          </span>
        )}
      </>
    ) : null);

  return (
    <div className={cn(rowSlots.row(), className)} {...rest}>
      <div className={rowSlots.content()}>
        {status === "avatar" ? leading : glyph != null ? <span className={rowSlots.leadingIcon()}>{glyph}</span> : null}
        <span className={rowSlots.label()}>{children}</span>
      </div>
      {actions != null && <div className={rowSlots.trailing()}>{actions}</div>}
    </div>
  );
}

/* ------------------------------- Task details ------------------------------- */

export type ContextBarTasksProps = {
  /** The always-visible summary row — "2/4 tasks in progress". */
  summary: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Collapsible task detail (Figma Expand/Folded): a chevron summary row that
 * unfolds the per-task rows underneath.
 */
export function ContextBarTasks({ summary, defaultOpen, open, onOpenChange, className, children }: ContextBarTasksProps) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} className={cn("w-full", className)}>
      <Collapsible.Trigger
        className={cn(
          "group/tasks flex cursor-pointer w-full items-center gap-1 outline-none select-none",
          "rounded-[var(--radius-control-tiny)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        )}
      >
        <span className="grid size-5 shrink-0 place-items-center">
          <ComposerAsset name="taskChevron" className="-rotate-90 transition-transform duration-200 ease-drawer motion-reduce:transition-none group-data-[panel-open]/tasks:rotate-0"/>
        </span>
        <span className="min-w-0 flex-1 text-left text-[14px] leading-5 font-medium text-[var(--color-text-primary)]">
          {summary}
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel
        className={cn(
          "h-[var(--collapsible-panel-height)] w-full overflow-hidden",
          "transition-[height] duration-200 ease-drawer motion-reduce:transition-none",
          "data-[ending-style]:h-0 data-[starting-style]:h-0",
        )}
      >
        <div className="flex w-full flex-col gap-[var(--space-x4)] pt-[var(--space-x4)]">{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

/* ---------------------------------- The bar --------------------------------- */

export type ContextBarProps = {
  /** Which Prompt Box edge the bar docks to; `detached` rounds all corners. */
  position?: "header" | "footer" | "detached";
} & React.ComponentPropsWithoutRef<"div">;

/**
 * Oreo UI Context Bar — a status surface docked above or below a Prompt Box.
 * Compose rows from `ContextBarLabel` and `ContextBarTasks`.
 */
export function ContextBar({ position = "header", className, children, ...rest }: ContextBarProps) {
  const barSlots = contextBar({ position });
  return (
    <div className={cn(barSlots.bar(), className)} {...rest}>
      {children}
    </div>
  );
}
