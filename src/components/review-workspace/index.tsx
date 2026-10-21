import { useEffect, useId, useRef, type ReactNode } from "react";
import { Avatar, type AvatarColor } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/cn";
import "./review-workspace.css";
import { DraftMessage } from "./DraftMessage";
import claudeMark from "@/components/icon/assets/brands/claude-color.svg";

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

export type ReviewContact = { id: string; name: string; company: string; companyColor?: "mint" | "brown" | "purple" | "blue"; companyMark?: ReactNode; avatarSrc?: string; color?: AvatarColor; strength: SignalLevel };
export function ContactRow({ contact, selected, onSelect }: { contact: ReviewContact; selected?: boolean; onSelect: (id: string) => void }) {
  return <button type="button" className="review-contact" aria-pressed={Boolean(selected)} onClick={() => onSelect(contact.id)}>
    <span aria-hidden="true"><Avatar name={contact.name} src={contact.avatarSrc} color={contact.color ?? "orange"} size="sm" /></span>
    <span className="review-contact-copy"><span>{contact.name}</span><span className="review-company"><span className="review-company-mark" data-color={contact.companyColor} aria-hidden>{contact.companyMark ?? contact.company.slice(0, 1)}</span>{contact.company}</span></span>
    <SignalStrength value={contact.strength} />
  </button>;
}

export type ReviewGroup = { id: string; label: string; contacts: ReviewContact[] };
export function ReviewQueue({ title = "Review", groups, selectedId, onSelect, actions, empty, footer }: {
  title?: string; groups: ReviewGroup[]; selectedId?: string; onSelect: (id: string) => void; actions?: ReactNode; empty?: ReactNode; footer?: ReactNode;
}) {
  const headingId = useId();
  return <section className="review-queue" aria-labelledby={headingId}>
    <header className="review-queue-header"><h2 id={headingId}><Icon name="scan-text" size="sm" />{title}</h2><div className="review-actions">{actions}</div></header>
    <div className="review-queue-body">{groups.some(g => g.contacts.length) ? groups.filter(g => g.contacts.length).map(group => <section className="review-group" key={group.id} aria-label={group.label}>
      <h3>{group.label}</h3><div>{group.contacts.map(contact => <ContactRow key={contact.id} contact={contact} selected={contact.id === selectedId} onSelect={onSelect} />)}</div>
    </section>) : <div className="review-empty">{empty ?? "No contacts to review."}</div>}</div>
    {footer && <footer className="border-t border-border-subtle p-3">{footer}</footer>}
  </section>;
}

export function FollowUpSummary({ title = "Follow-ups", action = "Send email", children }: { title?: string; action?: string; children: ReactNode }) {
  return <section className="review-summary" aria-label="Suggested action"><header><Icon name="cursor" size="sm" /><h3>{title}</h3><span>{action}</span></header><div>{children}</div></section>;
}

/** Navigation follows the host's filtered/sorted queue, without wrapping. */
export function ReviewNavigation({ onPrevious, onNext, onDismiss, previousDisabled = false, nextDisabled = false, disabled = false }: {
  onPrevious: () => void; onNext: () => void; onDismiss: () => void;
  previousDisabled?: boolean; nextDisabled?: boolean; disabled?: boolean;
}) {
  return <div className="review-navigation" role="group" aria-label="Review actions">
    <IconButton aria-label="Previous contact" title="Previous contact" type="secondary" size="sm" shape="rectangle" tapScale={1} disabled={disabled || previousDisabled} onClick={onPrevious} icon={<Icon name="chevron-up" size="sm" />} />
    <IconButton aria-label="Next contact" title="Next contact" type="secondary" size="sm" shape="rectangle" tapScale={1} disabled={disabled || nextDisabled} onClick={onNext} icon={<Icon name="chevron-down" size="sm" />} />
    <Button type="secondary" size="sm" tapScale={1} disabled={disabled} onClick={onDismiss}>Dismiss</Button>
  </div>;
}

export type EmailDraftToolbarProps = {
  onSend: () => void; onAttach?: () => void; model?: string;
  onModelChange?: (model: string) => void; modelMark?: ReactNode; disabled?: boolean;
};

/** Reusable composer actions. Picking files and sending remain host-owned. */
export function EmailDraftToolbar({ onSend, onAttach, model, onModelChange, modelMark, disabled = false }: EmailDraftToolbarProps) {
  return <div className="review-email-footer">
    {onAttach && <IconButton aria-label="Attach files" title="Attach files" type="secondary" size="sm" shape="rectangle" tapScale={1} disabled={disabled} onClick={onAttach} icon={<Icon name="paperclip" size="sm" />} />}
    <div className="review-email-send-actions">
      {model && <label className="review-model">{modelMark ?? (model.startsWith("Claude") ? <img src={claudeMark} alt="" className="review-model-mark" /> : <Icon name="sparkle" size="sm" />)}<span className="sr-only">Draft model</span><select aria-label="Draft model" value={model} onChange={e => onModelChange?.(e.target.value)} disabled={!onModelChange || disabled}>{[...new Set([model, "Claude Opus 5.5", "GPT", "Gemini"])].map(option => <option key={option}>{option}</option>)}</select></label>}
      <Button size="sm" disabled={disabled} onClick={onSend} trailingIcon={<Icon name="paper-plane" size="sm" />} tapScale={1}>Send</Button>
    </div>
  </div>;
}

export type EmailDraftValue = { subject: string; body: string };
export type DraftPerson = { name: string; email: string; color?: AvatarColor; avatarSrc?: string; brand?: ReactNode };
export function EmailDraft({ from, to, value, onChange, onSend, model, onModelChange, modelMark, disabled = false, status, error, onAttach, attachments }: {
  from: DraftPerson; to: DraftPerson; value: EmailDraftValue; onChange: (value: EmailDraftValue) => void;
  onSend: () => void; model?: string; onModelChange?: (model: string) => void; modelMark?: ReactNode; disabled?: boolean; status?: ReactNode; error?: string; onAttach?: () => void; attachments?: ReactNode;
}) {
  const id = useId();
  return <section className="review-email" aria-label={`Email draft for ${to.name}`}>
    <dl>{([['From', from], ['To', to]] as const).map(([label, person]) => <div className="review-address" key={label}><dt>{label}</dt><dd><Avatar size="xs" name={person.name} src={person.avatarSrc} color={person.color ?? "orange"} /><span>{person.email}</span>{person.brand && <span className="review-address-brand" aria-hidden>{person.brand}</span>}</dd></div>)}</dl>
    <div className="review-email-content">
      <label className="sr-only" htmlFor={`${id}-subject`}>Email subject</label>
      <input id={`${id}-subject`} className="review-subject" value={value.subject} onChange={e => onChange({ ...value, subject: e.target.value })} disabled={disabled} />
      <DraftMessage id={`${id}-body`} value={value.body} onChange={body => onChange({ ...value, body })} disabled={disabled} errorId={error ? `${id}-error` : undefined} />
      {error && <p id={`${id}-error`} role="alert" className="review-error">{error}</p>}
      {attachments && <div className="review-email-attachments">{attachments}</div>}
      <EmailDraftToolbar onSend={onSend} onAttach={onAttach} model={model} onModelChange={onModelChange} modelMark={modelMark} disabled={disabled} />
      <div className="review-send-status" role="status">{status}</div>
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
