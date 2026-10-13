import { useEffect, useRef, useState } from "react";
import { ContextWindow, type ContextFile, type ContextUsage } from "@/components/context-window";
import { Button } from "@/components/button";
import { Switch } from "@/components/switch";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";

const initialFiles: ContextFile[] = [
  { id: "schema", name: "schema.prisma", tokens: 9400 },
  { id: "billing", name: "billing.ts", tokens: 21300 },
  { id: "notes", name: "meeting-notes.md", tokens: 15400 },
];
const initialUsage: ContextUsage = { system: 4200, tools: 12800, conversation: 108600, memory: 3900 };
const code = `import { ContextWindow } from "@/components/context-window";

<ContextWindow
  model="Claude Sonnet"
  capacity={200_000}
  usage={usage}
  files={files}
  onRemoveFile={id => setFiles(files.filter(file => file.id !== id))}
  onCompact={compactConversation}
  compacting={compacting}
  compactError={error}
  onNewChat={startNewChat}
/>`;

function Demo() {
  const [files, setFiles] = useState(initialFiles);
  const [usage, setUsage] = useState(initialUsage);
  const [compacting, setCompacting] = useState(false);
  const [error, setError] = useState("");
  const [failNext, setFailNext] = useState(false);
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const reset = () => {
    clearTimeout(timer.current); setFiles(initialFiles); setUsage(initialUsage); setCompacting(false); setError(""); setNotice(""); setFailNext(false);
  };
  const compact = () => {
    if (compacting) return;
    setCompacting(true); setError(""); setNotice("");
    timer.current = setTimeout(() => {
      setCompacting(false);
      if (failNext) {
        setError("Couldn’t compact the conversation. Your context is unchanged. Try again."); setFailNext(false);
      } else {
        setUsage(previous => ({ ...previous, conversation: Math.round(previous.conversation * 0.28) }));
        setNotice("Conversation compacted. Files and instructions are preserved.");
      }
    }, 900);
  };
  return <>
    <div className="preview-grid grid min-h-128 place-items-center rounded-card-medium border border-border-subtle bg-bg-base px-3 py-8 sm:px-8" data-testid="context-window-preview">
      <ContextWindow capacity={200000} usage={usage} files={files} onRemoveFile={id => { setFiles(previous => previous.filter(file => file.id !== id)); setNotice("File removed from this demo’s context."); }}
        onCompact={compact} compacting={compacting} compactError={error} onNewChat={() => { setFiles([]); setUsage({ ...initialUsage, conversation: 0, memory: 0 }); setError(""); setNotice("New chat started. System prompt and tools are preserved."); }} />
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-text-secondary">
      <label className="flex items-center gap-2"><Switch aria-label="Fail next compaction" checked={failNext} onCheckedChange={setFailNext} disabled={compacting} />Fail next compaction</label>
      <Button type="secondary" size="sm" onClick={reset}>Reset demo</Button>
    </div>
    <p role="status" className="mt-3 min-h-5 text-xs text-text-secondary">{notice || "Local demo data. Compact and New chat simulate an application’s callbacks."}</p>
  </>;
}

export function ContextWindowDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage nav={nav} breadcrumb={["Agent", "Context Window"]} toc={[
    { id: "context-window", label: "Introduction" }, { id: "playground", label: "Playground" },
    { id: "usage", label: "Usage" }, { id: "states", label: "Empty & full" }, { id: "api", label: "API Reference" },
  ]}>
    {() => <>
      <header id="context-window" className="scroll-mt-8 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Context Window</h1>
        <p className="mt-3 max-w-prose text-sm leading-7 text-text-secondary">See what fills your context. Inspect each category, remove files, and make room for the next turn.</p>
        <p className="mt-3 text-xs text-text-tertiary">Interaction inspired by <a href="https://x.com/flohoeller/status/2109572824314876115" target="_blank" rel="noreferrer" className="underline underline-offset-4">Flo’s context window</a>. Built with Oreo’s existing tokens and components.</p>
      </header>
      <Section id="playground" title="A little room to think" description="Hover or focus a category to inspect it. Open Files to remove an item; compact the conversation to recover space."><Demo /></Section>
      <Section id="usage" title="Usage" description="Copy src/components/context-window and its Oreo dependencies. Your application owns the data and actions.">
        <CodeBlock code={code} />
        <p className="mt-4 text-sm leading-6 text-text-secondary">File totals are derived from the files array. Send real token counts from your model provider; this component doesn’t estimate tokens or call a model. Update usage only after compaction succeeds.</p>
      </Section>
      <Section id="states" title="Empty & full" description="Counts stay exact; the 216-cell chart is an approximate visual summary. Over-capacity usage remains visible.">
        <div className="grid gap-6 xl:grid-cols-2">
          <ContextWindow capacity={200000} model="Empty context" usage={{ system: 0, tools: 0, conversation: 0, memory: 0 }} defaultFilesOpen />
          <ContextWindow capacity={200000} model="Over capacity" usage={{ system: 4200, tools: 12800, conversation: 200000, memory: 3900 }} />
        </div>
      </Section>
      <Section id="api" title="API Reference" description="ContextWindow also accepts native section attributes and className.">
        <div className="overflow-x-auto"><PropsTable rows={[
          { prop: "capacity", type: "number", desc: "Maximum tokens. Zero or an invalid value displays capacity unavailable." },
          { prop: "usage", type: "ContextUsage", desc: "System, tools, conversation and memory token counts. Negative or non-finite inputs normalize to zero." },
          { prop: "files", type: "ContextFile[]", def: "[]", desc: "Unique id, name and token count for each file. Their sum supplies the Files total." },
          { prop: "model", type: "string", def: "Claude Sonnet", desc: "Model name shown in Oreo’s Keyword Tag." },
          { prop: "onRemoveFile", type: "(id: string) => void", desc: "Shows a removal action. The parent updates files." },
          { prop: "onCompact / onNewChat", type: "() => void", desc: "Optional actions. Omit callbacks for a read-only card." },
          { prop: "compacting", type: "boolean", def: "false", desc: "Shows activity and disables mutations until completion." },
          { prop: "compactError", type: "string", desc: "Announced error message; Compact becomes Retry." },
          { prop: "defaultFilesOpen", type: "boolean", def: "false", desc: "Initial disclosure state." },
        ]} /></div>
      </Section>
    </>}
  </DocsPage>;
}
