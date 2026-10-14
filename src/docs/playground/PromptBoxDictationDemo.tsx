import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { PromptBoxDictation, PromptBoxModelSelect, type PromptBoxAction, type PromptBoxDraft, type PromptBoxDictationStatus } from "@/components/prompt-box";

const SAMPLE: PromptBoxAction[] = [
  { id: "shortcut", label: "Palette shortcut", text: "Add a keyboard shortcut to cycle through the color palettes." },
  { id: "remember", label: "Remember palette", text: "Remember the last selected palette between sessions." },
  { id: "motion", label: "Smooth transition", text: "Animate the transition when switching palettes." },
];
const SPEECH = [
  "Add a shortcut to cycle through the palettes…",
  "And it should remember which one I picked last, so it's still there next time…",
  "Oh, and maybe make it fade smoothly when I switch palettes.",
];

/** Deterministic provider fixture. No microphone permission or network requests. */
export function PromptBoxDictationDemo() {
  const [draft, setDraft] = useState<PromptBoxDraft>({ text: "", actions: [] });
  const [status, setStatus] = useState<PromptBoxDictationStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [session, setSession] = useState(0);
  const removed = useRef(new Set<string>());
  const start = () => { setSubmitted(""); setTranscript(""); setSession(value => value + 1); setStatus("listening"); };
  useEffect(() => {
    if (status !== "listening") return;
    let index = 0;
    const timer = window.setInterval(() => {
      const action = SAMPLE[index];
      setTranscript(SPEECH[index]);
      setDraft(current => removed.current.has(action.id) || current.actions.some(item => item.id === action.id) ? current : { ...current, actions: [...current.actions, action] });
      index += 1;
      if (index === SAMPLE.length) { window.clearInterval(timer); setStatus("processing"); }
    }, 1800);
    return () => window.clearInterval(timer);
  }, [status, session]);
  useEffect(() => {
    if (status !== "processing") return;
    const timer = window.setTimeout(() => { setStatus("ready"); setTranscript(""); }, 1200);
    return () => window.clearTimeout(timer);
  }, [status]);
  const updateDraft = (next: PromptBoxDraft) => {
    for (const action of draft.actions) if (!next.actions.some(item => item.id === action.id)) removed.current.add(action.id);
    setDraft(next);
  };
  const reset = () => {
    setStatus("idle"); setDraft({ text: "", actions: [] }); setTranscript(""); setSubmitted(""); removed.current.clear();
  };
  return <div className="flex w-full min-w-0 flex-col gap-6" data-testid="dictation-demo">
    <p className="text-xs leading-5 text-[var(--color-text-secondary)]">Sample dictation · a simulated transcript, no microphone required. Review the actions before sending.</p>
    <PromptBoxDictation draft={draft} onDraftChange={updateDraft} status={status} transcript={transcript}
      placeholder="Type a prompt, or try sample dictation…"
      modelSelect={<PromptBoxModelSelect label="Auto" />}
      onStart={start} onFinish={() => setStatus("processing")}
      onCancel={() => { setStatus("idle"); setTranscript(""); }} onRetry={start}
      error="The sample connection was interrupted. Your actions and text are saved."
      onSubmit={({ prompt }) => { setSubmitted(prompt); setStatus("idle"); setDraft({ text: "", actions: [] }); removed.current.clear(); }}
    />
    <div className="flex flex-wrap gap-2">
      <Button type="secondary" size="sm" onClick={start} disabled={status === "listening" || status === "processing"}>Start sample dictation</Button>
      {(status === "listening" || status === "processing") && <Button type="tertiary" size="sm" onClick={() => setStatus("error")}>Simulate interruption</Button>}
      <Button type="tertiary" size="sm" onClick={reset}>Reset sample</Button>
    </div>
    {submitted && <div role="status" className="rounded-[var(--radius-control)] border border-[var(--color-border-subtle)] p-4 text-sm">
      <p className="mb-2 font-medium">Submitted prompt · local preview</p><p className="whitespace-pre-wrap break-words">{submitted}</p>
    </div>}
  </div>;
}
