import { useEffect, useId, useRef, type ReactNode } from "react";
import { Avatar, type AvatarColor } from "@/components/avatar";
import { Button } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/cn";
import "./review-workspace.css";

export type SignalLevel = 1 | 2 | 3;
export function SignalStrength({ value, label = "Signal strength" }: { value: SignalLevel; label?: string }) {
  return <span className="review-signal" data-level={value} role="img" aria-label={`${label}: ${value} of 3`}>
    {[1, 2, 3].map(n => <span key={n} data-filled={n <= value} />)}
  </span>;
}

export type WorkspaceRailItem = { id: string; label: string; icon: IconName; divider?: boolean };
export function WorkspaceRail({ items, activeId, onSelect, brand, footer }: {
  items: WorkspaceRailItem[]; activeId: string; onSelect: (id: string) => void; brand?: ReactNode; footer?: ReactNode;
}) {
  return <nav className="review-rail" aria-label="Workspace navigation">
    <div className="review-brand">{brand ?? <Icon name="circle-dashed" size="lg" />}</div>
    <div className="review-rail-items">{items.map(item => <div key={item.id} className={item.divider ? "review-rail-divider" : undefined}>
      <button type="button" title={item.label} aria-label={item.label} aria-current={activeId === item.id ? "page" : undefined} onClick={() => onSelect(item.id)} className="review-rail-button"><Icon name={item.icon} /></button>
    </div>)}</div>
    <div className="review-rail-footer">{footer}</div>
  </nav>;
}

export type ReviewContact = { id: string; name: string; company: string; companyMark?: ReactNode; avatarSrc?: string; color?: AvatarColor; strength: SignalLevel };
export function ContactRow({ contact, selected, onSelect }: { contact: ReviewContact; selected?: boolean; onSelect: (id: string) => void }) {
  return <button type="button" className="review-contact" aria-pressed={Boolean(selected)} onClick={() => onSelect(contact.id)}>
    <span aria-hidden="true"><Avatar name={contact.name} src={contact.avatarSrc} color={contact.color ?? "orange"} size="sm" /></span>
    <span className="review-contact-copy"><span>{contact.name}</span><span className="review-company"><span className="review-company-mark" aria-hidden>{contact.companyMark ?? contact.company.slice(0, 1)}</span>{contact.company}</span></span>
    <SignalStrength value={contact.strength} />
  </button>;
}

export type ReviewGroup = { id: string; label: string; contacts: ReviewContact[] };
export function ReviewQueue({ title = "Review", groups, selectedId, onSelect, actions, empty }: {
  title?: string; groups: ReviewGroup[]; selectedId?: string; onSelect: (id: string) => void; actions?: ReactNode; empty?: ReactNode;
}) {
  const headingId = useId();
  return <section className="review-queue" aria-labelledby={headingId}>
    <header className="review-queue-header"><h2 id={headingId}><Icon name="list-checks" />{title}</h2><div className="review-actions">{actions}</div></header>
    <div className="review-queue-body">{groups.some(g => g.contacts.length) ? groups.filter(g => g.contacts.length).map(group => <section className="review-group" key={group.id} aria-label={group.label}>
      <h3>{group.label}</h3><div>{group.contacts.map(contact => <ContactRow key={contact.id} contact={contact} selected={contact.id === selectedId} onSelect={onSelect} />)}</div>
    </section>) : <div className="review-empty">{empty ?? "No contacts to review."}</div>}</div>
  </section>;
}

export function FollowUpSummary({ title = "Follow-ups", action = "Send email", children }: { title?: string; action?: string; children: ReactNode }) {
  return <section className="review-summary" aria-label="Suggested action"><header><Icon name="plane" /><h3>{title}</h3><span>{action}</span></header><div>{children}</div></section>;
}

export type EmailDraftValue = { subject: string; body: string };
export type DraftPerson = { name: string; email: string; color?: AvatarColor; avatarSrc?: string };
export function EmailDraft({ from, to, value, onChange, onSend, model, onModelChange, disabled = false, status, error }: {
  from: DraftPerson; to: DraftPerson; value: EmailDraftValue; onChange: (value: EmailDraftValue) => void;
  onSend: () => void; model?: string; onModelChange?: (model: string) => void; disabled?: boolean; status?: ReactNode; error?: string;
}) {
  const id = useId();
  return <section className="review-email" aria-label={`Email draft for ${to.name}`}>
    <dl>{([['From', from], ['To', to]] as const).map(([label, person]) => <div className="review-address" key={label}><dt>{label}</dt><dd><Avatar size="xs" name={person.name} src={person.avatarSrc} color={person.color ?? "orange"} /><span>{person.email}</span></dd></div>)}</dl>
    <div className="review-email-content">
      <label className="sr-only" htmlFor={`${id}-subject`}>Email subject</label>
      <input id={`${id}-subject`} className="review-subject" value={value.subject} onChange={e => onChange({ ...value, subject: e.target.value })} disabled={disabled} />
      <label className="sr-only" htmlFor={`${id}-body`}>Email message</label>
      <textarea id={`${id}-body`} className="review-message" value={value.body} onChange={e => onChange({ ...value, body: e.target.value })} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p id={`${id}-error`} role="alert" className="review-error">{error}</p>}
      <div className="review-email-footer"><Button disabled={disabled} onClick={onSend} trailingIcon={<Icon name="plane" size="sm" />} tapScale={1}>Send</Button>
        {model && <label className="review-model"><Icon name="sparkle" size="sm" /><span className="sr-only">Draft model</span><select aria-label="Draft model" value={model} onChange={e => onModelChange?.(e.target.value)} disabled={!onModelChange || disabled}><option>Claude Opus 5.5</option><option>GPT</option><option>Gemini</option></select></label>}
      </div><div className="review-send-status" role="status">{status}</div>
    </div>
  </section>;
}

/** Layout only. Consumers own navigation, data, drafts, persistence and delivery. */
export function ReviewWorkspaceShell({ rail, queue, header, children, className, detailOpen = false }: {
  rail: ReactNode; queue: ReactNode; header: ReactNode; children: ReactNode; className?: string; detailOpen?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(detailOpen);
  useEffect(() => {
    if (wasOpen.current !== detailOpen && window.matchMedia("(max-width: 760px)").matches) {
      const selector = detailOpen ? ".review-detail" : ".review-shell-queue";
      root.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
    }
    wasOpen.current = detailOpen;
  }, [detailOpen]);
  return <div ref={root} className={cn("review-shell", className)} data-detail-open={detailOpen}>
    {rail}<div className="review-shell-queue" tabIndex={-1}>{queue}</div><section className="review-detail" tabIndex={-1} aria-label="Review detail"><header className="review-detail-header">{header}</header><div className="review-detail-body">{children}</div></section>
  </div>;
}
