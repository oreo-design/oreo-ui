import { useState, type ComponentType } from "react";
import { MotionConfig } from "motion/react";
import { PageViews } from "@/docs/PageViews";
import { Sidebar } from "@/docs/Sidebar";
import type { DocsNav } from "@/docs/DocsPage";
import { Action, type ExampleProps } from "./shared";
import { briefs } from "./briefs";
import { remixSlugs, type RemixSlug } from "./model";
import { PromptExample } from "./PromptExample";
import { AttachmentExample } from "./AttachmentExample";
import { ConfirmationExample } from "./ConfirmationExample";
import { PlanExample } from "./PlanExample";
import { SourcesExample } from "./SourcesExample";
import "./remixes.css";

const examples: Record<RemixSlug, ComponentType<ExampleProps>> = {
  "prompt-box": PromptExample, attachment: AttachmentExample, confirmation: ConfirmationExample, plan: PlanExample, sources: SourcesExample,
};
const sourceFiles: Record<RemixSlug, string> = { "prompt-box": "PromptExample", attachment: "AttachmentExample", confirmation: "ConfirmationExample", plan: "PlanExample", sources: "SourcesExample" };

export function RemixExamples({ slug, nav, dark, setDark, onPlayground, onDocumentation }: {
  slug: RemixSlug; nav: DocsNav; dark: boolean; setDark: (dark: boolean) => void; onPlayground: () => void; onDocumentation: () => void;
}) {
  const params = new URLSearchParams(window.location.search);
  const [mode, setMode] = useState<"capability" | "style">(() => params.get("remix") === "style" ? "style" : "capability");
  const [stress, setStress] = useState(() => params.has("stress"));
  const [revision, setRevision] = useState(0);
  const brief = briefs[slug], spec = brief[mode], Example = examples[slug];
  const chooseMode = (next: typeof mode) => {
    setMode(next);
    const url = new URL(window.location.href); url.searchParams.set("remix", next); window.history.replaceState(null, "", url);
  };
  return <MotionConfig reducedMotion="user"><div className="remix-layout">
    <Sidebar nav={nav} />
    <div className="remix-main">
      <header className="remix-header">
        <div><p className="text-xs text-text-secondary">Components / {brief.title}</p><h1>{brief.title}</h1></div>
        <PageViews slug={slug} active="remixes" onPlayground={onPlayground} onDocumentation={onDocumentation} />
      </header>
      <main>
        <nav className="remix-component-nav" aria-label="Remix components"><a href="/ai-remixes">All remixes</a>{remixSlugs.map((item) => <a key={item} href={`/${item}?view=remixes&remix=${mode}${dark ? "&dark" : ""}`} aria-current={slug === item ? "page" : undefined}>{briefs[item].title}</a>)}</nav>
        <div className="remix-intro"><h2>{spec.title}</h2></div>
        <div className="remix-toolbar">
          <div className="remix-mode" aria-label="Remix category"><button aria-pressed={mode === "capability"} onClick={() => chooseMode("capability")}><span>New capability</span></button><button aria-pressed={mode === "style"} onClick={() => chooseMode("style")}><span>Claude-inspired</span></button></div>
          <div className="remix-tools"><label><input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />Dark</label><label><input type="checkbox" checked={stress} onChange={e => { setStress(e.target.checked); setRevision(v => v + 1); }} />Long content</label><Action onClick={() => setRevision(v => v + 1)}>Reset demos</Action></div>
        </div>
        <div className="remix-comparison" key={`${mode}-${revision}`}>
          <section className="remix-specimen" aria-label="Original component"><div className="remix-specimen-label"><span>Original</span><span>Oreo UI</span></div><div className="remix-stage"><Example mode="original" stress={stress} /></div><p className="remix-baseline">{brief.baseline}</p></section>
          <section className="remix-specimen remix-result" aria-label="Remixed component"><div className="remix-specimen-label"><span>{mode === "capability" ? "New capability" : "Style adaptation"}</span></div><div className={`remix-stage ${mode === "style" ? "remix-claude" : ""}`}><Example mode={mode} stress={stress} /></div><p className="remix-baseline">{mode === "capability" ? "New state and behavior, composed around the original source." : "Independent visual interpretation. Not an official Claude component or partnership."}</p></section>
        </div>
        <section className="remix-brief" aria-label="Implementation brief"><p className="remix-eyebrow">Brief</p><blockquote>{spec.request}</blockquote><div className="remix-notes"><div><h3>What changed</h3><p>{spec.changed}</p></div><div><h3>What stayed</h3><p>{spec.kept}</p></div></div></section>
        <details className="remix-reference"><summary>Reference, source & implementation notes</summary><div>
          <p>These examples were authored in this task from the briefs above. They are working local demonstrations, not an independent model benchmark or a record of autonomous production changes. No human correction or external execution is claimed.</p>
          <p>Claude reference: <a href="https://claude.com/product/overview" target="_blank" rel="noreferrer">official product overview</a> and <a href="https://www.anthropic.com/news/claude-3-5-sonnet" target="_blank" rel="noreferrer">official introduction</a>. Public pages and the overview's conversation demo were visually checked on 18 October 2026: warm neutral surfaces, serif display headings, quiet rounded cards and a terracotta send action informed this study. Exact color values, type metrics, component layouts and the dark palette are our interpretations, not official design tokens or a pixel-identical replica.</p>
          <p>The scope is a product-inspired skin, not a claim to reproduce Claude's private design tokens. The Oreo documentation chrome and original components keep their own design language.</p>
          <p>Implementation: <code>src/docs/remixes/{sourceFiles[slug]}.tsx</code>, shared styles in <code>remixes.css</code>, state rules in <code>model.ts</code>. Copy these alongside the original component to explore beyond its existing variants.</p>
        </div></details>
        <footer className="remix-footer"><span>Local demo data.</span><a href={`/${slug}?view=docs`}>Read {brief.title} API →</a></footer>
      </main>
    </div>
  </div></MotionConfig>;
}
