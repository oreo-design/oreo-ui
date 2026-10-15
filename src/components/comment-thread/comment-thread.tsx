import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Avatar, AvatarGroup, type AvatarColor } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import "./comment-thread.css";

export type CommentAuthor = {
  id: string;
  name: string;
  avatar?: string;
  color?: AvatarColor;
};
export type ThreadComment = {
  id: string;
  author: CommentAuthor;
  body: string;
  time: string;
};
export type CommentThreadData = {
  id: string;
  comments: ThreadComment[];
  resolutionId?: string;
  resolved: boolean;
};

/** The same compact author line is used for questions, replies and resolutions. */
export function CommentItem({
  comment,
  badge,
  actions,
}: {
  comment: ThreadComment;
  badge?: string;
  actions?: ReactNode;
}) {
  return (
    <article
      className="ct-comment px-5 py-4"
      aria-label={`Comment by ${comment.author.name}`}
    >
      <header className="flex min-h-7 items-center gap-2 text-xs">
        <Avatar
          name={comment.author.name}
          src={comment.author.avatar}
          color={comment.author.color}
          size="xs"
        />
        <span className="min-w-0 font-medium">{comment.author.name}</span>
        <span className="shrink-0 text-text-tertiary">{comment.time}</span>
        {badge && (
          <span className="ct-status min-w-0 font-medium">{badge}</span>
        )}
        {actions && <div className="ml-auto shrink-0">{actions}</div>}
      </header>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
        {comment.body}
      </p>
    </article>
  );
}

export function CommentSummary({
  comments,
  resolved = false,
  expanded,
  ...props
}: {
  comments: ThreadComment[];
  resolved?: boolean;
  expanded: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "children" | "aria-expanded">) {
  const people = [
    ...new Map(comments.map((c) => [c.author.id, c.author])).values(),
  ];
  const names = people
    .slice(0, 2)
    .map((p) => p.name.split(" ")[0])
    .join(" and ");
  return (
    <button
      {...props}
      type="button"
      aria-expanded={expanded}
      className={cn(
        "ct-summary flex w-full items-center gap-3 border-y border-border-subtle bg-state-hover px-5 py-3 text-left text-xs text-text-secondary hover:bg-state-press",
        props.className,
      )}
    >
      {expanded ? (
        <Icon name="chevron-up" size="sm" />
      ) : (
        <AvatarGroup size="xs" aria-hidden>
          {people.slice(0, 3).map((p) => (
            <Avatar
              key={p.id}
              name={p.name}
              src={p.avatar}
              color={p.color}
              size="xs"
            />
          ))}
        </AvatarGroup>
      )}
      <span className="min-w-0 flex-1 leading-5">
        {expanded ? (
          "Collapse discussion"
        ) : (
          <>
            {comments.length} {resolved ? "resolved " : ""}
            {comments.length === 1 ? "comment" : "comments"}
            {names && ` from ${names}`}
            {people.length > 2 && `, +${people.length - 2}`}
          </>
        )}
      </span>
      {!expanded && <Icon name="chevron-down" size="sm" />}
    </button>
  );
}

/** Reject onSend to retain the draft. A ref guards rapid duplicate submissions. */
export function CommentComposer({
  onSend,
  placeholder = "Reply…",
  disabled = false,
}: {
  onSend: (text: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const running = useRef(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const errorId = useId();
  async function send() {
    const text = draft.trim();
    if (!text || running.current || disabled) return;
    running.current = true;
    setPending(true);
    setError(false);
    try {
      await onSend(text);
      setDraft("");
    } catch {
      setError(true);
    } finally {
      running.current = false;
      setPending(false);
      input.current?.focus();
    }
  }
  return (
    <form
      className="border-t border-border-subtle px-5 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
      aria-label="Reply to thread"
    >
      <div className="flex items-end gap-3">
        <textarea
          ref={input}
          aria-label="Reply"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error || undefined}
          placeholder={placeholder}
          rows={1}
          maxLength={4000}
          value={draft}
          readOnly={pending}
          disabled={disabled}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              void send();
            }
          }}
          className="ct-input max-h-36 min-h-8 w-full resize-y bg-transparent py-1.5 text-sm leading-5 outline-none placeholder:text-text-placeholder disabled:opacity-50"
        />
        <IconButton
          aria-label={
            pending ? "Sending reply" : error ? "Retry reply" : "Send reply"
          }
          type="secondary"
          size="sm"
          tapScale={1}
          disabled={disabled || pending || !draft.trim()}
          onClick={() => void send()}
          icon={
            <Icon
              name={pending ? "clock-history" : error ? "refresh" : "arrow-up"}
            />
          }
        />
      </div>
      {pending && (
        <p className="mt-2 text-xs text-text-secondary" role="status">
          Sending reply…
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-xs text-status-error">
          Couldn’t send. Your draft is safe. Try again.
        </p>
      )}
    </form>
  );
}

export type CommentThreadProps = {
  thread: CommentThreadData;
  /** Controlled data. IDs must be unique; the first comment is the question. */
  onChange: (thread: CommentThreadData) => void;
  onReply?: (text: string) => void | Promise<void>;
  onDeleteComment?: (id: string) => void;
  currentUserId?: string;
  defaultExpanded?: boolean;
  className?: string;
};

export function CommentThread({
  thread,
  onChange,
  onReply,
  onDeleteComment,
  currentUserId,
  defaultExpanded,
  className,
}: CommentThreadProps) {
  const [expanded, setExpanded] = useState(
    defaultExpanded ?? (!thread.resolutionId && !thread.resolved),
  );
  const [keyboard, setKeyboard] = useState(false);
  const [notice, setNotice] = useState("");
  const [menuDark, setMenuDark] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const focusAfterChange = useRef(false);
  const reduce = useReducedMotion();
  const historyId = useId();
  const [question, ...replies] = thread.comments;
  const resolution = replies.find((c) => c.id === thread.resolutionId);
  const hiddenReplies =
    !thread.resolved && resolution
      ? replies.filter((c) => c.id !== resolution.id)
      : replies;
  const showSummary = hiddenReplies.length > 0;
  const showResolution = !!resolution && !thread.resolved && !expanded;
  const move = !reduce && !keyboard;

  useLayoutEffect(() => {
    if (focusAfterChange.current) {
      root.current?.focus({ preventScroll: true });
      focusAfterChange.current = false;
    }
  }, [thread.resolved, thread.resolutionId, expanded]);

  function update(next: CommentThreadData, message: string) {
    focusAfterChange.current = true;
    onChange(next);
    setNotice(message);
  }
  function resolve() {
    setExpanded(false);
    update(
      { ...thread, resolved: !thread.resolved },
      thread.resolved
        ? "Thread reopened."
        : "Thread resolved. Discussion is still available.",
    );
  }
  function mark(comment: ThreadComment) {
    const removing = resolution?.id === comment.id;
    setExpanded(removing);
    update(
      { ...thread, resolutionId: removing ? undefined : comment.id },
      removing
        ? "Resolution removed."
        : "Resolution marked. Earlier comments collapsed.",
    );
  }
  async function copy(comment: ThreadComment) {
    try {
      await navigator.clipboard.writeText(
        `${comment.author.name}: ${comment.body}`,
      );
      setNotice("Comment copied for your agent.");
    } catch {
      setNotice("Couldn’t copy. Select the comment text and copy it manually.");
    }
  }
  const actions = (comment: ThreadComment, isQuestion = false) => (
    <Menu
      modal={false}
      onOpenChange={(open) => {
        if (open) setMenuDark(Boolean(root.current?.closest(".theme-dark")));
      }}
    >
      <MenuTrigger
        render={
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={
              isQuestion
                ? "Thread actions"
                : `Actions for ${comment.author.name}'s comment`
            }
            icon={<Icon name="ellipsis" />}
          />
        }
      />
      <MenuPopup
        align="end"
        className={cn(
          "ct-menu",
          menuDark && "theme-dark",
          keyboard && "ct-no-motion",
        )}
      >
        {isQuestion ? (
          <MenuItem
            icon={<Icon name={thread.resolved ? "reset" : "chat-check"} />}
            onClick={resolve}
          >
            {thread.resolved ? "Reopen thread" : "Resolve thread"}
          </MenuItem>
        ) : (
          <MenuItem
            disabled={thread.resolved}
            icon={<Icon name="checks" />}
            onClick={() => mark(comment)}
          >
            {resolution?.id === comment.id
              ? "Remove resolution"
              : "Mark resolution"}
          </MenuItem>
        )}
        <MenuItem
          icon={<Icon name="copy" />}
          onClick={() => void copy(comment)}
        >
          Copy for agent
        </MenuItem>
        {!isQuestion &&
          comment.author.id === currentUserId &&
          onDeleteComment && (
            <MenuItem
              className="text-status-error"
              icon={<Icon name="trash" />}
              onClick={() => {
                onDeleteComment(comment.id);
                root.current?.focus();
              }}
            >
              Delete comment
            </MenuItem>
          )}
      </MenuPopup>
    </Menu>
  );

  if (!question)
    return (
      <div className="rounded-card-medium border border-border-subtle bg-bg-surface p-8 text-center">
        <Icon name="chat" className="mx-auto text-text-secondary" />
        <p className="mt-3 text-sm font-medium">Start a discussion</p>
        <p className="mt-1 text-xs text-text-secondary">
          Ask a question to give your team a place to reply.
        </p>
        {onReply && (
          <div className="mt-5 text-left">
            <CommentComposer onSend={onReply} placeholder="Ask a question…" />
          </div>
        )}
      </div>
    );

  return (
    <div
      ref={root}
      tabIndex={-1}
      role="region"
      aria-label="Comment thread"
      data-resolved={thread.resolved}
      data-keyboard={keyboard}
      onPointerDownCapture={() => setKeyboard(false)}
      onKeyDownCapture={() => setKeyboard(true)}
      className={cn(
        "ct-thread overflow-hidden rounded-card-medium border border-border-subtle bg-bg-surface text-text-primary shadow-(--shadow-default) outline-none",
        className,
      )}
    >
      <CommentItem
        comment={question}
        badge={thread.resolved ? "Resolved thread" : undefined}
        actions={actions(question, true)}
      />
      {showSummary && (
        <CommentSummary
          comments={hiddenReplies}
          resolved={thread.resolved}
          expanded={expanded}
          aria-controls={historyId}
          onClick={() => setExpanded((v) => !v)}
        />
      )}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={historyId}
            key="discussion"
            initial={{ height: move ? 0 : "auto", opacity: move ? 0 : 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: move ? 0 : "auto", opacity: move ? 0 : 1 }}
            transition={{ duration: move ? 0.2 : 0, ease: easeOut }}
            className="overflow-hidden"
          >
            {replies.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                badge={resolution?.id === comment.id ? "Resolution" : undefined}
                actions={actions(comment)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {showResolution && (
        <CommentItem
          comment={resolution}
          badge="Resolution"
          actions={actions(resolution)}
        />
      )}
      {onReply && (
        <div hidden={thread.resolved && !expanded}>
          <CommentComposer
            onSend={async (text) => {
              await onReply(text);
              setExpanded(true);
            }}
            placeholder={thread.resolved ? "Reply to reopen…" : "Reply…"}
          />
        </div>
      )}
      {thread.resolved && (
        <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-5 py-2.5 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Icon name="check" size="sm" /> All caught up
          </span>
          <Button size="sm" type="tertiary" tapScale={1} onClick={resolve}>
            Reopen thread
          </Button>
        </div>
      )}
      <span role="status" className="sr-only">
        {notice}
      </span>
    </div>
  );
}
