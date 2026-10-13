import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { ContactRow, EmailDraft, EmailDraftToolbar, ReviewNavigation, FollowUpSummary, ReviewQueue, SignalStrength, WorkspaceRail } from "@/components/review-workspace";
import { initialDraft, reviewGroups } from "@/patterns/review-workspace/data";
import { Button } from "@/components/button";
const TOC = [{ id: "introduction", label: "Introduction" }, { id: "signals", label: "Signal strength" }, { id: "contacts", label: "Contact row & queue" }, { id: "rail", label: "Workspace rail" }, { id: "draft", label: "Summary & email" }, { id: "actions", label: "Review & draft actions" }, { id: "composition", label: "Compose the shell" }, { id: "api", label: "API reference" }];
function Examples() {
  const [selected, setSelected] = useState("olivia");
  const [active, setActive] = useState("review");
  const [draft, setDraft] = useState(initialDraft(reviewGroups[0].contacts[0]));
  const [status, setStatus] = useState("");
  const [position, setPosition] = useState(0);
  const [action, setAction] = useState("");
  return <>
    <Section id="signals" title="Signal strength" description="Three compact segments communicate early, medium, and strong signals. A text alternative exposes the level without relying on color."><div className="flex flex-wrap gap-x-8 gap-y-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-6">{([1, 2, 3] as const).map(n => <div key={n} className="flex items-center gap-3 text-xs"><SignalStrength value={n} />{["Early", "Medium", "Strong"][n - 1]}</div>)}</div></Section>
    <Section id="contacts" title="Contact row & review queue" description="Avatar, company identity, selection, and signal strength in one reusable row. The queue adds section headings and a toolbar slot.">
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-3"><ContactRow contact={reviewGroups[0].contacts[0]} selected={selected === "olivia"} onSelect={id => setSelected(selected === id ? "" : id)} /></div>
      <div className="mt-4 h-80 overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]"><ReviewQueue groups={reviewGroups.slice(0, 1)} selectedId={selected} onSelect={setSelected} /></div>
    </Section>
    <Section id="rail" title="Workspace rail" description="A compact navigation rail with named controls, a selected state, separators, and brand and footer slots."><div className="flex h-64 overflow-hidden rounded-xl border border-[var(--color-border-subtle)]"><WorkspaceRail activeId={active} onSelect={setActive} items={[{ id: "review", label: "Review", icon: "list-checks" }, { id: "contacts", label: "Contacts", icon: "folder" }, { id: "signals", label: "Signals", icon: "chart-line", divider: true }]} /><div className="grid flex-1 place-items-center bg-[var(--color-bg-base)] text-sm capitalize">{active}</div></div></Section>
    <Section id="draft" title="Follow-up summary & email draft" description="The suggested next action sits above a controlled, editable draft. Delivery belongs to the host application."><FollowUpSummary>Following Olivia’s demo, recap the implementation plan and schedule a security review.</FollowUpSummary><EmailDraft from={{ name: "James Thompson", email: "james@ace.example" }} to={{ name: "Olivia Bennett", email: "olivia@vercel.example" }} value={draft} onChange={value => { setDraft(value); setStatus(""); }} onSend={() => setStatus(draft.subject.trim() && draft.body.trim() ? "Demo complete — no email was sent." : "Add a subject and message first.")} status={status} /></Section>
    <Section id="actions" title="Review & draft actions" description="Two controlled action groups from the complete reference: previous / next / dismiss, and an attachment action opposite the model and send controls. Applications own file selection and queue changes.">
      <div className="rounded-xl border border-border-subtle bg-bg-base p-5">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm"><span>Contact {position + 1} of 3</span><ReviewNavigation previousDisabled={position === 0} nextDisabled={position === 2} onPrevious={() => setPosition(n => n - 1)} onNext={() => setPosition(n => n + 1)} onDismiss={() => setAction("Dismiss requested — the host owns the queue.")} /></div>
        <EmailDraftToolbar model="Claude Opus 5.5" onAttach={() => setAction("Attachment requested — the template opens a local file picker.")} onSend={() => setAction("Send requested — no email was sent.")} />
        <p role="status" className="mt-4 min-h-5 text-xs text-text-secondary">{action}</p>
      </div>
      <div className="mt-5"><CodeBlock code={`<ReviewNavigation
  previousDisabled={index === 0}
  nextDisabled={index === contacts.length - 1}
  onPrevious={previous} onNext={next} onDismiss={dismiss} />

<EmailDraft from={sender} to={recipient} value={draft}
  onChange={setDraft} onSend={reviewAndSend}
  onAttach={openFilePicker}
  attachments={<AttachmentBar>{fileChips}</AttachmentBar>}
  model={model} onModelChange={setModel} />`} /></div>
    </Section>
  </>;
}
export function ReviewComponentsDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage toc={TOC} breadcrumb={["Shell", "Review components"]} nav={nav}>{() => <>
    <header id="introduction" className="pb-8"><p className="mb-3 text-xs text-[var(--color-text-tertiary)]">COMPOSABLE WORKSPACES</p><h1 className="text-[32px] font-semibold tracking-tight">Review components</h1><p className="mt-3 text-[15px] leading-7 text-[var(--color-text-secondary)]">A quiet workspace for turning signals into conversations. Nine reusable parts, from a three-segment indicator to a complete review shell.</p><div className="mt-5"><Button render={<a href="/review-workspace" />} tapScale={1}>Open UI template ↗</Button></div><p className="mt-4 text-xs leading-6 text-[var(--color-text-tertiary)]">Inspired by <a className="underline underline-offset-4" href="https://x.com/_heyrico/status/2109659622114288121" target="_blank" rel="noreferrer">@_heyrico’s interface reference</a>. Independently implemented with Oreo tokens, Avatar, Icon, Button, Menu, and Attachment. The complete reference informs the layout; responsive behavior and local demo states extend it. Portraits and brand artwork are replaced with Oreo initials and simple marks.</p></header>
    <Examples />
    <Section id="composition" title="Compose the shell" description="Copy components/review-workspace for the building blocks. Add patterns/review-workspace for the interactive fixture. The shell owns layout; your application owns data and behavior."><CodeBlock code={`import { ReviewWorkspaceShell, WorkspaceRail, ReviewQueue,\n  FollowUpSummary, EmailDraft } from "@/components/review-workspace";\n\n<ReviewWorkspaceShell\n  rail={<WorkspaceRail items={navigation} activeId={section} onSelect={setSection} />}\n  queue={<ReviewQueue groups={groups} selectedId={selectedId} onSelect={selectContact} />}\n  header={<h2>{contact.name}</h2>}\n  detailOpen={detailOpen}\n>\n  <FollowUpSummary>{summary}</FollowUpSummary>\n  <EmailDraft from={sender} to={recipient} value={draft}\n    onChange={setDraft} onSend={reviewAndSend} />\n</ReviewWorkspaceShell>`} /><p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">Below 760px, show either the queue or the detail panel. Set detailOpen when a contact is selected and provide a back action in the header. Desktop uses independent scrolling for the list and detail. Draft edits in the template survive contact switches, and reset on reload.</p></Section>
    <Section id="api" title="API reference" description="All nine components are exported from the same entry point. No services or additional dependencies are required."><div className="overflow-x-auto"><PropsTable rows={[
      { prop: "SignalStrength", type: "value: 1 | 2 | 3; label?: string", desc: "Segment count and accessible description." },
      { prop: "WorkspaceRail", type: "items; activeId; onSelect; brand?; footer?", desc: "Controlled navigation. Items accept id, label, icon, and optional divider." },
      { prop: "ContactRow", type: "contact; selected?; onSelect", desc: "Contact accepts id, name, company, strength, avatarSrc?, color?, companyMark?, companyColor?." },
      { prop: "ReviewQueue", type: "groups; selectedId?; onSelect; title?; actions?; empty?; footer?", desc: "Groups contain id, label and contacts. Empty content and a footer slot can offer recovery." },
      { prop: "FollowUpSummary", type: "title?; action?; children", desc: "Non-interactive action label and summary content." },
      { prop: "EmailDraft", type: "from; to; value; onChange; onSend", desc: "Controlled subject and plain-text body with paragraph spacing and highlighted mentions. Optional model, modelMark, onModelChange, disabled, error, status, onAttach and attachments slots. People accept name, email, color?, avatarSrc?, brand?." },
      { prop: "ReviewNavigation", type: "onPrevious; onNext; onDismiss; previousDisabled?; nextDisabled?; disabled?", desc: "Labelled actions for the host’s filtered and sorted queue. Boundaries disable navigation; no wraparound." },
      { prop: "EmailDraftToolbar", type: "onSend; onAttach?; model?; modelMark?; onModelChange?; disabled?", desc: "Attachment action at the leading edge, model and send at the trailing edge. Supports host-defined model names." },
      { prop: "ReviewWorkspaceShell", type: "rail; queue; header; children; detailOpen?; className?", desc: "Responsive three-column layout with a mobile master-detail state." },
    ]} /></div></Section>
  </>}</DocsPage>;
}
