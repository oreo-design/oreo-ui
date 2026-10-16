import { useId, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import {
  clampTime,
  taskDone,
  trackTime,
  type MixComment,
  type MixVersion,
  type ProductionTask,
} from "./model";
import "./music-project.css";
export * from "./model";

/** Controlled display: the host owns audio playback and supplies real media time. */
export function AnnotatedWaveform({
  samples,
  duration,
  position,
  comments = [],
  selectedId,
  onSeek,
  onComment,
}: {
  samples: number[];
  duration: number;
  position: number;
  comments?: MixComment[];
  selectedId?: string;
  onSeek?: (seconds: number) => void;
  onComment?: (id: string) => void;
}) {
  const id = useId();
  if (
    !Number.isFinite(duration) ||
    duration <= 0 ||
    !Number.isFinite(position) ||
    !samples.length ||
    samples.length > 1024 ||
    samples.some((n) => !Number.isFinite(n) || n < 0 || n > 1)
  )
    return (
      <AgentWorkspaceState
        error
        title="Waveform unavailable"
        description="Provide a positive duration and normalized amplitude samples."
      />
    );
  const p = clampTime(position, duration),
    markers = comments.filter(
      (c) =>
        Number.isFinite(c.seconds) && c.seconds >= 0 && c.seconds <= duration,
    );
  return (
    <section className="mp-waveform" aria-label="Annotated track waveform">
      <div className="mp-markers" aria-label="Track comment markers">
        {markers.map((c) => (
          <button
            key={c.id}
            type="button"
            style={{
              left: `${(clampTime(c.seconds, duration) / duration) * 100}%`,
            }}
            className="mp-marker"
            aria-label={`${c.author} at ${trackTime(c.seconds)}: ${c.text}`}
            aria-pressed={selectedId === c.id}
            disabled={!onComment}
            onClick={() => onComment?.(c.id)}
          >
            <Avatar name={c.author} size="xs" color="blue" />
            <span className="mp-marker-line" aria-hidden />
          </button>
        ))}
      </div>
      <div className="mp-wave-track">
        <svg viewBox="0 0 960 72" preserveAspectRatio="none" aria-hidden>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width={(p / duration) * 960} height="72" />
            </clipPath>
          </defs>
          <g className="mp-unplayed">
            {samples.map((v, i) => (
              <line
                key={i}
                x1={((i + 0.5) / samples.length) * 960}
                x2={((i + 0.5) / samples.length) * 960}
                y1={36 - v * 32}
                y2={36 + v * 32}
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </g>
          <g className="mp-played" clipPath={`url(#${id})`}>
            {samples.map((v, i) => (
              <line
                key={i}
                x1={((i + 0.5) / samples.length) * 960}
                x2={((i + 0.5) / samples.length) * 960}
                y1={36 - v * 32}
                y2={36 + v * 32}
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </g>
        </svg>
        {onSeek && (
          <input
            type="range"
            aria-label="Track position"
            aria-valuetext={`${trackTime(p)} of ${trackTime(duration)}`}
            min={0}
            max={duration}
            step={0.1}
            value={p}
            onChange={(e) => onSeek(Number(e.target.value))}
          />
        )}
      </div>
      <div className="mp-time-scale">
        <span>0:00</span>
        <span>
          {trackTime(p)} / {trackTime(duration)}
        </span>
      </div>
      {!!markers.length && (
        <div className="mp-marker-links" aria-label="Timestamp comments">
          {markers.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={!onComment}
              onClick={() => onComment?.(c.id)}
              aria-pressed={selectedId === c.id}
            >
              {trackTime(c.seconds)} · {c.author}
              {c.resolved ? " · Resolved" : ""}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
export function ProductionTaskList({
  tasks,
  onToggle,
  onSeek,
}: {
  tasks: ProductionTask[];
  onToggle?: (id: string, done: boolean) => void;
  onSeek?: (seconds: number, versionId?: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  if (!tasks.length)
    return (
      <AgentWorkspaceState
        title="No production tasks"
        description="Add a task to keep this project moving."
      />
    );
  const render = (t: ProductionTask) => (
    <li key={t.id} className="mp-task-item">
      <div className="mp-task-row" data-done={taskDone(t)}>
        <input
          type="checkbox"
          checked={taskDone(t)}
          disabled={!onToggle}
          aria-label={`Complete ${t.title}`}
          onChange={(e) => onToggle?.(t.id, e.target.checked)}
        />
        <span className="mp-task-title">
          {t.title}
          {t.seconds !== undefined && (
            <button
              type="button"
              className="mp-time-link"
              disabled={!onSeek}
              onClick={() => onSeek?.(t.seconds!, t.versionId)}
            >
              {trackTime(t.seconds)}
            </button>
          )}
        </span>
        {!!t.children?.length && (
          <button
            type="button"
            className="mp-subtasks-toggle"
            aria-label={`${collapsed.includes(t.id) ? "Expand" : "Collapse"} ${t.title}`}
            aria-expanded={!collapsed.includes(t.id)}
            onClick={() =>
              setCollapsed((s) =>
                s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id],
              )
            }
          >
            {t.children.filter(taskDone).length}/{t.children.length}
            <Icon
              name={collapsed.includes(t.id) ? "chevron-right" : "chevron-down"}
              size="sm"
            />
          </button>
        )}
        <span className="mp-task-date">{t.due}</span>
        <Avatar name={t.assignee} size="xs" color="brown" />
      </div>
      {!!t.children?.length && !collapsed.includes(t.id) && (
        <ul className="mp-subtasks">{t.children.map(render)}</ul>
      )}
    </li>
  );
  return <ul className="mp-task-list">{tasks.map(render)}</ul>;
}
export function MixVersionList({
  versions,
  value,
  onChange,
}: {
  versions: MixVersion[];
  value: string;
  onChange?: (id: string) => void;
}) {
  if (!versions.length)
    return (
      <AgentWorkspaceState
        title="No mixes yet"
        description="Add an audio version to start reviewing."
      />
    );
  return (
    <div className="mp-version-list" role="group" aria-label="Mix versions">
      {versions.map((v, i) => (
        <button
          key={v.id}
          type="button"
          className="mp-version"
          aria-pressed={v.id === value}
          disabled={!onChange}
          onClick={() => onChange?.(v.id)}
        >
          <span className="mp-version-icon">
            <span aria-hidden>♫</span>
          </span>
          <span className="mp-version-info">
            <strong>
              {v.title} {i === 0 && <small>Latest</small>}
            </strong>
            <span>{v.note}</span>
            <span>
              {v.author} · {v.date}
            </span>
          </span>
          <span>{trackTime(v.duration)}</span>
          {v.id === value && <Icon name="check" size="sm" />}
        </button>
      ))}
    </div>
  );
}
