import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import { SkeletonReveal } from "@/components/finance-overview";
import type { Issue } from "./model";
import "./issue-browser.css";
export * from "./model";
function Labels({ labels }: { labels: string[] }) {
  return (
    <span className="ib-labels">
      {labels.map((label) => (
        <Tag key={label} size="sm" color="default">
          {label}
        </Tag>
      ))}
    </span>
  );
}
export function IssueRow({
  issue,
  selected = false,
  onSelect,
}: {
  issue: Issue;
  selected?: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <button
      type="button"
      className="ib-row"
      data-issue-id={issue.id}
      aria-pressed={selected}
      onClick={() => onSelect(issue.id)}
    >
      <span
        className="ib-state"
        data-state={issue.state}
        aria-label={issue.state}
      >
        <Icon name={issue.state === "closed" ? "check" : "circle-dashed"} />
      </span>
      <span className="ib-row-copy">
        <span className="ib-row-title">{issue.title}</span>
        <span className="ib-row-meta">
          <span>
            #{issue.id} by {issue.author}
          </span>
          <Labels labels={issue.labels} />
        </span>
      </span>
      <span
        className="ib-row-count"
        aria-label={`${issue.comments.length} comments`}
      >
        <Icon name="chat" size="sm" />
        {issue.comments.length}
      </span>
      <span className="ib-row-age">{issue.age}</span>
    </button>
  );
}
export function IssueQueue({
  issues,
  selectedId,
  onSelect,
  loading = false,
  error,
  onRetry,
  filtered = false,
  onClear,
  footer,
}: {
  issues: Issue[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  filtered?: boolean;
  onClear?: () => void;
  footer?: ReactNode;
}) {
  return (
    <section className="ib-queue" aria-label="Issue list">
      {error ? (
        <AgentWorkspaceState
          error
          title="Issues could not be loaded"
          description={error}
          actionLabel="Try again"
          onAction={onRetry}
        />
      ) : (
        <SkeletonReveal
          loading={loading}
          hasData={issues.length > 0}
          animate={false}
          label="Loading issues"
          skeleton={
            <div className="ib-skeleton">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i}>
                  <i />
                  <span>
                    <i />
                    <i />
                  </span>
                </div>
              ))}
            </div>
          }
        >
          {issues.length ? (
            <div>
              {issues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  selected={selectedId === issue.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          ) : (
            <AgentWorkspaceState
              title={filtered ? "No matching issues" : "No issues here"}
              description={
                filtered
                  ? "Try another search or remove your label filter."
                  : "New issues will appear here when they are added."
              }
              actionLabel={filtered ? "Clear filters" : undefined}
              onAction={onClear}
            />
          )}
        </SkeletonReveal>
      )}
      {footer && <footer className="ib-queue-footer">{footer}</footer>}
    </section>
  );
}
/** Nonmodal reader. The host owns selection, navigation, per-issue drafts and persistence. */
export function IssueReader({
  issue,
  repository = "oreo / ui",
  draft,
  onDraftChange,
  onComment,
  onClose,
  actions,
}: {
  issue: Issue;
  repository?: string;
  draft: string;
  onDraftChange: (value: string) => void;
  onComment: () => void;
  onClose: () => void;
  actions?: ReactNode;
}) {
  const id = useId(),
    heading = useRef<HTMLHeadingElement>(null),
    scroll = useRef<HTMLDivElement>(null),
    [all, setAll] = useState(false);
  useEffect(() => {
    setAll(false);
    if (scroll.current) scroll.current.scrollTop = 0;
    if (window.matchMedia("(max-width: 850px)").matches)
      heading.current?.focus({ preventScroll: true });
  }, [issue.id]);
  const comments = all ? issue.comments : issue.comments.slice(-1);
  return (
    <section
      className="ib-reader"
      aria-labelledby={id}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !e.defaultPrevented) {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <header className="ib-reader-header">
        <span>
          <Icon name="github-logo" size="sm" />
          {repository} <b>#{issue.id}</b>
        </span>
        <div>
          {actions}
          <IconButton
            aria-label="Close issue details"
            title="Close issue details (Escape)"
            type="tertiary"
            size="sm"
            tapScale={1}
            icon={<Icon name="x" size="sm" />}
            onClick={onClose}
          />
        </div>
      </header>
      <div className="ib-reader-scroll" ref={scroll}>
        <h2 id={id} ref={heading} tabIndex={-1}>
          {issue.title}
        </h2>
        <p className="ib-byline">
          <span className="ib-status" data-state={issue.state}>
            <Icon
              name={issue.state === "open" ? "circle-dashed" : "check"}
              size="sm"
            />
            {issue.state === "open" ? "Open" : "Closed"}
          </span>
          <Avatar name={issue.author} size="xs" color="purple" />
          {issue.author}
        </p>
        <dl className="ib-properties">
          <div>
            <dt>Assignee</dt>
            <dd>{issue.assignee || "No one assigned"}</dd>
          </div>
          <div>
            <dt>Labels</dt>
            <dd>
              {issue.labels.length ? <Labels labels={issue.labels} /> : "None"}
            </dd>
          </div>
          <div>
            <dt>Milestone</dt>
            <dd>{issue.milestone || "No milestone"}</dd>
          </div>
          <div>
            <dt>Development</dt>
            <dd>{issue.development || "No linked pull request"}</dd>
          </div>
        </dl>
        <article className="ib-markdown" aria-label="Issue description">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {issue.description}
          </ReactMarkdown>
        </article>
        <section className="ib-comments" aria-label="Issue comments">
          <header>
            <h3>
              {all ? "Comments" : "Latest comment"}{" "}
              <span>{issue.comments.length}</span>
            </h3>
            {issue.comments.length > 1 && (
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                onClick={() => setAll(!all)}
              >
                {all ? "Show latest" : `All ${issue.comments.length} comments`}
              </Button>
            )}
          </header>
          {!comments.length ? (
            <p className="ib-muted">
              No comments yet. Start the discussion below.
            </p>
          ) : (
            comments.map((c) => (
              <article className="ib-comment" key={c.id}>
                <header>
                  <Avatar name={c.author} size="xs" color="mint" />
                  <b>{c.author}</b>
                  <span>{c.date}</span>
                </header>
                <p>{c.body}</p>
              </article>
            ))
          )}
        </section>
      </div>
      <form
        className="ib-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) onComment();
        }}
      >
        <label htmlFor={`${id}-comment`}>Reply to #{issue.id}</label>
        <div>
          <textarea
            id={`${id}-comment`}
            aria-label="Local comment"
            rows={2}
            maxLength={4000}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Leave a comment…"
          />
          <IconButton
            aria-label="Add local comment"
            title="Add local comment"
            size="sm"
            tapScale={1}
            disabled={!draft.trim()}
            icon={<Icon name="arrow-up" size="sm" />}
            onClick={(e) => e.currentTarget.form?.requestSubmit()}
          />
        </div>
        <small>Local sample · only visible in this tab</small>
      </form>
    </section>
  );
}
