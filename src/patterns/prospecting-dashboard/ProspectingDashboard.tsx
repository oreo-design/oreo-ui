import { useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { ProspectAction, ProspectMetric, ProspectPanel, ProspectTable, ActivityTimeline } from "@/components/prospecting";
import { prospects, activities, metrics } from "./data";

export function ProspectingDashboard({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  const [period, setPeriod] = useState<"7" | "30">("7");
  const [saved, setSaved] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [ascending, setAscending] = useState(false);
  const [all, setAll] = useState(false);
  const [filters, setFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [qualifiedOnly, setQualifiedOnly] = useState(false);
  const [notice, setNotice] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [activityFilter, setActivityFilter] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const matches = prospects.filter(p => !dismissed.includes(p.id) && (!savedOnly || saved.includes(p.id)) && (!qualifiedOnly || p.score >= 80) && `${p.name} ${p.company} ${p.role} ${p.signal}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => ascending ? a.score - b.score : b.score - a.score);
  const visible = all || filters ? matches : matches.slice(0, 6);
  const toggleSave = (id: string) => {
    setSaved(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
    setNotice(`${prospects.find(p => p.id === id)?.name} ${saved.includes(id) ? "removed from" : "added to"} saved prospects.`);
  };
  const resetFilters = () => { setQuery(""); setSavedOnly(false); setQualifiedOnly(false); setDismissed([]); };
  const exportRows = () => {
    const rows = [["Name", "Role", "Company", "Signal", "AI score", "Saved"], ...visible.map(p => [p.name, p.role, p.company, p.signal, String(p.score), saved.includes(p.id) ? "Yes" : "No"])];
    const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = "oreo-prospects.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${visible.length} visible prospects as CSV.`);
  };
  return <div className="prospect-dashboard w-full overflow-hidden rounded-card-medium border border-border-subtle bg-bg-base shadow-(--shadow-panel)">
    <header className="flex items-center justify-between border-b border-border-subtle px-5 py-3 sm:px-8"><span className="flex items-center gap-2 text-sm font-medium"><Icon name="gauge" size="sm" className="text-text-secondary" />Home</span><div className="flex gap-2"><IconButton type="secondary" shape="rectangle" tapScale={1} aria-label="About this dashboard" aria-expanded={showHelp} icon={<Icon name="warning-circle" />} onClick={() => setShowHelp(v => !v)} /><IconButton type="secondary" shape="rectangle" tapScale={1} aria-label={dark ? "Use light theme" : "Use dark theme"} icon={<Icon name={dark ? "sun" : "moon"} />} onClick={onToggleTheme} /></div></header>
    {showHelp && <div className="border-b border-border-subtle bg-bg-elevated px-5 py-4 text-sm leading-6 sm:px-8">Explore a sample prospecting workspace. Search, sort, save and export the example contacts. Changes reset on reload. No outreach is sent.<a href="/prospecting-components?view=docs" className="ml-2 underline underline-offset-4">Explore the components ↗</a></div>}
    <div className="p-5 sm:p-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-5"><div><h1 className="text-2xl font-semibold tracking-tight">Good morning, Jordan</h1><p className="mt-1.5 text-sm text-text-secondary">Here’s what’s happening with your prospecting today.</p></div><div className="flex flex-wrap items-center gap-3"><label className="flex h-10 items-center gap-2 rounded-control border border-border-default bg-bg-base px-3 text-sm shadow-(--shadow-default)"><span className="text-text-tertiary">Period</span><select aria-label="Reporting period" value={period} onChange={e => { setPeriod(e.target.value as "7" | "30"); setNotice(`Metrics updated to the last ${e.target.value} days.`); }} className="bg-transparent font-medium outline-none"><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></label><Button type="secondary" size="lg" tapScale={1} leadingIcon={<Icon name="arrow-down" />} onClick={exportRows} disabled={!visible.length}>Export</Button><ProspectAction size="lg" onClick={() => { setFilters(true); setAll(true); requestAnimationFrame(() => search.current?.focus()); }} /></div></div>
      <section aria-label="Prospecting metrics" className="mb-7 grid gap-px overflow-hidden rounded-card-medium border border-border-subtle bg-border-subtle shadow-(--shadow-default) sm:grid-cols-2 xl:grid-cols-4">{metrics[period].map(metric => <ProspectMetric key={metric.label} {...metric} />)}</section>
      {filters && <div className="mb-5 flex flex-wrap items-center gap-3 rounded-card-small border border-border-subtle bg-bg-elevated p-3"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-control border border-border-default bg-bg-base px-3 py-2"><Icon name="search" size="sm" /><input ref={search} aria-label="Search prospects" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search names, companies, signals…" className="min-w-0 w-full bg-transparent text-sm outline-none" /></label><Button type={qualifiedOnly ? "primary" : "secondary"} tapScale={1} aria-pressed={qualifiedOnly} onClick={() => setQualifiedOnly(v => !v)}>Qualified only</Button><Button type={savedOnly ? "primary" : "secondary"} tapScale={1} aria-pressed={savedOnly} onClick={() => setSavedOnly(v => !v)}>Saved ({saved.length})</Button><Button type="tertiary" tapScale={1} onClick={resetFilters}>Reset filters</Button></div>}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)]">
        <ProspectPanel title="AI recommended prospects" description="Ranked by ICP fit and fresh buying signals · refreshed 7:00 AM" icon="sparkle" action={<Button type="secondary" tapScale={1} trailingIcon={<Icon name="chevron-right" size="sm" />} onClick={() => { if (all || filters) { resetFilters(); setFilters(false); setAll(false); } else setAll(true); }}>{all || filters ? "Show less" : "View all"}</Button>}>
          <ProspectTable prospects={visible} savedIds={saved} onToggleSave={toggleSave} onDismiss={id => { setDismissed(v => [...v, id]); setNotice("Recommendation dismissed. Reset filters to restore it."); setFilters(true); }} ascending={ascending} onSort={() => setAscending(v => !v)} footer={<span>{filters ? `${matches.length} matching prospects` : "38 new matches since yesterday"} · {visible.length} shown{saved.length > 0 && ` · ${saved.length} saved`}</span>} empty={<><h3 className="text-sm font-semibold">No prospects found</h3><p className="my-2 text-sm text-text-secondary">Try another search or reset your filters.</p><Button type="secondary" tapScale={1} onClick={resetFilters}>Show all prospects</Button></>} />
        </ProspectPanel>
        <ProspectPanel title="Recent activity" description="Across your workspace" icon="chart-line" tone="mint" action={<IconButton type="secondary" shape="rectangle" tapScale={1} aria-label={activityFilter ? "Show all activity" : "Show replies and meetings"} aria-pressed={activityFilter} icon={<Icon name="sliders" />} onClick={() => setActivityFilter(v => !v)} />}><ActivityTimeline items={activityFilter ? activities.slice(0, 2) : activities} /></ProspectPanel>
      </div>
      <div role="status" aria-live="polite" className="mt-4 min-h-5 text-xs text-text-secondary">{notice || "Sample workspace · Explore freely, changes stay in this preview."}</div>
    </div>
  </div>;
}
