import { useEffect, useRef, useState } from "react";
import { PromptBox } from "@/components/prompt-box";
import { Attachment } from "@/components/attachment";
import { Action, Status, type ExampleProps } from "./shared";
import { finishJob, type Job } from "./model";

export function PromptExample({ mode, stress }: ExampleProps) {
  const queued = mode === "capability";
  const [text, setText] = useState(stress ? "Summarize the onboarding research across mobile, desktop, accessibility and internationalization, preserving the evidence and unresolved questions. ".repeat(3) : "Summarize the onboarding research");
  const [jobs, setJobs] = useState<Job[]>([{ id: 0, text: "Outline three onboarding improvements", status: "queued", attempts: 0 }]);
  const [running, setRunning] = useState(false);
  const [attached, setAttached] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const sequence = useRef(1);
  const root = useRef<HTMLDivElement>(null);
  const focusComposer = () => root.current?.querySelector("textarea")?.focus();
  useEffect(() => {
    if (!queued || !running) return;
    const active = jobs.find(j => j.status === "running");
    if (active) {
      const timer = setTimeout(() => setJobs(items => items.map(j => j.id === active.id ? finishJob(j) : j)), 700);
      return () => clearTimeout(timer);
    }
    const next = jobs.find(j => j.status === "queued");
    if (next) setJobs(items => items.map(j => j.id === next.id ? { ...j, status: "running", attempts: j.attempts + 1 } : j));
    else setRunning(false);
  }, [jobs, running, queued]);
  const submit = (value: string) => {
    if (!value.trim()) return;
    if (!queued) { setMessage(`Local demo received: ${value.trim()}`); setText(""); return; }
    if (editing !== null) {
      setJobs(items => items.map(j => j.id === editing ? { ...j, text: value.trim(), status: "queued", attempts: 0 } : j));
      setEditing(null); setMessage("Queued prompt updated.");
    } else {
      if (jobs.length >= 5) { setMessage("Queue is full. Remove a prompt before adding another."); return; }
      setJobs(items => [...items, { id: sequence.current++, text: value.trim(), status: "queued", attempts: 0 }]);
      setMessage("Prompt added to the local queue.");
    }
    setText("");
  };
  return <div ref={root} className="remix-stack">
    {mode === "style" && <div><p className="remix-eyebrow">A little clarity, together</p><h3 className="remix-editorial">What are we working on?</h3></div>}
    {queued && <div className="remix-row"><span className="remix-eyebrow">Prompt queue · {jobs.length}/5</span><Action disabled={!jobs.some(j => j.status === "queued" || j.status === "running") || editing !== null} onClick={() => setRunning(v => !v)}>{running ? "Pause queue" : "Run queue"}</Action></div>}
    <PromptBox className="remix-composer" value={text} onValueChange={setText} onSubmit={submit}
      placeholder={queued ? "Write a prompt to queue…" : "How can I help?"}
      onAttach={() => setAttached(v => !v)} onMention={() => setText(current => `${current}${current ? " " : ""}@demo-research `)}
      attachments={attached ? <Attachment type="pdf" label="research-demo.pdf" onRemove={() => setAttached(false)} /> : undefined}
      modelSelect={<span className="remix-muted">{queued ? editing !== null ? "Save edit with ↑" : "↑ adds to queue" : "Local demo"}</span>} />
    {queued && <>
      <p className="remix-help">Enter queues a prompt; Shift+Enter adds a line. Add <code>[fail]</code> to try recovery. Nothing is sent to a model.</p>
      {editing !== null && <Action onClick={() => { setEditing(null); setText(""); }}>Cancel edit</Action>}
      <ol className="remix-queue" aria-label="Queued prompts">
        {jobs.map((job, i) => <li key={job.id} className="remix-queue-item">
          <span className="remix-number">{String(i + 1).padStart(2, "0")}</span>
          <div className="remix-grow"><p>{job.text}</p><span className="remix-muted">{job.status === "done" ? "Demo complete · fixed result: outline prepared" : job.status === "failed" ? "Simulated failure · ready to retry" : job.status === "running" && !running ? "Paused" : job.status}</span></div>
          <div className="remix-actions">
            {job.status === "failed" && <Action disabled={running} onClick={() => { setJobs(items => items.map(j => j.id === job.id ? { ...j, status: "queued" } : j)); setRunning(true); }}>Retry</Action>}
            <Action aria-label={`Edit prompt ${i + 1}`} disabled={running} onClick={() => { setEditing(job.id); setText(job.text); focusComposer(); }}>Edit</Action>
            <Action aria-label={`Remove prompt ${i + 1}`} disabled={running} onClick={() => { setJobs(items => items.filter(j => j.id !== job.id)); if (editing === job.id) { setEditing(null); setText(""); } focusComposer(); }}>Remove</Action>
          </div>
        </li>)}
      </ol>
      {!jobs.length && <div className="remix-empty"><strong>No prompts queued</strong><p>Write a prompt above and press Enter to start.</p></div>}
    </>}
    <Status>{running ? "Running local fixtures…" : message || (queued ? "Ready when you are. Each job uses a 700 ms local timer." : "Demo only · submit to see a local receipt.")}</Status>
  </div>;
}
