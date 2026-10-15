import { useId } from "react";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import "./operations.css";

export type OperationTone = "info" | "warning" | "success" | "danger";
export type OperationPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone: OperationTone;
};
export type OperationEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: OperationTone;
  status?: string;
};
const coordinate = (n: number) =>
  Number.isFinite(n) ? Math.max(4, Math.min(96, n)) : 50;
/** Original schematic geography; deliberately not a geographic or navigation API. */
export function DistrictArtwork() {
  return (
    <g aria-hidden="true">
      <rect width="1000" height="720" fill="var(--color-bg-base)" />
      <g
        transform="rotate(-17 500 360)"
        fill="var(--color-bg-surface)"
        stroke="var(--color-border-subtle)"
        strokeWidth="1"
      >
        {Array.from({ length: 130 }, (_, i) => (
          <rect
            key={i}
            x={(i % 13) * 92 - 80}
            y={Math.floor(i / 13) * 84 - 60}
            width={i % 4 === 0 ? 64 : 70}
            height={i % 3 === 0 ? 48 : 60}
            rx="3"
          />
        ))}
      </g>
      <path
        d="M390 -40Q560 120 445 270T575 500T615 780"
        fill="none"
        stroke="var(--color-bg-elevated)"
        strokeWidth="108"
      />
      <path
        d="M390 -40Q560 120 445 270T575 500T615 780"
        fill="none"
        stroke="var(--color-border-subtle)"
        strokeWidth="2"
      />
      <path
        d="M-50 285Q190 370 350 305T730 260L1060 400M-40 580Q220 490 440 550T1050 580M210 -40L290 760M760 -40L700 760"
        stroke="var(--color-border-default)"
        strokeWidth="8"
        fill="none"
      />
      <path
        d="M-50 285Q190 370 350 305T730 260L1060 400M-40 580Q220 490 440 550T1050 580M210 -40L290 760M760 -40L700 760"
        stroke="var(--color-bg-base)"
        strokeWidth="4"
        fill="none"
      />
      <g
        fill="var(--color-text-tertiary)"
        fontSize="14"
        fontFamily="monospace"
        letterSpacing="3"
      >
        <text x="110" y="160">
          NORTH DISTRICT
        </text>
        <text x="660" y="150">
          EAST YARD
        </text>
        <text x="115" y="640">
          OLD TOWN
        </text>
        <text x="660" y="655">
          SOUTH DEPOT
        </text>
        <text x="460" y="415" transform="rotate(35 460 415)">
          RIVER
        </text>
      </g>
    </g>
  );
}
export function OperationsMap({
  points,
  selectedId,
  onSelect,
  route = [],
  label = "Operations map",
}: {
  points: OperationPoint[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  route?: { x: number; y: number }[];
  label?: string;
}) {
  const id = useId();
  return (
    <figure className="ops-map" aria-label={label}>
      <div className="ops-map-scene">
        <svg
          viewBox="0 0 1000 720"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <DistrictArtwork />
          {route.length > 1 && (
            <polyline
              points={route
                .map((p) => `${coordinate(p.x) * 10},${coordinate(p.y) * 7.2}`)
                .join(" ")}
              stroke="var(--color-status-progress)"
              strokeWidth="5"
              fill="none"
              strokeLinejoin="round"
            />
          )}
        </svg>
        {points.map((p) => (
          <button
            key={p.id}
            type="button"
            className="ops-map-pin"
            data-tone={p.tone}
            data-edge={p.x < 35 ? "left" : p.x > 65 ? "right" : undefined}
            style={{ left: `${coordinate(p.x)}%`, top: `${coordinate(p.y)}%` }}
            aria-label={p.label}
            aria-pressed={selectedId === p.id}
            aria-describedby={id}
            disabled={!onSelect}
            onClick={() => onSelect?.(p.id)}
          >
            <span aria-hidden="true" />
            <span className="ops-pin-label">{p.label}</span>
          </button>
        ))}
        {!points.length && (
          <div className="ops-map-empty">
            <AgentWorkspaceState
              title="No locations to show"
              description="Clear your filters to bring locations back to the map."
            />
          </div>
        )}
        <span className="ops-map-north" aria-hidden="true">
          N ↑
        </span>
      </div>
      <figcaption id={id}>
        Illustrated district · Demo coordinates · Not for navigation
      </figcaption>
    </figure>
  );
}
export function OperationsFeed({
  items,
  selectedId,
  onSelect,
  emptyTitle = "No matching events",
  onClear,
}: {
  items: OperationEvent[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  emptyTitle?: string;
  onClear?: () => void;
}) {
  if (!items.length)
    return (
      <AgentWorkspaceState
        title={emptyTitle}
        description="Adjust the filters to see more activity."
        actionLabel={onClear ? "Clear filters" : undefined}
        onAction={onClear}
      />
    );
  return (
    <ul className="ops-feed">
      {items.map((item) => (
        <li key={item.id}>
          {onSelect ? (
            <button
              type="button"
              aria-pressed={selectedId === item.id}
              onClick={() => onSelect(item.id)}
            >
              <FeedContent item={item} />
            </button>
          ) : (
            <div className="ops-feed-static">
              <FeedContent item={item} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
function FeedContent({ item }: { item: OperationEvent }) {
  return (
    <>
      <span className="ops-event-icon" data-tone={item.tone}>
        <Icon
          name={
            item.tone === "danger"
              ? "warning-circle"
              : item.tone === "success"
                ? "check"
                : "circle-dashed"
          }
          size="sm"
        />
      </span>
      <span className="ops-feed-copy">
        <strong>{item.title}</strong>
        <span>{item.detail}</span>
        {item.status && <small>{item.status}</small>}
      </span>
      <time>{item.time}</time>
    </>
  );
}
export type HealthReading = {
  label: string;
  value: number;
  status: string;
  tone: OperationTone;
};
export function HealthMeters({ readings }: { readings: HealthReading[] }) {
  return (
    <dl className="ops-health">
      {readings.map((r) => {
        const value = Number.isFinite(r.value)
          ? Math.max(0, Math.min(100, r.value))
          : null;
        return (
          <div key={r.label} data-tone={r.tone}>
            <dt>{r.label}</dt>
            <dd>
              <span
                className="ops-segments"
                role={value === null ? "img" : "meter"}
                aria-label={
                  value === null ? `${r.label}: unavailable` : r.label
                }
                aria-valuemin={value === null ? undefined : 0}
                aria-valuemax={value === null ? undefined : 100}
                aria-valuenow={value ?? undefined}
                aria-valuetext={
                  value === null ? undefined : `${value}% · ${r.status}`
                }
              >
                <i style={{ width: `${value ?? 0}%` }} />
              </span>
              <span>
                {value === null ? "Unavailable" : `${value}%`} · {r.status}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
export type RouteStop = {
  id: string;
  label: string;
  detail: string;
  state: "complete" | "current" | "upcoming";
};
export function RouteTimeline({ stops }: { stops: RouteStop[] }) {
  return (
    <ol className="ops-timeline">
      {stops.map((s) => (
        <li
          key={s.id}
          data-state={s.state}
          aria-current={s.state === "current" ? "step" : undefined}
        >
          <span className="ops-stop-icon">
            <Icon
              name={s.state === "complete" ? "check" : "circle-dashed"}
              size="sm"
            />
          </span>
          <div>
            <strong>{s.label}</strong>
            <p>{s.detail}</p>
            <span className="sr-only">{s.state}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function PipelineFile({
  name,
  source,
  annotations = [],
}: {
  name: string;
  source: string;
  annotations?: { line: number; label: string; tone: OperationTone }[];
}) {
  return (
    <figure className="ops-file">
      <figcaption>
        <Icon name="inline-code" size="sm" />
        {name}
        <span>Read-only source</span>
      </figcaption>
      <div
        className="ops-code-scroll"
        tabIndex={0}
        aria-label={`${name} source, scroll horizontally if needed`}
      >
        <pre>
          {source.split("\n").map((line, i) => (
            <span className="ops-code-line" key={i}>
              <span className="ops-line-number" aria-hidden="true">
                {i + 1}
              </span>
              <code>
                {line
                  .split(
                    /(#.*$|"[^"]*"|\b(?:from|import|def|return|if|raise|class|True|False)\b|\b\d+(?:\.\d+)?\b)/g,
                  )
                  .map((part, j) => (
                    <span
                      key={j}
                      className={
                        part.startsWith("#")
                          ? "ops-code-comment"
                          : part.startsWith('"')
                            ? "ops-code-string"
                            : /^\d/.test(part)
                              ? "ops-code-number"
                              : /^(from|import|def|return|if|raise|class|True|False)$/.test(
                                    part,
                                  )
                                ? "ops-code-keyword"
                                : undefined
                      }
                    >
                      {part}
                    </span>
                  ))}
              </code>
              {annotations
                .filter((a) => a.line === i + 1)
                .map((a) => (
                  <span
                    key={a.label}
                    data-tone={a.tone}
                    className="ops-code-note"
                  >
                    {a.label}
                  </span>
                ))}
            </span>
          ))}
        </pre>
      </div>
    </figure>
  );
}
export function CameraCheckpoint({
  label,
  index = 0,
  selected = false,
  onSelect,
}: {
  label: string;
  index?: number;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      className="ops-camera"
      aria-pressed={selected}
      disabled={!onSelect}
      onClick={onSelect}
    >
      <svg
        viewBox="0 0 300 120"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="300" height="120" fill="var(--color-bg-elevated)" />
        <path
          d="M130 20L45 120H255L170 20"
          fill="var(--color-border-default)"
        />
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            <rect
              x={i < 4 ? i * 30 : 190 + (i - 4) * 28}
              y={10 + ((i + index) % 3) * 10}
              width="24"
              height="90"
              fill="var(--color-bg-surface)"
              stroke="var(--color-border-subtle)"
            />
            {[0, 1, 2, 3].map((j) => (
              <path
                key={j}
                d={`M${i < 4 ? i * 30 + 5 : 195 + (i - 4) * 28} ${30 + j * 15}h14`}
                stroke="var(--color-text-tertiary)"
              />
            ))}
          </g>
        ))}
        <path
          d="M150 35V50M150 65V85M150 100V115"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
        />
      </svg>
      <span>
        <strong>{label}</strong>
        <small>Illustrative snapshot</small>
      </span>
    </button>
  );
}
