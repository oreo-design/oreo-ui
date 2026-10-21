import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Icon } from "@/components/icon";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { TaskStatusGroup } from "@/components/grouped-tasks";
import { SkeletonReveal } from "@/components/finance-overview";
import { AgentWorkspaceState } from "@/components/automation";
import {
  fitWidth,
  snapWidth,
  ISSUE_STAGES,
  type AdaptiveIssue,
  type PullRequestState,
  type IssueStage,
} from "./model";
import "./adaptive-issues.css";
export * from "./model";

/** A display-only PR identity. Hosts own navigation and live repository data. */
export function PullRequestPill({
  number,
  state = "open",
}: {
  number: number;
  state?: PullRequestState;
}) {
  return (
    <span
      className="adapt-pr"
      data-state={state}
      title={`Pull request #${number} · ${state}`}
      aria-label={`Pull request ${number}, ${state}`}
    >
      <Icon name={state === "merged" ? "git-merge" : state === "closed" ? "git-pull-request-closed" : "git-pull-request"} size="sm" />
      <span>#{number}</span>
    </span>
  );
}
export function AdaptiveIssueRow({
  issue,
  onOpen,
  selected = false,
  index = 0,
}: {
  issue: AdaptiveIssue;
  onOpen?: (issue: AdaptiveIssue) => void;
  selected?: boolean;
  index?: number;
}) {
  const label = `${issue.title}, pull request ${issue.pullRequest.number} ${issue.pullRequest.state}, ${issue.category}, ${issue.priority} priority, ${issue.points} points, due ${issue.due || "not set"}, ${issue.assignees.join(", ") || "unassigned"}`;
  const contents = (
    <>
      <span className="adapt-priority" title={`${issue.priority} priority`}>
        <Icon
          name={
            issue.priority === "urgent"
              ? "warning-circle"
              : issue.priority === "low"
                ? "ellipsis"
                : "chart-bar"
          }
          size="sm"
        />
      </span>
      <span className="adapt-title">{issue.title}</span>
      <span className="adapt-pr-slot">
        <PullRequestPill {...issue.pullRequest} />
      </span>
      <span className="adapt-category">
        <Tag color="default">{issue.category}</Tag>
      </span>
      <span className="adapt-points" title={`${issue.points} points`}>
        <Icon name="gauge" size="sm" />
        {issue.points}
      </span>
      <time className="adapt-date" dateTime={issue.due}>
        {issue.due
          ? new Date(`${issue.due}T12:00:00Z`).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })
          : "No date"}
      </time>
      <span className="adapt-people" title={issue.assignees.join(", ")}>
        <span className="adapt-one-person">
          <Avatar name={issue.assignees[0] || "Unassigned"} size="xs" />
        </span>
        <span className="adapt-many-people">
          <AvatarGroup size="xs" max={3}>
            {issue.assignees.map((name) => (
              <Avatar name={name} size="xs" key={name} />
            ))}
          </AvatarGroup>
          {!issue.assignees.length && <span>—</span>}
        </span>
      </span>
    </>
  );
  const props = {
    className: "adapt-row",
    "data-selected": selected,
    "data-adaptive-issue-id": issue.id,
    "data-priority": issue.priority,
    "aria-label": label,
    style: {
      "--adapt-delay": `${Math.min(index, 12) * 12}ms`,
    } as CSSProperties,
  };
  return (
    <li>
      {onOpen ? (
        <button
          {...props}
          type="button"
          aria-pressed={selected}
          onClick={() => onOpen(issue)}
        >
          {contents}
        </button>
      ) : (
        <div {...props}>{contents}</div>
      )}
    </li>
  );
}
export function AdaptiveIssueTable({
  issues,
  collapsed,
  onCollapsedChange,
  onOpen,
  selectedId,
  loading = false,
  error,
  onRetry,
  onClear,
}: {
  issues: readonly AdaptiveIssue[];
  collapsed?: readonly IssueStage[];
  onCollapsedChange?: (next: IssueStage[]) => void;
  onOpen?: (issue: AdaptiveIssue) => void;
  selectedId?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onClear?: () => void;
}) {
  const [localCollapsed, setLocalCollapsed] = useState<IssueStage[]>([]);
  const closed = collapsed ?? localCollapsed;
  const change = (next: IssueStage[]) => {
    if (collapsed === undefined) setLocalCollapsed(next);
    onCollapsedChange?.(next);
  };
  return (
    <div className="adapt-table">
      {error ? (
        <AgentWorkspaceState
          error
          title="Issues unavailable"
          description={error}
          actionLabel={onRetry ? "Try again" : undefined}
          onAction={onRetry}
        />
      ) : (
        <SkeletonReveal
          loading={loading}
          hasData={issues.length > 0}
          animate={false}
          label="Loading issues"
          skeleton={
            <div className="adapt-skeleton">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i}>
                  <i />
                  <i />
                  <i />
                </div>
              ))}
            </div>
          }
        >
          {issues.length ? (
            ISSUE_STAGES.map((status) => {
              const rows = issues.filter((i) => i.status === status);
              return rows.length ? (
                <TaskStatusGroup
                  key={status}
                  status={status}
                  count={rows.length}
                  tone="neutral"
                  open={!closed.includes(status)}
                  onOpenChange={(open) =>
                    change(
                      open
                        ? closed.filter((s) => s !== status)
                        : [...closed, status],
                    )
                  }
                >
                  <ul className="adapt-rows">
                    {rows.map((issue, i) => (
                      <AdaptiveIssueRow
                        key={issue.id}
                        issue={issue}
                        index={i}
                        selected={selectedId === issue.id}
                        onOpen={onOpen}
                      />
                    ))}
                  </ul>
                </TaskStatusGroup>
              ) : null;
            })
          ) : (
            <AgentWorkspaceState
              title={onClear ? "No matching issues" : "No issues yet"}
              description={
                onClear
                  ? "Try another search to find your issue."
                  : "Issues will appear here when they are added."
              }
              actionLabel={onClear ? "Clear search" : undefined}
              onAction={onClear}
            />
          )}
        </SkeletonReveal>
      )}
    </div>
  );
}
/** Controlled width; observes available space, captures the pointer, supports keyboard and cancellation. */
export function ResizeFrame({
  width,
  onWidthChange,
  children,
  label = "Issue panel width",
}: {
  width: number;
  onWidthChange: (width: number) => void;
  children: ReactNode;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null),
    drag = useRef<{ x: number; width: number; current: number } | null>(null);
  const [available, setAvailable] = useState(1120),
    [dragging, setDragging] = useState(false),
    id = useId();
  useLayoutEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) =>
      setAvailable(Math.max(0, entries[0].contentRect.width)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const max = Math.min(1120, available),
    actual = fitWidth(width, max);
  function finish(cancel = false) {
    const current = drag.current;
    if (!current) return;
    onWidthChange(cancel ? current.width : snapWidth(current.current, max));
    drag.current = null;
    setDragging(false);
  }
  return (
    <div className="adapt-resize-host" ref={host}>
      <div
        id={id}
        className="adapt-resize-frame"
        data-dragging={dragging}
        style={{ width: actual }}
      >
        {children}
        <div
          role="separator"
          tabIndex={0}
          aria-label={label}
          aria-orientation="vertical"
          aria-controls={id}
          aria-valuemin={Math.min(320, max)}
          aria-valuemax={Math.round(max)}
          aria-valuenow={actual}
          aria-valuetext={`${actual} pixels`}
          className="adapt-resize-handle"
          title="Drag to resize · arrow keys to adjust · double-click to fill"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.currentTarget.focus();
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { x: e.clientX, width: actual, current: actual };
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const next = fitWidth(
              drag.current.width + e.clientX - drag.current.x,
              max,
            );
            drag.current.current = next;
            onWidthChange(next);
          }}
          onPointerUp={() => finish()}
          onPointerCancel={() => finish(true)}
          onLostPointerCapture={() => finish()}
          onDoubleClick={() => onWidthChange(max)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && drag.current) {
              e.preventDefault();
              finish(true);
              return;
            }
            const step = e.shiftKey ? 40 : 10;
            const next =
              e.key === "ArrowRight"
                ? actual + step
                : e.key === "ArrowLeft"
                  ? actual - step
                  : e.key === "Home"
                    ? Math.min(320, max)
                    : e.key === "End"
                      ? max
                      : null;
            if (next !== null) {
              e.preventDefault();
              onWidthChange(fitWidth(next, max));
            }
          }}
        >
          <span />
        </div>
      </div>
    </div>
  );
}
