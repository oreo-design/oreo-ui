import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from "react";
import { Combobox } from "@base-ui-components/react/combobox";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { tv } from "@/lib/tv";
import { Icon } from "@/components/icon";
import { Button, IconButton } from "@/components/button";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/cn";
import "./connections.css";

export type ConnectionProject = { id: string; name: string; mark?: "triangle" | "flame" | "letter"; letter?: string; tone?: "neutral" | "orange" | "pink" };
export type ConnectionDirection = "readers" | "sources";
const markStyle = tv({
  base: "inline-flex size-5 shrink-0 items-center justify-center rounded-capsule text-xs font-semibold leading-none",
  variants: { tone: { neutral: "bg-bg-inverse text-text-on-inverse", orange: "bg-palette-orange-bg text-palette-orange-text", pink: "bg-palette-pink-bg text-palette-pink-text" } },
  defaultVariants: { tone: "neutral" },
});

export function ProjectIdentity({ project, className }: { project: ConnectionProject; className?: string }) {
  return <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
    <span aria-hidden="true" className={markStyle({ tone: project.tone })}>{project.mark === "flame" ? "🔥" : project.mark === "letter" ? (project.letter ?? project.name[0]?.toUpperCase()) : <svg viewBox="0 0 16 16" className="size-3" fill="currentColor"><path d="M8 2 15 14H1Z" /></svg>}</span>
    <span className="min-w-0 break-words">{project.name}</span>
  </span>;
}

export function ConnectionGroup({ project, direction, children, className }: { project: ConnectionProject; direction: ConnectionDirection; children: ReactNode; className?: string }) {
  const id = useId();
  return <section aria-labelledby={id} className={cn("min-w-0", className)}>
    <h2 id={id} className="flex flex-wrap items-center gap-x-1.5 gap-y-2 rounded-control-large bg-state-press px-3 py-3 text-sm font-normal">
      <ProjectIdentity project={project} className="font-medium" />
      <span className="text-text-secondary">{direction === "readers" ? "flags can be read by" : "can read flags from"}</span>
    </h2>
    <div className="mt-1">{children}</div>
  </section>;
}

export function ConnectionRow({ project, open, defaultOpen = false, onOpenChange, children, triggerRef, instant = false }: {
  project: ConnectionProject; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode; triggerRef?: Ref<HTMLButtonElement>; instant?: boolean;
}) {
  const [keyboard, setKeyboard] = useState(false);
  return <Collapsible.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} className="connection-row" data-instant={instant || keyboard || undefined}>
    <Collapsible.Trigger ref={triggerRef} onKeyDown={() => setKeyboard(true)} onPointerDown={() => setKeyboard(false)} className="connection-trigger flex min-h-12 w-full items-center gap-2 rounded-control-large px-3 py-3 text-left text-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent">
      <ProjectIdentity project={project} /><Icon name="chevron-right" size="sm" className="connection-chevron shrink-0 text-text-secondary" />
    </Collapsible.Trigger>
    <Collapsible.Panel className="connection-panel"><div className="px-3 pb-5 pt-3">{children}</div></Collapsible.Panel>
  </Collapsible.Root>;
}

export function ConnectionSetup({ source, target, children }: { source: ConnectionProject; target: ConnectionProject; children?: ReactNode }) {
  const code = `import { createVercelAdapter } from '@flags-sdk/vercel';\n\nconst sourceAdapter = createVercelAdapter({\n  projectId: ${JSON.stringify(source.id)},\n});`;
  return <div className="space-y-4"><p className="text-sm leading-6 text-text-secondary">In <strong className="font-medium text-text-primary">{target.name}</strong>, point an adapter at <strong className="font-medium text-text-primary">{source.name}</strong>’s project ID, alongside the default <code className="rounded-control-tiny border border-border-subtle px-1 text-xs text-text-primary">vercelAdapter()</code>.</p>
    <CodeBlock code={code} language="ts" title="flags.ts" wrap />{children}
  </div>;
}

/** An inline, non-modal combobox. Base UI owns selection, arrow keys and dismissal. */
export function InlineProjectPicker({ projects, label = "Search projects", onSelect, onCancel, dark = false, instant = false }: {
  projects: ConnectionProject[]; label?: string; onSelect: (project: ConnectionProject, keyboard: boolean) => void; onCancel: (restoreFocus: boolean) => void; dark?: boolean; instant?: boolean;
}) {
  const [query, setQuery] = useState("");
  const keyboard = useRef(instant);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const pendingDismiss = useRef<(() => void) | null>(null);
  useEffect(() => () => { pendingDismiss.current?.(); }, []);
  const dismiss = (details: Combobox.Root.ChangeEventDetails) => {
    if (details.reason === "item-press") return;
    pendingDismiss.current?.();
    // Keep the row in place until the outside click reaches its target. Removing
    // it on pointerdown would move that target before the browser dispatches click.
    if (details.reason === "outside-press" && /^(pointerdown|mousedown|touchstart)$/.test(details.event.type)) {
      const finish = () => { pendingDismiss.current = null; onCancel(false); };
      document.addEventListener("click", finish, { once: true });
      pendingDismiss.current = () => document.removeEventListener("click", finish);
    } else onCancel(details.reason === "escape-key" || details.reason === "trigger-press");
  };
  return <div className="flex min-h-12 items-center gap-2 px-3 py-2">
    <Combobox.Root<ConnectionProject> modal={false} items={projects} itemToStringLabel={project => project.name} defaultOpen autoHighlight inputValue={query} onInputValueChange={setQuery}
      onOpenChange={(open, details) => { if (open) { pendingDismiss.current?.(); pendingDismiss.current = null; } else dismiss(details); }}
      onValueChange={project => { if (project) onSelect(project, keyboard.current); }}>
      <span ref={anchorRef} className="flex min-w-0 max-w-72 flex-1 items-center gap-2 rounded-control border border-border-default bg-bg-base px-2 focus-within:outline-2 focus-within:outline-accent">
        <Icon name="search" size="sm" className="shrink-0 text-text-tertiary" />
        <Combobox.Input autoFocus aria-label={label} placeholder="Search projects…" className="min-w-0 w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-text-placeholder" onKeyDown={() => { keyboard.current = true; }} onPointerDown={() => { keyboard.current = false; }} />
      </span>
      <Combobox.Portal><Combobox.Positioner anchor={anchorRef} sideOffset={8} align="start" className={cn("z-50", dark && "theme-dark")}>
        <Combobox.Popup initialFocus={false} finalFocus={false} data-instant={instant || undefined} className="connection-picker w-72 max-w-[calc(100vw-2rem)] origin-[var(--transform-origin)] rounded-card-medium border border-border-default bg-bg-base p-1.5 text-text-primary shadow-[var(--shadow-overlay)]">
          <Combobox.Empty className="px-3 py-5 text-sm text-text-secondary empty:hidden">{projects.length ? `No projects match “${query}”. Try another name.` : "All available projects are connected."}</Combobox.Empty>
          <Combobox.List className="max-h-64 overflow-y-auto overscroll-contain outline-none">{(project: ConnectionProject) => <Combobox.Item key={project.id} value={project} onPointerDown={() => { keyboard.current = false; }} className="cursor-pointer rounded-control-large px-3 py-3 text-sm outline-none data-[highlighted]:bg-state-press"><ProjectIdentity project={project} /></Combobox.Item>}</Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner></Combobox.Portal>
      <Combobox.Trigger aria-label="Cancel new connection" render={<IconButton aria-label="Cancel new connection" type="tertiary" size="sm" tapScale={1} icon={<Icon name="x" size="sm" />} />} />
    </Combobox.Root>
  </div>;
}

export function NewConnectionButton({ onClick, disabled, allConnected, buttonRef }: { onClick: (keyboard: boolean) => void; disabled?: boolean; allConnected?: boolean; buttonRef?: Ref<HTMLButtonElement> }) {
  return <div className="mx-3 mt-1 border-t border-border-subtle pt-2"><Button render={<button type="button" ref={buttonRef} />} type="tertiary" tapScale={1} disabled={disabled} className="-ml-2 text-text-secondary" leadingIcon={<Icon name="plus" size="sm" />} onClick={event => onClick(event.detail === 0)}>{allConnected ? "All projects connected" : "New Connection"}</Button></div>;
}
