import { useId } from "react";
import { AgentWorkspaceState } from "@/components/automation";
import {
  latency,
  partialText,
  percentile,
  phaseAt,
  validStages,
  validTurn,
  type VoiceTurn,
  type VoiceStage,
} from "./model";
import "./voice-telemetry.css";
export * from "./model";
export function VoiceSignal({
  turn,
  position,
  onSeek,
  paused = true,
  interrupted = false,
}: {
  turn: VoiceTurn;
  position: number;
  onSeek?: (ms: number) => void;
  paused?: boolean;
  interrupted?: boolean;
}) {
  const id = useId();
  if (
    !validTurn(turn) ||
    !Number.isFinite(position) ||
    position < 0 ||
    position > turn.duration
  )
    return (
      <AgentWorkspaceState
        error
        title="Signal unavailable"
        description="Provide a valid turn, normalized samples and a position within the turn."
      />
    );
  const phase = phaseAt(turn, position, interrupted),
    progress = position / turn.duration;
  const lines = [
    {
      label: "Caller",
      samples: turn.callerSamples,
      text:
        partialText(turn.caller, position, 0, turn.callerEnd) ||
        "Ready to replay this turn.",
    },
    {
      label: "Agent",
      samples: turn.agentSamples,
      text:
        partialText(
          turn.agent,
          position,
          turn.callerEnd + latency(turn),
          turn.agentEnd,
        ) || "Waiting for the caller.",
    },
  ];
  return (
    <section className="vt-signal" aria-labelledby={id}>
      <header>
        <h2 id={id}>Turn {turn.id}</h2>
        <span role="status" className="vt-phase" data-phase={phase}>
          {paused &&
          position > 0 &&
          phase !== "complete" &&
          phase !== "interrupted"
            ? "Paused · "
            : ""}
          {phase}
        </span>
        <span className="vt-meta">
          {turn.duration / 1000} s window · sample
        </span>
      </header>
      <div className="vt-lanes">
        {lines.map((line) => (
          <div className="vt-lane" key={line.label}>
            <span>{line.label}</span>
            <div className="vt-wave" data-channel={line.label.toLowerCase()}>
              <svg
                viewBox="0 0 480 48"
                preserveAspectRatio="none"
                role="img"
                aria-label={`${line.label} sample amplitude over ${turn.duration / 1000} seconds`}
              >
                <line x1="0" x2="480" y1="24" y2="24" className="vt-baseline" />
                {line.samples.map((v, i) => (
                  <line
                    key={i}
                    x1={((i + 0.5) / line.samples.length) * 480}
                    x2={((i + 0.5) / line.samples.length) * 480}
                    y1={24 - v * 20}
                    y2={24 + v * 20}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={i / line.samples.length <= progress ? 1 : 0.25}
                  />
                ))}
              </svg>
              <div
                className="vt-playhead"
                style={{ transform: `translateX(${progress * 100}%)` }}
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>
      <div className="vt-transcript" aria-label="Sample transcript">
        {lines.map((line) => (
          <p key={line.label}>
            <span>{line.label}</span>
            <span>{line.text}</span>
          </p>
        ))}
      </div>
      {onSeek && (
        <label className="vt-seek">
          <span>Turn position</span>
          <input
            aria-label="Turn position"
            type="range"
            min="0"
            max={turn.duration}
            step="100"
            value={position}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-valuetext={`${(position / 1000).toFixed(1)} of ${(turn.duration / 1000).toFixed(1)} seconds`}
          />
          <span className="vt-time">{(position / 1000).toFixed(1)} s</span>
        </label>
      )}
    </section>
  );
}
export function VoiceLatencyBreakdown({
  stages,
  budget = 800,
  turnLabel = "Selected turn",
}: {
  stages: VoiceStage[];
  budget?: number;
  turnLabel?: string;
}) {
  const id = useId();
  if (!validStages(stages) || !Number.isFinite(budget) || budget <= 0)
    return (
      <AgentWorkspaceState
        error
        title="Latency unavailable"
        description="Provide non-negative stage timings and a positive latency budget."
      />
    );
  const total = stages.reduce((a, s) => a + s.ms, 0),
    scale = Math.max(total, budget) * 1.2,
    diff = Math.round(budget - total);
  return (
    <section className="vt-latency" aria-labelledby={id}>
      <div className="vt-latency-head">
        <h2 id={id}>
          <strong>{total.toLocaleString("en-US")}</strong> ms
        </h2>
        <span className="vt-budget-state" data-over={diff < 0}>
          {Math.abs(diff)} ms{" "}
          {diff < 0 ? "over" : diff === 0 ? "at budget" : "under"}
        </span>
      </div>
      <div className="vt-caption">
        <span>Voice to voice · {turnLabel}</span>
        <span>Budget {budget} ms</span>
      </div>
      <div
        className="vt-stack"
        role="img"
        aria-label={`${total} ms total, ${budget} ms budget. ${stages.map((s) => `${s.label} ${s.ms} ms`).join(", ")}`}
      >
        <div className="vt-stage-fill">
          {stages.map((s) => (
            <span
              key={s.id}
              data-tone={s.tone}
              style={{ width: `${(s.ms / scale) * 100}%` }}
            />
          ))}
        </div>
        <i
          className="vt-budget-marker"
          style={{ left: `${(budget / scale) * 100}%` }}
        />
      </div>
      <dl className="vt-stage-labels">
        {stages.map((s) => (
          <div key={s.id}>
            <dt>
              <i data-tone={s.tone} />
              {s.label}
            </dt>
            <dd>{s.ms} ms</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
export function TurnLatencyHistory({
  turns,
  budget = 800,
  selectedId,
  onSelect,
}: {
  turns: VoiceTurn[];
  budget?: number;
  selectedId?: number;
  onSelect?: (id: number) => void;
}) {
  const id = useId();
  if (!turns.length)
    return (
      <AgentWorkspaceState
        title="No turns yet"
        description="Completed voice turns will appear here."
      />
    );
  if (
    !turns.every(validTurn) ||
    new Set(turns.map((t) => t.id)).size !== turns.length ||
    !Number.isFinite(budget) ||
    budget <= 0
  )
    return (
      <AgentWorkspaceState
        error
        title="Turn history unavailable"
        description="Check turn IDs, signals, timings and budget."
      />
    );
  const values = turns.map(latency),
    max = Math.max(...values, budget) * 1.25;
  return (
    <section className="vt-history" aria-labelledby={id}>
      <div className="vt-history-scroll">
        <div
          className="vt-history-bars"
          style={{ minWidth: turns.length * 28 }}
        >
          <i
            className="vt-history-budget"
            style={{ bottom: `${(budget / max) * 100}%` }}
            aria-hidden
          />
          {turns.map((t) => (
            <button
              type="button"
              key={t.id}
              aria-label={`Turn ${t.id}, ${latency(t)} milliseconds, ${latency(t) > budget ? "over" : "within"} budget`}
              aria-pressed={t.id === selectedId}
              onClick={() => onSelect?.(t.id)}
              disabled={!onSelect}
              data-over={latency(t) > budget}
              style={{ height: `${Math.max(4, (latency(t) / max) * 100)}%` }}
            >
              <span className="sr-only">Turn {t.id}</span>
              {latency(t) > budget && <b aria-hidden>◆</b>}
            </button>
          ))}
        </div>
      </div>
      <footer>
        <h2 id={id}>{turns.length} sample turns</h2>
        <span>
          P50 {percentile(values, 0.5)} · P95 {percentile(values, 0.95)} ms
        </span>
      </footer>
    </section>
  );
}
