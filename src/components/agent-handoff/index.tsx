import { useId, useRef, useState, type ReactNode } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { CommentItem, type ThreadComment } from "@/components/comment-thread";
import { AgentResultCard, AgentWorkspaceState } from "@/components/automation";
import { ThinkingState } from "@/components/thinking-state";
import {
  HANDOFF_LABELS,
  mentionAt,
  removeMention,
  type HandoffStatus,
} from "./model";
import "./handoff.css";
export * from "./model";
export type HandoffAgent = {
  id: string;
  name: string;
  description: string;
  available: boolean;
};
export function AgentMentionComposer({
  agents,
  agentId,
  onAgentChange,
  onSend,
  disabled = false,
}: {
  agents: HandoffAgent[];
  agentId: string;
  onAgentChange: (id: string) => void;
  onSend: (body: string, agentId: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const id = useId(),
    input = useRef<HTMLTextAreaElement>(null),
    guard = useRef(false);
  const [text, setText] = useState(""),
    [caret, setCaret] = useState(0),
    [picker, setPicker] = useState(false),
    [dismissed, setDismissed] = useState(false),
    [active, setActive] = useState(0),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const range = mentionAt(text, caret),
    open = !disabled && !pending && !dismissed && (picker || !!range),
    query = picker ? "" : (range?.query ?? ""),
    matches = agents.filter((a) =>
      a.name.toLowerCase().includes(query.toLowerCase()),
    ),
    selected = agents.find((a) => a.id === agentId),
    index = Math.min(active, Math.max(0, matches.length - 1));
  function choose(agent: HandoffAgent) {
    if (!agent.available) return;
    onAgentChange(agent.id);
    if (range) {
      setText(removeMention(text, range));
      setCaret(range.start);
    }
    setPicker(false);
    setDismissed(true);
    setError("");
    requestAnimationFrame(() => {
      input.current?.focus();
      if (range) input.current?.setSelectionRange(range.start, range.start);
    });
  }
  async function send() {
    if (guard.current || disabled) return;
    const body = text.trim();
    if (!body || body.length > 2000) {
      setError("Write a comment of 1–2,000 characters.");
      return;
    }
    if (agentId && !selected?.available) {
      setError(
        "This agent is unavailable. Choose another agent or remove the mention.",
      );
      return;
    }
    guard.current = true;
    setPending(true);
    setError("");
    try {
      await onSend(body, agentId);
      setText("");
      setCaret(0);
      setPicker(false);
      setDismissed(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not send. Your draft is preserved.",
      );
    } finally {
      guard.current = false;
      setPending(false);
      input.current?.focus();
    }
  }
  return (
    <form
      className="ah-composer"
      aria-label="Comment or delegate"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setDismissed(true);
          setPicker(false);
        }
      }}
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
    >
      <div className="ah-composer-input">
        {selected && (
          <span className="ah-mention-chip">
            <Icon name="assistant" size="sm" />@{selected.name}
            <IconButton
              icon={<Icon name="x" />}
              type="tertiary"
              size="sm"
              tapScale={1}
              aria-label="Remove agent mention"
              disabled={disabled || pending}
              onClick={() => {
                onAgentChange("");
                input.current?.focus();
              }}
            />
          </span>
        )}
        <textarea
          ref={input}
          aria-label="Work item comment"
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          aria-invalid={!!error || undefined}
          aria-controls={open ? `${id}-list` : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            open && matches[index] ? `${id}-${matches[index].id}` : undefined
          }
          value={text}
          maxLength={2000}
          rows={3}
          disabled={disabled}
          readOnly={pending}
          placeholder="Add a comment, or type @ to hand work to an agent…"
          onChange={(e) => {
            setText(e.target.value);
            setCaret(e.target.selectionStart);
            setDismissed(false);
            setActive(0);
            setError("");
          }}
          onSelect={(e) => setCaret(e.currentTarget.selectionStart)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (open && ["ArrowDown", "ArrowUp"].includes(e.key)) {
              e.preventDefault();
              setActive(
                (index +
                  (e.key === "ArrowDown" ? 1 : -1) +
                  Math.max(1, matches.length)) %
                  Math.max(1, matches.length),
              );
            } else if (open && e.key === "Escape") {
              e.preventDefault();
              setDismissed(true);
              setPicker(false);
            } else if (open && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (matches[index]) choose(matches[index]);
            } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void send();
            }
          }}
        />
      </div>
      {open && (
        <div className="ah-agent-picker">
          <span>Agents {query && `· ${query}`}</span>
          <div role="listbox" id={`${id}-list`} aria-label="Mention an agent">
            {matches.map((a, i) => (
              <div
                key={a.id}
                id={`${id}-${a.id}`}
                role="option"
                aria-selected={index === i}
                aria-disabled={!a.available}
                className="ah-agent-option"
                onMouseDown={(e) => e.preventDefault()}
                onMouseMove={() => setActive(i)}
                onClick={() => choose(a)}
              >
                <Avatar name={a.name} size="sm" />
                <span>
                  <strong>{a.name}</strong>
                  <small>{a.description}</small>
                </span>
                <Tag>{a.available ? "Agent" : "Unavailable"}</Tag>
              </div>
            ))}
          </div>
          {!matches.length && (
            <p role="status">No matching agents. Try another name.</p>
          )}
        </div>
      )}
      <footer>
        <Button
          type="tertiary"
          size="sm"
          tapScale={1}
          leadingIcon={<Icon name="at" size="sm" />}
          disabled={disabled || pending}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          onClick={() => {
            setPicker(!open);
            setDismissed(open);
            setActive(0);
            input.current?.focus();
          }}
        >
          Mention agent
        </Button>
        <span id={`${id}-hint`}>⌘ / Ctrl + Enter</span>
        <Button
          size="sm"
          tapScale={1}
          disabled={disabled || pending || !text.trim()}
          render={<button type="submit" />}
        >
          {pending ? "Sending…" : agentId ? "Delegate" : "Comment"}
        </Button>
      </footer>
      {error && (
        <p className="ah-input-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
export function AgentSessionCard({
  agent,
  status,
  messages,
  reply,
  result,
  resultTitle = "Execution result",
  resultIcon = "folder",
  onStop,
  onRetry,
  loading = false,
}: {
  agent: string;
  status: HandoffStatus;
  messages: ThreadComment[];
  reply?: ReactNode;
  result?: ReactNode;
  resultTitle?: string;
  resultIcon?: IconName;
  onStop?: () => void;
  onRetry?: () => void;
  loading?: boolean;
}) {
  const working = status === "analyzing" || status === "implementing";
  const tone =
    status === "completed"
      ? "mint"
      : status === "awaiting"
        ? "blue"
        : status === "failed"
          ? "orange"
          : "default";
  return (
    <section className="ah-session" aria-label={`${agent} execution session`}>
      <header>
        <span>
          <Icon name="assistant" size="sm" />
          Session with <strong>{agent}</strong>
        </span>
        <span role="status">
          <Tag color={tone}>{HANDOFF_LABELS[status]}</Tag>
        </span>
        {onStop &&
          ["analyzing", "awaiting", "implementing", "review"].includes(
            status,
          ) && (
            <Button type="tertiary" size="sm" tapScale={1} onClick={onStop}>
              Stop session
            </Button>
          )}
      </header>
      <div className="ah-session-body" aria-busy={loading}>
        {loading ? (
          <div
            className="ah-session-skeleton"
            role="status"
            aria-label="Loading session"
          >
            <i />
            <span />
            <span />
          </div>
        ) : (
          <>
            {messages.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            {working && (
              <div className="ah-working" role="status">
                <ThinkingState
                  phase={status === "analyzing" ? "analyzing" : "building"}
                  label={
                    status === "analyzing"
                      ? "Reading the work item"
                      : "Preparing the sample patch"
                  }
                  tone="neutral"
                  announce={false}
                />
                <p>
                  {status === "analyzing"
                    ? "Checking the description, constraints and surrounding context."
                    : "Using the supplied context and constraints."}
                </p>
              </div>
            )}
            {status === "idle" && (
              <AgentWorkspaceState
                title="No execution yet"
                description="Mention an agent in a comment to start a scoped session."
              />
            )}
            {status === "awaiting" && (
              <p className="ah-awaiting" role="status">
                Your input is needed before work can continue.
              </p>
            )}
            {(status === "failed" || status === "stopped") && (
              <AgentWorkspaceState
                error={status === "failed"}
                title={
                  status === "failed"
                    ? "Context could not be loaded"
                    : "Session stopped"
                }
                description="Your request and conversation are preserved. Continue when you’re ready."
                actionLabel={onRetry ? "Retry session" : undefined}
                onAction={onRetry}
              />
            )}{" "}
            {(status === "review" || status === "completed") && result && (
              <div className="ah-result">
                <AgentResultCard
                  title={resultTitle}
                  status={status === "completed" ? "reviewed" : "ready"}
                  icon={resultIcon}
                  defaultOpen
                >
                  {result}
                </AgentResultCard>
              </div>
            )}
            {reply}
          </>
        )}
      </div>
    </section>
  );
}
