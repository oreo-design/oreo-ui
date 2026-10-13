import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { RowShell, RowLabel } from "./row-primitives";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";

/* ----------------------------------------------------------------------------
 * The row vocabulary. Every row shares one shell — label block left, control
 * block right, hairline below — so the card styles only have to reason about
 * one shape. Hairlines sit on the rows and vanish on the last one; the card's
 * own padding is what turns them into inset dividers.
 * -------------------------------------------------------------------------- */

/** The workhorse: title + description on the left, any control on the right. */
export function SettingsRow({
  title,
  description,
  control,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  control?: React.ReactNode;
}) {
  return (
    <RowShell>
      <RowLabel title={title} description={description} />
      {control && <div className="flex shrink-0 items-center">{control}</div>}
    </RowShell>
  );
}

/** A whole-row link out of the app — trailing arrow nudges on hover. */
export function SettingsLinkRow({
  title,
  description,
  href,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-6 border-b-[0.5px] border-[var(--settings-hairline)] py-4 last:border-b-0"
    >
      <RowLabel title={title} description={description} />
      <Icon
        name="arrow-out"
        size="sm"
        weight="light"
        className="shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px"
      />
    </a>
  );
}

/** A prominent value with a caption — plan name, balance — plus an action. */
export function SettingsStatRow({
  value,
  caption,
  action,
}: {
  value: React.ReactNode;
  caption?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <RowShell>
      <RowLabel title={value} description={caption} strong />
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </RowShell>
  );
}

/** A usage meter: thin bar that eases to its fill on mount, plus a readout. */
export function SettingsMeterRow({
  title,
  caption,
  fraction,
  label,
}: {
  title: React.ReactNode;
  caption?: React.ReactNode;
  /** 0–1 fill of the bar. */
  fraction: number;
  /** Trailing readout, e.g. "95% left". */
  label: string;
}) {
  const reduce = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, fraction));
  return (
    <RowShell>
      <RowLabel title={title} description={caption} />
      <div className="flex shrink-0 items-center gap-3">
        <div
          role="progressbar"
          aria-valuenow={Math.round(clamped * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 w-24 overflow-hidden rounded-[var(--radius-capsule)] bg-[var(--color-state-press)]"
        >
          <motion.span
            className="block h-full w-full origin-left rounded-[var(--radius-capsule)] bg-[var(--color-bg-inverse)]"
            initial={reduce ? false : { transform: "scaleX(0)" }}
            animate={{ transform: `scaleX(${clamped})` }}
            transition={{ duration: 0.6, ease: easeOut }}
          />
        </div>
        <span className="w-16 text-right text-[13px] tabular-nums text-[var(--color-text-secondary)]">{label}</span>
      </div>
    </RowShell>
  );
}

/**
 * An entity in a pick-one list — leading media, name + blurb, and a trailing
 * Select action that swaps to a quiet "Selected" state. The swap crossfades in
 * place so choosing feels like the row settling, not re-rendering.
 */
export function SettingsEntityRow({
  media,
  title,
  description,
  selected,
  onSelect,
  selectLabel = "Select",
  selectedLabel = "Selected",
}: {
  media?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  selectLabel?: string;
  selectedLabel?: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b-[0.5px] border-[var(--settings-hairline)] py-4 last:border-b-0">
      {media && <div className="shrink-0">{media}</div>}
      <RowLabel title={title} description={description} />
      <div className="ml-auto flex shrink-0 items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {selected ? (
            <motion.span
              key="selected"
              initial={{ opacity: 0, transform: "scale(0.95)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.95)" }}
              transition={{ duration: 0.15, ease: easeOut }}
              className="oreo-squircle [--squircle-radius:var(--radius-control)] inline-flex h-8 items-center bg-[var(--color-state-hover)] px-3 text-[13px] font-medium text-[var(--color-text-tertiary)]"
            >
              {selectedLabel}
            </motion.span>
          ) : (
            <motion.span
              key="action"
              initial={{ opacity: 0, transform: "scale(0.95)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.95)" }}
              transition={{ duration: 0.15, ease: easeOut }}
            >
              <Button type="secondary" size="sm" onClick={onSelect}>
                {selectLabel}
              </Button>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A full-width multiline editor. Inputs keep their own border on every card
 * style — an editable surface needs an edge even when the cards around it
 * don't. */
export function SettingsEditor({
  value,
  defaultValue,
  onChange,
  placeholder,
  rows = 5,
  "aria-label": ariaLabel,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  "aria-label": string;
}) {
  return (
    <textarea
      aria-label={ariaLabel}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      rows={rows}
      className="oreo-squircle [--squircle-radius:var(--radius-card-small)] w-full resize-y border-[0.5px] border-[var(--color-border-default)] bg-transparent px-3.5 py-3 text-[13px] leading-6 tracking-[0.01em] text-[var(--color-text-primary)] outline-none transition-colors duration-150 placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-text-tertiary)]"
    />
  );
}

const CALLOUT_TONES = {
  warning: "bg-[var(--color-palette-orange-bg)] text-[var(--color-palette-orange-text)]",
  info: "bg-[var(--color-palette-blue-bg)] text-[var(--color-palette-blue-text)]",
} as const;

/** An inline notice — sits between sections, outside any card. */
export function SettingsCallout({
  tone = "warning",
  children,
}: {
  tone?: keyof typeof CALLOUT_TONES;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("oreo-squircle [--squircle-radius:var(--radius-card-small)] flex items-start gap-2.5 px-3.5 py-3", CALLOUT_TONES[tone])}>
      <Icon name="warning-circle" size="sm" weight="light" className="mt-0.5 shrink-0" />
      <p className="text-[13px] leading-5 tracking-[0.01em]">{children}</p>
    </div>
  );
}
