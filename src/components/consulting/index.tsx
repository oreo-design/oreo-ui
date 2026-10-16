import { useId, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  SOURCE_LABELS,
  sourceStatus,
  validConversationDays,
  type Escalation,
  type KnowledgeSource,
  type SourceConflict,
  type ConversationDay,
} from "./model";
import "./consulting.css";
export * from "./model";
export function EscalationCard({
  item,
  open,
  onOpenChange,
  onReview,
  onApprove,
  onReopen,
}: {
  item: Escalation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReview?: (item: Escalation) => void;
  onApprove?: (item: Escalation) => void;
  onReopen?: (item: Escalation) => void;
}) {
  const id = useId();
  return (
    <article className="co-escalation" data-open={open || undefined}>
      <button
        className="co-escalation-heading"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        <Avatar name={item.person} size="sm" />
        <span className="co-client">
          <span>
            <strong>{item.client}</strong>
            <span>{item.advisor}</span>
          </span>
          <span>{item.summary}</span>
        </span>
        <Tag
          color={
            item.impact === "High impact"
              ? "orange"
              : item.impact === "Low confidence"
                ? "blue"
                : "default"
          }
        >
          {item.impact}
        </Tag>
        <time>{item.age}</time>
        <Icon name={open ? "chevron-up" : "chevron-down"} size="sm" />
      </button>
      {open && (
        <div id={id} className="co-escalation-body">
          <div className="co-case-grid">
            <section>
              <p className="co-overline">Client question</p>
              <h3>{item.question}</h3>
              <div className="co-contact">
                <Avatar name={item.person} size="xs" />
                <div>
                  {item.person}
                  <small>{item.role}</small>
                </div>
              </div>
            </section>
            <section>
              <p className="co-overline">What the advisor knows</p>
              <dl className="co-facts">
                {item.facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="co-reason">
              <div>
                <Icon name="users" size="sm" />
                <strong>Why this needs you</strong>
              </div>
              <p>{item.reason}</p>
              <span>
                <Icon name="chart-bar" size="sm" />
                {item.confidence} confidence
              </span>
            </section>
          </div>
          <footer>
            {onReview && (
              <Button
                size="sm"
                tapScale={1}
                onClick={() => onReview(item)}
                trailingIcon={<Icon name="arrow-up-right" size="sm" />}
              >
                {item.status === "resolved"
                  ? "View response"
                  : "Review and respond"}
              </Button>
            )}
            {item.status === "needs-you" && onApprove && (
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                leadingIcon={<Icon name="check" size="sm" />}
                onClick={() => onApprove(item)}
              >
                Review advisor draft
              </Button>
            )}
            {item.status !== "needs-you" && onReopen && (
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => onReopen(item)}
              >
                Reopen
              </Button>
            )}
            <Tag color={item.status === "resolved" ? "mint" : "default"}>
              {item.status === "resolved"
                ? "Resolved locally"
                : item.status === "waiting"
                  ? "Waiting on client"
                  : "Needs your decision"}
            </Tag>
          </footer>
        </div>
      )}
    </article>
  );
}
export function SourceConflictCard({
  conflict,
  onResolve,
  disabled = false,
}: {
  conflict: SourceConflict;
  onResolve?: (choice: string) => void;
  disabled?: boolean;
}) {
  const selected = conflict.options.find(
    (o) => o.sourceId === conflict.resolution,
  );
  return (
    <section
      className="co-conflict"
      data-resolved={!!conflict.resolution || undefined}
      aria-label={conflict.title}
    >
      <header>
        <span className="co-conflict-mark">
          <Icon name={conflict.resolution ? "check" : "warning-circle"} />
        </span>
        <div>
          <h3>{conflict.title}</h3>
          <p>{conflict.context}</p>
        </div>
        <Tag color={conflict.resolution ? "mint" : "orange"}>
          {conflict.resolution ? "Decision saved" : "Conflict"}
        </Tag>
      </header>
      <div className="co-conflict-options">
        {conflict.options.map((o) => (
          <blockquote
            key={o.sourceId}
            data-selected={selected?.sourceId === o.sourceId || undefined}
          >
            <span>
              <Icon name="paperclip" size="sm" />
              {o.title}
            </span>
            <p>“{o.quote}”</p>
            {!conflict.resolution && onResolve && (
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                disabled={disabled}
                onClick={() => onResolve(o.sourceId)}
              >
                Use {o.title}
              </Button>
            )}
          </blockquote>
        ))}
      </div>
      {conflict.resolution ? (
        <p className="co-decision" role="status">
          {conflict.resolution === "ask"
            ? "Ask a person each time this conflicting guidance is used."
            : `${selected?.title ?? "Selected source"} is the preferred source. Other versions are marked as duplicates.`}
        </p>
      ) : (
        onResolve && (
          <footer>
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              disabled={disabled}
              onClick={() => onResolve("ask")}
            >
              Ask me each time
            </Button>
            <span>Choose a source, or keep the decision with a person.</span>
          </footer>
        )
      )}
    </section>
  );
}
export function KnowledgeSourceTable({
  sources,
  conflicts = [],
  onReview,
  onRemove,
  onClear,
  loading = false,
  error,
  onRetry,
}: {
  sources: KnowledgeSource[];
  conflicts?: SourceConflict[];
  onReview?: (source: KnowledgeSource) => void;
  onRemove?: (source: KnowledgeSource) => void;
  onClear?: () => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  if (error)
    return (
      <AgentWorkspaceState
        error
        title="Sources unavailable"
        description={error}
        actionLabel={onRetry ? "Try again" : undefined}
        onAction={onRetry}
      />
    );
  if (loading && !sources.length)
    return (
      <div
        className="co-table-skeleton"
        role="status"
        aria-label="Loading knowledge sources"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <i />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    );
  if (!sources.length)
    return (
      <AgentWorkspaceState
        title="No sources found"
        description="Add a document or adjust your filters to see your knowledge sources."
        actionLabel={onClear ? "Clear filters" : undefined}
        onAction={onClear}
      />
    );
  return (
    <div
      className="co-table-scroll"
      role="region"
      aria-label="Knowledge sources"
      tabIndex={0}
      aria-busy={loading}
    >
      <table className="co-source-table">
        <caption className="sr-only">
          Advisor knowledge sources and review status
        </caption>
        <thead>
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Used for</th>
            <th scope="col">Found in sample</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s) => {
            const status = sourceStatus(s, conflicts);
            return (
              <tr key={s.id}>
                <td>
                  <span className="co-source-title">
                    <Icon name="paperclip" />
                    <span>
                      <strong>{s.title}</strong>
                      <small>
                        {s.format} · {s.detail}
                      </small>
                    </span>
                  </span>
                </td>
                <td>{s.usedFor}</td>
                <td>
                  {s.local
                    ? "Not analyzed"
                    : `${s.findings.frameworks} frameworks, ${s.findings.recommendations} recommendations${s.findings.examples ? `, ${s.findings.examples} examples` : ""}`}
                </td>
                <td>
                  <Tag
                    color={
                      status === "approved"
                        ? "mint"
                        : status === "conflict" || status === "review"
                          ? "orange"
                          : "default"
                    }
                  >
                    {SOURCE_LABELS[status]}
                  </Tag>
                </td>
                <td>
                  <div className="co-source-actions">
                    {onReview && (
                      <Button
                        type="tertiary"
                        size="sm"
                        tapScale={1}
                        onClick={() => onReview(s)}
                        aria-label={`Review ${s.title}`}
                      >
                        Review
                      </Button>
                    )}
                    {onRemove && (
                      <IconButton
                        type="tertiary"
                        size="sm"
                        tapScale={1}
                        icon={<Icon name="trash" size="sm" />}
                        aria-label={`Archive ${s.title}`}
                        disabled={status === "conflict"}
                        title={
                          status === "conflict"
                            ? "Resolve the source conflict before archiving."
                            : undefined
                        }
                        onClick={() => onRemove(s)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export function ConversationActivity({
  days,
  label = "This week",
}: {
  days: ConversationDay[];
  label?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null),
    id = useId();
  if (!validConversationDays(days))
    return (
      <AgentWorkspaceState
        error
        title="Activity unavailable"
        description="Use unique day IDs and non-negative whole conversation counts."
      />
    );
  if (!days.length)
    return (
      <AgentWorkspaceState
        title="No conversations yet"
        description="Activity appears here after a conversation is recorded."
      />
    );
  const total = days.reduce((s, d) => s + d.answered + d.escalated, 0),
    max = Math.max(1, ...days.map((d) => d.answered + d.escalated)),
    current = days.find((d) => d.id === selected) ?? days[days.length - 1];
  return (
    <figure className="co-activity" aria-labelledby={id}>
      <figcaption id={id}>
        <strong>{label}</strong>
        <span>
          {days[0].label} – {days[days.length - 1].label}
        </span>
      </figcaption>
      <p className="co-activity-total">
        <strong>{total}</strong> conversations
      </p>
      <div className="co-chart-legend">
        <span>
          <i />
          Answered by advisor
        </span>
        <span>
          <i />
          Needed you
        </span>
      </div>
      <div className="co-chart-bars">
        {days.map((d) => (
          <button
            key={d.id}
            aria-label={`${d.label}: ${d.answered} answered, ${d.escalated} escalated`}
            aria-pressed={current.id === d.id}
            onClick={() => setSelected(d.id)}
            onFocus={() => setSelected(d.id)}
          >
            <span className="co-chart-track" aria-hidden>
              <i
                className="co-chart-escalated"
                style={{ height: `${(d.escalated / max) * 100}%` }}
              />
              <i
                className="co-chart-answered"
                style={{ height: `${(d.answered / max) * 100}%` }}
              />
            </span>
            <span>{d.label}</span>
          </button>
        ))}
      </div>
      <p className="co-chart-detail" aria-live="polite">
        {current.label}: {current.answered} answered · {current.escalated}{" "}
        needed you
      </p>
    </figure>
  );
}
