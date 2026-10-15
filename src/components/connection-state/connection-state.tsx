import { useId, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import "./connection-state.css";

export type ConnectionStatus = "idle" | "syncing" | "success" | "error";
export type IntegrationStackProps = {
  status?: ConnectionStatus;
  provider?: ReactNode;
  destination?: ReactNode;
  instant?: boolean;
};

/** Decorative identity pair; the adjacent ConnectionState supplies the accessible status. */
export function IntegrationStack({ status = "idle", provider = <Icon name="calendar" size="xl" />, destination = <Icon name="sparkle" size="xl" />, instant = false }: IntegrationStackProps) {
  return <div className="integration-stack" data-status={status} data-instant={instant} aria-hidden="true">
    <div className="integration-tile integration-provider">{provider}</div>
    <div className="integration-tile integration-status">
      {status === "syncing" ? <svg viewBox="0 0 32 32" className="size-8"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" /><path className="integration-sweep" d="M16 16V7a9 9 0 0 1 9 9Z" fill="currentColor" /></svg> : status === "success" ? <span className="flex size-8 items-center justify-center rounded-capsule bg-status-success text-bg-base"><Icon name="check" weight="bold" /></span> : <Icon name={status === "error" ? "warning-circle" : "plug"} size="xl" />}
    </div>
    <div className="integration-tile integration-destination">{destination}</div>
  </div>;
}

export type ConnectionStateProps = IntegrationStackProps & {
  title: string;
  description: ReactNode;
  actionLabel?: string;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

/** Controlled presentation: no authentication, network requests or automatic success. */
export function ConnectionState({ status = "idle", title, description, actionLabel, onAction, onCancel, provider, destination, instant = false, className }: ConnectionStateProps) {
  const id = useId();
  const reduced = useReducedMotion();
  return <section aria-labelledby={id} className={cn("connection-state relative isolate flex min-h-96 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center", className)}>
    <div className="connection-dot-field" aria-hidden="true" />
    <IntegrationStack status={status} provider={provider} destination={destination} instant={instant} />
    <div className="relative mt-7 w-full max-w-md" role="status" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={status} initial={{ opacity: 0, transform: reduced || instant ? "translateY(0px)" : "translateY(4px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} transition={{ duration: instant ? 0 : .16, ease: easeOut }}>
          <h2 id={id} className="text-base font-medium tracking-tight">{title}</h2>
          <div className="mt-3 text-sm leading-6 text-text-secondary">{description}</div>
        </motion.div>
      </AnimatePresence>
    </div>
    <div className="relative mt-5 flex min-h-8 items-center justify-center gap-2">
      {onAction && actionLabel && status !== "syncing" && status !== "success" && <Button tapScale={1} onClick={onAction}>{actionLabel}</Button>}
      {status === "syncing" && onCancel && <Button type="tertiary" tapScale={1} onClick={onCancel}>Cancel sync</Button>}
    </div>
  </section>;
}

export type Meeting = { id: string; date: string; time: string; title: string; company: string; attendees: string[]; note: string };
export function MeetingRow({ meeting }: { meeting: Meeting }) {
  return <li className="meeting-row rounded-control focus-within:bg-bg-elevated">
    <details className="group">
      <summary className="grid cursor-pointer grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-2 rounded-control px-3 py-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-text-primary sm:grid-cols-[6.5rem_4rem_1fr_auto]">
        <span className="text-sm text-text-secondary">{meeting.date}</span>
        <span className="col-start-1 row-start-2 text-xs text-text-tertiary sm:col-auto sm:row-auto sm:text-sm">{meeting.time}</span>
        <span className="col-start-2 row-span-2 row-start-1 flex min-w-0 items-center gap-2 text-sm sm:col-auto sm:row-auto"><span className="flex size-5 shrink-0 items-center justify-center rounded-control-tiny bg-palette-default-bg text-xs font-semibold text-text-secondary" aria-hidden="true">{meeting.company[0]}</span><span className="min-w-0 break-words">{meeting.title}</span></span>
        <AvatarGroup size="xs" max={3} className="col-start-2 justify-end sm:col-auto">{meeting.attendees.map(name => <Avatar key={name} name={name} size="xs" />)}</AvatarGroup>
      </summary>
      <div className="border-t border-border-subtle px-3 py-4 text-sm leading-6 text-text-secondary sm:ml-48"><p>{meeting.note}</p><p className="mt-2 text-xs text-text-tertiary">Attendees: {meeting.attendees.join(", ")}</p></div>
    </details>
  </li>;
}
export function MeetingGroup({ title, meetings, icon = "calendar" }: { title: string; meetings: Meeting[]; icon?: "calendar" | "clock-history" }) {
  const id = useId();
  return <section aria-labelledby={id}>
    <div className="flex items-center gap-2 rounded-control bg-bg-elevated px-3 py-3 text-sm"><Icon name={icon} size="sm" className="text-text-secondary" /><h2 id={id} className="font-medium">{title}</h2><span className="rounded-capsule bg-palette-default-bg px-2 py-0.5 text-xs tabular-nums text-text-secondary">{meetings.length}</span><Icon name="users" size="sm" className="ml-auto text-text-tertiary" /></div>
    {meetings.length ? <ul className="mt-2">{meetings.map(meeting => <MeetingRow key={meeting.id} meeting={meeting} />)}</ul> : <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-sm text-text-secondary"><Icon name="calendar" /><p>No meetings in this group.</p></div>}
  </section>;
}
