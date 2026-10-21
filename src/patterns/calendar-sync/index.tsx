import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ConnectionState, MeetingGroup, type ConnectionStatus } from "@/components/connection-state";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import { easeOut } from "@/lib/motion";
import { upcoming, earlier } from "./data";

export function GoogleMark() { return <span className="text-3xl font-semibold text-status-progress">G</span>; }
export function CalendarSyncDemo({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<ConnectionStatus | "ready">("idle");
  const [failNext, setFailNext] = useState(false);
  const [instant, setInstant] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const restoreFocus = useRef(false);
  const region = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (status !== "syncing" && status !== "success") return;
    const timer = window.setTimeout(() => setStatus(status === "syncing" ? (failNext ? "error" : "success") : "ready"), status === "syncing" ? 2800 : 800);
    return () => window.clearTimeout(timer);
  }, [status, failNext]);
  useEffect(() => {
    if (!restoreFocus.current) return;
    if (status === "ready") heading.current?.focus();
    else if (status === "idle" || status === "error") region.current?.querySelector<HTMLButtonElement>("section button")?.focus();
  }, [status]);
  const copy = {
    idle: ["Connect your Google account", "Bring your calendar into one place. Your meetings appear here, with prep before each call and notes after."],
    syncing: ["Syncing your calendar", "Your meetings will appear here once it’s done."],
    success: ["Your calendar is connected", "Everything is ready. Let’s see what’s coming up."],
    error: ["We couldn’t sync your calendar", "Your connection was interrupted. Try again to bring your meetings into view."],
  } as const;
  return <div ref={region} onKeyDownCapture={() => setInstant(true)} onPointerDownCapture={() => setInstant(false)}>
    <div className={compact ? "min-h-96" : "min-h-[38rem]"}>
      {status === "ready" ? <motion.div initial={{ opacity: instant ? 1 : 0, transform: reduced || instant ? "translateY(0px)" : "translateY(6px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: instant ? 0 : .24, ease: easeOut }} className="space-y-5 p-3 sm:p-5"><h2 ref={heading} tabIndex={-1} className="sr-only">Calendar synced. Your meetings</h2><MeetingGroup title="Coming up" meetings={upcoming} /><MeetingGroup title="Earlier" icon="clock-history" meetings={earlier} /></motion.div> : <ConnectionState className={compact ? "min-h-96" : "min-h-[38rem]"} status={status} instant={instant} title={copy[status][0]} description={copy[status][1]} provider={<GoogleMark />} destination={<OreoLogo className="h-6 w-8 text-text-primary" />} actionLabel={status === "error" ? "Try again" : "Connect Google"} onAction={event => { restoreFocus.current = event.detail === 0; setInstant(event.detail === 0); if (status === "error") setFailNext(false); setStatus("syncing"); }} onCancel={event => { restoreFocus.current = event.detail === 0; setInstant(event.detail === 0); setStatus("idle"); }} />}
    </div>
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-5 py-4 text-xs text-text-secondary">
      <span>Local demo · No Google account required</span>
      <div className="flex flex-wrap items-center gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={failNext} disabled={status === "syncing" || status === "success"} onChange={event => setFailNext(event.target.checked)} />Simulate failure</label><Button type="tertiary" size="sm" tapScale={1} onClick={() => { setStatus("idle"); setFailNext(false); }}>Reset demo</Button></div>
    </footer>
  </div>;
}
export function CalendarSyncWorkspace() {
  const [dark, setDark] = useThemeMode(false);
  return <div className={dark ? "theme-dark" : ""}><div className="min-h-screen bg-bg-elevated text-text-primary">
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border-subtle bg-bg-base px-5 sm:px-8"><a href="/connection-state" className="flex items-center gap-3 text-sm"><OreoLogo className="h-4 w-6" /><span className="text-text-tertiary">/</span><span>Calendar Sync</span></a><IconButton type="tertiary" tapScale={1} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setDark(value => !value)} icon={<Icon name={dark ? "sun" : "moon"} />} /></header>
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12"><div className="mb-6 flex items-end justify-between gap-3"><div><p className="mb-2 text-xs text-text-tertiary">YOUR WORK, IN SYNC</p><h1 className="text-2xl font-semibold tracking-tight">Meetings</h1></div><a href="/connection-state" className="text-xs text-text-secondary underline underline-offset-4">Explore components ↗</a></div><div className="overflow-hidden rounded-card-medium border border-border-subtle bg-bg-base shadow-[var(--shadow-default)]"><CalendarSyncDemo /></div></main>
  </div></div>;
}
