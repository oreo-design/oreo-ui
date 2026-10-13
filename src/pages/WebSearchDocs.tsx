import { searchSources, searchAnswer } from "@/docs/playground/web-search.demo";
import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { WebSearch, WebSearchResult, WebSearchAnswer } from "@/components/web-search";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "web-search", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "cards", label: "Source cards & citations" },
  { id: "streaming", label: "Streaming list" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "sources", type: "WebSource[]", desc: "Selects card mode. Stable id, title and url; optional name, snippet, favicon, icon and Oreo palette color." },
  { prop: "open / expanded", type: "boolean", desc: "Controlled disclosure and full-grid state; pair with onOpenChange / onExpandedChange. Uncontrolled defaults are also supported." },
  { prop: "progress", type: "number (0–1)", desc: "Optional search progress. Otherwise the ring indicates activity based on result arrivals." },
  { prop: "error / onRetry", type: "string / () => void", desc: "Keeps received sources visible and presents an optional retry action." },
  { prop: "WebSearchCitation", type: "{ source, index? }", desc: "Inline link with hover/focus preview, Escape dismissal and viewport collision handling." },
  { prop: "WebSearchAnswer", type: "{ parts, play?, speed?, replayKey?, onComplete? }", desc: "Types text and inserts citations atomically. Pause with play; reset with replayKey. Reduced motion reveals the answer immediately." },
  { prop: "WebSearchSourceCard / WebSearchSourceStack", type: "source / sources", desc: "Reusable token-driven source card and animated favicon stack." },
  { prop: "query", type: "string", desc: "The search, shown as a pill." },
  { prop: "searching", type: "boolean", def: "false", desc: "Shimmers the status while results stream." },
  { prop: "summary", type: "ReactNode", desc: "Resting status — \"Read 3 sources\"." },
  { prop: "WebSearchResult", type: "{ domain, title, …<a> }", desc: "One result row — favicon letter, title, mono domain. Renders an anchor." },
];

const RESULTS = [
  { domain: "react.dev", title: "useSyncExternalStore – React Reference" },
  { domain: "web.dev", title: "Optimize long tasks: how to schedule work" },
  { domain: "github.com", title: "reactwg/react-18: useSES discussion" },
] as const;

const CODE = `import { WebSearch, WebSearchResult } from "@/components/web-search";

<WebSearch query="react external store subscription" searching={searching} summary="Read 3 sources">
  {results.map((r) => (
    <WebSearchResult key={r.domain} domain={r.domain} title={r.title} href={r.href} />
  ))}
</WebSearch>`;

function Demo() {
  const [visible, setVisible] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearInterval(timer.current);
    setVisible(0);
    timer.current = window.setInterval(() => {
      setVisible((v) => {
        if (v >= RESULTS.length) {
          window.clearInterval(timer.current);
          return v;
        }
        return v + 1;
      });
    }, 900);
  };

  useEffect(() => {
    play();
    return () => window.clearInterval(timer.current);
  }, []);

  const searching = visible < RESULTS.length;
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <WebSearch
        query="react external store subscription"
        searching={searching}
        summary={`Read ${RESULTS.length} sources`}
      >
        {RESULTS.slice(0, visible).map((r) => (
          <WebSearchResult key={r.domain} domain={r.domain} title={r.title} href={`https://${r.domain}`} />
        ))}
      </WebSearch>
      <Button type="secondary" size="sm" onClick={play} disabled={searching}>
        Replay
      </Button>
    </div>
  );
}

export function WebSearchDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Web Search"]} nav={nav}>
      {() => (
        <>
          <header id="web-search" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Web Search</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Search progress, streaming source cards, expandable results and inline citations. All motion lives in the components; the original list API remains available.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add web-search\n# or copy src/components/web-search/* by hand`} />
          </Section>

          <Section id="cards" title="Source cards & citations" description="Replay the search, expand the sources, hover the icon stack, then hover or focus an inline citation.">
            <PreviewTabs code={`import { WebSearch, WebSearchAnswer } from "@/components/web-search";

<WebSearch query="spring animations react" sources={sources} searching={searching} />
<WebSearchAnswer parts={[{ text: "Use springs for interruptible motion.", source: sources[0], index: 1 }]} play={!searching} />`} preview={<CardDemo />} />
            <p className="mt-3 text-xs text-text-secondary">Interaction reference: <a className="underline" href="https://x.com/SwamiMalode/status/2109236238683398540?s=20" target="_blank" rel="noreferrer">Swami’s Web Search study</a>. Built with Oreo tokens, ActivityLabel, icons, Motion and Base UI Preview Card.</p>
          </Section>

          <Section id="streaming" title="Streaming" description="Rows land one by one; the status swaps from Searching to the summary.">
            <PreviewTabs code={CODE} preview={<Demo />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>

          <footer className="border-t border-[var(--color-border-subtle)] py-8 text-[12px] text-[var(--color-text-secondary)]">
            Oreo UI — Base UI · tailwind-variants · Motion. Built as a design-system reference.
          </footer>
        </>
      )}
    </DocsPage>
  );
}

function CardDemo() {
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(0);
  const [searching, setSearching] = useState(true);
  useEffect(() => {
    setCount(0); setSearching(true);
    const timers = searchSources.map((_, index) => window.setTimeout(() => setCount(index + 1), 550 * (index + 1)));
    timers.push(window.setTimeout(() => setSearching(false), 4000));
    return () => timers.forEach(window.clearTimeout);
  }, [run]);
  return <div className="w-full max-w-xl space-y-6">
    <WebSearch key={run} query="spring animations react" sources={searchSources.slice(0, count)} searching={searching} />
    <WebSearchAnswer parts={searchAnswer} play={!searching} replayKey={run} />
    <Button type="secondary" size="sm" onClick={() => setRun(value => value + 1)}>Replay search</Button>
  </div>;
}
