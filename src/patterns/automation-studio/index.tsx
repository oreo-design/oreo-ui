import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Message, MessageContent } from "@/components/message";
import { Attachment, AttachmentBar } from "@/components/attachment";
import { PromptBox } from "@/components/prompt-box";
import { StreamCardSkeleton } from "@/patterns/stream/Skeletons";
import { OreoLogo } from "@/docs/OreoLogo";
import { AgentWorkspaceNav, AgentWorkspaceShell, AgentWorkspacePanel, AgentResultCard, AgentRunSummary, AutomationViews, AutomationStepCard, AgentWorkspaceState, type AutomationStep, type AutomationView, type WorkspaceNavGroup } from "@/components/automation";

const samplePrompt = "Raise budget in steps while ROAS holds";
const groups: WorkspaceNavGroup[] = [
  { label: "Workspace", items: [{ label: "Skills", href: "/skills-workspace", icon: "sparkle" }, { label: "Activity", href: "/activity-workspace", icon: "clock-history" }] },
  { label: "Work", items: [{ label: "Projects", href: "/knowledge-base", icon: "folder" }, { label: "Automations", href: "/automation-studio", icon: "plug", active: true }, { label: "Review", href: "/review-workspace", icon: "scan-text" }] },
  { label: "Insights", items: [{ label: "Analytics", href: "/activity-workspace#usage", icon: "chart-bar" }, { label: "Prospecting", href: "/prospecting-dashboard", icon: "users" }] },
];

type RunState = "ready" | "empty" | "running" | "error";

export function AutomationStudio() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<AutomationView>("canvas");
  const [runState, setRunState] = useState<RunState>("ready");
  const [prompt, setPrompt] = useState("");
  const [request, setRequest] = useState(samplePrompt);
  const [resultOpen, setResultOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [threshold, setThreshold] = useState("3.0");
  const [increase, setIncrease] = useState("10");
  const [notice, setNotice] = useState("");
  const [duration, setDuration] = useState("1m 28s");
  const [files, setFiles] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef(new Map<string, HTMLDivElement>());
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const valid = threshold.trim() !== "" && increase.trim() !== "" && Number.isFinite(Number(threshold)) && Number.isFinite(Number(increase)) && Number(threshold) >= 1 && Number(threshold) <= 20 && Number(increase) >= 1 && Number(increase) <= 50;
  const steps: AutomationStep[] = [
    { id: "trigger", kind: "Trigger", icon: "clock-history", title: "Check every morning", description: "Daily at 9:00 AM · Workspace time" },
    { id: "condition", kind: "Condition", icon: "filter", title: "Keep performance healthy", description: `ROAS is at least ${threshold || "—"}× over the last 7 days` },
    { id: "action", kind: "Action", icon: "chart-line", title: "Increase daily budget", description: `Raise by ${increase || "—"}% · Maximum $500 per day` },
  ];
  const stop = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; setRunState("empty"); setNotice("Demo stopped. You can try again."); };
  const run = (fail = false, value = request) => {
    if (!valid || runState === "running") return;
    setRequest(value.trim() || samplePrompt); setRunState("running"); setPrompt(""); setSelected(null); setResultOpen(false); setNotice("");
    timer.current = setTimeout(() => { setRunState(fail ? "error" : "ready"); setDuration("1.8s"); setNotice(fail ? "Demo run failed. Retry is available." : "Demo workflow is ready. No account changes were made."); timer.current = null; }, 1800);
  };
  const reset = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; setRunState("empty"); setThreshold("3.0"); setIncrease("10"); setFiles([]); setRequest(samplePrompt); setPrompt(""); setSelected(null); setResultOpen(false); setNotice("New draft started."); composerRef.current?.querySelector<HTMLElement>("textarea, [contenteditable=true]")?.focus(); };
  const selectStep = (id: string) => { setSelected(id); setView("build"); };
  useEffect(() => { if (selected && view === "build") (stepRefs.current.get(selected)?.querySelector<HTMLElement>("input") ?? stepRefs.current.get(selected)?.querySelector<HTMLElement>("button"))?.focus({ preventScroll: true }); }, [selected, view]);

  const loading = <div className="space-y-5 p-6" role="status" aria-label="Building demo workflow"><StreamCardSkeleton lines={3} /><p className="text-sm text-text-secondary">Building your demo workflow…</p></div>;
  const empty = <AgentWorkspaceState title="A little help, a lot less busywork" description="Start with the budget example to explore an agent-built workflow." actionLabel="Use budget example" onAction={() => run(false, samplePrompt)} />;
  const error = <AgentWorkspaceState error title="The demo run didn’t finish" description="Your request and settings are still here. Try the same run again." actionLabel="Retry demo" onAction={() => run()} />;
  const result = <AgentResultCard title="Selected account and ad sets" icon="folder" open={resultOpen} onOpenChange={setResultOpen}><dl className="grid grid-cols-2 gap-2"><dt>Account</dt><dd>Oreo Store · Demo</dd><dt>Ad sets</dt><dd>Weekend essentials</dd><dt>Daily budget</dt><dd>$200.00</dd></dl><p className="mt-3 text-xs text-text-tertiary">Sample data. No advertising account is connected.</p></AgentResultCard>;

  const build = <div className="space-y-5"><div><h3 className="text-base font-medium">Weekend performance</h3><p className="mt-1 text-xs leading-5 text-text-secondary">Review the conditions before a dry run.</p></div>{steps.map(step => <div key={step.id} ref={node => { if (node) stepRefs.current.set(step.id, node); else stepRefs.current.delete(step.id); }} className="space-y-3"><AutomationStepCard step={step} selected={selected === step.id} onSelect={setSelected} />{step.id === "condition" && <label className="agent-build-field">Minimum ROAS<input type="number" min="1" max="20" step="0.1" value={threshold} onChange={e => setThreshold(e.target.value)} aria-describedby="automation-validation" /></label>}{step.id === "action" && <label className="agent-build-field">Budget increase (%)<input type="number" min="1" max="50" value={increase} onChange={e => setIncrease(e.target.value)} aria-describedby="automation-validation" /></label>}</div>)}<p id="automation-validation" className={valid ? "text-xs leading-5 text-text-tertiary" : "text-xs leading-5 text-status-error"} role={valid ? undefined : "alert"}>{valid ? "ROAS 1–20× · Increase 1–50% · Daily cap $500" : "Enter a ROAS between 1 and 20, and an increase between 1 and 50%."}</p><Button tapScale={1} disabled={!valid} onClick={() => run()}>Run demo</Button></div>;
  const canvas = <div className="agent-canvas-stack">{steps.map((step, index) => <div key={step.id} className="flex w-full flex-col items-center">{index > 0 && <div className="agent-canvas-connector" aria-hidden />}<AutomationStepCard step={step} selected={selected === step.id} onSelect={selectStep} /></div>)}<span className="mt-6 rounded-capsule border border-border-subtle bg-bg-base px-3 py-1 text-xs text-text-tertiary">End of workflow</span><p className="mt-5 max-w-xs text-center text-xs leading-5 text-text-tertiary">Select a step to inspect its settings.</p></div>;

  return <div className={dark ? "theme-dark" : ""}><div className="min-h-screen bg-bg-elevated text-text-primary">
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-7"><a href="/automation-components" className="flex items-center gap-3 text-xs text-text-secondary"><OreoLogo className="h-4 w-6" />Oreo UI<span className="text-text-tertiary">/</span><span>Automation Studio</span></a><div className="flex items-center gap-3"><span className="hidden text-xs text-text-tertiary sm:inline">Local demo · Resets on reload</span><IconButton type="tertiary" tapScale={1} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setDark(value => !value)} icon={<Icon name={dark ? "sun" : "moon"} />} /><Button type="tertiary" tapScale={1} size="sm" render={<a href="/automation-components" />}>Explore components ↗</Button></div></header>
    <main className="px-3 pb-3 sm:px-6 sm:pb-6"><h1 className="sr-only">Automation Studio</h1><AgentWorkspaceShell
      navigation={<AgentWorkspaceNav brand={<><span className="grid size-8 place-items-center rounded-control bg-palette-mint-bg text-palette-mint-text"><OreoLogo className="h-4 w-5" /></span>Oreo Studio</>} groups={groups} footer={<span>Made for the work in between.</span>} />}
      assistant={<AgentWorkspacePanel title="Ask AI" icon="sparkle" actions={<IconButton type="tertiary" tapScale={1} aria-label="Start new draft" title="Start new draft" onClick={reset} icon={<Icon name="plus" />} />} footer={<div ref={composerRef}><input ref={fileInput} type="file" multiple className="hidden" aria-label="Attach reference files" onChange={e => { setFiles(previous => [...new Set([...previous, ...Array.from(e.target.files ?? [], file => file.name)])]); e.target.value = ""; setNotice("Reference filenames added locally. File contents are not uploaded or processed."); }} /><PromptBox value={prompt} onValueChange={setPrompt} placeholder="Describe an adjustment…" onAttach={() => fileInput.current?.click()} onMention={() => { setPrompt(value => `${value}${value ? " " : ""}@Oreo Store `); composerRef.current?.querySelector<HTMLElement>("textarea, [contenteditable=true]")?.focus(); }} attachments={files.length ? <AttachmentBar>{files.map(file => <Attachment key={file} label={file} type="doc" size="sm" onRemove={() => setFiles(current => current.filter(name => name !== file))} />)}</AttachmentBar> : undefined} running={runState === "running"} onStop={stop} onSubmit={value => run(false, value)} submitDisabled={!valid} tapScale={1} /><p className="mt-3 text-xs leading-5 text-text-tertiary">Demo assistant uses a fixed budget recipe. Your prompt is shown as context.</p></div>}>
        <div className="space-y-8 px-5 py-7 sm:px-6"><p className="text-lg leading-7 tracking-tight">Hey, what are you working on?</p>{runState !== "empty" && <Message role="user"><MessageContent className="max-w-full bg-bg-elevated">{request}</MessageContent></Message>}{runState === "ready" && <AgentRunSummary duration={duration} result={result} steps={[
          { title: "Trigger", description: "Checks your selected ad sets every morning at 9:00 AM." },
          { title: "Filter", description: `Only continues when return on ad spend holds at ${threshold || "—"}× or above across the last 7 days.` },
          { title: "Action", description: `Increases the daily budget by ${increase || "—"}%, with a $500 cap. You stay in control.` },
        ]} />}{runState === "running" && loading}{runState === "empty" && empty}{runState === "error" && error}</div>
      </AgentWorkspacePanel>}
      workspace={<AgentWorkspacePanel title="Automations" icon="plug"><div className="flex min-h-16 items-center gap-3 border-b border-border-subtle px-5 py-3 text-sm"><span className="text-text-tertiary">Automation</span><span className="text-text-tertiary">/</span><span className="min-w-0 font-medium [overflow-wrap:anywhere]">Weekend performance</span></div>{runState === "ready" ? <AutomationViews value={view} onValueChange={setView} build={build} canvas={canvas} actions={<span className="text-xs text-text-tertiary">Draft · Not active</span>} /> : runState === "running" ? loading : runState === "error" ? <AgentWorkspaceState error title="Workflow unavailable" description="Retry the demo in Ask AI to rebuild this draft." /> : <AgentWorkspaceState title="Your workflow starts here" description="Use the example in Ask AI to build a draft you can inspect." />}</AgentWorkspacePanel>}
    /></main><footer className="flex flex-wrap items-center justify-between gap-3 px-6 pb-4 text-xs text-text-tertiary"><span role="status">{notice || "A local design demo. No AI calls, scheduling or budget changes."}</span><Button type="tertiary" size="sm" tapScale={1} disabled={runState === "running" || !valid} onClick={() => run(true)}>Simulate failed run</Button></footer>
  </div></div>;
}
