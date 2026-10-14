import { useLayoutEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import { ConnectionGroup, ConnectionRow, ConnectionSetup, InlineProjectPicker, NewConnectionButton, ProjectIdentity, type ConnectionDirection } from "@/components/connections";
import { currentProject, connectionProjects } from "./data";

export function EditableConnections({ direction, initialIds = [], dark = false }: { direction: ConnectionDirection; initialIds?: string[]; dark?: boolean }) {
  const [ids, setIds] = useState(initialIds);
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [instant, setInstant] = useState(false);
  const [notice, setNotice] = useState("");
  const addRef = useRef<HTMLButtonElement>(null);
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusTarget = useRef<string | "add" | null>(null);
  useLayoutEffect(() => {
    if (focusTarget.current === "add") addRef.current?.focus();
    else if (focusTarget.current) rowRefs.current.get(focusTarget.current)?.focus();
    focusTarget.current = null;
  }, [adding, ids]);
  const available = connectionProjects.filter(p => p.id !== currentProject.id && !ids.includes(p.id));
  return <ConnectionGroup project={currentProject} direction={direction}>
    {ids.length === 0 && !adding && <div className="flex min-h-12 items-center gap-2.5 px-3 py-3 text-text-tertiary" aria-label="No connections yet"><span className="size-5 rounded-capsule border border-dashed border-text-tertiary" /><span className="h-3 w-16 rounded-control-tiny border border-dashed border-text-tertiary" /><span className="sr-only">No connections yet</span></div>}
    {ids.map(id => {
      const project = connectionProjects.find(p => p.id === id)!;
      return <ConnectionRow key={id} project={project} open={openId === id} instant={instant} triggerRef={node => { if (node) rowRefs.current.set(id, node); else rowRefs.current.delete(id); }} onOpenChange={open => { setInstant(false); setOpenId(open ? id : null); }}>
        <ConnectionSetup source={direction === "readers" ? currentProject : project} target={direction === "readers" ? project : currentProject}>
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-text-tertiary">Example project ID · Local demo</span><Button type="tertiary" size="sm" tapScale={1} danger onClick={() => { focusTarget.current = "add"; setIds(prev => prev.filter(value => value !== id)); setOpenId(null); setNotice(`${project.name} disconnected.`); }}>Disconnect</Button></div>
        </ConnectionSetup>
      </ConnectionRow>;
    })}
    {adding ? <InlineProjectPicker dark={dark} instant={instant} projects={available} label={direction === "readers" ? "Search projects that can read flags" : "Search projects to read flags from"} onCancel={restore => { if (restore) focusTarget.current = "add"; setAdding(false); }} onSelect={(project, keyboard) => { focusTarget.current = project.id; setInstant(keyboard); setIds(prev => prev.includes(project.id) ? prev : [...prev, project.id]); setOpenId(project.id); setAdding(false); setNotice(`${project.name} connected. Setup instructions expanded.`); }} /> : null}
    <NewConnectionButton buttonRef={addRef} allConnected={available.length === 0} disabled={available.length === 0 || adding} onClick={keyboard => { setInstant(keyboard); setOpenId(null); setAdding(true); }} />
    <p className="sr-only" role="status">{notice}</p>
  </ConnectionGroup>;
}

export function ConnectionsWorkspace() {
  const [dark, setDark] = useState(false);
  const [version, setVersion] = useState(0);
  return <div className={dark ? "theme-dark" : ""}>
    <div className="min-h-screen bg-bg-elevated text-text-primary">
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border-subtle bg-bg-base px-5 sm:px-8">
        <a href="/connection-components" className="flex items-center gap-3 text-sm"><OreoLogo className="h-4 w-6" /><span className="text-text-tertiary">/</span><span>Oreo UI</span><span className="hidden text-text-tertiary sm:inline">/ Connections</span></a>
        <IconButton type="tertiary" tapScale={1} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setDark(value => !value)} icon={<Icon name={dark ? "sun" : "moon"} />} />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="rounded-card-medium border border-border-subtle bg-bg-base px-4 py-6 shadow-[var(--shadow-default)] sm:px-10 sm:py-8">
          <div className="mb-9 flex items-center gap-4 text-text-secondary"><Icon name="list" size="sm" /><span className="h-5 border-l border-border-default" /><ProjectIdentity project={currentProject} className="text-xs" /></div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Connections</h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">Share flags between Vercel projects.</p>
          <div key={version} className="mt-10 space-y-12 sm:mt-12">
            <EditableConnections direction="readers" dark={dark} />
            <EditableConnections direction="sources" dark={dark} initialIds={["prj_demo_next_site", "prj_demo_geist_storybook"]} />
          </div>
        </div>
        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-text-tertiary"><span>Local demo · Connections reset on reload</span><div className="flex items-center gap-4"><button type="button" className="cursor-pointer text-text-secondary underline-offset-4 hover:underline" onClick={() => setVersion(value => value + 1)}>Reset demo</button><a href="/connection-components" className="text-text-secondary underline-offset-4 hover:underline">Explore components ↗</a></div></footer>
      </main>
    </div>
  </div>;
}
