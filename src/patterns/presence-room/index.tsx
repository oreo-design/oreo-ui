import { useEffect, useRef, useState } from "react";
import { PresenceStack, PresenceBadge, presenceLabels, type PresencePerson, type PresenceStatus } from "@/components/presence";
import { ChatBubble, CollaborationComposer, TypingPresence, type ChatDraft } from "@/components/project-chat";
import { AgentWorkspaceState } from "@/components/automation";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { StepProgress } from "@/components/step-progress";
import { OreoLogo } from "@/docs/OreoLogo";
import { INITIAL_BRIEF, INITIAL_TASKS, ROOM_PEOPLE } from "./data";
import "./presence-room.css";

type RoomMessage = { id: string; text: string; files: string[] };
export function PresenceRoom() {
  const [dark, setDark] = useState(false);
  const [people, setPeople] = useState(() => ROOM_PEOPLE.slice(0,5));
  const [brief, setBrief] = useState(INITIAL_BRIEF);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [connected, setConnected] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [event, setEvent] = useState("Everyone has a place here.");
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const selectedPerson = people.find(person => person.id === selected);
  const others = people.filter(person => person.id !== "you");
  const typing = connected ? others.filter(person => person.status === "typing") : [];
  function join() {
    setPeople(current => {
      const next = ROOM_PEOPLE.find(person => !current.some(p => p.id === person.id));
      return next ? [...current, {...next}] : current;
    });
  }
  function leave() { setPeople(current => current.length > 1 ? current.slice(0,-1) : current); }
  function cycleStatus() {
    setPeople(current => current.map((person,index) => {
      if (index !== 1) return person;
      const statuses:PresenceStatus[] = ["online","typing","away"];
      const status = statuses[(statuses.indexOf(person.status) + 1) % statuses.length];
      return {...person,status,detail:status === "typing" ? "Writing a comment" : status === "away" ? "Taking a short break" : "Reviewing the launch"};
    }));
  }
  useEffect(() => {
    if (!playing || !connected) return;
    let step = 0;
    const timer = setInterval(() => { [join,cycleStatus,leave,cycleStatus][step++ % 4](); },2200);
    return () => clearInterval(timer);
  },[playing,connected]);
  useEffect(() => () => { if (typingTimer.current) clearTimeout(typingTimer.current); },[]);
  useEffect(() => { if (messages.length && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; },[messages.length]);
  function editBrief(value:string) {
    setBrief(value);
    setEvent("Brief updated in this session.");
    setPeople(current => current.map(person => person.id === "you" ? {...person,status:"typing",detail:"Editing the brief"} : person));
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setPeople(current => current.map(person => person.id === "you" ? {...person,status:"online",detail:"Viewing the brief"} : person)),1600);
  }
  async function send(draft:ChatDraft) {
    if (!connected) throw new Error("Offline demo");
    setMessages(current => [...current,{id:crypto.randomUUID(),text:draft.text,files:draft.files.map(file => file.name)}]);
    setEvent("Message added to this local discussion.");
  }
  function disconnect() { setConnected(false); setPlaying(false); setEvent("Connection paused. Your edits stay in this session."); }
  return <div className={`presence-room min-h-screen bg-bg-elevated text-text-primary${dark ? " theme-dark" : ""}`}>
    <header className="border-b border-border-subtle bg-bg-base">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-10">
        <a href="/presence-stack" className="flex items-center gap-3 text-sm font-semibold"><OreoLogo className="h-5 w-8 shrink-0" /><span>Oreo UI <span className="ml-3 font-normal text-text-tertiary">/ Presence Room</span></span></a>
        <div className="flex items-center gap-3"><span className="rounded-capsule bg-bg-elevated px-3 py-1 text-xs text-text-secondary">Local demo</span><Button type="tertiary" size="sm" tapScale={1} onClick={() => setDark(value => !value)}>{dark ? "Light theme" : "Dark theme"}</Button></div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div><p className="mb-2 text-xs font-medium uppercase tracking-widest text-text-tertiary">A little more together</p><h1 className="text-3xl font-semibold tracking-tight">The launch room</h1><p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">One shared plan. A few familiar faces. Keep the work and the conversation in the same place.</p></div>
        <a href="/presence-stack" className="text-xs text-text-secondary underline underline-offset-4">Explore the components ↗</a>
      </div>
      <section className="overflow-visible rounded-card-medium border border-border-subtle bg-bg-base shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-border-subtle px-5 py-5 md:px-7">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-card-small bg-bg-elevated"><Icon name="folder" /></span><div><h2 className="text-sm font-semibold">Oreo / Autumn launch</h2><p className="mt-1 text-xs text-text-secondary">{connected ? `You and ${others.length} ${others.length === 1 ? "other" : "others"}` : "Presence unavailable · connection paused"}</p></div></div>
          {connected ? <PresenceStack people={people} selfId="you" onPersonSelect={person => { setSelected(person.id); setEvent(`${person.name}: ${person.detail ?? presenceLabels[person.status]}.`); }} /> : <Button type="secondary" tapScale={1} onClick={() => {setConnected(true);setEvent("Reconnected to the local demo.");}}>Reconnect</Button>}
        </header>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="min-w-0 space-y-8 p-5 md:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary"><span className="rounded-md border border-border-subtle px-2 py-1">Launch brief</span><span>Session draft</span><span className="ml-auto">October 2026</span></div>
            <div><h2 className="text-3xl font-semibold tracking-tight">Good things happen<br />when we work together.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-text-secondary">We’re making space for a better way to work. Here’s the story, the people, and the last few things to get right.</p></div>
            <label className="block"><span className="mb-3 block text-sm font-semibold">The idea</span><textarea aria-label="Launch idea" maxLength={3000} value={brief} onChange={event => editBrief(event.target.value)} className="min-h-32 w-full resize-y rounded-card-small border border-border-subtle bg-bg-elevated p-4 text-sm leading-7" /><span className="mt-2 block text-xs text-text-tertiary">Edit the brief to see your own typing status. Changes stay in this tab.</span></label>
            <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-card-small border border-border-subtle p-5"><p className="text-xs text-text-tertiary">The feeling</p><p className="mt-2 text-lg font-medium">Less friction.<br />More flow.</p></div><div className="rounded-card-small border border-border-subtle p-5"><p className="text-xs text-text-tertiary">The promise</p><p className="mt-2 text-lg font-medium">A clear next step,<br />every time.</p></div></div>
            <section aria-label="Launch checklist"><div className="mb-5 flex items-center justify-between"><h3 className="text-sm font-semibold">Before we go live</h3><span className="text-xs text-text-secondary">4 small steps</span></div><StepProgress completed={tasks.filter(task => task.done).length} total={tasks.length} label="Launch readiness" /><ul className="mt-4 divide-y divide-border-subtle">{tasks.map(task => <li key={task.id} className="flex items-center justify-between gap-3 py-3"><label className="flex min-w-0 items-center gap-3 text-sm"><input type="checkbox" checked={task.done} onChange={() => setTasks(current => current.map(value => value.id === task.id ? {...value,done:!value.done} : value))} className="size-4 accent-current" /><span className={task.done ? "text-text-tertiary line-through" : undefined}>{task.title}</span></label><span className="text-xs text-text-tertiary">{task.owner}</span></li>)}</ul></section>
            <p className="text-xs leading-5 text-text-tertiary" role="status">{event}</p>
          </article>
          <aside className="flex min-w-0 flex-col border-t border-border-subtle lg:border-t-0 lg:border-l" aria-label="Room discussion">
            <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4"><h2 className="text-sm font-semibold">Discussion</h2><span className="text-xs text-text-tertiary">{messages.length + 2} messages</span></header>
            {selectedPerson && <div className="mx-4 mt-4 rounded-control bg-bg-elevated p-3 text-xs"><div className="flex items-center justify-between gap-2"><strong>{selectedPerson.name}</strong><PresenceBadge status={selectedPerson.status} /></div><p className="mt-1 text-text-secondary">{selectedPerson.detail}</p><button type="button" className="mt-2 underline" onClick={() => setSelected(undefined)}>Dismiss details</button></div>}
            <div ref={transcript} className="presence-room-transcript space-y-5 p-4" tabIndex={0} aria-label="Discussion messages">
              <ChatBubble author={ROOM_PEOPLE[1]} time="10:42">The story is coming together. Can we make the first step feel a little more welcoming?</ChatBubble>
              <ChatBubble author={ROOM_PEOPLE[2]} time="10:45">Agreed. I’ve checked the walkthrough — the checklist is up to date.</ChatBubble>
              {messages.map(message => <ChatBubble key={message.id} outgoing receipt="Added locally">{message.text}{message.files.map((file,index) => <p key={`${file}-${index}`} className="mt-2 break-all text-xs">Attachment: {file} · local only</p>)}</ChatBubble>)}
            </div>
            <div className="min-h-12 px-4 pb-3"><TypingPresence people={typing} animate /></div>
            <CollaborationComposer onSend={send} note="Local discussion demo. No messages or files leave this tab." />
          </aside>
        </div>
      </section>
      <section className="mt-6 rounded-card-medium border border-border-subtle bg-bg-base p-5" aria-label="Demo controls">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-sm font-medium">Try a little activity</h2><p className="mt-1 text-xs leading-5 text-text-secondary">Simulated people. Real component behavior.</p></div><div className="flex flex-wrap gap-2"><Button type="secondary" size="sm" tapScale={1} disabled={!connected || people.length >= ROOM_PEOPLE.length} onClick={join}>Someone joins</Button><Button type="secondary" size="sm" tapScale={1} disabled={!connected || people.length < 2} onClick={leave}>Someone leaves</Button><Button type="secondary" size="sm" tapScale={1} disabled={!connected || people.length < 2} onClick={cycleStatus}>Change a status</Button><Button type="tertiary" size="sm" tapScale={1} disabled={!connected} onClick={() => setPlaying(value => !value)}>{playing ? "Pause activity" : "Play activity"}</Button></div></div>
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border-subtle pt-4 text-xs"><button type="button" disabled={!connected} className="underline underline-offset-4 disabled:opacity-40" onClick={() => {setPeople(current => current.filter(person => person.id === "you"));setPlaying(false);}}>Clear guests</button><button type="button" disabled={connected} className="underline underline-offset-4 disabled:opacity-40" onClick={() => {setConnected(true);setEvent("Reconnected to the local demo.");}}>Reconnect demo</button><button type="button" disabled={!connected} className="underline underline-offset-4 disabled:opacity-40" onClick={disconnect}>Pause connection</button></div>
        {connected && !others.length && <AgentWorkspaceState title="A little quiet in here" description="You’re the only person in this demo room. Add a guest to try the presence stack." actionLabel="Add a guest" onAction={join} />}
      </section>
      <footer className="py-6 text-xs text-text-tertiary">Presence interaction inspired by <a href="https://x.com/eliakuratli/status/2110376615595409417" className="underline">Elia / Arc</a>. Built with Oreo primitives.</footer>
    </main>
  </div>;
}
