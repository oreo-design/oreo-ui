import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import "./inline-confirm.css";

type Phase = "idle" | "confirming" | "pending" | "success" | "error";
export type InlineConfirmProps = {
  /** Resolve only after the action succeeds; reject to keep an inline retry. */
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  label?: string;
  question?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  successLabel?: string;
  errorMessage?: string;
  retryLabel?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

/** Two deliberate clicks, in one place. No portal, modal or automatic deletion. */
export function InlineConfirm({
  onConfirm, onCancel, label = "Delete project", question = "Delete project?",
  confirmLabel = "Delete", cancelLabel = "Cancel", pendingLabel = "Deleting",
  successLabel = "Deleted", errorMessage = "Could not delete. Try again.",
  retryLabel = "Try again", icon = <Icon name="trash" />, disabled = false, className,
}: InlineConfirmProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [keyboard, setKeyboard] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const running = useRef(false);
  const dismissed = useRef(false);
  const focusNext = useRef<"trigger" | "cancel" | "status" | "root" | null>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const expanded = phase === "confirming" || phase === "error";
  const move = !reduced && !keyboard;

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useLayoutEffect(() => {
    const target = focusNext.current;
    if (target) ({ trigger, cancel, status, root }[target]).current?.focus({ preventScroll: true });
    focusNext.current = null;
  }, [phase]);

  const dismiss = (restoreFocus: boolean) => {
    if (!expanded || running.current || dismissed.current) return;
    dismissed.current = true;
    focusNext.current = restoreFocus ? "trigger" : null;
    setPhase("idle");
    onCancel?.();
  };

  useEffect(() => {
    if (!expanded) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) dismiss(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  });

  useEffect(() => {
    if (disabled && expanded) {
      focusNext.current = root.current?.contains(document.activeElement) ? "root" : null;
      setPhase("idle");
    }
  }, [disabled, expanded]);

  const confirm = async () => {
    if (!expanded || disabled || running.current) return;
    running.current = true;
    focusNext.current = "status";
    setPhase("pending");
    try {
      await onConfirm();
      if (mounted.current) {
        if (root.current?.contains(document.activeElement)) focusNext.current = "status";
        setPhase("success");
      }
    } catch {
      if (mounted.current) {
        if (root.current?.contains(document.activeElement)) focusNext.current = "cancel";
        setPhase("error");
      }
    } finally { running.current = false; }
  };

  return <div ref={root} tabIndex={-1} className={cn("oreo-inline-confirm inline-flex max-w-full flex-col items-start gap-2 outline-none", className)} data-phase={phase} data-keyboard={keyboard || undefined}
    onPointerDownCapture={() => setKeyboard(false)}
    onKeyDownCapture={event => {
      setKeyboard(true);
      if (event.key === "Escape" && expanded) { event.preventDefault(); event.stopPropagation(); dismiss(true); }
    }}
    onBlur={event => {
      // Moving to Cancel/Delete stays inside the group. Tab out dismisses it.
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) dismiss(false);
    }}>
    <motion.div layout={move} transition={{ layout: { duration: expanded ? .25 : .18, ease: easeOut } }}
      className="oreo-confirm-surface relative max-w-full rounded-capsule bg-bg-surface p-1 text-text-primary"
      style={{ borderRadius: "calc(var(--radius-card-small) * 2)" }}>
      <motion.div key={phase} layout={move ? "position" : false}
        initial={phase === "idle" || keyboard ? false : { opacity: 0, transform: move ? "translateY(3px)" : "translateY(0px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: keyboard ? 0 : .15, ease: easeOut }}>
        {phase === "idle" ? <Button render={<button ref={trigger} type="button" />} type="tertiary" size="lg" disabled={disabled}
          className="oreo-confirm-action min-h-11 h-auto max-w-full gap-2 rounded-capsule px-4 py-2 text-text-primary whitespace-normal break-words"
          aria-expanded={false} onClick={event => { dismissed.current = false; setKeyboard(event.detail === 0); focusNext.current = "cancel"; setPhase("confirming"); }}
          leadingIcon={<span aria-hidden className="shrink-0 text-text-secondary">{icon}</span>}>{label}</Button>
          : expanded ? <div role="group" aria-labelledby={`${id}-question`} aria-describedby={phase === "error" ? `${id}-error` : undefined} className="flex max-w-full flex-wrap items-center gap-x-2 gap-y-1">
            <span id={`${id}-question`} className="min-w-0 flex-1 basis-auto px-3 py-2 text-sm font-medium break-words">{question}</span>
            <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-1">
              <Button render={<button ref={cancel} type="button" />} type="tertiary" size="lg" className="oreo-confirm-action min-h-11 h-auto max-w-full rounded-capsule px-3 py-2 whitespace-normal break-words" onClick={() => dismiss(true)}>{cancelLabel}</Button>
              <Button render={<button type="button" />} type="tertiary" size="lg" danger disabled={disabled}
                className="oreo-confirm-action oreo-confirm-danger min-h-11 h-auto max-w-full rounded-capsule px-4 py-2 whitespace-normal break-words" onClick={event => { if (event.detail < 2) void confirm(); }}>{phase === "error" ? retryLabel : confirmLabel}</Button>
            </div>
          </div>
          : <div ref={status} tabIndex={-1} className="flex min-h-11 items-center gap-2 rounded-capsule px-4 text-sm font-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-status-progress" aria-busy={phase === "pending"}>
            <span aria-hidden className={phase === "pending" ? "oreo-confirm-spinner" : "text-status-success"}><Icon name={phase === "pending" ? "spinner" : "check"} /></span>
            <span className="min-w-0 break-words">{phase === "pending" ? pendingLabel : successLabel}</span>
          </div>}
      </motion.div>
    </motion.div>
    <span role="status" aria-live="polite" className="sr-only">{phase === "pending" ? pendingLabel : phase === "success" ? successLabel : ""}</span>
    {phase === "error" && <p id={`${id}-error`} role="alert" className="max-w-full px-4 text-xs leading-5 text-status-error">{errorMessage}</p>}
  </div>;
}
