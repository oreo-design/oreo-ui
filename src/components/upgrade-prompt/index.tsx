import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";

export function UpgradePrompt({ prompt, title = "Bring the updates into your project" }: { prompt: string; title?: string }) {
  const id = useId();
  const details = useRef<HTMLDetailsElement>(null);
  const generation = useRef(0);
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  useEffect(() => { generation.current++; setStatus("idle"); }, [prompt]);
  async function copy() {
    const current = ++generation.current;
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(prompt);
      if (current === generation.current) setStatus("copied");
    } catch {
      if (current !== generation.current) return;
      setStatus("error");
      if (details.current) details.current.open = true;
    }
  }
  return <section aria-labelledby={id} className="rounded-card-small border border-border-subtle bg-bg-base p-5">
    <h2 id={id} className="text-sm font-semibold">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-text-secondary">Copy the context for your coding agent. Review the changes together before applying them.</p>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Button type="secondary" tapScale={1} disabled={status === "copying"} onClick={copy} leadingIcon={<Icon name="copy" size="sm" />}>{status === "copying" ? "Copying…" : "Copy upgrade prompt"}</Button>
      <span role="status" className="text-xs text-text-secondary">{status === "copied" ? "Copied" : status === "error" ? "Could not copy. Select and copy the prompt below." : ""}</span>
    </div>
    <details ref={details} className="mt-4 text-xs">
      <summary className="w-fit cursor-pointer text-text-secondary">Read the prompt</summary>
      <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words rounded-control bg-bg-elevated p-4 font-mono leading-6" tabIndex={0}>{prompt}</pre>
    </details>
  </section>;
}
