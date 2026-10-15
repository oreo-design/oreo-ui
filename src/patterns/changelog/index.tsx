import { useState } from "react";
import { DocsLayout } from "@/docs/DocsLayout";
import type { DocsNav } from "@/docs/DocsPage";
import { ReleaseEntry, type ChangeKind } from "@/components/release-entry";
import { UpgradePrompt } from "@/components/upgrade-prompt";
import { Button } from "@/components/button";
import { TypeScale } from "@/components/type-scale";
import { StepProgress } from "@/components/step-progress";
import { AgentResultCard, AgentWorkspaceState } from "@/components/automation";
import { changesMarkdown, releases, REPOSITORY, upgradePrompt, type Release } from "./data";

/** Reuse with your own verified release data; the website passes Oreo's curated history. */
export function Changelog({ nav, data = releases }: { nav: DocsNav; data?: Release[] }) {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"All" | ChangeKind>("All");
  const [checks, setChecks] = useState(2);
  const kinds = [...new Set(data.flatMap(release => release.changes.map(change => change.kind)))];
  const filtered = data.map(release => ({ ...release, changes: release.changes.filter(change => (kind === "All" || change.kind === kind) && `${change.title} ${change.description}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter(release => release.changes.length);
  const count = filtered.reduce((sum, release) => sum + release.changes.length, 0);
  const reset = () => { setKind("All"); setQuery(""); };
  return <div className={`min-h-screen bg-bg-elevated text-text-primary${dark ? " theme-dark" : ""}`}>
    <DocsLayout nav={nav} breadcrumb={["Oreo UI", "Changelog"]} toc={filtered.map(release => ({ id:`release-${release.date}`, label:release.label }))}>
      <header className="border-b border-border-subtle pb-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <a href="/button" className="text-text-secondary underline underline-offset-4">Browse components</a>
          <Button type="tertiary" size="sm" tapScale={1} onClick={() => setDark(value => !value)}>{dark ? "Light theme" : "Dark theme"}</Button>
        </div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-text-secondary">The library, in motion</p>
        <h1 className="text-4xl font-semibold tracking-tight">Changelog</h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-text-secondary">New components. Thoughtful updates.<br />A running record of what’s taking shape in Oreo UI.</p>
        <p className="mt-4 text-xs leading-5 text-text-tertiary">Selected updates merged to main · Dates in Asia/Shanghai.<br />Code availability and website deployment may differ.</p>
        <div className="mt-6 flex flex-wrap gap-5 text-xs">
          <a className="underline underline-offset-4" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(changesMarkdown(data))}`} download="oreo-ui-changelog.md">Download Markdown <span aria-hidden="true">↗</span></a>
          <a className="underline underline-offset-4" href={`${REPOSITORY}/commits/main`}>All commits <span aria-hidden="true">↗</span></a>
          <a className="underline underline-offset-4" href="/release-entry">Use this template <span aria-hidden="true">↗</span></a>
        </div>
      </header>
      {count > 0 && <div className="my-8"><UpgradePrompt prompt={upgradePrompt(filtered)} title={query || kind !== "All" ? `Review ${count} matching ${count === 1 ? "update" : "updates"}` : undefined} /></div>}
      <div className="my-8 space-y-4">
        <label className="block text-xs font-medium">Search updates<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a component or improvement…" className="mt-2 block w-full rounded-control border border-border-default bg-bg-base px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-text-secondary" /></label>
        <div className="flex flex-wrap items-center gap-2" aria-label="Change type">
          {(["All", ...kinds] as const).map(value => <Button key={value} size="sm" tapScale={1} type={kind === value ? "primary" : "tertiary"} aria-pressed={kind === value} onClick={() => setKind(value)}>{value}</Button>)}
          <span role="status" className="ml-auto text-xs text-text-secondary">{count} {count === 1 ? "update" : "updates"}</span>
        </div>
      </div>
      {!count && <AgentWorkspaceState title="No matching updates" description="Try another component name or clear your filters." actionLabel="Clear filters" onAction={reset} />}
      {filtered.map(release => <section id={`release-${release.date}`} key={release.date} className="relative mb-10 scroll-mt-8 border-l border-border-default pl-6 md:pl-8">
        <span className="absolute -left-1 top-1.5 h-2 w-2 rounded-full bg-text-primary" aria-hidden="true" />
        <a href={`#release-${release.date}`} className="text-xs text-text-secondary hover:underline"><time dateTime={release.date}>{release.label}</time></a>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">{release.title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{release.description}</p>
        {release.changes.map(change => <ReleaseEntry key={change.id} {...change} href={`/${change.page}`} sourceHref={`${REPOSITORY}/pull/${change.pr}`} sourceLabel={`PR #${change.pr}`}>
          {change.preview === "type" && <TypeScale base={16} ratio={1.25} sample="Good things take shape." />}
          {change.preview === "steps" && <div className="space-y-5"><StepProgress completed={checks} total={4} label="Example review" /><Button type="secondary" size="sm" tapScale={1} onClick={() => setChecks(value => (value + 1) % 5)}>{checks === 4 ? "Reset checks" : "Complete a check"}</Button></div>}
          {change.preview === "result" && <AgentResultCard title="A result that starts open" defaultOpen><p className="text-sm leading-6">This is the real AgentResultCard, with defaultOpen enabled. Collapse it and open it again.</p></AgentResultCard>}
        </ReleaseEntry>)}
      </section>)}
      <footer className="border-t border-border-subtle py-8 text-xs leading-6 text-text-secondary">Built from Oreo components. <a className="underline underline-offset-4" href="/upgrade-prompt">Explore Upgrade Prompt</a> · <a className="underline underline-offset-4" href="https://www.fluidfunctionalism.com/changelog">Layout inspiration by Micka</a></footer>
    </DocsLayout>
  </div>;
}
