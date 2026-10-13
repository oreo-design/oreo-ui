import { useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Avatar } from "@/components/avatar";
import { Attachment, AttachmentBar } from "@/components/attachment";
import { Icon } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { EmailDraft, FollowUpSummary, ReviewQueue, ReviewNavigation, ReviewWorkspaceShell, SignalStrength, WorkspaceRail, type EmailDraftValue } from "@/components/review-workspace";
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
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [attachments, setAttachments] = useState<Record<string, { id: string; name: string }[]>>({});
  const [announcement, setAnnouncement] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const attachmentTarget = useRef(selectedId);
  const contact = reviewGroups.flatMap(g => g.contacts).find(c => c.id === selectedId)!;
  const group = reviewGroups.find(g => g.contacts.some(c => c.id === selectedId))!;
  const draft = drafts[selectedId] ?? initialDraft(contact);
  const groups = reviewGroups.filter(g => section === "review" || g.id === section).map(g => ({ ...g, contacts: g.contacts.filter(c => !dismissed.has(c.id) && (!filter || c.strength === filter)).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "company" ? a.company.localeCompare(b.company) : 0) }));
  const visibleContacts = groups.flatMap(g => g.contacts);
  const hasResults = visibleContacts.length > 0;
  const selectedIndex = visibleContacts.findIndex(c => c.id === selectedId);
  const dismiss = () => {
    setDismissed(current => new Set([...current, selectedId]));
    const next = visibleContacts[selectedIndex + 1] ?? visibleContacts[selectedIndex - 1];
    if (next) setSelectedId(next.id);
    else setDetailOpen(false);
    setAnnouncement(`${contact.name} dismissed from this demo. Use Restore dismissed to bring contacts back.`);
  };
  const restoreDismissed = () => {
    setDismissed(new Set()); setSection("review"); setFilter(0);
    setAnnouncement("All dismissed contacts restored.");
  };
  const changeView = (nextSection: string, nextFilter: number) => {
    setSection(nextSection); setFilter(nextFilter); setDetailOpen(false);
    const visible = reviewGroups.filter(g => nextSection === "review" || g.id === nextSection).flatMap(g => g.contacts).filter(c => !dismissed.has(c.id) && (!nextFilter || c.strength === nextFilter));
    if (visible.length && !visible.some(c => c.id === selectedId)) setSelectedId(visible[0].id);
  };
  const select = (id: string) => { setSelectedId(id); setDetailOpen(true); };
  return <ReviewWorkspaceShell detailOpen={detailOpen}
    rail={<WorkspaceRail brand={<span aria-hidden>◐</span>} activeId={section} onSelect={id => { if (["review", "follow-ups", "opportunity", "hiring"].includes(id)) changeView(id, filter); else window.location.assign(`/${id}`); }} items={[
      { id: "thread-list", label: "Conversation history", icon: "reset" },
      { id: "review", label: "Review all", icon: "list-checks" },
      { id: "follow-ups", label: "Follow-ups", icon: "paper-plane" },
      { id: "skills-workspace", label: "Skills workspace", icon: "circle-dashed" },
      { id: "prompt-box", label: "Assistant composer", icon: "at" },
      { id: "opportunity", label: "Opportunities", icon: "chart-line", divider: true },
      { id: "hiring", label: "Hiring signals", icon: "search" },
      { id: "confirmation", label: "Approvals", icon: "checks", divider: true },
      { id: "onboarding-board", label: "Planning board", icon: "calendar" },
      { id: "inbox-stream", label: "Inbox stream", icon: "chat" },
      { id: "skill-card", label: "Add skills", icon: "plus", divider: true },
    ]} footer={<><a href="/review-components" title="Component documentation" aria-label="Component documentation"><Avatar name="James Thompson" size="xs" color="blue" className="!size-5" /></a>{onToggleTheme && <button className="review-rail-button" type="button" onClick={onToggleTheme} title={dark ? "Light theme" : "Dark theme"} aria-label={dark ? "Light theme" : "Dark theme"}><Icon name={dark ? "sun" : "moon"} /></button>}</>} />}
    queue={<ReviewQueue groups={groups} selectedId={selectedId} onSelect={select} footer={dismissed.size > 0 && hasResults ? <Button type="tertiary" size="sm" tapScale={1} onClick={restoreDismissed}>Restore dismissed ({dismissed.size})</Button> : undefined} actions={<>
      <Menu><MenuTrigger aria-label="Filter contacts" title="Filter contacts" className="review-rail-button !size-8"><Icon name="sliders" size="sm" /></MenuTrigger><MenuPopup className={dark ? "theme-dark" : undefined}><MenuItem selected={filter === 0} onClick={() => changeView(section, 0)}>All signals</MenuItem>{([3, 2, 1] as const).map(n => <MenuItem key={n} selected={filter === n} onClick={() => changeView(section, n)}>{n === 3 ? "Strong" : n === 2 ? "Medium" : "Early"} signals</MenuItem>)}</MenuPopup></Menu>
      <Menu><MenuTrigger aria-label="Sort contacts" title="Sort contacts" className="review-rail-button !size-8"><Icon name="arrow-down" size="sm" /></MenuTrigger><MenuPopup className={dark ? "theme-dark" : undefined}>{[["default", "Recommended"], ["name", "Name"], ["company", "Company"]].map(([value, label]) => <MenuItem key={value} selected={sort === value} onClick={() => setSort(value)}>{label}</MenuItem>)}</MenuPopup></Menu>
    </>} empty={<><p>No contacts match this view.</p><Button className="mt-4" type="secondary" onClick={dismissed.size ? restoreDismissed : () => changeView(section, 0)} tapScale={1}>{dismissed.size ? "Restore dismissed" : "Clear filter"}</Button></>} />}
    header={hasResults ? <><IconButton aria-label="Back to review list" icon={<Icon name="chevron-left" />} className="review-back" type="tertiary" onClick={() => setDetailOpen(false)} tapScale={1} /><h2>{contact.name}</h2><span className="review-company"><span className="review-company-mark" data-color={contact.companyColor} aria-hidden>{contact.companyMark ?? contact.company.slice(0, 1)}</span>{contact.company}</span><SignalStrength value={contact.strength} /><ReviewNavigation previousDisabled={selectedIndex <= 0} nextDisabled={selectedIndex >= visibleContacts.length - 1} onPrevious={() => { const previous = visibleContacts[selectedIndex - 1]; if (previous) select(previous.id); }} onNext={() => { const next = visibleContacts[selectedIndex + 1]; if (next) select(next.id); }} onDismiss={dismiss} /></> : <h2>Review</h2>}>
      <input ref={fileInput} type="file" multiple hidden aria-label="Choose draft attachments" onChange={event => {
        const target = attachmentTarget.current;
        const files = Array.from(event.currentTarget.files ?? []).map(file => ({ id: crypto.randomUUID(), name: file.name }));
        if (files.length) {
          setAttachments(current => ({ ...current, [target]: [...(current[target] ?? []), ...files] }));
          setStatuses(current => { const next = { ...current }; delete next[target]; return next; });
          setAnnouncement(`${files.length} attachment${files.length === 1 ? "" : "s"} added locally. No files were uploaded.`);
        }
        event.currentTarget.value = "";
      }} />
      {hasResults ? <>
      <FollowUpSummary title={group.label}>Following {contact.name.split(" ")[0]}’s demo last week, there are still some open questions about implementation timing and the security review. This message recaps the next steps and proposes a follow-up</FollowUpSummary>
      <EmailDraft from={{ name: "James Thompson", email: "thompson@ace.com", color: "blue", brand: <span className="review-company-mark review-workspace-brand">◐</span> }} to={{ name: contact.name, email: `${contact.name.split(" ")[0].toLowerCase()}@${contact.company.toLowerCase()}.com`, color: contact.color, brand: <span className="review-company-mark" data-color={contact.companyColor}>{contact.companyMark ?? contact.company.slice(0, 1)}</span> }} value={draft}
        onChange={value => { setDrafts(prev => ({ ...prev, [selectedId]: value })); setStatuses(prev => { const next = { ...prev }; delete next[selectedId]; return next; }); }}
        onSend={() => setStatuses(prev => ({ ...prev, [selectedId]: draft.subject.trim() && draft.body.trim() ? "sent" : "error" }))}
        onAttach={() => { attachmentTarget.current = selectedId; fileInput.current?.click(); }}
        attachments={attachments[selectedId]?.length ? <AttachmentBar aria-label="Draft attachments">{attachments[selectedId].map(file => <Attachment key={file.id} label={file.name} type="unknown" onRemove={() => {
          setAttachments(current => ({ ...current, [selectedId]: current[selectedId].filter(item => item.id !== file.id) }));
          setStatuses(current => { const next = { ...current }; delete next[selectedId]; return next; });
          setAnnouncement(`${file.name} removed.`);
        }} />)}</AttachmentBar> : undefined}
        model={models[selectedId] ?? "Claude Opus 5.5"} onModelChange={model => setModels(prev => ({ ...prev, [selectedId]: model }))}
        error={statuses[selectedId] === "error" ? "Add a subject and message before sending." : undefined}
        status={statuses[selectedId] === "sent" ? "Demo complete — no email was sent." : undefined} />
    </> : <div className="review-empty"><Icon name="list-checks" className="mx-auto mb-4" /><p>No matching contacts.</p><p>{dismissed.size ? "Restore dismissed contacts to continue reviewing." : "Clear the signal filter to continue reviewing."}</p></div>}
    <div className="mx-auto max-w-3xl text-xs text-text-secondary">
      <p role="status">{announcement}</p>
    </div>
    </ReviewWorkspaceShell>;
}
