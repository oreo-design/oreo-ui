import { SourceReference } from "@/docs/SourceReference";
import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { StreamingText, type StreamingTextVariant } from "@/components/streaming-text";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "streaming-text", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "plain", label: "Plain" },
  { id: "fade", label: "Fade" },
  { id: "gradient", label: "Gradient tail" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "children", type: "string", desc: "The streamed text so far — re-render with the growing string." },
  {
    prop: "variant",
    type: '"plain" | "fade" | "gradient"',
    desc: 'Token entrance: none, an opacity ease-in ("fade", default), or a sliding gradient mask that gives the stream a fading tail.',
  },
];

const SAMPLE =
  "Streaming answers read differently from pasted ones. Tokens arrive a few at a time, " +
  "so the interface has to decide how each one enters: snap in instantly, ease in, or " +
  "surface through a gradient that trails the newest words. The component diffs the " +
  "growing string you pass it, animates only what was appended, and folds finished " +
  "tokens back into plain text so a long response never accumulates animated nodes.";

const CODE_PLAIN = `import { StreamingText } from "@/components/streaming-text";

// re-render with the growing string as tokens arrive
<StreamingText variant="plain">{textSoFar}</StreamingText>`;

const CODE_FADE = `// default — each appended token eases in
<StreamingText>{textSoFar}</StreamingText>`;

const CODE_GRADIENT = `// newest tokens surface through a sliding gradient mask
<StreamingText variant="gradient">{textSoFar}</StreamingText>`;

/** Feeds SAMPLE out in small word chunks, like tokens landing from an API. */
function useFakeStream() {
  const words = useRef(SAMPLE.split(" "));
  const [count, setCount] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const done = count >= words.current.length;

  const play = () => {
    window.clearInterval(timer.current);
    setCount(0);
    timer.current = window.setInterval(() => {
      // The updater stays pure — React may re-run it (StrictMode, interrupted
      // renders), so the interval is stopped from the effect below instead.
      const step = 1 + Math.floor(Math.random() * 2);
      setCount((c) => Math.min(c + step, words.current.length));
    }, 70);
  };

  useEffect(() => {
    if (done) window.clearInterval(timer.current);
  }, [done]);

  useEffect(() => {
    play();
    return () => window.clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { text: words.current.slice(0, count).join(" "), done, play };
}

function StreamDemo({ variant }: { variant: StreamingTextVariant }) {
  const { text, done, play } = useFakeStream();
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-4">
      <div className="min-h-[120px] w-full text-[14px] leading-[1.7] text-[var(--color-text-primary)]">
        <StreamingText variant={variant}>{text}</StreamingText>
      </div>
      <Button type="secondary" size="sm" onClick={play} disabled={!done}>
        Replay
      </Button>
    </div>
  );
}

export function StreamingTextDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Streaming Text"]} nav={nav}>
      {() => (
        <>
          <header id="streaming-text" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Streaming Text</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Plain text arriving token by token. Pass the growing string on every render — the
              component diffs out what was appended, animates just those tokens in, and folds them
              back into inert text once the entrance settles. For markdown streams, reach for
              Response instead; this is for captions, titles, summaries and other unformatted
              streams.
            </p>
          </header>

          <Section id="installation" title="Source" description="No dependencies beyond the Oreo tokens.">
            <SourceReference source="streaming-text" />
          </Section>

          <Section
            id="plain"
            title="Plain"
            description="The most ordinary streaming: appended text snaps in with no animation. The right choice when tokens land fast enough that any entrance would strobe."
          >
            <PreviewTabs code={CODE_PLAIN} preview={<StreamDemo variant="plain" />} />
          </Section>

          <Section
            id="fade"
            title="Fade"
            description="The default. Each appended token eases in over 250ms, so the stream reads as a steady pour instead of a hard teletype."
          >
            <PreviewTabs code={CODE_FADE} preview={<StreamDemo variant="fade" />} />
          </Section>

          <Section
            id="gradient"
            title="Gradient tail"
            description="The shimmer gradient, repurposed: every token surfaces through a sliding gradient mask, and because the sweep outlasts the token cadence, the newest words overlap into one soft fading edge that chases the stream."
          >
            <PreviewTabs code={CODE_GRADIENT} preview={<StreamDemo variant="gradient" />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
