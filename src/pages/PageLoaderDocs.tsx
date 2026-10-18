import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { PageLoader, type LoaderStory, type LoaderTier } from "@/components/page-loader";

const TOC: TocItem[] = [
  { id: "page-loader", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "tiers", label: "The three tiers" },
  { id: "snake", label: "Snake" },
  { id: "breakout", label: "Breakout" },
  { id: "runner", label: "Runner" },
  { id: "fishing", label: "Fishing" },
  { id: "orbit", label: "Orbit" },
  { id: "kitchen", label: "Kitchen" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  {
    prop: "story",
    type: '"snake" | "breakout" | "runner" | "fishing" | "orbit" | "kitchen"',
    desc: "Which storyline to tell. Pick one per product and stay with it — the point is that every wait, of any length, speaks the same symbol.",
  },
  {
    prop: "tier",
    type: '"short" | "medium" | "long"',
    desc: "Explicit size: glyph loop, ambient scene, or playable minigame. Wins over estimateMs.",
  },
  {
    prop: "estimateMs",
    type: "number",
    desc: "Estimated wait in milliseconds; mapped to a tier via tierForEstimate (<5s short, <30s medium, 30s+ long).",
  },
  { prop: "label", type: "string", desc: "Optional caption under the stage, e.g. “Indexing your workspace…”." },
  { prop: "className", type: "string", desc: "Extra classes on the wrapper." },
];

const TIER_CAPTIONS: Record<LoaderTier, string> = {
  short: "short · under 5s",
  medium: "medium · 5–30s",
  long: "long · 30s+ — playable",
};

function TierCell({ story, tier }: { story: LoaderStory; tier: LoaderTier }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid min-h-[96px] place-items-center">
        <PageLoader story={story} tier={tier} />
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
        {TIER_CAPTIONS[tier]}
      </div>
    </div>
  );
}

function StoryRow({ story }: { story: LoaderStory }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-center gap-x-10 gap-y-8">
      <TierCell story={story} tier="short" />
      <TierCell story={story} tier="medium" />
      <TierCell story={story} tier="long" />
    </div>
  );
}

const codeFor = (story: LoaderStory) => `import { PageLoader } from "@/components/page-loader";

<PageLoader story="${story}" tier="short" />
<PageLoader story="${story}" tier="medium" />
<PageLoader story="${story}" tier="long" />

// or let the estimate pick the tier:
<PageLoader story="${story}" estimateMs={45_000} label="Setting things up…" />`;

const CODE_TIERS = `import { PageLoader, tierForEstimate } from "@/components/page-loader";

// <5s → "short" · 5–30s → "medium" · 30s+ → "long"
tierForEstimate(2_000);  // "short"
tierForEstimate(12_000); // "medium"
tierForEstimate(60_000); // "long"

<PageLoader story="snake" estimateMs={estimate} label="Loading…" />`;

export function PageLoaderDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Shell", "Page Loader"]} nav={nav}>
      {() => (
        <>
          <header id="page-loader" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Page Loader</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Story-driven loading, sized to the wait. One storyline plays at three scales: a quick
              wait shows the story&apos;s smallest symbol on a loop, a medium wait gets a small
              ambient scene, and a long wait unlocks the full playable minigame — because if you
              must hold someone for half a minute, give them something to do. Every tier of a story
              shares the same symbols, so the loader stays recognizable whether it&apos;s on screen
              for two seconds or two minutes.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Self-contained: component + stories + a local stylesheet. No dependencies beyond the Oreo tokens.">
            <Snippet lang="bash" code={`npx oreo-ui add page-loader\n# or copy src/components/page-loader/* by hand`} />
          </Section>

          <Section
            id="tiers"
            title="The three tiers"
            description="Pick the tier yourself, or pass your estimate and let the component decide. The ambient tiers are pure CSS animation, so they keep running smoothly while the main thread does the actual loading; the playable tier is a canvas game and only starts moving once the user reaches for it. Under prefers-reduced-motion the loops go still and the stage breathes its opacity instead."
          >
            <Snippet lang="tsx" code={CODE_TIERS} />
          </Section>

          <Section
            id="snake"
            title="Snake"
            description="The reference story. The short tier is the food pixel, blinking. The medium tier is a snake lapping its block, food waiting in the middle. The long tier is the real thing — arrows to steer, wrap-around walls, food to grow, and it speeds up as you eat."
          >
            <PreviewTabs code={codeFor("snake")} preview={<StoryRow story="snake" />} />
          </Section>

          <Section
            id="breakout"
            title="Breakout"
            description="Loading as clearing blocks — the bricks read as work being chipped away. Short: a ball bouncing with a proper squash. Medium: the ball pinging around its box, paddle tracking underneath. Long: playable breakout; clear the wall and it refills a little faster."
          >
            <PreviewTabs code={codeFor("breakout")} preview={<StoryRow story="breakout" />} />
          </Section>

          <Section
            id="runner"
            title="Runner"
            description="Loading as distance covered — someone is on their way with your content. Short: footprints, one after the other. Medium: the runner mid-stride on a scrolling ground. Long: an endless runner — space to jump, and the meters double as a score."
          >
            <PreviewTabs code={codeFor("runner")} preview={<StoryRow story="runner" />} />
          </Section>

          <Section
            id="fishing"
            title="Fishing"
            description="Waiting, made literal — the request is a line in the water. Short: a fish wiggling along. Medium: the bobber riding the water between ripples. Long: a timing game — cast, watch the shadow close in, and hook the moment the ! appears. Pull early and you spook it."
          >
            <PreviewTabs code={codeFor("fishing")} preview={<StoryRow story="fishing" />} />
          </Section>

          <Section
            id="orbit"
            title="Orbit"
            description="Loading as travel — you're in transit to the content. Short: a star twinkling. Medium: a ship circling its planet. Long: fly the ship with ↑ ↓ — collect stars, dodge asteroids, and a collision costs you the run."
          >
            <PreviewTabs code={codeFor("orbit")} preview={<StoryRow story="orbit" />} />
          </Section>

          <Section
            id="kitchen"
            title="Kitchen"
            description="Loading as cooking — your page is being prepared. Short: steam rising. Medium: the pot simmering, lid rattling. Long: catch the falling ingredients in the bowl; the last few catches ride along in it."
          >
            <PreviewTabs code={codeFor("kitchen")} preview={<StoryRow story="kitchen" />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
