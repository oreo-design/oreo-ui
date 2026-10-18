import { useId, type ReactNode, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import { cn } from "@/lib/cn";
import { mergeCaption, isMergeBusy, type MergePhase } from "./model";
import "./merge-review.css";
export * from "./model";

export type BranchCommit = {
  id: string;
  title: string;
  lane: number;
  parents: string[];
  branch?: string;
  author: string;
  time: string;
  conflicts?: number;
  resolved?: boolean;
};
export type MergeCheck = {
  id: string;
  label: string;
  state: "pending" | "running" | "passed" | "failed";
  summary: string;
  detail: string;
};
const laneColors = [
  "var(--color-text-tertiary)",
  "var(--mr-feature, var(--color-status-progress))",
  "var(--color-status-success)",
];
const phaseIcon = (phase: MergePhase) =>
  isMergeBusy(phase)
    ? ("spinner" as const)
    : phase === "conflicts" || phase === "error"
      ? ("warning-circle" as const)
      : ("check" as const);

export function MergeStatusBadge({
  phase,
  number,
  conflicts = 3,
  className,
}: {
  phase: MergePhase;
  number?: number;
  conflicts?: number;
  className?: string;
}) {
  return (
    <span className={cn("mr-badge", className)} data-phase={phase}>
      <Icon
        name={phaseIcon(phase)}
        size="sm"
        className={isMergeBusy(phase) ? "mr-spin" : ""}
      />
      {number != null && <span className="mr-number">#{number}</span>}
      {mergeCaption(phase, conflicts)}
    </span>
  );
}

/** Caller assigns lanes and parent IDs. Rows are newest first; unknown parents terminate at the visible boundary. */
export function BranchHistory({
  commits,
  merged = false,
  selectedId,
  onSelect,
}: {
  commits: readonly BranchCommit[];
  merged?: boolean;
  selectedId?: string;
  onSelect?: (commit: BranchCommit) => void;
}) {
  const reduced = useReducedMotion();
  const lanes = Math.max(
    2,
    ...commits.map((c) => Math.max(0, Math.min(5, c.lane))),
  );
  const width = 24 + lanes * 18;
  const x = (lane: number) => 12 + Math.max(0, Math.min(5, lane)) * 18;
  const color = (commit: BranchCommit) =>
    commit.conflicts && !commit.resolved
      ? "var(--color-palette-orange-text)"
      : merged && commit.lane === 1
        ? "var(--color-palette-purple-text)"
        : laneColors[commit.lane % 3];
  if (!commits.length)
    return (
      <AgentWorkspaceState
        title="No commits yet"
        description="Commit history will appear here when a branch is available."
      />
    );
  return (
    <div
      className="mr-history"
      style={{ "--graph-width": `${width}px` } as CSSProperties}
    >
      <svg
        className="mr-graph"
        width={width}
        height={commits.length * 42}
        aria-hidden="true"
      >
        {commits.flatMap((commit, index) =>
          commit.parents.map((parent) => {
            const end = commits.findIndex((c) => c.id === parent);
            if (end < 0) return null;
            const fromX = x(commit.lane),
              toX = x(commits[end].lane),
              y = index * 42 + 21,
              endY = end * 42 + 21;
            return (
              <path
                key={`${commit.id}-${parent}`}
                d={`M ${fromX} ${y} C ${fromX} ${y + 24}, ${toX} ${endY - 24}, ${toX} ${endY}`}
                fill="none"
                stroke={color(commit)}
                strokeOpacity=".3"
                strokeWidth="1.5"
              />
            );
          }),
        )}
        {commits.map((commit, index) => (
          <motion.circle
            key={commit.id}
            initial={false}
            animate={{ cy: index * 42 + 21 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            cx={x(commit.lane)}
            r={commit.id === selectedId ? 6 : 4.5}
            fill={color(commit)}
            stroke="var(--color-bg-base)"
            strokeWidth="2"
          />
        ))}
      </svg>
      <ol className="mr-commit-list" aria-label="Branch commit history">
        {commits.map((commit) => {
          const content = (
            <>
              <span className="mr-commit-copy">
                <span className="mr-commit-title">{commit.title}</span>
                {commit.branch && (
                  <code className="mr-branch" style={{ color: color(commit) }}>
                    {commit.branch}
                  </code>
                )}
                {!!commit.conflicts && (
                  <span
                    className="mr-conflict-count"
                    data-resolved={commit.resolved}
                    aria-label={
                      commit.resolved
                        ? "Conflicts resolved"
                        : `${commit.conflicts} conflicts`
                    }
                  >
                    {commit.resolved ? (
                      <Icon name="check" size="sm" />
                    ) : (
                      commit.conflicts
                    )}
                  </span>
                )}
              </span>
              <span className="mr-commit-meta">
                <code>{commit.id.slice(0, 6)}</code> {commit.author} ·{" "}
                {commit.time}
              </span>
            </>
          );
          return (
            <motion.li
              layout={!reduced}
              transition={{ duration: reduced ? 0 : 0.25 }}
              key={commit.id}
              data-conflict={!!commit.conflicts && !commit.resolved}
            >
              {onSelect ? (
                <button
                  type="button"
                  className="mr-commit"
                  aria-pressed={selectedId === commit.id}
                  onClick={() => onSelect(commit)}
                  title={`${commit.title} · ${commit.branch ?? `lane ${commit.lane}`} · ${commit.author} · ${commit.time}`}
                >
                  {content}
                </button>
              ) : (
                <div className="mr-commit">{content}</div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export function MergeChecks({ checks }: { checks: readonly MergeCheck[] }) {
  return (
    <div className="mr-checks" aria-label="Pull request checks">
      {checks.map((check) => (
        <details className="mr-check" key={check.id} data-state={check.state}>
          <summary>
            <Icon
              name={
                check.state === "passed"
                  ? "check"
                  : check.state === "failed"
                    ? "warning-circle"
                    : "spinner"
              }
              size="sm"
              className={check.state === "running" ? "mr-spin" : ""}
            />
            <span>{check.label}</span>
            <span className="mr-muted">{check.summary}</span>
          </summary>
          <div className="mr-check-detail">{check.detail}</div>
        </details>
      ))}
    </div>
  );
}

export function ChangeSummary({
  additions,
  deletions,
  children,
}: {
  additions: number;
  deletions: number;
  children?: ReactNode;
}) {
  const added = Math.max(
    0,
    Math.floor(Number.isFinite(additions) ? additions : 0),
  );
  const removed = Math.max(
    0,
    Math.floor(Number.isFinite(deletions) ? deletions : 0),
  );
  const green =
    added + removed ? Math.round((5 * added) / (added + removed)) : 0;
  const label = (
    <>
      <span className="mr-added">+{added}</span>
      <span className="mr-removed">−{removed}</span>
      <span className="mr-diff-blocks" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            data-tone={
              added + removed === 0 ? "empty" : i < green ? "add" : "remove"
            }
          />
        ))}
      </span>
    </>
  );
  return children ? (
    <details className="mr-change-summary">
      <summary
        aria-label={`View changes: ${added} additions, ${removed} deletions`}
      >
        {label}
        <Icon name="chevron-down" size="sm" />
      </summary>
      <div className="mr-change-detail">{children}</div>
    </details>
  ) : (
    <span
      className="mr-badge"
      aria-label={`${added} additions, ${removed} deletions`}
    >
      {label}
    </span>
  );
}

export type PullRequestCardProps = {
  title: string;
  number: number;
  target?: string;
  phase: MergePhase;
  commits: readonly BranchCommit[];
  checks?: readonly MergeCheck[];
  resolved?: number;
  conflicts?: number;
  onResolve?: () => void;
  onMerge?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
  onSelectCommit?: (commit: BranchCommit) => void;
  selectedCommit?: string;
  error?: string;
  children?: ReactNode;
};
export function PullRequestCard({
  title,
  number,
  target = "main",
  phase,
  commits,
  checks = [],
  resolved = 0,
  conflicts = 3,
  onResolve,
  onMerge,
  onRetry,
  onCancel,
  onSelectCommit,
  selectedCommit,
  error,
  children,
}: PullRequestCardProps) {
  const heading = useId(),
    reduced = useReducedMotion();
  const complete = phase === "merged",
    busy = isMergeBusy(phase);
  const allChecksPassed =
    checks.length > 0 && checks.every((check) => check.state === "passed");
  const caption =
    phase === "resolving"
      ? `Resolving conflict ${Math.min(resolved + 1, conflicts)} of ${conflicts}`
      : phase === "checking"
        ? "Verifying the merge"
        : complete
          ? `Merged into ${target}`
          : mergeCaption(phase, conflicts);
  return (
    <article className="mr-card" data-phase={phase} aria-labelledby={heading}>
      <header className="mr-card-header">
        <h2 id={heading}>
          {title} <span className="mr-muted">#{number}</span>
        </h2>
        <span className="mr-open-state">● {complete ? "Merged" : "Open"}</span>
      </header>
      {phase === "creating" ? (
        <div
          className="mr-skeleton"
          role="status"
          aria-label="Creating pull request"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ width: `${90 - (i % 3) * 15}%` }} />
          ))}
        </div>
      ) : (
        <>
          <div className="mr-target">
            <Icon
              name={phaseIcon(phase)}
              size="sm"
              className={busy ? "mr-spin" : ""}
            />
            <span>
              {complete ? "Merged into" : "Merge into"} <code>{target}</code>
            </span>
            <span>
              {phase === "conflicts"
                ? `${conflicts} conflicts`
                : phase === "resolving"
                  ? `${resolved}/${conflicts}`
                  : phase === "ready"
                    ? "ready"
                    : complete
                      ? "merged"
                      : ""}
            </span>
          </div>
          <BranchHistory
            commits={commits}
            merged={complete}
            selectedId={selectedCommit}
            onSelect={onSelectCommit}
          />
          {checks.length > 0 && <MergeChecks checks={checks} />}
          {children}
        </>
      )}
      <footer className="mr-card-footer">
        <div role="status" aria-live="polite" className="mr-footer-status">
          <Icon
            name={phaseIcon(phase)}
            size="sm"
            className={busy ? "mr-spin" : ""}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={caption}
              initial={{ opacity: 0, y: reduced ? 0 : 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.15 }}
            >
              {caption}
            </motion.span>
          </AnimatePresence>
        </div>
        {phase === "conflicts" && onResolve && (
          <Button size="sm" type="primary" onClick={onResolve}>
            Resolve conflicts
          </Button>
        )}
        {phase === "ready" && onMerge && (
          <Button
            size="sm"
            type="primary"
            disabled={!allChecksPassed}
            onClick={onMerge}
          >
            Merge
          </Button>
        )}
        {phase === "error" && onRetry && (
          <Button size="sm" type="secondary" onClick={onRetry}>
            Retry checks
          </Button>
        )}
        {busy && phase !== "merging" && onCancel && (
          <Button size="sm" type="tertiary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </footer>
      {phase === "error" && (
        <p className="mr-error" role="alert">
          {error ?? "Checks failed. Review the failed check and try again."}
        </p>
      )}
    </article>
  );
}
