import { useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { EmailDraft, FollowUpSummary, ReviewQueue, ReviewWorkspaceShell, SignalStrength, WorkspaceRail, type EmailDraftValue } from "@/components/review-workspace";
import { reviewGroups, initialDraft } from "./data";

/** Local fixture. Wire EmailDraft.onSend to your own reviewed delivery flow. */
export function ReviewWorkspace({ dark = false, onToggleTheme }: { dark?: boolean; onToggleTheme?: () => void }) {
  const [selectedId, setSelectedId] = useState("olivia");
  const [section, setSection] = useState("review");
  const [filter, setFilter] = useState(0);
  const [sort, setSort] = useState("default");
  const [detailOpen, setDetailOpen] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, EmailDraftValue>>({});
  const [models, setModels] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, "sent" | "error">>({});
  const contact = reviewGroups.flatMap(g => g.contacts).find(c => c.id === selectedId)!;
  const group = reviewGroups.find(g => g.contacts.some(c => c.id === selectedId))!;
  const draft = drafts[selectedId] ?? initialDraft(contact);
  const groups = reviewGroups.filter(g => section === "review" || g.id === section).map(g => ({ ...g, contacts: g.contacts.filter(c => !filter || c.strength === filter).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "company" ? a.company.localeCompare(b.company) : 0) }));
  const hasResults = groups.some(g => g.contacts.length);
  const changeView = (nextSection: string, nextFilter: number) => {
    setSection(nextSection); setFilter(nextFilter); setDetailOpen(false);
    const visible = reviewGroups.filter(g => nextSection === "review" || g.id === nextSection).flatMap(g => g.contacts).filter(c => !nextFilter || c.strength === nextFilter);
    if (visible.length && !visible.some(c => c.id === selectedId)) setSelectedId(visible[0].id);
  };
  const select = (id: string) => { setSelectedId(id); setDetailOpen(true); };
  return <ReviewWorkspaceShell detailOpen={detailOpen}
    rail={<WorkspaceRail activeId={section} onSelect={id => changeView(id, filter)} items={[
      { id: "review", label: "Review all", icon: "list-checks" },
      { id: "follow-ups", label: "Follow-ups", icon: "plane" },
      { id: "opportunity", label: "Opportunities", icon: "chart-line", divider: true },
      { id: "hiring", label: "Hiring signals", icon: "search" },
    ]} footer={<><a href="/review-components" title="Component documentation" aria-label="Component documentation" className="review-rail-button"><Icon name="folder" /></a>{onToggleTheme && <button className="review-rail-button" type="button" onClick={onToggleTheme} title={dark ? "Light theme" : "Dark theme"} aria-label={dark ? "Light theme" : "Dark theme"}><Icon name={dark ? "sun" : "moon"} /></button>}</>} />}
    queue={<ReviewQueue groups={groups} selectedId={selectedId} onSelect={select} actions={<>
      <Menu><MenuTrigger aria-label="Filter contacts" title="Filter contacts" className="review-rail-button !size-8"><Icon name="sliders" size="sm" /></MenuTrigger><MenuPopup className={dark ? "theme-dark" : undefined}><MenuItem selected={filter === 0} onClick={() => changeView(section, 0)}>All signals</MenuItem>{([3, 2, 1] as const).map(n => <MenuItem key={n} selected={filter === n} onClick={() => changeView(section, n)}>{n === 3 ? "Strong" : n === 2 ? "Medium" : "Early"} signals</MenuItem>)}</MenuPopup></Menu>
      <Menu><MenuTrigger aria-label="Sort contacts" title="Sort contacts" className="review-rail-button !size-8"><Icon name="arrow-down" size="sm" /></MenuTrigger><MenuPopup className={dark ? "theme-dark" : undefined}>{[["default", "Recommended"], ["name", "Name"], ["company", "Company"]].map(([value, label]) => <MenuItem key={value} selected={sort === value} onClick={() => setSort(value)}>{label}</MenuItem>)}</MenuPopup></Menu>
    </>} empty={<><p>No contacts match this filter.</p><Button className="mt-4" type="secondary" onClick={() => changeView(section, 0)} tapScale={1}>Clear filter</Button></>} />}
    header={hasResults ? <><IconButton aria-label="Back to review list" icon={<Icon name="chevron-left" />} className="review-back" type="tertiary" onClick={() => setDetailOpen(false)} tapScale={1} /><h2>{contact.name}</h2><span className="review-company"><span className="review-company-mark" aria-hidden>{contact.companyMark ?? contact.company.slice(0, 1)}</span>{contact.company}</span><SignalStrength value={contact.strength} /></> : <h2>Review</h2>}>
      {hasResults ? <>
      <FollowUpSummary title={group.label}>Following {contact.name.split(" ")[0]}’s demo last week, there are still some open questions around the security review. This message recaps the next steps and keeps things moving.</FollowUpSummary>
      <EmailDraft from={{ name: "James Thompson", email: "thompson@ace.example", color: "blue" }} to={{ name: contact.name, email: `${contact.name.split(" ")[0].toLowerCase()}@${contact.company.toLowerCase()}.example`, color: contact.color }} value={draft}
        onChange={value => { setDrafts(prev => ({ ...prev, [selectedId]: value })); setStatuses(prev => { const next = { ...prev }; delete next[selectedId]; return next; }); }}
        onSend={() => setStatuses(prev => ({ ...prev, [selectedId]: draft.subject.trim() && draft.body.trim() ? "sent" : "error" }))}
        model={models[selectedId] ?? "Claude Opus 5.5"} onModelChange={model => setModels(prev => ({ ...prev, [selectedId]: model }))}
        error={statuses[selectedId] === "error" ? "Add a subject and message before sending." : undefined}
        status={statuses[selectedId] === "sent" ? "Demo complete — no email was sent." : "Local demo · edits stay here until you reload."} />
    </> : <div className="review-empty"><Icon name="list-checks" className="mx-auto mb-4" /><p>No matching contacts.</p><p>Clear the signal filter to continue reviewing.</p></div>}
    </ReviewWorkspaceShell>;
}
