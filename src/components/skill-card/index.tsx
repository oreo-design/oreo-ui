import { useId, type ReactNode } from "react";
import { Tabs } from "@base-ui-components/react/tabs";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/cn";
import { paletteSurface, type PaletteColor } from "@/lib/palette";

export type SkillProvider = { name: string; color?: PaletteColor; mark?: ReactNode };

/** A provider identity, with an optional brand mark supplied by the host. */
export function SkillProviderBadge({ name, color = "default", mark }: SkillProvider) {
  return <span className="inline-flex min-w-0 items-center gap-2 text-sm text-text-secondary">
    <span aria-hidden="true" className={cn("grid size-5 shrink-0 place-items-center rounded-control-tiny text-xs font-semibold", paletteSurface[color])}>{mark ?? name.slice(0, 1)}</span>
    <span className="truncate">{name}</span>
  </span>;
}

export type SkillCardProps = {
  title: string;
  description: string;
  provider: SkillProvider;
  icon?: IconName;
  installed?: boolean;
  pending?: boolean;
  disabled?: boolean;
  error?: string;
  onInstalledChange: (installed: boolean) => void;
  className?: string;
};

/** Controlled: applications own installation, errors and persistence. */
export function SkillCard({ title, description, provider, icon = "circle-dashed", installed = false, pending = false, disabled = false, error, onInstalledChange, className }: SkillCardProps) {
  const id = useId();
  const action = error ? "Retry" : installed ? "Remove" : "Install";
  return <article aria-labelledby={`${id}-title`} aria-busy={pending || undefined} className={cn("flex min-w-0 flex-col gap-4 rounded-card-small border border-border-default bg-bg-base p-5 text-text-primary", className)}>
    <header className="flex items-center gap-3">
      <Icon name={icon} className="shrink-0 text-text-secondary" />
      <h3 id={`${id}-title`} className="min-w-0 flex-1 text-base font-medium leading-6 [overflow-wrap:anywhere]">{title}</h3>
      <IconButton aria-label={`${action} ${title}`} title={`${action} ${title}`} aria-pressed={installed} aria-describedby={error ? `${id}-error` : undefined} type="secondary" size="sm" shape="rectangle" tapScale={1} disabled={disabled || pending} onClick={() => onInstalledChange(!installed)} icon={<Icon name={pending ? "circle-dashed" : error ? "refresh" : installed ? "check" : "plus"} size="sm" />} className="shrink-0 border border-border-default" />
    </header>
    <p className="line-clamp-2 min-h-12 text-sm leading-6 text-text-tertiary [overflow-wrap:anywhere]" title={description}>{description}</p>
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1"><SkillProviderBadge {...provider} />{(installed || pending) && <span className="text-xs text-text-secondary">{pending ? "Updating…" : "Installed"}</span>}</footer>
    {error && <p id={`${id}-error`} role="alert" className="text-xs leading-5 text-status-error">{error}</p>}
  </article>;
}

export function SkillSearch({ value, onValueChange, placeholder = "Search skills…" }: { value: string; onValueChange: (value: string) => void; placeholder?: string }) {
  return <label className="focus-within:ring-2 focus-within:ring-accent flex min-h-10 w-full items-center gap-2 rounded-control-large border border-border-default bg-bg-base px-3 text-text-tertiary sm:w-60">
    <Icon name="search" size="sm" /><span className="sr-only">Search skills</span>
    <input type="search" value={value} onChange={e => onValueChange(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent py-2 text-sm text-text-primary outline-none placeholder:text-text-placeholder" />
  </label>;
}

export type SkillCatalogView = "installed" | "discover";
export function SkillCatalogTabs({ value, onValueChange, installedCount, search, children }: {
  value: SkillCatalogView;
  onValueChange: (value: SkillCatalogView) => void;
  installedCount?: number;
  search?: ReactNode;
  children: Record<SkillCatalogView, ReactNode>;
}) {
  return <Tabs.Root value={value} onValueChange={v => { if (v === "installed" || v === "discover") onValueChange(v); }}>
    <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
      <Tabs.List aria-label="Skill catalog" activateOnFocus className="inline-flex rounded-control-large bg-bg-elevated p-1">
        <Tabs.Tab value="installed" className="cursor-pointer rounded-control px-3 py-1.5 text-sm text-text-secondary data-[active]:bg-bg-base data-[active]:text-text-primary data-[active]:shadow-sm">Installed{installedCount ? <span className="ml-2 text-xs tabular-nums text-text-tertiary"> {installedCount}</span> : null}</Tabs.Tab>
        <Tabs.Tab value="discover" className="cursor-pointer rounded-control px-3 py-1.5 text-sm text-text-secondary data-[active]:bg-bg-base data-[active]:text-text-primary data-[active]:shadow-sm">Discover</Tabs.Tab>
      </Tabs.List>
      {search}
    </div>
    <Tabs.Panel value="installed">{children.installed}</Tabs.Panel>
    <Tabs.Panel value="discover">{children.discover}</Tabs.Panel>
  </Tabs.Root>;
}

export function SkillSection({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return <section aria-labelledby={id} className="mb-12 last:mb-0">
    <h2 id={id} className="mb-4 text-sm font-normal text-text-tertiary">{title}</h2>
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">{children}</div>
  </section>;
}

export function SkillEmptyState({ title = "No skills found", description = "Try a different name or provider.", actionLabel = "Clear search", onAction }: { title?: string; description?: string; actionLabel?: string; onAction: () => void }) {
  return <div className="flex flex-col items-center gap-3 rounded-card-small border border-dashed border-border-default px-5 py-16 text-center">
    <Icon name="search" className="text-text-tertiary" /><h2 className="text-base font-medium">{title}</h2><p className="max-w-sm text-sm leading-6 text-text-secondary">{description}</p><Button type="secondary" tapScale={1} onClick={onAction}>{actionLabel}</Button>
  </div>;
}

/** The host supplies the rail and owns navigation. No service dependencies. */
export function SkillWorkspaceShell({ rail, header, children }: { rail: ReactNode; header?: ReactNode; children: ReactNode }) {
  return <div className="skills-shell grid min-h-full w-full grid-cols-[3.5rem_minmax(0,1fr)] overflow-hidden rounded-card-medium border border-border-subtle bg-bg-base text-text-primary sm:grid-cols-[4rem_minmax(0,1fr)] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-accent [&_label:focus-within]:ring-2 [&_label:focus-within]:ring-accent">
    {rail}<div className="min-w-0"><header className="flex h-16 items-center gap-3 border-b border-border-subtle px-5 text-sm font-medium sm:px-7">{header ?? <><Icon name="circle-dashed" />Skills</>}</header>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-10 sm:py-14 xl:px-20"><h1 className="mb-8 text-2xl font-medium tracking-tight">Skills</h1>{children}</div>
    </div>
  </div>;
}
