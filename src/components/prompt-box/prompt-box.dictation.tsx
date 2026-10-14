import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PromptBox, type PromptBoxProps } from "./prompt-box";
import { PromptPresenceContent, promptTransition } from "./prompt-box.motion";
import { ContextBar } from "@/components/context-bar";
import { ShimmerText } from "@/components/activity-label";
import { Icon } from "@/components/icon";
import { keywordTag } from "@/components/keyword-tag";
import { cn } from "@/lib/cn";
import "./prompt-box.dictation.css";

export type PromptBoxAction = {
  /** Stable across partial transcript updates, so removed actions stay removed. */
  id: string;
  label: string;
  /** Complete instruction included in the submitted prompt. */
  text: string;
};
export type PromptBoxDraft = { text: string; actions: PromptBoxAction[] };
export type PromptBoxDictationStatus = "idle" | "listening" | "processing" | "ready" | "error";

export function composePromptDraft(draft: PromptBoxDraft): string {
  return [draft.text.trim(), ...draft.actions.map(action => action.text.trim())].filter(Boolean).join("\n");
}

const quietButton = "rounded-[var(--radius-control)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] disabled:opacity-40";

export type PromptBoxActionsProps = {
  actions: PromptBoxAction[];
  onRemove: (id: string) => void;
  onClear?: () => void;
  onEdit?: () => void;
  disabled?: boolean;
};

/** Docked action review. Every removal remains visible to touch and keyboard users. */
export function PromptBoxActions({ actions, onRemove, onClear, onEdit, disabled }: PromptBoxActionsProps) {
  const reduce = useReducedMotion();
  const tag = keywordTag({ color: "mint" });
  const bar = React.useRef<HTMLDivElement>(null);
  const remove = (id: string) => {
    // Keep keyboard focus in the review after its current chip disappears.
    const buttons = Array.from(bar.current?.querySelectorAll<HTMLButtonElement>("button[data-action-remove]") ?? []);
    const index = actions.findIndex(action => action.id === id);
    (buttons[index + 1] ?? buttons[index - 1] ?? bar.current)?.focus();
    onRemove(id);
  };
  return <div ref={bar} tabIndex={-1} aria-label="Dictated actions"><ContextBar role="group" aria-label="Dictated actions">
    <div className="flex w-full flex-wrap items-center gap-2 text-xs">
      <span role="status" className="mr-auto text-[var(--color-text-secondary)]">{actions.length} {actions.length === 1 ? "action" : "actions"}</span>
      {onEdit && <button type="button" disabled={disabled} className={quietButton} onClick={onEdit}>Edit as text</button>}
      {onClear && <button type="button" disabled={disabled} className={quietButton} onClick={onClear}>Clear actions</button>}
    </div>
    <ul className="flex w-full flex-wrap gap-2" aria-label="Actions to include">
      <AnimatePresence initial={false}>
        {actions.map(action => <motion.li key={action.id} layout={reduce ? false : "position"}
          initial={{ opacity: 0, y: reduce ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 0 }}
          transition={reduce ? { duration: 0 } : promptTransition} className="min-w-0 max-w-full">
          <PromptPresenceContent>
            <span className={cn(tag.root(), "h-auto min-h-6 max-w-full gap-1 whitespace-normal")} title={action.text}>
              <span className="min-w-0 break-words">{action.label}</span>
              <button type="button" data-action-remove disabled={disabled} aria-label={`Remove ${action.label}`}
                onClick={() => remove(action.id)} className={cn(quietButton, "grid size-6 shrink-0 place-items-center text-inherit")}>
                <Icon name="x" size="sm" />
              </button>
            </span>
          </PromptPresenceContent>
        </motion.li>)}
      </AnimatePresence>
    </ul>
  </ContextBar></div>;
}

export type PromptBoxDictationProps = Omit<PromptBoxProps,
  "value" | "defaultValue" | "onValueChange" | "onSubmit" | "header" | "voice" | "voiceStatus" | "onVoiceToggle" | "readOnly" | "submitDisabled"
> & {
  draft: PromptBoxDraft;
  onDraftChange: (draft: PromptBoxDraft) => void;
  status: PromptBoxDictationStatus;
  /** Interim speech shown separately; it is never submitted as an action. */
  transcript?: string;
  error?: string;
  onStart: () => void;
  onFinish: () => void;
  onCancel: () => void;
  onRetry?: () => void;
  onSubmit: (submission: { prompt: string; actions: PromptBoxAction[] }) => void;
};

/** UI only: the caller owns speech recognition, extraction, and session cancellation. */
export function PromptBoxDictation({ draft, onDraftChange, status, transcript, error, onStart, onFinish, onCancel, onRetry, onSubmit, running, className, ...rest }: PromptBoxDictationProps) {
  const active = status === "listening" || status === "processing";
  const prompt = composePromptDraft(draft);
  const root = React.useRef<HTMLDivElement>(null);
  const updateDraft = (next: PromptBoxDraft) => {
    onDraftChange(next);
    if (draft.actions.length > 0 && next.actions.length === 0) {
      requestAnimationFrame(() => root.current?.querySelector("textarea")?.focus());
    }
  };
  const label = status === "listening" ? "Listening" : status === "processing" ? "Organizing your prompt" : status === "error" ? "Dictation interrupted" : status === "ready" ? "Ready to send" : "Speak your next idea";
  const remove = (id: string) => updateDraft({ ...draft, actions: draft.actions.filter(action => action.id !== id) });
  return <div ref={root} className={cn("flex w-full max-w-[800px] flex-col gap-3", className)}>
    <PromptBox {...rest} running={running} value={draft.actions.length ? prompt : draft.text}
      readOnly={active || draft.actions.length > 0 || running}
      submitDisabled={active || status === "error"}
      onValueChange={text => onDraftChange({ text, actions: [] })}
      onSubmit={() => onSubmit({ prompt, actions: draft.actions.map(action => ({ ...action })) })}
      voice={running || status === "processing" || status === "error" ? undefined : "mic"}
      voiceStatus={status === "listening" ? "inputting" : "idle"}
      onVoiceToggle={status === "listening" ? onFinish : onStart}
      header={draft.actions.length > 0 ? <PromptBoxActions actions={draft.actions} onRemove={remove} disabled={running}
        onClear={() => updateDraft({ ...draft, actions: [] })}
        onEdit={active || running ? undefined : () => updateDraft({ text: prompt, actions: [] })} /> : undefined}
    />
    <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--color-text-secondary)]">
      <span role="status" className="flex items-center gap-2">
        <span aria-hidden className={cn("oreo-dictation-orb", active && "oreo-dictation-orb-active")} />
        {active ? <ShimmerText>{label}</ShimmerText> : label}
      </span>
      {active && <button type="button" className={quietButton} onClick={onCancel}>Cancel dictation</button>}
    </div>
    {status === "listening" && transcript && <p className="text-sm leading-6 text-[var(--color-text-secondary)]"><span className="font-medium">Hearing: </span>{transcript}</p>}
    {status === "error" && <div role="alert" className="flex flex-wrap items-center gap-3 rounded-[var(--radius-control)] bg-[var(--color-bg-elevated)] p-3 text-sm">
      <p className="min-w-0 flex-1 basis-full break-words sm:basis-auto">{error ?? "Dictation stopped. Your draft is safe."}</p>
      {onRetry && <button type="button" className={quietButton} onClick={onRetry}>Try again</button>}
      <button type="button" className={quietButton} onClick={onCancel}>Keep draft</button>
    </div>}
  </div>;
}
