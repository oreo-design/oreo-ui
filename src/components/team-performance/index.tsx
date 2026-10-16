import { useId } from "react";
import { Button } from "@/components/button";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  scoreBand,
  type MemberPerformance,
  type PerformanceSort,
  type ReviewState,
} from "./model";
import "./performance.css";
export * from "./model";
export function PerformanceScore({
  value,
  label = "Performance",
}: {
  value: number;
  label?: string;
}) {
  const band = scoreBand(value),
    valid = band.label !== "Unavailable";
  return (
    <span
      className="tp-score"
      data-tone={band.color}
      role={valid ? "meter" : "img"}
      aria-label={valid ? label : `${label}: unavailable`}
      aria-valuemin={valid ? 0 : undefined}
      aria-valuemax={valid ? 100 : undefined}
      aria-valuenow={valid ? value : undefined}
      aria-valuetext={valid ? `${value} out of 100 · ${band.label}` : undefined}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle className="tp-ring-track" cx="12" cy="12" r="9" />
        <circle
          cx="12"
          cy="12"
          r="9"
          pathLength="100"
          strokeDasharray={`${valid ? value : 0} 100`}
          transform="rotate(-90 12 12)"
        />
      </svg>
      <span aria-hidden>{valid ? `${value}%` : "—"}</span>
    </span>
  );
}
export function ReviewProgress({
  counts,
  label = "Reviews progress",
  selected,
  onSelect,
}: {
  counts: Record<ReviewState, number>;
  label?: string;
  selected?: ReviewState;
  onSelect?: (state: ReviewState) => void;
}) {
  const id = useId(),
    states = ["Completed", "Pending", "Overdue"] as const;
  const safe = states.map((s) =>
      Number.isSafeInteger(counts[s]) && counts[s] >= 0 ? counts[s] : 0,
    ),
    total = safe.reduce((a, b) => a + b, 0),
    percent = total ? Math.round((100 * safe[0]) / total) : 0;
  return (
    <section className="tp-review-progress" aria-labelledby={id}>
      <header>
        <h2 id={id}>{label}</h2>
        <strong>
          {total ? `${percent}%` : "—"}
          <small> completed</small>
        </strong>
      </header>
      <div
        className="tp-review-track"
        role="img"
        aria-label={
          total
            ? states.map((s, i) => `${safe[i]} ${s.toLowerCase()}`).join(", ")
            : "No reviews in this view"
        }
      >
        {states.map((s, i) => (
          <i
            key={s}
            data-state={s}
            style={{ width: `${total ? (100 * safe[i]) / total : 0}%` }}
          />
        ))}
      </div>
      <footer>
        <div>
          {states.map((s, i) =>
            onSelect ? (
              <button
                type="button"
                key={s}
                data-state={s}
                aria-pressed={selected === s}
                onClick={() => onSelect(s)}
              >
                <i />
                {safe[i]} {s}
              </button>
            ) : (
              <span key={s} data-state={s}>
                <i />
                {safe[i]} {s}
              </span>
            ),
          )}
        </div>
        <span>
          {safe[0]} / {total} reviews completed
        </span>
      </footer>
    </section>
  );
}
export function MemberPerformanceTable({
  members,
  sort,
  onSort,
  onOpen,
  loading = false,
  error,
  onReset,
}: {
  members: MemberPerformance[];
  sort?: PerformanceSort;
  onSort?: (sort: PerformanceSort) => void;
  onOpen?: (member: MemberPerformance) => void;
  loading?: boolean;
  error?: string;
  onReset?: () => void;
}) {
  if (error)
    return (
      <AgentWorkspaceState
        error
        title="Reviews unavailable"
        description={error}
        actionLabel={onReset ? "Try again" : undefined}
        onAction={onReset}
      />
    );
  if (loading && !members.length)
    return (
      <div
        className="tp-skeleton"
        role="status"
        aria-label="Loading member reviews"
      >
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i}>
            {Array.from({ length: 6 }, (_, j) => (
              <i key={j} />
            ))}
          </div>
        ))}
      </div>
    );
  if (!members.length)
    return (
      <AgentWorkspaceState
        title="No members found"
        description="Try a different name, department or review status."
        actionLabel={onReset ? "Clear filters" : undefined}
        onAction={onReset}
      />
    );
  const th = (name: string, key: PerformanceSort["key"]) => (
    <th
      scope="col"
      aria-sort={
        sort?.key === key
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      {onSort ? (
        <Button
          type="tertiary"
          size="sm"
          tapScale={1}
          onClick={() =>
            onSort({
              key,
              direction:
                sort?.key === key && sort.direction === "asc" ? "desc" : "asc",
            })
          }
        >
          {name}
          {sort?.key === key ? (
            <span aria-hidden>{sort.direction === "asc" ? "↑" : "↓"}</span>
          ) : null}
        </Button>
      ) : (
        name
      )}
    </th>
  );
  return (
    <div
      className="tp-table-scroll"
      role="region"
      aria-label="Team member performance"
      tabIndex={0}
      aria-busy={loading}
    >
      <table className="tp-table">
        <caption className="sr-only">
          Member scores are out of 100. Changes are percentage points against
          the previous month. Last review dates use UTC.
        </caption>
        <thead>
          <tr>
            {th("Name", "name")}
            <th scope="col">Role</th>
            <th scope="col">Department</th>
            {th("Performance", "score")}
            {th("Change", "change")}
            <th scope="col">Rating</th>
            <th scope="col">Review</th>
            <th scope="col">Last review</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const delta = Number((m.score - m.previous).toFixed(1)),
              band = scoreBand(m.score);
            return (
              <tr key={m.id}>
                <th scope="row">
                  {onOpen ? (
                    <button
                      className="tp-member"
                      onClick={() => onOpen(m)}
                      aria-label={`Review ${m.name}`}
                    >
                      <Avatar name={m.name} size="sm" aria-hidden />
                      <span>{m.name}</span>
                    </button>
                  ) : (
                    <span className="tp-member">
                      <Avatar name={m.name} size="sm" aria-hidden />
                      <span>{m.name}</span>
                    </span>
                  )}
                </th>
                <td>
                  <Tag>{m.role}</Tag>
                </td>
                <td>{m.department}</td>
                <td>
                  <PerformanceScore
                    value={m.score}
                    label={`${m.name} performance`}
                  />
                </td>
                <td
                  className="tp-delta"
                  data-direction={
                    delta > 0 ? "up" : delta < 0 ? "down" : "same"
                  }
                >
                  {delta > 0 ? "↑ " : delta < 0 ? "↓ " : ""}
                  {Math.abs(delta)} pp
                  <span className="sr-only">
                    {delta > 0
                      ? " increase"
                      : delta < 0
                        ? " decrease"
                        : " unchanged"}
                  </span>
                </td>
                <td>
                  <Tag color={band.color}>{band.label}</Tag>
                </td>
                <td>
                  <Tag
                    color={
                      m.review === "Completed"
                        ? "mint"
                        : m.review === "Overdue"
                          ? "pink"
                          : "orange"
                    }
                  >
                    {m.review}
                  </Tag>
                </td>
                <td>
                  {m.lastReview ? (
                    <time dateTime={m.lastReview}>
                      {new Date(m.lastReview + "T00:00:00Z").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        },
                      )}
                    </time>
                  ) : (
                    "Not reviewed"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
