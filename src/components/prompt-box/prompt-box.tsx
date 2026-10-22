import { ComposerAsset } from "@/components/composer/assets";
import { StopGlyph } from "@/components/icon";
import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { PromptReveal, PromptSwap, PromptPresenceContent, promptTransition } from "./prompt-box.motion";
import { IconButton } from "@/components/button";
import { shortcutCap } from "@/components/shortcut/shortcut.variants";
import { ShimmerText } from "@/components/activity-label";
import { Menu, MenuTrigger, MenuPopup } from "@/components/menu";
import { promptBox } from "./prompt-box.variants";

import { PromptBoxPermission, PromptBoxConnectApps, type PromptBoxPermissionProps, type PromptBoxConnectAppsProps } from "./prompt-box.controls";

const slots = promptBox();

/* ----------------------------- Keyword Tag ------------------------------ */

// The inline keyword chip grew into its own component — re-exported here so
// composer-side imports keep working.
export { KeywordTag, type KeywordTagProps } from "@/components/keyword-tag";

/* -------------------------- Model Select trigger ------------------------- */

export type PromptBoxModelSelectProps = {
  /** 12px brand mark rendered in a 16px box. */
  icon?: React.ReactNode;
  /** Current model name. */
  label: React.ReactNode;
  /** Menu content (MenuItem / MenuSubmenu…). Omit for a plain trigger. */
  menu?: React.ReactNode;
  /** Popup placement relative to the trigger. */
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children">;

/** The "Claude ⌄" model picker. With `menu` it opens the real dropdown. */
export function PromptBoxModelSelect({
  icon,
  label,
  menu,
  side = "top",
  align = "end",
  className,
  ...rest
}: PromptBoxModelSelectProps) {
  const trigger = (
    <button
      type="button"
      className={cn(
        "oreo-model-selector oreo-squircle oreo-state-layer flex h-8 items-center gap-[var(--space-x2)] px-[var(--space-x4)]",
        "text-[14px] font-normal leading-5 text-[var(--color-text-primary)] outline-none select-none",
        "transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        className,
      )}
      {...rest}
    >
      <span className="flex items-center gap-1">
        {icon != null && (
          <span className="grid size-4 place-items-center overflow-hidden [&_img]:size-3 [&_svg]:size-3">{icon}</span>
        )}
        <span className="relative inline-grid">
          <AnimatePresence initial={false}>
            <motion.span key={typeof label === "string" ? label : "label"} className="col-start-1 row-start-1 whitespace-nowrap"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={promptTransition}>{label}</motion.span>
          </AnimatePresence>
        </span>
      </span>
      <ComposerAsset name="chevron" />
    </button>
  );

  if (menu == null) return trigger;

  return (
    <Menu>
      <MenuTrigger render={trigger} />
      <MenuPopup side={side} align={align}>
        {menu}
      </MenuPopup>
    </Menu>
  );
}

/* ----------------------------- Voice pieces ------------------------------ */

/** Bar heights of the kit's 36px-wide equalizer glyph, in px. */
const EQ_BARS = [4, 6, 6, 10, 8, 6, 6, 8, 12, 8, 6, 4];

function EqBars({ animate }: { animate?: boolean }) {
  return (
    <span aria-hidden className="flex h-full w-9 items-center justify-between">
      {EQ_BARS.map((h, i) => (
        <span
          key={i}
          style={{
            height: h,
            animationDelay: animate ? `${(i % 4) * 0.12}s` : undefined,
          }}
          className={cn(
            "w-[1.6px] rounded-[var(--radius-capsule)] bg-[var(--color-status-progress)]",
            animate && "animate-[oreo-eq_0.9s_ease-in-out_infinite] motion-reduce:animate-none",
          )}
        />
      ))}
    </span>
  );
}

/* ------------------------------- Prompt Box ------------------------------ */

export type PromptBoxProps = {
  /** Controlled input value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Empty-state hint. Defaults to the "Type a prompt or press / …" row. */
  placeholder?: React.ReactNode;
  /** A response is streaming — the send button becomes a stop square. */
  running?: boolean;
  /** Fired on send button press or Enter (without Shift). */
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  /** Prevent sending while external input is being finalized. */
  submitDisabled?: boolean;
  /** Keep a structured/generated prompt selectable without allowing text edits. */
  readOnly?: boolean;
  onAttach?: () => void;
  /** Attachment button or quiet plus entry. Custom attachControl takes priority. */
  entryStyle?: "attachment" | "add";
  showMention?: boolean;
  permission?: PromptBoxPermissionProps;
  /** Used when footer is undefined; footer={null} explicitly hides it. */
  connectApps?: PromptBoxConnectAppsProps;
  /** Custom controls preserve the action slots while adding anchored menus. */
  attachControl?: React.ReactNode;
  mentionControl?: React.ReactNode;
  onPromptKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onMention?: () => void;
  /** Attachment row above the text — usually an `<AttachmentBar>`. */
  attachments?: React.ReactNode;
  /** Inline keyword tags at the head of the first text line. */
  tags?: React.ReactNode;
  /** The model picker — usually a `<PromptBoxModelSelect>`. */
  modelSelect?: React.ReactNode;
  /** Voice input add-on: `wave` and `mic` both sit beside Send, per the Figma Type A/B variants. */
  voice?: "wave" | "mic";
  /** Voice lifecycle — drives the wave button / Stop pill / Thinking pill. */
  voiceStatus?: "idle" | "inputting" | "thinking";
  onVoiceToggle?: () => void;
  /** Context Bar above the card — tucked 16px underneath it. */
  header?: React.ReactNode;
  /** Context Bar below the card. */
  footer?: React.ReactNode;
  /** Indent attached bars by 12px so they read as inset (Figma `Is Inset`). */
  inset?: boolean;
  /** Press-spring controls, exposed so docs can tune them live. */
  bounce?: number;
  duration?: number;
  tapScale?: number;
} & Omit<React.ComponentPropsWithoutRef<"div">, "onSubmit" | "children">;

/**
 * Oreo UI Prompt Box — a multi-state input component for agent conversations.
 * Composes Attachment, Chip, Menu, and Context Bar without owning them.
 */
export function PromptBox({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  running = false,
  onSubmit,
  onStop,
  submitDisabled = false,
  readOnly = false,
  onAttach,
  entryStyle = "attachment",
  showMention = true,
  permission,
  connectApps,
  attachControl,
  mentionControl,
  onPromptKeyDown,
  onMention,
  attachments,
  tags,
  modelSelect,
  voice,
  voiceStatus = "idle",
  onVoiceToggle,
  header,
  footer,
  inset = false,
  bounce = 0.4,
  duration = 0.3,
  tapScale = 0.96,
  className,
  ...rest
}: PromptBoxProps) {
  const reduce = useReducedMotion();
  const layoutId = React.useId();
  const [textHeight, setTextHeight] = React.useState(60);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const text = value ?? internal;
  const canSend = text.trim().length > 0 && !submitDisabled;

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [tagsElement, setTagsElement] = React.useState<HTMLDivElement | null>(null);
  const [indent, setIndent] = React.useState(0);

  // Measure at the destination indent, then let Motion interpolate the height.
  // Restore the live style before paint; the textarea itself is never remounted.
  const measureText = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const previousHeight = el.style.height;
    const previousIndent = el.style.textIndent;
    el.style.height = "0px";
    el.style.textIndent = `${indent}px`;
    const height = Math.max(el.scrollHeight, 60);
    el.style.height = previousHeight;
    el.style.textIndent = previousIndent;
    setTextHeight(height);
  }, [indent]);
  React.useLayoutEffect(measureText, [text, measureText]);
  React.useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth !== width) { width = el.clientWidth; measureText(); }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [measureText]);

  // A programmatic replacement fades in; ordinary typing stays immediate.
  const previousText = React.useRef(text);
  React.useLayoutEffect(() => {
    const previous = previousText.current;
    previousText.current = text;
    if (!text || text === previous || document.activeElement === textareaRef.current ||
      (text.startsWith(previous) && text.length - previous.length <= 2)) return;
    const animation = textareaRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200, easing: `cubic-bezier(${easeOut.join(",")})`,
    });
    return () => animation?.cancel();
  }, [text]);

  // Keyword tags sit inline at the head of the first line: measure the tag
  // row and indent the textarea's first line by exactly that much.
  React.useLayoutEffect(() => {
    const el = tagsElement;
    if (tags == null || !el) {
      setIndent(0);
      return undefined;
    }
    const measure = () => setIndent(el.offsetWidth + 8);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [tags, tagsElement]);

  const setText = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const submit = () => {
    if (!canSend || running) return;
    onSubmit?.(text);
  };

  const defaultPlaceholder = running ? (
    <>Continue asking...</>
  ) : (
    <>
      <span>Type a prompt or press</span>
      <kbd aria-label="/" className={cn(shortcutCap({ size: "sm" }), "w-5 px-0 text-text-placeholder")}><ComposerAsset name="slash" /></kbd>
      <span className="oreo-legacy-label leading-5">for commands</span>
    </>
  );

  const spring = { bounce, duration, tapScale };
  const hairline = "ring-[0.5px] ring-[var(--color-border-subtle)]";

  const attachButton = (
    <IconButton
      aria-label={entryStyle === "add" ? "Add" : "Add attachment"}
      type={entryStyle === "add" ? "tertiary" : "secondary"}
      icon={entryStyle === "add" ? <ComposerAsset name="add" /> : <ComposerAsset name="attach" />}
      onClick={onAttach}
      className={entryStyle === "add" ? undefined : hairline}
      {...spring}
    />
  );
  const mentionButton = (
    <IconButton
      aria-label="Mention"
      type="secondary"
      icon={<ComposerAsset name="mention" />}
      onClick={onMention}
      className={hairline}
      {...spring}
    />
  );

  const sendButton = canSend ? (
    <IconButton
      aria-label="Send"
      type="primary"
      icon={<ComposerAsset name="send" />}
      onClick={submit}
      {...spring}
    />
  ) : (
    <IconButton
      aria-label="Send"
      type="secondary"
      icon={<ComposerAsset name="send" />}
      disabled
      className="bg-[var(--color-bg-elevated)] ring-[0.5px] ring-[var(--color-border-default)]"
    />
  );

  const stopButton = (
    <motion.button
      type="button"
      aria-label="Stop"
      onClick={onStop}
      whileTap={reduce ? undefined : { scale: tapScale }}
      transition={{ type: "spring", bounce, duration }}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[var(--radius-capsule)]",
        "bg-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
      )}
    >
      <StopGlyph />
    </motion.button>
  );

  const waveButton = (
    <motion.button
      type="button"
      aria-label="Start voice input"
      onClick={onVoiceToggle}
      whileTap={reduce ? undefined : { scale: tapScale }}
      transition={{ type: "spring", bounce, duration }}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[var(--radius-capsule)]",
        "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
      )}
    >
      <ComposerAsset name="audio" />
    </motion.button>
  );

  const stopPill = (
    <motion.button
      type="button"
      onClick={onVoiceToggle}
      whileTap={reduce ? undefined : { scale: tapScale }}
      transition={{ type: "spring", bounce, duration }}
      className={cn(
        "flex h-8 items-center gap-[var(--space-x4)] rounded-[var(--radius-capsule)] px-[var(--space-x6)]",
        "bg-[var(--color-status-progress-subtle)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
      )}
    >
      <EqBars animate />
      <span className="oreo-legacy-label text-[14px] leading-5 font-medium text-[var(--color-status-progress)]">Stop</span>
    </motion.button>
  );

  const thinkingPill = (
    <span
      className={cn(
        "oreo-legacy-label relative overflow-hidden flex h-8 min-w-[74px] items-center justify-center rounded-[var(--radius-capsule)] px-[var(--space-x6)]",
        "bg-[var(--color-bg-elevated)] text-[12px] leading-5 font-medium text-[var(--color-text-secondary)]",
      )}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-[51px] bg-state-hover" /><ShimmerText>Thinking</ShimmerText>
    </span>
  );

  const micButton = (
    <IconButton
      aria-label={voiceStatus === "inputting" ? "Stop voice input" : "Start voice input"}
      type="tertiary"
      icon={<ComposerAsset name={voiceStatus === "inputting" ? "mic" : "micOutline"} />}
      onClick={onVoiceToggle}
      className={voiceStatus === "inputting" ? "bg-status-progress-subtle text-[var(--color-status-progress)] ring-4 ring-inset ring-[color-mix(in_srgb,var(--color-status-progress)_6%,transparent)]" : "text-[var(--color-text-primary)]"}
      {...spring}
    />
  );

  const voicePrimary = voiceStatus === "inputting" ? stopPill : voiceStatus === "thinking" ? thinkingPill : waveButton;

  const card = (
    <div className={slots.card()}>
      <div className={cn(slots.content(), "gap-0")}>
        <PromptReveal>{attachments != null && <div className="pb-[var(--space-x8)]">{attachments}</div>}</PromptReveal>
        <div className={slots.inputWrap()}>
          <AnimatePresence initial={false}>
            {tags != null && <motion.div key="tags" ref={setTagsElement} className={cn(slots.tags(), "[&_span]:transition-colors [&_span]:duration-200")}
              initial={{ opacity: 0, transform: reduce ? "scale(1)" : "scale(0.95)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: reduce ? "scale(1)" : "scale(0.95)" }}
              transition={promptTransition} style={{ transformOrigin: "left center" }}>
              <PromptPresenceContent>{tags}</PromptPresenceContent>
            </motion.div>}
          </AnimatePresence>
          <motion.textarea
            ref={textareaRef}
            value={text}
            rows={1}
            readOnly={readOnly}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              onPromptKeyDown?.(event);
              if (event.defaultPrevented) return;
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder=""
            aria-label="Prompt"
            className={cn(slots.textarea(), "overflow-hidden")}
            initial={false}
            animate={{ height: textHeight, textIndent: `${indent}px` }}
            transition={reduce ? { duration: 0 } : promptTransition}
          />
          <AnimatePresence initial={false}>
            {text === "" && <motion.div key="placeholder" className={cn(slots.placeholder(), "right-0 overflow-hidden")} initial={{ opacity: 0 }} animate={{ opacity: 1, left: indent }} exit={{ opacity: 0 }} transition={reduce ? { opacity: promptTransition, left: { duration: 0 } } : promptTransition}>{placeholder ?? defaultPlaceholder}</motion.div>}
          </AnimatePresence>
        </div>
      </div>
      <div className={cn(slots.actions(), "oreo-prompt-actions gap-[var(--space-x4)]")}>
        <div className={cn(slots.actionCluster(), "oreo-prompt-leading")} >
          {attachControl ?? attachButton}
          {showMention && (mentionControl ?? mentionButton)}
          {permission && <PromptBoxPermission {...permission} />}
        </div>
        <div className="oreo-prompt-trailing">
        <motion.div layout={reduce ? false : "position"} transition={promptTransition}
          className="ml-auto">
          {modelSelect}
        </motion.div>
        <motion.div layout={reduce ? false : "position"} transition={promptTransition} className={cn(slots.actionCluster(), "justify-end")}>
          <AnimatePresence initial={false} mode="popLayout">
            {voice === "mic" && <motion.div key="mic" layout={reduce ? false : "position"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={promptTransition}>{micButton}</motion.div>}
          </AnimatePresence>
          {voice === "wave" && <PromptSwap state={`voice-${voiceStatus}`}>{voicePrimary}</PromptSwap>}
          <PromptSwap state={running ? "running" : "send"}>{running ? stopButton : sendButton}</PromptSwap>
        </motion.div>
        </div>
      </div>
    </div>
  );

  const resolvedFooter = footer !== undefined ? footer : connectApps ? <PromptBoxConnectApps {...connectApps} /> : undefined;

  return (
    <LayoutGroup id={layoutId}>
      <div className={cn(slots.stack(), className)} {...rest}>
        <PromptReveal edge="header">{header != null && <div className={cn("transition-[padding] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none", inset && "px-[var(--space-x6)]")}>{header}</div>}</PromptReveal>
        {card}
        <PromptReveal edge="footer">{resolvedFooter != null && <div className={cn("transition-[padding] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none", inset && "px-[var(--space-x6)]")}>{resolvedFooter}</div>}</PromptReveal>
      </div>
    </LayoutGroup>
  );
}
