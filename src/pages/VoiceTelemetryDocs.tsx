import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PropsTable, CodeBlock } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "voice-signal": {
    name: "VoiceSignal",
    description:
      "Caller and agent amplitude lanes with explicit replay position, phase and readable transcript excerpts.",
    code: "<VoiceSignal turn={turn} position={positionMs} onSeek={setPosition}\n paused={!playing} interrupted={false} />",
    rows: [
      {
        prop: "turn",
        type: "VoiceTurn",
        desc: "Unique positive ID; duration, callerEnd, agentEnd and stage timings in milliseconds; 1–512 normalized amplitude samples per channel. The agent starts after callerEnd + stage sum.",
      },
      {
        prop: "position / onSeek",
        type: "number / optional callback",
        desc: "Controlled milliseconds within the turn. Optional native seek range. Host owns playback clock and side effects.",
      },
      {
        prop: "paused / interrupted",
        type: "boolean",
        desc: "Explicit replay status. Interrupted does not alter source timings. Reduced-motion hides the moving playhead; transcript and time remain available.",
      },
    ],
  },
  "voice-latency-breakdown": {
    name: "VoiceLatencyBreakdown",
    description:
      "A voice-to-voice latency total, stage decomposition and budget marker with exact accessible values.",
    code: '<VoiceLatencyBreakdown stages={turn.stages} budget={800}\n turnLabel="turn 12" />',
    rows: [
      {
        prop: "stages",
        type: "VoiceStage[]",
        desc: "Unique IDs, labels, non-negative integer milliseconds and semantic tones: neutral, blue, orange, purple or mint. Empty/invalid stages show the shared error state.",
      },
      {
        prop: "budget / turnLabel",
        type: "number / string",
        desc: "Positive milliseconds (800 default). Over-budget status uses the actual stage sum. Label identifies which turn is being inspected.",
      },
    ],
  },
  "turn-latency-history": {
    name: "TurnLatencyHistory",
    description:
      "Selectable latency bars with explicit outliers and nearest-rank p50/p95.",
    code: "<TurnLatencyHistory turns={turns} budget={800}\n selectedId={selected} onSelect={setSelected} />",
    rows: [
      {
        prop: "turns / budget",
        type: "VoiceTurn[] / number",
        desc: "Unique valid turns; positive budget. Empty and invalid data have distinct shared states. Percentiles cover exactly the supplied turns.",
      },
      {
        prop: "selectedId / onSelect",
        type: "number / optional callback",
        desc: "Controlled selection. Each bar names the turn, exact latency and budget state; selection is aria-pressed. Without a callback the bars are noninteractive.",
      },
    ],
  },
};
export function VoiceTelemetryDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["voice-signal"],
    title = s.name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {s.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/voice-agent"
            >
              Open Voice Agent ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name} } from "@/components/voice-telemetry";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              VoiceTurn includes id, caller, agent, duration, callerEnd,
              agentEnd, stages, callerSamples and agentSamples. VoiceStage
              includes id, label, ms and tone. The template replays synthetic
              amplitude samples silently; there is no audio recording,
              microphone access, model request or network stream. Play, pause,
              seek, interrupt, next-turn selection and reconnection use local
              state. Interrupting stops playback and preserves the source
              measurements; Replay starts the selected turn again. Hidden tabs
              pause. Export contains the complete fixture and inspection state.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/disarto_max/status/2110815271078559764"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Disarto ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
