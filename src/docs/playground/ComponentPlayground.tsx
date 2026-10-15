import { useEffect, useState } from "react";
import { Sidebar } from "@/docs/Sidebar";
import type { DocsNav } from "@/docs/DocsPage";
import type { CustomizeState } from "@/docs/CustomizePanel";
import { Button } from "@/components/button";
import { Icon, ICON_LIBRARIES } from "@/components/icon";
import { CodeBlock } from "@/components/code-block";
import { PropertyControl } from "./PropertyControl";
import { defaultsFor, resolveControl, updateValues, select, toggle, number, type PlaygroundSpec, type Values } from "./schema";
import { playgroundCode } from "./code";
import { playgrounds } from "./registry";
import { useDemo } from "./useDemo";

export function ComponentPlayground({ spec, nav, breadcrumb, appearance, onDocumentation }: { spec: PlaygroundSpec; nav: DocsNav; breadcrumb: string[]; appearance: CustomizeState; onDocumentation: () => void }) {
  const [values, setValues] = useState(() => defaultsFor(spec));
  const [revision, setRevision] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  // Portaled Oreo menus inherit the same tokens as the preview.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.classList.contains("theme-dark");
    root.classList.toggle("theme-dark", appearance.dark);
    return () => { root.classList.toggle("theme-dark", previous); };
  }, [appearance.dark]);
  useEffect(() => { if (!copyStatus) return; const timer = setTimeout(() => setCopyStatus(""), 2400); return () => clearTimeout(timer); }, [copyStatus]);

  const demo = useDemo(spec, patch => setValues(current => ({ ...current, ...patch })));
  const set = (key: string, value: Values[string]) => {
    demo.player?.stop();
    setValues(current => updateValues(spec.controls, current, key, value));
  };
  const preview = spec.render(values, set);
  const code = playgroundCode(preview);
  const source = spec.source ?? nav.active;
  const install = `npx oreo-ui add ${source}`;
  const copy = async (text: string, kind: string) => {
    try { await navigator.clipboard.writeText(text); setCopyStatus(`${kind} copied`); }
    catch { setCopyStatus("Could not copy. Select and copy the text below."); }
  };
  const groups = [...new Set(Object.values(spec.controls).map(control => control.group ?? spec.title))];
  const reset = () => { demo.player?.stop(); setValues(defaultsFor(spec)); setRevision(revision + 1); };

  return <div className="flex min-h-screen bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
    <Sidebar nav={nav} />
    <div className="min-w-0 flex-1">
      <header className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] px-5 py-4 md:px-8">
        <div>
          <nav aria-label="Breadcrumb" className="mb-1 text-xs text-[var(--color-text-secondary)]">{breadcrumb.join(" / ")}</nav>
          <h1 className="text-xl font-semibold tracking-tight">{spec.title}</h1>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[var(--color-state-press)] p-1" aria-label="Page view">
          <span aria-current="page" className="rounded-md bg-[var(--color-bg-base)] px-3 py-1.5 text-xs font-medium shadow-sm">Playground</span>
          <button type="button" onClick={onDocumentation} className="rounded-md px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:ring-2">Documentation</button>
        </div>
        <a className="text-xs underline underline-offset-4 lg:hidden" href="/changelog">Changelog</a>
        <label className="flex w-full items-center gap-3 text-xs lg:hidden">Component
          <select aria-label="Component" value={nav.active} onChange={e => nav.onNavigate(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] p-2">{Object.entries(playgrounds).map(([slug, entry]) => <option key={slug} value={slug}>{entry.title}</option>)}</select>
        </label>
      </header>
      <div className="flex flex-col md:flex-row">
        <main className="min-w-0 flex-1" aria-label={`${spec.title} playground`}>
          <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-8">
            <div className="flex gap-1" aria-label="Preview view">
              {([false, true] as const).map(isCode => <button key={String(isCode)} type="button" aria-pressed={showCode === isCode} onClick={() => { if (isCode) demo.player?.pause(); setShowCode(isCode); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${showCode === isCode ? "bg-[var(--color-state-press)]" : "text-[var(--color-text-secondary)]"}`}>{isCode ? "Code" : "Preview"}</button>)}
            </div>
            {demo.player ? <div className="flex shrink-0 items-center gap-1">
              <Button type="tertiary" size="sm" onClick={() => { setShowCode(false); demo.player?.replay(); }}>Replay</Button>
              <Button type="secondary" size="sm" onClick={() => { setShowCode(false); if (demo.status === "playing") demo.player?.pause(); else demo.player?.play(); }}>{demo.status === "playing" ? "Pause" : demo.status === "paused" ? "Resume" : "Play demo"}</Button>
            </div> : <Button type="tertiary" size="sm" onClick={() => setRevision(revision + 1)}>Replay</Button>}
          </div>
          {demo.player && <div className="flex flex-wrap items-center justify-between gap-2 px-5 text-xs text-[var(--color-text-secondary)] md:px-8">
            <span role="status">{demo.status === "idle" ? "Automatic demo" : `${demo.label} · ${demo.status === "playing" ? "Playing" : demo.status === "paused" ? "Paused" : "Complete"}`}</span>
            <span>Edit any property to take over.</span>
          </div>}
          <div hidden={showCode}>
            <div className="flex min-h-96 items-center justify-center overflow-x-auto px-5 py-12 md:min-h-128 md:px-8" aria-label="Component preview" role="region" onPointerDownCapture={() => demo.player?.stop()} onKeyDownCapture={() => demo.player?.stop()}>
              <div key={revision} className="flex w-full min-w-0 max-w-2xl items-center justify-center [&>div]:max-w-full">{preview}</div>
            </div>
          </div>
          {showCode && <section aria-label="Generated code" className="min-h-96 space-y-3 px-5 pb-8 md:px-8">
            <div className="flex items-center justify-between gap-3"><p className="text-xs text-[var(--color-text-secondary)]">Starting JSX with your current properties.</p><Button type="secondary" size="sm" onClick={() => void copy(code, "Code")}>Copy code</Button></div>
            <CodeBlock code={code} language="tsx" copyable={false} wrap />
          </section>}
          <footer className="mx-5 space-y-3 border-t border-[var(--color-border-subtle)] py-6 md:mx-8">
            <div className="flex items-center justify-between gap-4"><h2 className="text-xs font-medium">Use this component</h2><Button type="tertiary" size="sm" onClick={() => void copy(install, "Command")}>Copy command</Button></div>
            <code className="block overflow-x-auto rounded-lg bg-[var(--color-state-press)] px-4 py-3 text-xs">{install}</code>
            <p className="text-xs text-[var(--color-text-secondary)]">Or copy <code>src/components/{source}/*</code> into your project.</p>
            <p role="status" className="min-h-4 text-xs text-[var(--color-text-secondary)]">{copyStatus}</p>
          </footer>
        </main>
        <aside aria-label="Component properties" className="w-full shrink-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] md:sticky md:top-0 md:max-h-screen md:w-72 md:overflow-y-auto md:border-t-0 md:border-l xl:w-80">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-5 py-4"><h2 className="flex items-center gap-2 text-sm font-semibold"><Icon name="sliders" size="sm" />Properties</h2><Button type="tertiary" size="sm" onClick={reset}>Reset</Button></div>
          {groups.map(group => <details key={group} open={group !== "Press spring"} className="border-b border-[var(--color-border-subtle)] px-5 py-4">
            <summary className="cursor-pointer text-xs font-semibold">{group}</summary>
            <div className="mt-5 space-y-4">{Object.entries(spec.controls).filter(([, control]) => (control.group ?? spec.title) === group).map(([key, control]) => <PropertyControl key={`${revision}-${key}`} name={key} control={resolveControl(control, values)} value={values[key]} onChange={value => set(key, value)} />)}</div>
          </details>)}
          <details className="px-5 py-4" open><summary className="cursor-pointer text-xs font-semibold">Appearance</summary><div className="mt-5 space-y-4">
            <PropertyControl name="Dark theme" control={toggle()} value={appearance.dark} onChange={value => appearance.setDark(Boolean(value))} />
            <PropertyControl name="Radius" control={number(8, 0, 999)} value={appearance.radius} onChange={value => appearance.setRadius(Number(value))} />
            <PropertyControl name="Icon library" control={select(ICON_LIBRARIES, "phosphor")} value={appearance.library} onChange={value => appearance.setLibrary(value as CustomizeState["library"])} />
          </div></details>
        </aside>
      </div>
    </div>
  </div>;
}
