import type { ReactNode } from "react";
import { Avatar, type AvatarColor } from "@/components/avatar";
import { Plan, PlanStep } from "@/components/plan";
import type { StreamItem, StreamTier, StreamTopic } from "./types";

/**
 * Demo seed — an invented team, no product branding. Everything in here is
 * *host content*: the framework never reads it, it just flows through the
 * `content` slot. The little excerpt rows below stand in for whatever a real
 * host would graft into the shell (their own digest, a chart, a form).
 */

export const TOPIC_LABELS: Record<StreamTopic, string> = {
  mentions: "Mentions",
  threads: "Threads",
  updates: "Updates",
};

/** A stand-in conversation row: tiny avatar, name, time, one line of text. */
function Excerpt({
  name,
  color,
  time,
  children,
}: {
  name: string;
  color: AvatarColor;
  time: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 gap-2">
      <Avatar name={name} color={color} size="xs" className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <span className="text-[13px] font-medium leading-5">{name}</span>
        <span className="ml-2 font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)]">
          {time}
        </span>
        <p className="text-[13px] leading-5 text-[var(--color-text-secondary)]">{children}</p>
      </div>
    </div>
  );
}

function ExcerptList({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 flex-col gap-3">{children}</div>;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const SEED: StreamItem[] = [
  {
    id: "seed-launch-week",
    tier: "attention",
    topic: "mentions",
    source: { icon: "hash", title: "launch-week", meta: "Maya, Jonah and 3 others" },
    content: (
      <ExcerptList>
        <Excerpt name="Maya" color="mint" time="5m">
          @you can we ship the beta on Friday? The waitlist crossed 2k overnight.
        </Excerpt>
        <Excerpt name="Jonah" color="blue" time="2m">
          Blocking bug in the export flow is fixed — needs one more review pass.
        </Excerpt>
      </ExcerptList>
    ),
  },
  {
    id: "seed-design-crit",
    tier: "attention",
    topic: "threads",
    // Tuned low so the demo trips the clamp on any viewport; a real host
    // would usually pass `true` and take the defaults.
    clamp: { minPx: 280, vhRatio: 0.35 },
    source: { icon: "hash", title: "design-crit", meta: "Priya, Sam and 6 others" },
    content: (
      <ExcerptList>
        <Excerpt name="Priya" color="purple" time="1h">
          Posted three directions for the empty state — the illustrated one tests best.
        </Excerpt>
        <Excerpt name="Sam" color="orange" time="58m">
          Agreed, but the illustration fights the density of the cards around it.
        </Excerpt>
        <Excerpt name="Priya" color="purple" time="55m">
          We could keep the drawing but mute it to a single tone. I'll try that tomorrow.
        </Excerpt>
        <Excerpt name="Noor" color="pink" time="49m">
          The copy also runs long. Two lines max — people skim empty states.
        </Excerpt>
        <Excerpt name="Sam" color="orange" time="45m">
          On the cards themselves: the hover ring reads heavier in dark mode.
        </Excerpt>
        <Excerpt name="Priya" color="purple" time="41m">
          That's the border token — it flips to 12% white. I'll propose an 8% step.
        </Excerpt>
        <Excerpt name="Noor" color="pink" time="36m">
          Filed the token change. Also, timestamps: mono or not? We're inconsistent.
        </Excerpt>
        <Excerpt name="Sam" color="orange" time="30m">
          Mono. It stops the jitter when relative times tick over.
        </Excerpt>
        <Excerpt name="Priya" color="purple" time="24m">
          Locking that in. Last thing — the expand affordance needs a floating surface.
        </Excerpt>
        <Excerpt name="Noor" color="pink" time="19m">
          Yes, it sits on clipped text, so it can't be transparent. Solid + shadow.
        </Excerpt>
        <Excerpt name="Sam" color="orange" time="12m">
          Shipping the crit notes tonight. Thanks all — good round.
        </Excerpt>
      </ExcerptList>
    ),
  },
  {
    id: "seed-support",
    tier: "rest",
    topic: "threads",
    source: { icon: "hash", title: "support", meta: "Ana and 2 others" },
    content: (
      <ExcerptList>
        <Excerpt name="Ana" color="brown" time="3h">
          Two reports of the same import error — both on workspaces created this week.
        </Excerpt>
      </ExcerptList>
    ),
  },
  {
    id: "seed-release",
    tier: "rest",
    topic: "updates",
    source: { icon: "sparkle", title: "Release bot", meta: "automated" },
    content: (
      // A grafted host component: an existing Oreo component drops into the
      // shell untouched — the card adds only the surface and the accessory.
      <Plan title="Ship v2.1">
        <PlanStep status="done">Cut the release branch</PlanStep>
        <PlanStep status="done">Run the migration dry-run</PlanStep>
        <PlanStep status="active">Canary at 5% of workspaces</PlanStep>
        <PlanStep status="pending">Promote to all regions</PlanStep>
      </Plan>
    ),
  },
  {
    id: "seed-random",
    tier: "rest",
    topic: "updates",
    source: { icon: "hash", title: "random", meta: "Jonah" },
    content: (
      <ExcerptList>
        <Excerpt name="Jonah" color="blue" time="4h">
          The office plant has a name now. It's Fern. It was always going to be Fern.
        </Excerpt>
      </ExcerptList>
    ),
  },
];

/** Rotating pool for the "New card" demo action. */
const INJECT_POOL: Array<Omit<StreamItem, "id" | "tier">> = [
  {
    topic: "mentions",
    source: { icon: "hash", title: "incidents", meta: "Ops team" },
    content: (
      <ExcerptList>
        <Excerpt name="Ana" color="brown" time="now">
          @you the p95 alert cleared, but I'd like a second pair of eyes on the graph.
        </Excerpt>
      </ExcerptList>
    ),
  },
  {
    topic: "threads",
    source: { icon: "hash", title: "hiring", meta: "Maya and 1 other" },
    content: (
      <ExcerptList>
        <Excerpt name="Maya" color="mint" time="now">
          The take-home reviews are in — thread has the summary, verdicts due Friday.
        </Excerpt>
      </ExcerptList>
    ),
  },
  {
    topic: "updates",
    source: { icon: "sparkle", title: "Release bot", meta: "automated" },
    content: (
      <ExcerptList>
        <Excerpt name="Bot" color="black" time="now">
          Nightly build is green again. Flaky test quarantined: exporter/streams.
        </Excerpt>
      </ExcerptList>
    ),
  },
];

let injectCursor = 0;

/** Builds a fresh card from the pool — each call rotates the content. */
export function makeCard(tier: StreamTier = "attention"): StreamItem {
  const base = INJECT_POOL[injectCursor % INJECT_POOL.length];
  injectCursor += 1;
  return { ...base, id: `inject-${uid()}`, tier };
}
