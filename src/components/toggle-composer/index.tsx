import { useId, useRef, useState, type ReactNode } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/cn";
import "./toggle-composer.css";

export type ComposerMode = "quick" | "long";
export type ComposerValue = {
  quick: string;
  headline: string;
  intro: string;
  body: string;
};
export const EMPTY_COMPOSER: ComposerValue = {
  quick: "",
  headline: "",
  intro: "",
  body: "",
};
export type ComposerFormat =
  | "h1"
  | "h2"
  | "h3"
  | "bullets"
  | "numbered"
  | "bold"
  | "italic"
  | "link";

/** Native radios supply arrow navigation and a single Tab stop. */
export function ComposerModeSwitch({
  value,
  onValueChange,
  disabled = false,
}: {
  value: ComposerMode;
  onValueChange: (value: ComposerMode) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [pointer, setPointer] = useState(false);
  return (
    <fieldset
      className="composer-mode"
      disabled={disabled}
      data-pointer={pointer}
      onPointerDown={() => setPointer(true)}
      onKeyDown={() => setPointer(false)}
    >
      <legend className="sr-only">Post length</legend>
      <span
        aria-hidden="true"
        className="composer-mode-indicator"
        style={{ transform: `translateX(${value === "long" ? 100 : 0}%)` }}
      />
      {(["quick", "long"] as const).map((mode) => (
        <label key={mode} className="composer-mode-option">
          <input
            type="radio"
            name={id}
            value={mode}
            checked={value === mode}
            onChange={() => onValueChange(mode)}
          />
          <span>{mode === "quick" ? "Quick Post" : "Long Post"}</span>
        </label>
      ))}
    </fieldset>
  );
}
const formats: {
  id: ComposerFormat;
  label: string;
  icon?: IconName;
  text?: string;
}[] = [
  { id: "h1", label: "Heading 1", text: "H₁" },
  { id: "h2", label: "Heading 2", text: "H₂" },
  { id: "h3", label: "Heading 3", text: "H₃" },
  { id: "bullets", label: "Bullet list", icon: "list" },
  { id: "numbered", label: "Numbered list", text: "1." },
  { id: "bold", label: "Bold", icon: "text-bold" },
  { id: "italic", label: "Italic", icon: "text-italic" },
  { id: "link", label: "Insert link", icon: "link" },
];
export function ComposerFormattingToolbar({
  mode = "long",
  onFormat,
  onAttach,
  disabled = false,
}: {
  mode?: ComposerMode;
  onFormat?: (format: ComposerFormat) => void;
  onAttach?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="composer-tools" role="group" aria-label="Text formatting">
      {onAttach && (
        <IconButton
          type="tertiary"
          size="sm"
          tapScale={1}
          aria-label="Attach image"
          title="Attach image"
          disabled={disabled}
          icon={<Icon name="camera" />}
          onClick={onAttach}
        />
      )}
      {formats
        .filter(
          (f) => mode === "long" || ["bold", "italic", "link"].includes(f.id),
        )
        .map((f) => (
          <IconButton
            key={f.id}
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={f.label}
            title={f.label}
            disabled={disabled || !onFormat}
            icon={
              f.icon ? (
                <Icon name={f.icon} />
              ) : (
                <span className="text-xs font-semibold">{f.text}</span>
              )
            }
            onClick={() => onFormat?.(f.id)}
          />
        ))}
    </div>
  );
}

/** Pure selection transform, shared by both editor modes. */
export function formatComposerText(
  value: string,
  start: number,
  end: number,
  format: ComposerFormat,
) {
  const selected = value.slice(start, end) || "text";
  const wrappers: Partial<Record<ComposerFormat, [string, string]>> = {
    bold: ["**", "**"],
    italic: ["*", "*"],
    link: ["[", "](https://example.com)"],
  };
  const wrapper = wrappers[format];
  if (wrapper) {
    const replacement = wrapper[0] + selected + wrapper[1];
    return {
      value: value.slice(0, start) + replacement + value.slice(end),
      start: start + wrapper[0].length,
      end: start + wrapper[0].length + selected.length,
    };
  }
  const lineStart = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  const lineEnd = nextBreak < 0 ? value.length : nextBreak;
  const prefixes: Partial<Record<ComposerFormat, string>> = {
    h1: "# ",
    h2: "## ",
    h3: "### ",
    bullets: "- ",
  };
  const replacement = (value.slice(lineStart, lineEnd) || "text")
    .split("\n")
    .map(
      (line, i) =>
        (format === "numbered" ? `${i + 1}. ` : prefixes[format]) +
        line.replace(/^(?:#{1,3} |[-*] |\d+\. )/, ""),
    )
    .join("\n");
  return {
    value: value.slice(0, lineStart) + replacement + value.slice(lineEnd),
    start: lineStart,
    end: lineStart + replacement.length,
  };
}
export type ToggleComposerProps = {
  mode: ComposerMode;
  onModeChange: (mode: ComposerMode) => void;
  value: ComposerValue;
  onValueChange: (value: ComposerValue) => void;
  surface?: "solid" | "frosted";
  disabled?: boolean;
  onSubmit?: () => void;
  submitLabel?: string;
  onAttach?: () => void;
  attachment?: ReactNode;
  error?: string;
  className?: string;
};
export function ToggleComposer({
  mode,
  onModeChange,
  value,
  onValueChange,
  surface = "solid",
  disabled = false,
  onSubmit,
  submitLabel = "Save draft",
  onAttach,
  attachment,
  error,
  className,
}: ToggleComposerProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const field = mode === "quick" ? "quick" : "body";
  const change = (key: keyof ComposerValue, text: string) =>
    onValueChange({ ...value, [key]: text });
  function format(kind: ComposerFormat) {
    const element = textarea.current;
    if (!element) return;
    const next = formatComposerText(
      value[field],
      element.selectionStart,
      element.selectionEnd,
      kind,
    );
    change(field, next.value);
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(next.start, next.end);
    });
  }
  const submit = (
    <Button
      type="primary"
      tapScale={1}
      className={mode === "long" ? "w-full" : "shrink-0"}
      disabled={disabled || !onSubmit}
      onClick={onSubmit}
    >
      {submitLabel}
    </Button>
  );
  return (
    <section
      aria-label="Post composer"
      className={cn("toggle-composer", className)}
      data-surface={surface}
    >
      <ComposerModeSwitch
        value={mode}
        onValueChange={onModeChange}
        disabled={disabled}
      />
      <div className="composer-shell">
        {mode === "long" && (
          <div className="composer-fields">
            <input
              aria-label="Headline"
              placeholder="Headline"
              value={value.headline}
              onChange={(e) => change("headline", e.target.value)}
              disabled={disabled}
            />
            <textarea
              aria-label="Intro"
              placeholder="Intro"
              value={value.intro}
              onChange={(e) => change("intro", e.target.value)}
              disabled={disabled}
              rows={2}
            />
          </div>
        )}
        <div className="composer-writing">
          <textarea
            key={field}
            ref={textarea}
            aria-label={mode === "long" ? "Body" : "Quick post"}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder={mode === "long" ? "Body" : "What’s on your mind?"}
            value={value[field]}
            onChange={(e) => change(field, e.target.value)}
            disabled={disabled}
            rows={mode === "long" ? 6 : 3}
          />
          {attachment}
          <div className="composer-bottom">
            <ComposerFormattingToolbar
              mode={mode}
              onFormat={format}
              onAttach={onAttach}
              disabled={disabled}
            />
            {mode === "quick" && submit}
          </div>
        </div>
        {mode === "long" && submit}
        {error && (
          <p
            className="px-2 py-1 text-sm text-text-primary"
            role="alert"
            id={`${id}-error`}
          >
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
