import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { PromptReveal, PromptSwap, PromptPresenceContent, promptTransition } from "./prompt-box.motion";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import { Shortcut } from "@/components/shortcut";
import { ShimmerText } from "@/components/activity-label";
import { Menu, MenuTrigger, MenuPopup } from "@/components/menu";
import { promptBox } from "./prompt-box.variants";

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
        "flex h-8 items-center gap-[var(--space-x2)] rounded-[var(--radius-control)] px-[var(--space-x4)]",
        "text-[14px] leading-5 text-[var(--color-text-primary)] outline-none select-none",
        "transition-colors duration-150 hover:bg-[var(--color-state-hover)] active:bg-[var(--color-state-press)]",
        "focus-visible:ring-2 focus-visible:ring-black/40",
        className,
      )}
      {...rest}
    >
      <span className="flex items-center gap-[4px]">
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
      <Icon name="chevron-down" weight="bold" className="size-[10px] text-[var(--color-text-secondary)]" />
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
  onMention?: () => void;
  /** Attachment row above the text — usually an `<AttachmentBar>`. */
  attachments?: React.ReactNode;
  /** Inline keyword tags at the head of the first text line. */
  tags?: React.ReactNode;
  /** The model picker — usually a `<PromptBoxModelSelect>`. */
  modelSelect?: React.ReactNode;
  /** Voice input add-on: `wave` replaces send (Type A), `mic` sits beside it (Type B). */
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
      <Shortcut keys={["/"]} />
      <span>for commands</span>
    </>
  );

  const spring = { bounce, duration, tapScale };
  const hairline = "ring-[0.5px] ring-[var(--color-border-subtle)]";

  const attachButton = (
    <IconButton
      aria-label="Add attachment"
      type="secondary"
      icon={<Icon name="paperclip" />}
      onClick={onAttach}
      className={hairline}
      {...spring}
    />
  );
  const mentionButton = (
    <IconButton
      aria-label="Mention"
      type="secondary"
      icon={<Icon name="at" />}
      onClick={onMention}
      className={hairline}
      {...spring}
    />
  );

  const sendButton = canSend ? (
    <IconButton
      aria-label="Send"
      type="primary"
      icon={<Icon name="arrow-up" weight="bold" />}
      onClick={submit}
      {...spring}
    />
  ) : (
    <IconButton
      aria-label="Send"
      type="secondary"
      icon={<Icon name="arrow-up" weight="bold" />}
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
        "bg-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-black/40",
      )}
    >
      <span className="size-2.5 rounded-[1px] bg-[var(--color-text-on-inverse)]" />
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
        "bg-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-black/40",
        "[&_img]:size-5",
      )}
    >
      <AudioWaveGlyph className="size-5 text-[var(--color-text-on-inverse)]" />
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
        "bg-[var(--color-status-progress-subtle)] outline-none focus-visible:ring-2 focus-visible:ring-black/40",
      )}
    >
      <EqBars animate />
      <span className="text-[14px] leading-5 font-medium text-[var(--color-status-progress)]">Stop</span>
    </motion.button>
  );

  const thinkingPill = (
    <span
      className={cn(
        "flex h-8 min-w-[100px] items-center justify-center rounded-[var(--radius-capsule)] px-[var(--space-x6)]",
        "bg-[var(--color-bg-elevated)] text-[12px] leading-5 font-medium text-[var(--color-text-secondary)]",
      )}
    >
      <ShimmerText>Thinking</ShimmerText>
    </span>
  );

  const micButton = (
    <IconButton
      aria-label={voiceStatus === "inputting" ? "Stop voice input" : "Start voice input"}
      type="tertiary"
      icon={<Icon name="mic" />}
      onClick={onVoiceToggle}
      className={voiceStatus === "inputting" ? "text-[var(--color-status-progress)]" : "text-[var(--color-text-primary)]"}
      {...spring}
    />
  );

  const voicePrimary = voiceStatus === "inputting" ? stopPill : voiceStatus === "thinking" ? thinkingPill : waveButton;

  const card = (
    <div className={slots.card()}>
      <div className={cn(slots.content(), "gap-0")}>
        <PromptReveal>{attachments != null && <div className="pb-[var(--space-x4)]">{attachments}</div>}</PromptReveal>
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
      <div className={cn(slots.actions(), "gap-[var(--space-x4)]")}>
        <div className={slots.actionCluster()}>{attachButton}{mentionButton}</div>
        <motion.div layout={reduce ? false : "position"} transition={promptTransition}
          className="ml-auto">
          {modelSelect}
        </motion.div>
        <motion.div layout={reduce ? false : "position"} transition={promptTransition} className={cn(slots.actionCluster(), "justify-end")}>
          <AnimatePresence initial={false} mode="popLayout">
            {voice === "mic" && <motion.div key="mic" layout={reduce ? false : "position"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={promptTransition}>{micButton}</motion.div>}
          </AnimatePresence>
          <PromptSwap state={voice === "wave" ? `voice-${voiceStatus}` : running ? "running" : "send"}>
            {voice === "wave" ? voicePrimary : running ? stopButton : sendButton}
          </PromptSwap>
        </motion.div>
      </div>
    </div>
  );

  return (
    <LayoutGroup id={layoutId}>
      <div className={cn(slots.stack(), className)} {...rest}>
        <PromptReveal edge="header">{header != null && <div className={cn("transition-[padding] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none", inset && "px-[var(--space-x6)]")}>{header}</div>}</PromptReveal>
        {card}
        <PromptReveal edge="footer">{footer != null && <div className={cn("transition-[padding] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none", inset && "px-[var(--space-x6)]")}>{footer}</div>}</PromptReveal>
      </div>
    </LayoutGroup>
  );
}

/** The kit's Icon/Audio glyph (exported union, 15.4×14.6 in a 20px box). */
function AudioWaveGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        transform="translate(2.292 2.708)"
        fill="currentColor"
        d="M6.29102 0C6.63609 0 6.91584 0.279972 6.91602 0.625V13.959C6.91584 14.304 6.63609 14.584 6.29102 14.584C5.9461 14.5838 5.66619 14.3039 5.66602 13.959V0.625C5.66619 0.28008 5.9461 0.000176004 6.29102 0ZM11.958 1.48145C12.303 1.48149 12.5828 1.76148 12.583 2.10645V11.7363C12.5829 12.0814 12.3031 12.3613 11.958 12.3613C11.6129 12.3613 11.3331 12.0814 11.333 11.7363V2.10645C11.3332 1.76148 11.613 1.48149 11.958 1.48145ZM3.45801 2.22266C3.8031 2.2227 4.08293 2.50257 4.08301 2.84766V10.9951C4.08301 11.3403 3.80315 11.6201 3.45801 11.6201C3.11287 11.6201 2.83301 11.3403 2.83301 10.9951V2.84766C2.83308 2.50257 3.11291 2.2227 3.45801 2.22266ZM9.125 3.7041C9.47 3.70428 9.74995 3.98407 9.75 4.3291V9.51367C9.75 9.85874 9.47003 10.1385 9.125 10.1387C8.77982 10.1387 8.5 9.85885 8.5 9.51367V4.3291C8.50005 3.98397 8.77985 3.7041 9.125 3.7041ZM0.625 5.18555C0.970013 5.18572 1.24998 5.4655 1.25 5.81055V8.03223C1.25 8.3773 0.970028 8.65705 0.625 8.65723C0.279822 8.65723 0 8.3774 0 8.03223V5.81055C2.44804e-05 5.46539 0.279837 5.18555 0.625 5.18555ZM14.791 5.18555C15.1362 5.18555 15.416 5.46539 15.416 5.81055V8.03223C15.416 8.3774 15.1362 8.65723 14.791 8.65723C14.446 8.65705 14.166 8.3773 14.166 8.03223V5.81055C14.166 5.4655 14.446 5.18572 14.791 5.18555Z"
      />
    </svg>
  );
}
