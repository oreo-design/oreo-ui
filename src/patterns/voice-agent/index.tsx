import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { ActivityWorkspaceShell } from "@/components/activity";
import { AgentWorkspaceState } from "@/components/automation";
import { RowLabel, RowShell } from "@/patterns/settings/row-primitives";
import {
  VoiceSignal,
  VoiceLatencyBreakdown,
  TurnLatencyHistory,
  advance,
  latency,
  phaseAt,
  percentile,
} from "@/components/voice-telemetry";
import { VOICE_TURNS } from "./data";
import "./voice-agent.css";
export function VoiceAgentPage() {
  const [dark, setDark] = useState(true),
    [selected, setSelected] = useState(12),
    [position, setPosition] = useState(3800),
    [playing, setPlaying] = useState(false),
    [interrupted, setInterrupted] = useState(false),
    [budget, setBudget] = useState(800),
    [speed, setSpeed] = useState(1),
    [connected, setConnected] = useState(true),
    [closed, setClosed] = useState(false),
    [message, setMessage] = useState("");
  const settings = useRef<HTMLSelectElement>(null),
    turn = VOICE_TURNS.find((t) => t.id === selected)!,
    phase = phaseAt(turn, position, interrupted);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now(),
        delta = (now - last) * speed;
      last = now;
      setPosition((p) => advance(p, delta, turn.duration));
    }, 80);
    const hide = () => {
      if (document.hidden) {
        setPlaying(false);
        setMessage("Playback paused while the tab was hidden.");
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [playing, speed, turn.duration]);
  useEffect(() => {
    if (position >= turn.duration && playing) {
      setPlaying(false);
      setMessage(`Turn ${turn.id} complete. Replay or select another turn.`);
    }
  }, [position, turn.duration, turn.id, playing]);
  function choose(id: number) {
    setPlaying(false);
    setInterrupted(false);
    setSelected(id);
    setPosition(VOICE_TURNS.find((t) => t.id === id)!.duration);
    setMessage(`Inspecting turn ${id}.`);
  }
  function play() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (interrupted || position >= turn.duration) {
      setPosition(0);
      setInterrupted(false);
    }
    setPlaying(true);
    setMessage("Silent sample playback. No microphone is in use.");
  }
  function reset() {
    setPlaying(false);
    setSelected(12);
    setPosition(3800);
    setInterrupted(false);
    setBudget(800);
    setSpeed(1);
    setConnected(true);
    setClosed(false);
    setMessage("Sample session reset.");
  }
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            kind: "silent-local-fixture",
            budgetMs: budget,
            selectedTurn: selected,
            positionMs: Math.round(position),
            interrupted,
            turns: VOICE_TURNS,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-session.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Sample session exported.");
  }
  return (
    <div className={`va-page ${dark ? "theme-dark" : ""}`}>
      <ActivityWorkspaceShell
        header={
          <>
            <a className="va-brand" href="/voice-signal">
              <Icon name="mic" />
              Oreo <span>/ Voice agent</span>
            </a>
            <div className="va-actions">
              <Button
                type="tertiary"
                tapScale={1}
                onClick={() => setDark(!dark)}
              >
                {dark ? "Light theme" : "Dark theme"}
              </Button>
              <Button type="secondary" tapScale={1} onClick={download}>
                Export session
              </Button>
            </div>
          </>
        }
        navigation={
          <nav aria-label="Agent workspaces" className="va-nav">
            <a href="/voice-agent" aria-current="page">
              Voice session
            </a>
            <a href="/agent-observatory">Observatory</a>
            <a href="/agent-inbox">Agent inbox</a>
            <a href="/trace-explorer">Trace explorer</a>
          </nav>
        }
      >
        <div className="va-title">
          <div>
            <p className="va-eyebrow">VOICE OPERATIONS / SAMPLE SESSION</p>
            <h1>Every turn, in focus.</h1>
            <p>Follow the conversation. Find where the waiting happens.</p>
          </div>
          <span>Nova · API support</span>
        </div>
        <div className="va-layout">
          <div className="va-console-zone">
            {closed ? (
              <AgentWorkspaceState
                title="Monitor closed"
                description="The sample is paused. Reopen to keep inspecting this session."
                actionLabel="Reopen monitor"
                onAction={() => setClosed(false)}
              />
            ) : (
              <section className="va-console" aria-label="Voice agent monitor">
                <header className="va-console-header">
                  <h2>
                    Voice agent <span>Nova · API support</span>
                  </h2>
                  <div className="va-actions">
                    <IconButton
                      aria-label="Session settings"
                      type="tertiary"
                      tapScale={1}
                      onClick={() => {
                        settings.current?.scrollIntoView({ block: "center" });
                        settings.current?.focus();
                      }}
                      icon={<Icon name="sliders" size="sm" />}
                    />
                    <IconButton
                      aria-label="Close monitor"
                      type="tertiary"
                      tapScale={1}
                      onClick={() => {
                        setPlaying(false);
                        setClosed(true);
                      }}
                      icon={<Icon name="x" size="sm" />}
                    />
                  </div>
                </header>
                {!connected ? (
                  <AgentWorkspaceState
                    error
                    title="Sample stream disconnected"
                    description="The last turn is preserved. Reconnect to resume inspection."
                    actionLabel="Reconnect sample"
                    onAction={() => {
                      setConnected(true);
                      setMessage("Sample reconnected. Press Play to continue.");
                    }}
                  />
                ) : (
                  <>
                    <div className="va-signal-panel">
                      <VoiceSignal
                        turn={turn}
                        position={position}
                        paused={!playing}
                        interrupted={interrupted}
                        onSeek={(p) => {
                          setPlaying(false);
                          setInterrupted(false);
                          setPosition(p);
                        }}
                      />
                    </div>
                    <div className="va-latency-panel">
                      <VoiceLatencyBreakdown
                        stages={turn.stages}
                        budget={budget}
                        turnLabel={`turn ${turn.id}`}
                      />
                      <TurnLatencyHistory
                        turns={VOICE_TURNS}
                        budget={budget}
                        selectedId={selected}
                        onSelect={choose}
                      />
                    </div>
                    <footer className="va-console-footer">
                      <span>
                        {(position / 1000).toFixed(1)} s · Turn {selected} /{" "}
                        {VOICE_TURNS.length}
                      </span>
                      <div className="va-actions">
                        <Button type="secondary" tapScale={1} onClick={play}>
                          {playing
                            ? "Pause"
                            : position >= turn.duration || interrupted
                              ? "Replay turn"
                              : "Play sample"}
                        </Button>
                        <Button
                          tapScale={1}
                          disabled={!playing || phase !== "speaking"}
                          onClick={() => {
                            setPlaying(false);
                            setInterrupted(true);
                            setMessage(
                              `Turn ${selected} interrupted. Replay starts this sample turn again.`,
                            );
                          }}
                          leadingIcon={<Icon name="mic" size="sm" />}
                        >
                          Barge in
                        </Button>
                      </div>
                    </footer>
                  </>
                )}
              </section>
            )}
            <div className="va-transport">
              <Button
                type="tertiary"
                tapScale={1}
                disabled={!connected || closed}
                onClick={() => {
                  setPlaying(false);
                  setInterrupted(false);
                  setSelected(
                    selected === VOICE_TURNS.length ? 1 : selected + 1,
                  );
                  setPosition(0);
                  setMessage("Next turn ready.");
                }}
              >
                Next turn →
              </Button>
              <span>Barge in becomes available while the agent speaks.</span>
            </div>
            <p className="va-feedback" role="status">
              {message}
            </p>
            <p className="va-local">
              Silent sample · synthetic amplitude data, no microphone or live
              calls.
            </p>
          </div>
          <aside className="va-inspector">
            <section>
              <h2>Session settings</h2>
              <p>Explore the same turn under a different latency target.</p>
              <RowShell>
                <RowLabel
                  title="Voice-to-voice budget"
                  description="Highlight turns that exceed this target."
                />
                <select
                  ref={settings}
                  aria-label="Latency budget"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                >
                  {[400, 600, 800, 1000].map((n) => (
                    <option value={n} key={n}>
                      {n} ms
                    </option>
                  ))}
                </select>
              </RowShell>
              <RowShell>
                <RowLabel
                  title="Replay speed"
                  description="Changes playback speed, not measured latency."
                />
                <select
                  aria-label="Replay speed"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                >
                  {[0.5, 1, 2].map((n) => (
                    <option value={n} key={n}>
                      {n}×
                    </option>
                  ))}
                </select>
              </RowShell>
              <RowShell>
                <RowLabel
                  title="Sample connection"
                  description={
                    connected
                      ? "Available for local playback."
                      : "Paused until reconnected."
                  }
                />
                <Button
                  type="secondary"
                  tapScale={1}
                  onClick={() => {
                    setConnected(!connected);
                    setPlaying(false);
                    setMessage(
                      connected
                        ? "Sample disconnected."
                        : "Sample reconnected.",
                    );
                  }}
                >
                  {connected ? "Disconnect" : "Reconnect"}
                </Button>
              </RowShell>
            </section>
            <section className="va-overview">
              <h2>Session overview</h2>
              <dl>
                <div>
                  <dt>Completed sample turns</dt>
                  <dd>{VOICE_TURNS.length}</dd>
                </div>
                <div>
                  <dt>Above {budget} ms</dt>
                  <dd>
                    {VOICE_TURNS.filter((t) => latency(t) > budget).length}
                  </dd>
                </div>
                <div>
                  <dt>Median latency</dt>
                  <dd>{percentile(VOICE_TURNS.map(latency), 0.5)} ms</dd>
                </div>
                <div>
                  <dt>P95 latency</dt>
                  <dd>{percentile(VOICE_TURNS.map(latency), 0.95)} ms</dd>
                </div>
              </dl>
              <p>
                Nearest-rank percentiles across all 12 sample turns. Playback
                and interruptions do not rewrite the source measurements.
              </p>
            </section>
            <section className="va-meaning">
              <h2>What the stages mean</h2>
              <p>
                <strong>Endpoint</strong> detects the end of caller speech.
              </p>
              <p>
                <strong>STT</strong> transcribes speech to text.
              </p>
              <p>
                <strong>LLM TTFT</strong> measures time to the first model
                token.
              </p>
              <p>
                <strong>TTS TTFB</strong> measures time to the first speech
                byte.
              </p>
              <p>
                <strong>Network</strong> adds transport overhead.
              </p>
            </section>
            <Button type="tertiary" tapScale={1} onClick={reset}>
              Reset sample session
            </Button>
          </aside>
        </div>
        <footer className="va-bottom">
          <a href="/voice-signal">Explore the components ↗</a>
          <a
            href="https://x.com/disarto_max/status/2110815271078559764"
            target="_blank"
            rel="noreferrer"
          >
            Reference by Disarto ↗
          </a>
        </footer>
      </ActivityWorkspaceShell>
    </div>
  );
}
