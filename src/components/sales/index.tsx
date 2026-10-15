import { useId } from "react";
import { Tag } from "@/components/tag";
import { Button } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import {
  STAGE_PROGRESS,
  salesMoney,
  validAmount,
  type Deal,
  type DealStage,
  type RevenueDay,
  type PipelineStage,
} from "./model";
import "./sales.css";
export * from "./model";
const tones = {
  New: "blue",
  Contacted: "purple",
  Qualified: "purple",
  Negotiation: "orange",
  Won: "mint",
} as const;
export function DealStageBadge({ stage }: { stage: DealStage }) {
  return <Tag color={tones[stage]}>{stage}</Tag>;
}
/** Pixel columns retain a zero baseline. Exact observations remain available in the data disclosure. */
export function RevenueMatrix({
  days,
  label = "Booked revenue",
}: {
  days: RevenueDay[];
  label?: string;
}) {
  const id = useId();
  if (!days.length)
    return (
      <AgentWorkspaceState
        title="No revenue observations"
        description="Add dated revenue values to see the matrix."
      />
    );
  if (days.some((d) => !validAmount(d.value)))
    return (
      <AgentWorkspaceState
        error
        title="Revenue data unavailable"
        description="Every observation needs a finite, non-negative amount."
      />
    );
  const max = Math.max(...days.map((d) => d.value), 1),
    ceiling = Math.max(1000, Math.ceil(max / 10000) * 10000);
  const rows = 16,
    width = Math.max(280, days.length * 15),
    plot = width;
  return (
    <figure className="revenue-matrix" aria-labelledby={id}>
      <figcaption id={id}>
        <strong>{salesMoney(days.reduce((s, d) => s + d.value, 0))}</strong>
        <span>
          {label} · {days.length} days
        </span>
      </figcaption>
      <div
        className="revenue-scroll"
        tabIndex={0}
        role="region"
        aria-label={`${label} chart`}
      >
        <div className="revenue-plot">
          <div className="sales-y-axis" aria-hidden="true">
            {[1, 0.5, 0].map((t) => (
              <span key={t}>{salesMoney(t * ceiling, true)}</span>
            ))}
          </div>
          <svg
            viewBox={`0 0 ${width} 160`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`${label}. Pixel bars from zero to ${salesMoney(ceiling)}. Exact values follow in the data table.`}
          >
            {days.map((d, i) => (
              <g key={`${d.date}-${i}`}>
                <title>
                  {d.date}: {salesMoney(d.value)}
                </title>
                {Array.from({ length: rows }, (_, r) => {
                  const fraction = Math.max(
                    0,
                    Math.min(1, (d.value / ceiling) * rows - r),
                  );
                  const x = (i * plot) / days.length,
                    y = 150 - r * 10;
                  return (
                    <g key={r}>
                      <rect
                        x={x}
                        y={y}
                        width={Math.max(2, plot / days.length - 3)}
                        height="7"
                        rx="1"
                        className="revenue-cell"
                      />
                      {fraction > 0 && (
                        <rect
                          x={x}
                          y={y + 7 * (1 - fraction)}
                          width={Math.max(2, plot / days.length - 3)}
                          height={7 * fraction}
                          rx="1"
                          className={`revenue-fill revenue-fill-${r % 3}`}
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        </div>
        <div className="sales-x-axis" aria-hidden="true">
          <span>{days[0].date}</span>
          {days.length > 2 && (
            <span>{days[Math.floor(days.length / 2)].date}</span>
          )}
          {days.length > 1 && <span>{days[days.length - 1].date}</span>}
        </div>
      </div>
      <details>
        <summary>View daily amounts</summary>
        <div
          className="sales-data-scroll"
          tabIndex={0}
          role="region"
          aria-label="Daily revenue data"
        >
          <table>
            <caption>Booked revenue in USD</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={`${d.date}-${i}`}>
                  <th scope="row">{d.date}</th>
                  <td>{salesMoney(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
/** Stage order is illustrative; values and shares, not shape area, encode amounts. */
export function PipelineFunnel({ stages }: { stages: PipelineStage[] }) {
  const id = useId();
  if (!stages.length)
    return (
      <AgentWorkspaceState
        title="No pipeline stages"
        description="Supply stages and their values to build the pipeline overview."
      />
    );
  if (stages.some((s) => !validAmount(s.value)))
    return (
      <AgentWorkspaceState
        error
        title="Pipeline data unavailable"
        description="Stage values must be finite and non-negative."
      />
    );
  const total = stages.reduce((s, d) => s + d.value, 0);
  return (
    <figure className="pipeline-funnel" aria-labelledby={id}>
      <svg viewBox={`0 0 320 ${stages.length * 82 + 22}`} aria-hidden="true">
        {stages.map((s, i) => {
          const top = 140 - i * Math.min(24, 100 / stages.length),
            bottom = top - 18,
            y = 20 + i * 82;
          return (
            <g key={s.id} className={`funnel-tier funnel-tier-${i % 3}`}>
              <path
                d={`M${160 - top},${y} Q160,${y + 26} ${160 + top},${y} L${160 + bottom},${y + 55} Q160,${y + 82} ${160 - bottom},${y + 55} Z`}
              />
              <ellipse cx="160" cy={y} rx={top} ry="14" />
              <text x="160" y={y + 44} textAnchor="middle">
                {salesMoney(s.value, true)}
              </text>
            </g>
          );
        })}
      </svg>
      <ul>
        {stages.map((s, i) => (
          <li key={s.id}>
            <span>
              <i className={`revenue-fill-${i % 3}`} />
              {s.label}
            </span>
            <span>
              {salesMoney(s.value)}{" "}
              <small>{total ? Math.round((s.value / total) * 100) : 0}%</small>
            </span>
          </li>
        ))}
      </ul>
      <figcaption id={id}>
        Open pipeline · stage shapes show order, not value.
      </figcaption>
    </figure>
  );
}
export function DealTable({
  deals,
  selectedIds = [],
  onSelectionChange,
  onEdit,
  onClear,
}: {
  deals: Deal[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onEdit?: (deal: Deal) => void;
  onClear?: () => void;
}) {
  if (!deals.length)
    return (
      <AgentWorkspaceState
        title="No matching deals"
        description="Try another name or stage to find a deal."
        actionLabel={onClear ? "Clear filters" : undefined}
        onAction={onClear}
      />
    );
  const selected = deals.filter((d) => selectedIds.includes(d.id));
  return (
    <div
      className="deal-table-scroll"
      role="region"
      aria-label="Deals table"
      tabIndex={0}
    >
      <table className="deal-table">
        <caption className="sr-only">
          Sales opportunities in USD. Progress indicates stage, not probability.
        </caption>
        <thead>
          <tr>
            {onSelectionChange && (
              <th>
                <input
                  type="checkbox"
                  aria-label="Select all visible deals"
                  checked={selected.length === deals.length}
                  ref={(el) => {
                    if (el)
                      el.indeterminate =
                        selected.length > 0 && selected.length < deals.length;
                  }}
                  onChange={(e) =>
                    onSelectionChange(
                      e.target.checked
                        ? Array.from(
                            new Set([
                              ...selectedIds,
                              ...deals.map((d) => d.id),
                            ]),
                          )
                        : selectedIds.filter(
                            (id) => !deals.some((d) => d.id === id),
                          ),
                    )
                  }
                />
              </th>
            )}
            {[
              "Lead",
              "Company",
              "Status",
              "Progress",
              "Source",
              "Value",
              "Next step",
            ].map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
            {onEdit && (
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {deals.map((d) => (
            <tr
              key={d.id}
              data-selected={selectedIds.includes(d.id) || undefined}
            >
              {onSelectionChange && (
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${d.lead}`}
                    checked={selectedIds.includes(d.id)}
                    onChange={(e) =>
                      onSelectionChange(
                        e.target.checked
                          ? [...selectedIds, d.id]
                          : selectedIds.filter((id) => id !== d.id),
                      )
                    }
                  />
                </td>
              )}
              <th scope="row">{d.lead}</th>
              <td>{d.company}</td>
              <td>
                <DealStageBadge stage={d.stage} />
              </td>
              <td>
                <span className="deal-progress">
                  <span style={{ width: `${STAGE_PROGRESS[d.stage]}%` }} />
                  <b>{STAGE_PROGRESS[d.stage]}%</b>
                </span>
              </td>
              <td>{d.source}</td>
              <td className="deal-value">{salesMoney(d.value)}</td>
              <td>{d.nextStep}</td>
              {onEdit && (
                <td>
                  <Button
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    aria-label={`Edit ${d.lead}`}
                    onClick={() => onEdit(d)}
                  >
                    Edit
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
