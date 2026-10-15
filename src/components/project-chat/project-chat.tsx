import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Message, MessageContent } from "@/components/message";
import { PresenceBadge } from "@/components/presence";
import { cn } from "@/lib/cn";
import "./project-chat.css";

export type Collaborator = {
  id: string;
  name: string;
  src?: string;
  online?: boolean;
};
export type ProjectChannel = { id: string; name: string; unread?: number };
export function CollaboratorPresence({
  people,
  title,
}: {
  people: Collaborator[];
  title?: string;
}) {
  const online = people.filter((p) => p.online).length;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <AvatarGroup size="xs" max={3}>
        {people.map((p) => (
          <Avatar
            key={p.id}
            name={p.name}
            src={p.src}
            size="xs"
            color="brown"
          />
        ))}
      </AvatarGroup>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold">
          {title ?? people.map((p) => p.name).join(", ")}
        </h2>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
          <span
            className={cn(
              "size-1.5 rounded-full",
              online ? "bg-status-success" : "bg-text-disabled",
            )}
          />
          {online ? `${online} online now` : "Everyone is offline"}
        </p>
      </div>
    </div>
  );
}

export function ProjectChannels({
  channels,
  value,
  onChange,
}: {
  channels: ProjectChannel[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Project conversations"
      className="pc-channels flex gap-1.5 overflow-x-auto border-y border-border-subtle p-3"
    >
      {channels.map((c) => (
        <button
          type="button"
          key={c.id}
          aria-current={value === c.id ? "true" : undefined}
          onClick={() => onChange(c.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-capsule px-3 py-2 text-sm font-medium",
            value === c.id
              ? "bg-bg-inverse text-text-on-inverse"
              : "bg-bg-elevated text-text-secondary",
          )}
        >
          <span>{c.name}</span>
          {!!c.unread && (
            <span
              className="grid min-w-4 place-items-center rounded-full bg-status-progress px-1 text-xs text-white"
              aria-label={`${c.unread} unread`}
            >
              {c.unread}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

export function ChatBubble({
  author,
  time,
  outgoing = false,
  receipt,
  children,
}: {
  author?: Collaborator;
  time?: string;
  outgoing?: boolean;
  receipt?: string;
  children: ReactNode;
}) {
  return (
    <Message
      role={outgoing ? "user" : "assistant"}
      variant="flat"
      avatar={
        !outgoing && author ? (
          <Avatar name={author.name} src={author.src} size="xs" color="brown" />
        ) : undefined
      }
      className="pc-message"
    >
      <div
        className={cn(
          "flex max-w-full flex-col gap-1.5",
          outgoing && "items-end",
        )}
      >
        {!outgoing && author && (
          <p className="text-xs text-text-tertiary">
            {author.name}
            {time && ` · ${time}`}
          </p>
        )}
        <MessageContent
          className={cn(
            "pc-bubble rounded-card-medium px-3.5 py-2.5 text-sm leading-6",
            outgoing
              ? "bg-bg-elevated rounded-tr-control"
              : "border border-border-subtle rounded-tl-control",
          )}
        >
          {children}
        </MessageContent>
        {receipt && (
          <p className="text-xs text-text-tertiary">
            {receipt}
            {time && ` · ${time}`}
          </p>
        )}
      </div>
    </Message>
  );
}

export const audioTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
export type AudioSeek = { seconds: number; request: number };
export function AudioClip({
  src,
  title,
  duration: suppliedDuration,
  seek,
  active = true,
}: {
  src: string;
  title: string;
  duration: number;
  seek?: AudioSeek;
  active?: boolean;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(suppliedDuration);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (seek && audio.current) {
      audio.current.currentTime = Math.max(0, Math.min(duration, seek.seconds));
      setPosition(audio.current.currentTime);
    }
  }, [seek, duration]);
  useEffect(() => {
    setPosition(0);
    setPlaying(false);
    setFailed(false);
    setDuration(suppliedDuration);
  }, [src, suppliedDuration]);
  useEffect(() => {
    if (!active) audio.current?.pause();
  }, [active]);
  async function toggle() {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else {
      try {
        await audio.current.play();
      } catch {
        setFailed(true);
      }
    }
  }
  return (
    <div className="pc-audio rounded-card-small border border-border-subtle p-2.5">
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onLoadedMetadata={() => {
          const d = audio.current?.duration;
          if (d && Number.isFinite(d)) setDuration(d);
        }}
        onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setFailed(true);
          setPlaying(false);
        }}
      />
      <div className="flex items-center gap-2.5">
        <IconButton
          aria-label={
            failed ? `Retry ${title}` : `${playing ? "Pause" : "Play"} ${title}`
          }
          size="sm"
          tapScale={1}
          onClick={() => {
            if (failed) {
              setFailed(false);
              audio.current?.load();
            }
            void toggle();
          }}
          icon={
            <span aria-hidden className="text-xs">
              {failed ? "↻" : playing ? "Ⅱ" : "▶"}
            </span>
          }
        />
        <div className="relative min-w-0 flex-1">
          <div className="flex h-7 items-center gap-0.5" aria-hidden>
            {Array.from({ length: 34 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "min-w-0 flex-1 rounded-full",
                  i / 34 < position / duration
                    ? "bg-status-progress"
                    : "bg-border-default",
                )}
                style={{ height: `${22 + ((i * 17 + 7) % 70)}%` }}
              />
            ))}
          </div>
          <input
            aria-label={`Seek ${title}`}
            type="range"
            min={0}
            max={duration || 1}
            step={1}
            value={position}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (audio.current) audio.current.currentTime = value;
              setPosition(value);
            }}
            className="pc-seek absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <div className="shrink-0 text-sm">
          <p className="font-medium">{title}</p>
          <p className="text-xs text-text-tertiary tabular-nums">
            {audioTime(position || duration)}
          </p>
        </div>
      </div>
      {failed && (
        <p role="alert" className="mt-2 text-xs text-status-error">
          Audio unavailable. Check the file and retry.
        </p>
      )}
    </div>
  );
}

/** Single-person callers keep the original static row; multi-person use is opt-in. */
export function TypingPresence({ person, people, animate = false }: { person?: Collaborator; people?: Collaborator[]; animate?: boolean }) {
  const active = people ?? (person ? [person] : []);
  const names = active.map(p => p.name);
  const label = names.length === 1 ? `${names[0]} is typing…` : names.length === 2 ? `${names.join(" and ")} are typing…` : `${names[0]} and ${names.length - 1} others are typing…`;
  return active.length ? <div role="status" className="flex items-center gap-3 text-xs text-text-tertiary">
    {active.length === 1 ? <Avatar name={active[0].name} src={active[0].src} size="xs" color="brown" /> : <AvatarGroup size="xs" max={2}>{active.map(p => <Avatar key={p.id} name={p.name} src={p.src} size="xs" color="brown" />)}</AvatarGroup>}
    <span>{label}</span>
    {animate && <PresenceBadge status="typing" decorative />}
  </div> : null;
}

export type ChatDraft = { text: string; files: File[] };
export function CollaborationComposer({
  onSend,
  note = "Only collaborators on this song can see this chat",
}: {
  onSend: (draft: ChatDraft) => void | Promise<void>;
  note?: string;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const id = useId();
  async function send() {
    if (sending || (!text.trim() && !files.length)) return;
    setSending(true);
    setError("");
    try {
      await onSend({ text: text.trim(), files });
      setText("");
      setFiles([]);
      if (fileInput.current) fileInput.current.value = "";
    } catch {
      setError("Message wasn’t sent. Your draft is saved here. Try again.");
    } finally {
      setSending(false);
    }
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
      className="p-3 pt-0"
    >
      {files.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex min-w-0 items-center gap-1 rounded-control bg-bg-elevated px-2 py-1 text-xs"
            >
              <span className="max-w-40 truncate">{f.name}</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() =>
                  setFiles((list) => list.filter((_, n) => n !== i))
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-end gap-2 rounded-card-medium border border-border-subtle bg-bg-base p-2 shadow-default">
        <input
          ref={fileInput}
          type="file"
          multiple
          className="hidden"
          disabled={sending}
          onChange={(e) => {
            setFiles(Array.from(e.target.files ?? []));
            setError("");
          }}
        />
        <IconButton
          type="tertiary"
          tapScale={1}
          aria-label="Attach files"
          disabled={sending}
          icon={<Icon name="paperclip" />}
          onClick={() => fileInput.current?.click()}
        />
        <textarea
          aria-label="Message collaborators"
          aria-describedby={error ? id : undefined}
          placeholder="Message collaborators…"
          rows={1}
          maxLength={4000}
          value={text}
          disabled={sending}
          onChange={(e) => setText(e.target.value)}
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
          className="max-h-28 min-h-8 min-w-0 flex-1 resize-y bg-transparent py-1 text-sm outline-none placeholder:text-text-placeholder"
        />
        <IconButton
          aria-label={sending ? "Sending message" : "Send message"}
          disabled={sending || (!text.trim() && !files.length)}
          tapScale={1}
          icon={<Icon name="arrow-up" />}
          onClick={() => void send()}
        />
      </div>
      {error && (
        <p id={id} role="alert" className="mt-2 text-xs text-status-error">
          {error}
        </p>
      )}
      <p className="mt-2.5 text-center text-xs leading-5 text-text-tertiary">
        {note}
      </p>
    </form>
  );
}

export function ProjectChatPanel({
  header,
  channels,
  children,
  composer,
  onMinimize,
  onClose,
  className,
}: {
  header: ReactNode;
  channels: ReactNode;
  children: ReactNode;
  composer: ReactNode;
  onMinimize?: () => void;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <section
      aria-label="Project chat"
      className={cn(
        "pc-panel flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border-subtle bg-bg-base text-text-primary shadow-panel",
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 p-4">
        {header}
        <div className="flex shrink-0">
          {onMinimize && (
            <IconButton
              tapScale={1}
              type="tertiary"
              size="sm"
              aria-label="Minimize chat"
              icon={<span aria-hidden>−</span>}
              onClick={onMinimize}
            />
          )}
          {onClose && (
            <IconButton
              tapScale={1}
              type="tertiary"
              size="sm"
              aria-label="Close chat"
              icon={<Icon name="x" />}
              onClick={onClose}
            />
          )}
        </div>
      </header>
      {channels}
      <div
        className="pc-transcript min-h-0 flex-1 overflow-y-auto p-4"
        role="log"
        aria-label="Project messages"
        aria-live="polite"
      >
        {children}
      </div>
      {composer}
    </section>
  );
}
