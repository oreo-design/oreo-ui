import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type PointerEvent, type FocusEvent } from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { animate, useReducedMotion } from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { KeywordTag } from "@/components/keyword-tag";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { contextWindow } from "./context-window.variants";

export type ContextFile = { id: string; name: string; tokens: number };
export type ContextUsage = { system: number; tools: number; conversation: number; memory: number };
export type ContextWindowProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & {
  capacity: number;
  usage: ContextUsage;
  files?: readonly ContextFile[];
  model?: string;
  onRemoveFile?: (id: string) => void;
  onCompact?: () => void;
  onNewChat?: () => void;
  compacting?: boolean;
  compactError?: string;
  defaultFilesOpen?: boolean;
};

type Category = keyof ContextUsage | "files";
const categories: { id: Category; label: string; color: string }[] = [
  { id: "system", label: "System prompt", color: "bg-text-primary" },
  { id: "tools", label: "Tools", color: "bg-text-secondary" },
  { id: "files", label: "Files", color: "bg-text-disabled" },
  { id: "conversation", label: "Conversation", color: "bg-status-progress" },
  { id: "memory", label: "Memory", color: "bg-palette-blue-text" },
];
const slots = contextWindow();
const safeTokens = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
const formatTokens = (value: number) => value >= 1000
  ? `${Number((value / 1000).toFixed(1))}K`
  : Math.round(value).toLocaleString("en-US");

function TokenCount({ value, instant }: { value: number; instant: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const write = (next: number) => {
      previous.current = next;
      if (ref.current) ref.current.textContent = formatTokens(next);
    };
    if (reduce || instant) { write(value); return; }
    const animation = animate(previous.current, value, { duration: 0.2, ease: easeOut, onUpdate: write });
    return () => animation.stop();
  }, [value, reduce, instant]);
  return <><span aria-hidden ref={ref}>{formatTokens(value)}</span><span className="sr-only">{formatTokens(value)}</span></>;
}

/** Controlled token data. Removing/compacting never invents a backend result. */
export function ContextWindow({
  capacity, usage, files = [], model = "Claude Sonnet", onRemoveFile, onCompact, onNewChat,
  compacting = false, compactError, defaultFilesOpen = false, className, ...rest
}: ContextWindowProps) {
  const titleId = useId();
  const filesTrigger = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const [keyboard, setKeyboard] = useState(false);
  const [hovered, setHovered] = useState<Category | null>(null);
  const [focused, setFocused] = useState<Category | null>(null);
  const [filesOpen, setFilesOpen] = useState(defaultFilesOpen);
  const active = hovered ?? focused;
  const limit = safeTokens(capacity);
  const values: Record<Category, number> = {
    system: safeTokens(usage.system), tools: safeTokens(usage.tools),
    files: files.reduce((sum, file) => sum + safeTokens(file.tokens), 0),
    conversation: safeTokens(usage.conversation), memory: safeTokens(usage.memory),
  };
  const total = Object.values(values).reduce((sum, value) => sum + value, 0);
  const percent = limit > 0 ? total / limit * 100 : 0;
  const selected = categories.find(category => category.id === active);
  // 216 sample cells depict proportions; exact counts remain in the legend.
  let cumulative = 0;
  const ranges = categories.map(category => ({ ...category, end: cumulative += values[category.id] }));
  const inputHandlers = (id: Category) => ({
    onPointerEnter: (event: PointerEvent) => { if (event.pointerType === "mouse") setHovered(id); },
    onPointerLeave: () => setHovered(null),
    onFocus: () => { setHovered(null); setFocused(id); },
    onBlur: (event: FocusEvent) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); },
  });
  const legend = (category: typeof categories[number]) => <>
    <span aria-hidden className={cn(slots.dot(), category.color)} />
    <span className="truncate">{category.label}</span>
    {category.id === "files" && <Icon name="chevron-down" size="sm" className={cn("shrink-0 transition-transform duration-200 ease-drawer motion-reduce:transition-none", filesOpen && "rotate-180", keyboard && "transition-none")} />}
  </>;

  return (
    <section aria-labelledby={titleId} className={cn(slots.root(), className)} {...rest}
      onKeyDownCapture={event => { setKeyboard(true); setHovered(null); rest.onKeyDownCapture?.(event); }}
      onPointerDownCapture={event => { setKeyboard(false); rest.onPointerDownCapture?.(event); }}>
      <div className={slots.card()}>
        <header className={slots.header()}>
          <h3 id={titleId}>Context window</h3>
          <KeywordTag className="max-w-full [&>span:last-child]:truncate" icon={<Icon name="sparkle" size="sm" />}>{model}</KeywordTag>
        </header>
        <div className={slots.summary()}>
          <span className={slots.number()}><TokenCount value={active ? values[active] : total} instant={keyboard || (focused !== null && hovered === null)} /></span>
          <span className={slots.caption()}>{selected?.label ?? (limit ? `of ${formatTokens(limit)} tokens` : "capacity unavailable")}</span>
          <span className={cn("ml-auto shrink-0 text-sm tabular-nums", percent >= 100 ? "text-status-error" : percent >= 80 ? "text-palette-orange-text" : "text-text-tertiary")}>
            {limit ? `${Math.round(percent)}%` : "—"}
          </span>
        </div>
        <div role="img" aria-label={`${formatTokens(total)} of ${limit ? formatTokens(limit) : "unknown capacity"} tokens used. Usage by category is listed below.`}
          className={slots.grid()} style={{ gridTemplateColumns: "repeat(36, minmax(0, 1fr))" }} onPointerLeave={() => setHovered(null)}>
          {Array.from({ length: 216 }, (_, index) => {
            const sample = (index + 0.5) / 216 * Math.max(limit, total);
            const category = limit ? ranges.find(range => sample < range.end) : undefined;
            return <span key={index} aria-hidden className={cn(slots.cell(), keyboard && "transition-none", category?.color ?? "bg-state-press")}
              style={{ opacity: active && category?.id !== active ? 0.2 : 1 }}
              onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(category?.id ?? null); }} />;
          })}
        </div>
        <div className="mt-4 space-y-1">
          {categories.map(category => category.id === "files" ? (
            <Collapsible.Root key={category.id} open={filesOpen} onOpenChange={setFilesOpen} className="rounded-control-large data-[panel-open]:bg-bg-elevated" {...inputHandlers(category.id)}>
              <div className={slots.row()} data-active={active === category.id}>
                <Collapsible.Trigger ref={filesTrigger} className={slots.label()}>{legend(category)}<span className={slots.count()}>{formatTokens(values.files)}</span></Collapsible.Trigger>
              </div>
              <Collapsible.Panel className={cn(slots.panel(), keyboard && "transition-none")}>
                <ul className="pb-2">
                  {files.map(file => <li key={file.id} className={slots.file()}>
                    <span title={file.name} className="min-w-0 flex-1 truncate font-mono text-xs">{file.name}</span>
                    <span className="text-xs tabular-nums text-text-tertiary">{formatTokens(safeTokens(file.tokens))}</span>
                    {onRemoveFile && <IconButton type="tertiary" size="sm" danger shape="rectangle" tapScale={reduce ? 1 : undefined}
                      aria-label={`Remove ${file.name}`} icon={<Icon name="x" size="sm" />} disabled={compacting} onClick={() => {
                        // Keep focus on the disclosure when its focused child is removed.
                        filesTrigger.current?.focus();
                        onRemoveFile(file.id);
                      }} />}
                  </li>)}
                  {!files.length && <li className="px-7 py-2 text-xs text-text-tertiary">No files in context.</li>}
                </ul>
              </Collapsible.Panel>
            </Collapsible.Root>
          ) : (
            <div key={category.id} className={slots.row()} data-active={active === category.id} {...inputHandlers(category.id)}>
              <button type="button" className={slots.label()} aria-pressed={active === category.id} onClick={() => setFocused(category.id)}>{legend(category)}</button>
              {category.id === "conversation" && onCompact && <span className="@max-2xs/context:order-3 @max-2xs/context:flex @max-2xs/context:w-full @max-2xs/context:justify-end @max-2xs/context:pb-2"><Button type="tertiary" size="sm" disabled={compacting || !values.conversation} tapScale={reduce ? 1 : undefined}
                leadingIcon={<Icon name={compacting ? "spinner" : "sliders"} size="sm" className={compacting ? "animate-spin motion-reduce:animate-none" : undefined} />}
                onClick={onCompact}>{compacting ? "Compacting…" : compactError ? "Retry" : "Compact"}</Button></span>}
              <span className={slots.count()}>{formatTokens(values[category.id])}</span>
            </div>
          ))}
        </div>
        {compactError && <p role="alert" className="mt-3 text-xs leading-5 text-status-error">{compactError}</p>}
        <span className="sr-only" role="status">{compacting ? "Compacting conversation" : `${formatTokens(total)} tokens used`}</span>
      </div>
      <footer className={slots.footer()}>
        <span>{selected ? `${selected.label} · ${limit ? `${Number((values[selected.id] / limit * 100).toFixed(1))}% of the window` : "capacity unavailable"}` : limit ? total > limit ? `${formatTokens(total - limit)} over capacity` : `${formatTokens(limit - total)} left` : "Capacity unavailable"}</span>
        {onNewChat && <Button type="tertiary" size="sm" disabled={compacting} tapScale={reduce ? 1 : undefined} trailingIcon={<Icon name="chevron-right" size="sm" />} onClick={onNewChat}>New chat</Button>}
      </footer>
    </section>
  );
}
