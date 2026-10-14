import { useEffect, useRef, useState } from "react";
import {
  AudioClip,
  ChatBubble,
  CollaborationComposer,
  CollaboratorPresence,
  ProjectChannels,
  ProjectChatPanel,
  TypingPresence,
  type AudioSeek,
  type ChatDraft,
} from "@/components/project-chat";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { collaborators, songs } from "./data";

type SentMessage = { id: string; text: string; files: string[] };
function ChannelThread({
  songId,
  active,
}: {
  songId: string;
  active: boolean;
}) {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [seek, setSeek] = useState<AudioSeek>();
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length) end.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);
  const initial = songId === "on-my-mind";
  function send(draft: ChatDraft) {
    setMessages((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        text: draft.text,
        files: draft.files.map((f) => f.name),
      },
    ]);
  }
  return (
    <>
      <div className="space-y-4 p-4">
        {initial ? (
          <>
            <ChatBubble author={collaborators[1]} time="4:12 PM">
              New mix is up. Pulled the pads back on the drop so the bass has
              room.
            </ChatBubble>
            <div className="ml-9">
              <AudioClip
                src="/examples/music-workspace/mix-demo.wav"
                title="Mix v4"
                duration={238}
                seek={seek}
                active={active}
              />
            </div>
            <ChatBubble outgoing receipt="Seen" time="4:15 PM">
              Sounds huge. Can the kick hit a little harder at{" "}
              <button
                type="button"
                className="text-status-progress"
                aria-label="Seek Mix v4 to 1:24"
                onClick={() => setSeek({ seconds: 84, request: Date.now() })}
              >
                1:24
              </button>
              ?
            </ChatBubble>
            <TypingPresence person={collaborators[1]} />
          </>
        ) : (
          <div className="py-10 text-center">
            <Icon
              name="chat"
              className="mx-auto mb-3 size-6 text-text-tertiary"
            />
            <h3 className="text-sm font-medium">
              A space for {songs.find((s) => s.id === songId)?.name}
            </h3>
            <p className="mt-2 text-xs text-text-secondary">
              Share a thought or attach your latest mix.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <ChatBubble key={m.id} outgoing receipt="Saved locally">
            {m.text}
            {m.files.map((name, i) => (
              <p
                key={i}
                className="mt-1 flex items-center gap-1 text-xs text-text-secondary"
              >
                <Icon name="paperclip" className="size-3 shrink-0" />
                {name} · local attachment
              </p>
            ))}
          </ChatBubble>
        ))}
      </div>
      <div className="sticky bottom-0 bg-bg-base pt-2">
        <CollaborationComposer onSend={send} />
      </div>
      <div ref={end} />
    </>
  );
}

export function ProjectChatDemo({
  active,
  openRequest = 0,
  onActiveChange,
  onClose,
}: {
  active?: string;
  openRequest?: number;
  onActiveChange?: (id: string) => void;
  onClose?: () => void;
}) {
  const [localActive, setLocalActive] = useState("on-my-mind");
  const [read, setRead] = useState<string[]>(["on-my-mind"]);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const selected = active ?? localActive;
  const wrapper = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (openRequest) {
      setClosed(false);
      setMinimized(false);
    }
  }, [openRequest]);
  useEffect(() => {
    if (restoreFocus.current) {
      wrapper.current
        ?.querySelector<HTMLButtonElement>(
          closed || minimized ? "button" : "nav button[aria-current]",
        )
        ?.focus();
      restoreFocus.current = false;
    }
  }, [closed, minimized]);
  useEffect(() => {
    setRead((r) => (r.includes(selected) ? r : [...r, selected]));
  }, [selected]);
  function select(id: string) {
    setLocalActive(id);
    onActiveChange?.(id);
    setRead((r) => [...r, id]);
  }
  // Keep each channel mounted so both sent messages and unsent drafts survive switching.
  return (
    <div ref={wrapper} className="w-96 max-w-full">
      {closed || minimized ? (
        <div className="flex justify-end">
          <Button
            tapScale={1}
            leadingIcon={<Icon name="chat" />}
            onClick={() => {
              restoreFocus.current = true;
              setClosed(false);
              setMinimized(false);
            }}
          >
            {closed ? "Open project chat" : "Allagi, Sophia & Ravi"}
          </Button>
        </div>
      ) : null}
      <div hidden={closed || minimized}>
        <ProjectChatPanel
          className="music-chat"
          header={
            <CollaboratorPresence
              people={collaborators}
              title="Allagi, Sophia & Ravi"
            />
          }
          onMinimize={() => {
            restoreFocus.current = true;
            setMinimized(true);
          }}
          onClose={() => {
            restoreFocus.current = true;
            setClosed(true);
            onClose?.();
          }}
          channels={
            <ProjectChannels
              channels={songs.map((s) => ({
                ...s,
                unread: read.includes(s.id) ? 0 : s.unread,
              }))}
              value={selected}
              onChange={select}
            />
          }
          composer={null}
        >
          {songs.map((s) => (
            <div key={s.id} hidden={selected !== s.id}>
              <ChannelThread
                songId={s.id}
                active={selected === s.id && !closed && !minimized}
              />
            </div>
          ))}
        </ProjectChatPanel>
      </div>
    </div>
  );
}

export function ComposerFailureExample() {
  const [fail, setFail] = useState(true);
  const [sent, setSent] = useState(false);
  return (
    <div className="pc-panel rounded-card-medium border border-border-subtle pt-3">
      <CollaborationComposer
        onSend={() => {
          if (fail) throw new Error("Demo failure");
          setSent(true);
        }}
        note="Demo: try sending, then enable delivery and retry."
      />
      <div className="flex items-center justify-between p-3 pt-0">
        <Button
          size="sm"
          type="secondary"
          tapScale={1}
          onClick={() => setFail((v) => !v)}
        >
          {fail ? "Enable delivery" : "Simulate failure"}
        </Button>
        {sent && (
          <span role="status" className="text-xs text-status-success">
            Message sent locally
          </span>
        )}
        <IconButton
          type="tertiary"
          size="sm"
          aria-label="Reset delivery example"
          tapScale={1}
          icon={<Icon name="reset" />}
          onClick={() => {
            setFail(true);
            setSent(false);
          }}
        />
      </div>
    </div>
  );
}
