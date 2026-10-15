import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Popover } from "@base-ui-components/react/popover";
import { Avatar } from "@/components/avatar";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import "./presence.css";

export type PresenceStatus = "online" | "away" | "typing";
export type PresencePerson = { id: string; name: string; src?: string; status: PresenceStatus; detail?: string };
export const presenceLabels: Record<PresenceStatus, string> = { online: "Online", away: "Away", typing: "Typing" };

/** A small, text-labelled status mark. Decorative callers may set aria-hidden. */
export function PresenceBadge({ status, animate = true, decorative = false }: { status: PresenceStatus; animate?: boolean; decorative?: boolean }) {
  return <span className="oreo-presence-badge" data-status={status} data-animate={animate} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : presenceLabels[status]} aria-hidden={decorative || undefined}>
    {status === "typing" && <><i /><i /><i /></>}
  </span>;
}

export type PresenceStackProps = {
  people: PresencePerson[];
  max?: number;
  selfId?: string;
  label?: string;
  animate?: boolean;
  onPersonSelect?: (person: PresencePerson) => void;
};

/** A controlled presence view, not a presence transport. IDs identify people across updates. */
export function PresenceStack({ people, max = 4, selfId, label = "People here now", animate = true, onPersonSelect }: PresenceStackProps) {
  const limit = Number.isFinite(max) ? Math.max(1, Math.min(6, Math.floor(max))) : 4;
  const seen = new Set<string>();
  const unique = people.filter(person => !seen.has(person.id) && Boolean(seen.add(person.id)));
  const shown = unique.slice(0, limit);
  const overflow = Math.max(0, unique.length - limit);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string>();
  const [expanded, setExpanded] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const previous = useRef(people);
  const popup = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const moving = animate && !reduce && !keyboard;
  const current = unique.find(person => person.id === hovered);
  const signature = unique.map(person => person.id).join("\0");
  useEffect(() => {
    const nextIds = new Set(people.map(person => person.id));
    const oldIds = new Set(previous.current.map(person => person.id));
    const joined = people.filter(person => !oldIds.has(person.id));
    const left = previous.current.filter(person => !nextIds.has(person.id));
    if (joined.length || left.length) setAnnouncement([
      joined.length ? `${joined.map(person => person.name).join(", ")} joined.` : "",
      left.length ? `${left.map(person => person.name).join(", ")} left.` : "",
    ].filter(Boolean).join(" "));
    previous.current = people;
  }, [signature, people]);
  const step = expanded ? 40 : 24;
  const labelFor = (person: PresencePerson) => `${person.name}${person.id === selfId ? " (you)" : ""}`;
  return <div ref={setHost} className="oreo-presence" data-keyboard={keyboard}>
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="oreo-presence-trigger" aria-label={`${label}, ${unique.length} ${unique.length === 1 ? "person" : "people"}`} style={{ width: (limit + 1) * 40 }}
        onPointerEnter={event => { if (event.pointerType === "mouse") { setKeyboard(false); setExpanded(true); } }}
        onPointerLeave={() => { setExpanded(false); setHovered(undefined); }}
        onFocus={event => { if (event.currentTarget.matches(":focus-visible")) { setKeyboard(true); setExpanded(true); } }}
        onBlur={() => { setExpanded(false); setHovered(undefined); }}
        onKeyDown={event => { setKeyboard(true); if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const index = shown.findIndex(person => person.id === hovered); setHovered(shown[(index + (event.key === "ArrowRight" ? 1 : -1) + shown.length) % shown.length]?.id); } }}>
        <span aria-hidden="true" className="absolute inset-0">
          <AnimatePresence initial={false}>
            {shown.map((person, index) => <motion.span key={person.id} className="oreo-presence-face" style={{ zIndex: limit - index }}
              initial={{ opacity: 0, transform: `translateX(${index * step}px) scale(0.95)` }}
              animate={{ opacity: person.status === "away" ? 0.6 : 1, transform: `translateX(${index * step}px) scale(1)` }}
              exit={{ opacity: 0, transform: `translateX(${index * step}px) scale(0.95)` }}
              transition={{ duration: moving ? 0.18 : 0, ease: [0.23, 1, 0.32, 1] }}
              onPointerEnter={() => setHovered(person.id)}>
              <Avatar name={person.name} src={person.src} size="sm" color="purple" />
              <span className="oreo-presence-face-status"><PresenceBadge status={person.status} animate={animate} decorative /></span>
            </motion.span>)}
          </AnimatePresence>
          {!!overflow && <motion.span className="oreo-presence-overflow" animate={{ transform:`translateX(${shown.length * step}px)` }} transition={{ duration:moving ? 0.18 : 0, ease:[0.23,1,0.32,1] }} onPointerEnter={() => setHovered(undefined)}>+{overflow}</motion.span>}
          {!unique.length && <span className="flex h-full items-center gap-2 text-xs text-text-secondary"><Icon name="users" size="sm" />No one here yet</span>}
        </span>
        {expanded && current && <span className="oreo-presence-hover" aria-hidden="true">{labelFor(current)} · {presenceLabels[current.status]}</span>}
      </Popover.Trigger>
      <Popover.Portal container={host}>
        <Popover.Positioner side="bottom" align="end" sideOffset={12} collisionPadding={16} positionMethod="fixed" className="z-50 outline-none">
          <Popover.Popup ref={popup} className="oreo-presence-popup" initialFocus={popup} finalFocus>
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border-subtle px-4 py-3">
              <div><Popover.Title className="text-sm font-semibold">{label}</Popover.Title><Popover.Description className="mt-1 text-xs text-text-secondary">{unique.length} {unique.length === 1 ? "person" : "people"} in this space</Popover.Description></div>
              <Popover.Close render={<IconButton type="tertiary" tapScale={1} icon={<Icon name="x" size="sm" />} aria-label="Close people" />} />
            </div>
            <ul className="min-h-0 max-h-72 overflow-y-auto p-2" aria-label="People and status">
              {unique.map(person => {
                const content = <><Avatar name={person.name} src={person.src} size="sm" color="purple" aria-hidden="true" /><span className="min-w-0 flex-1"><strong className="block break-words text-sm font-medium">{labelFor(person)}</strong><span className="mt-0.5 block break-words text-xs text-text-secondary">{presenceLabels[person.status]}{person.detail ? ` · ${person.detail}` : ""}</span></span><PresenceBadge status={person.status} animate={animate} decorative /></>;
                return <li key={person.id}>{onPersonSelect ? <button type="button" className="oreo-presence-person" onClick={() => { onPersonSelect(person); setOpen(false); }}>{content}</button> : <div className="oreo-presence-person">{content}</div>}</li>;
              })}
              {!unique.length && <li className="px-5 py-8 text-center text-sm text-text-secondary">People will appear here when they join.</li>}
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
  </div>;
}
