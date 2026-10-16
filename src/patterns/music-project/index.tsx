import { useEffect, useRef, useState } from "react";
import { Tabs } from "@base-ui-components/react/tabs";
import { Avatar } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import {
  AnnotatedWaveform,
  ProductionTaskList,
  MixVersionList,
  clampTime,
  trackTime,
  taskDone,
  toggleTask,
  validComment,
  type MixVersion,
  type MixComment,
  type ProductionTask,
} from "@/components/music-project";
import { MIX_COMMENTS, MIX_SAMPLES, MIX_TASKS, MIX_VERSIONS } from "./data";
import "./music-project.css";
export function MusicProjectPage() {
  const [dark, setDark] = useState(true),
    [favorite, setFavorite] = useState(true),
    [versions, setVersions] = useState(MIX_VERSIONS),
    [selected, setSelected] = useState("v4"),
    [comments, setComments] = useState(MIX_COMMENTS),
    [tasks, setTasks] = useState(MIX_TASKS),
    [undo, setUndo] = useState<ProductionTask[] | null>(null),
    [tab, setTab] = useState("tasks"),
    [position, setPosition] = useState(84),
    [playing, setPlaying] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [testError, setTestError] = useState(false),
    [draft, setDraft] = useState(""),
    [anchor, setAnchor] = useState(84),
    [selectedComment, setSelectedComment] = useState(""),
    [feedback, setFeedback] = useState(""),
    [commentError, setCommentError] = useState(""),
    [taskTitle, setTaskTitle] = useState(""),
    [uploading, setUploading] = useState(false);
  const audio = useRef<HTMLAudioElement>(null),
    file = useRef<HTMLInputElement>(null),
    composer = useRef<HTMLTextAreaElement>(null),
    pendingSeek = useRef(84),
    urls = useRef<string[]>([]),
    uploadToken = useRef(0),
    drafts = useRef<Record<string, { text: string; at: number }>>({});
  const version = versions.find((v) => v.id === selected)!,
    activeComments = comments.filter((c) => c.versionId === selected),
    completed = tasks.filter(taskDone).length;
  useEffect(() => {
    const pause = () => {
      if (document.hidden) audio.current?.pause();
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      document.removeEventListener("visibilitychange", pause);
      uploadToken.current++;
      urls.current.forEach(URL.revokeObjectURL);
    };
  }, []);
  function choose(id: string, at = 0) {
    if (id === selected) {
      seek(at);
      return;
    }
    drafts.current[selected] = { text: draft, at: anchor };
    audio.current?.pause();
    pendingSeek.current = at;
    setSelected(id);
    setPosition(at);
    setAnchor(drafts.current[id]?.at ?? at);
    setReady(false);
    setFailed(false);
    setTestError(false);
    setSelectedComment("");
    setDraft(drafts.current[id]?.text ?? "");
    setCommentError("");
  }
  function seek(at: number) {
    const t = clampTime(at, version.duration);
    pendingSeek.current = t;
    if (audio.current && ready) audio.current.currentTime = t;
    setPosition(t);
    if (!draft.trim()) setAnchor(t);
  }
  async function togglePlay() {
    const el = audio.current;
    if (!el || !ready) return;
    if (!el.paused) el.pause();
    else {
      try {
        await el.play();
      } catch {
        if (el !== audio.current) return;
        setFailed(true);
        setPlaying(false);
      }
    }
  }
  function retry() {
    setFailed(false);
    setReady(false);
    if (testError) setTestError(false);
    else audio.current?.load();
  }
  function sendComment() {
    if (!validComment(draft, anchor, version.duration)) {
      setCommentError(
        "Write a comment of 1–2,000 characters at a valid track position.",
      );
      return;
    }
    const c: MixComment = {
      id: crypto.randomUUID(),
      versionId: selected,
      author: "Allagi",
      seconds: Math.floor(anchor),
      text: draft.trim(),
      resolved: false,
    };
    setComments((s) => [...s, c]);
    delete drafts.current[selected];
    setSelectedComment(c.id);
    setDraft("");
    setCommentError("");
    setFeedback(
      `Comment saved locally on ${version.title} at ${trackTime(anchor)}.`,
    );
    setTab("comments");
  }
  async function replaceTrack(f: File | undefined) {
    if (!f) return;
    file.current!.value = "";
    if (
      f.size > 25 * 1024 * 1024 ||
      !(
        f.type.startsWith("audio/") || /\.(wav|mp3|m4a|ogg|flac)$/i.test(f.name)
      )
    ) {
      setFeedback(
        "Choose an audio file up to 25 MB. The current mix is unchanged.",
      );
      return;
    }
    const token = ++uploadToken.current;
    setUploading(true);
    const url = URL.createObjectURL(f);
    try {
      const d = await new Promise<number>((resolve, reject) => {
        const probe = new Audio();
        const cleanup = () => {
          clearTimeout(timer);
          probe.onloadedmetadata = null;
          probe.onerror = null;
          probe.removeAttribute("src");
          probe.load();
        };
        const timer = setTimeout(() => {
          cleanup();
          reject(new Error("timeout"));
        }, 10000);
        probe.onloadedmetadata = () => {
          const value = probe.duration;
          cleanup();
          Number.isFinite(value) && value > 0
            ? resolve(value)
            : reject(new Error("duration"));
        };
        probe.onerror = () => {
          cleanup();
          reject(new Error("audio"));
        };
        probe.preload = "metadata";
        probe.src = url;
      });
      if (token !== uploadToken.current) {
        URL.revokeObjectURL(url);
        return;
      }
      urls.current.push(url);
      const id = crypto.randomUUID();
      const v: MixVersion = {
        id,
        title: `Mix v${versions.length + 1}`,
        author: "Allagi",
        date: "Just added",
        src: url,
        duration: d,
        note: f.name,
      };
      setVersions((s) => [v, ...s]);
      choose(id);
      setFeedback(
        "Audio added as a new local version. Previous mixes and comments are preserved.",
      );
    } catch {
      URL.revokeObjectURL(url);
      if (token === uploadToken.current)
        setFeedback(
          "This audio file could not be read. Try another file; the current mix is unchanged.",
        );
    } finally {
      if (token === uploadToken.current) setUploading(false);
    }
  }
  function addTask() {
    if (!taskTitle.trim()) return;
    setUndo(tasks);
    setTasks((s) => [
      ...s,
      {
        id: crypto.randomUUID(),
        title: taskTitle.trim(),
        done: false,
        assignee: "Allagi",
        due: "No date",
      },
    ]);
    setTaskTitle("");
    setFeedback("Task added locally.");
  }
  function exportProject() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            project: "On My Mind",
            localOnly: true,
            selectedVersion: selected,
            positionSeconds: position,
            versions: versions.map(({ src, ...v }) => ({
              ...v,
              source: src.startsWith("blob:")
                ? "local file; not included"
                : src,
            })),
            comments,
            tasks,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "on-my-mind-project.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setFeedback(
      "Project notes exported. Uploaded audio files are not included.",
    );
  }
  return (
    <div className={`music-project-page ${dark ? "theme-dark" : ""}`}>
      <aside className="mp-sidebar">
        <a href="/music-workspace" className="mp-workspace">
          <Avatar name="Allagi" size="sm" color="blue" />
          <strong>Allagi</strong>
          <span>⌄</span>
        </a>
        <nav aria-label="Music workspace">
          <a href="/studio-inbox">
            <Icon name="chat" /> Inbox
          </a>
          <a href="/music-workspace">
            <Icon name="folder" /> Projects
          </a>
          <a href="/music-project" aria-current="page">
            <span aria-hidden>♫</span> On My Mind
          </a>
        </nav>
        <div className="mp-sidebar-bottom">
          <a href="/annotated-waveform">Explore components ↗</a>
          <p>
            Local workspace
            <br />
            Changes reset on reload.
          </p>
        </div>
      </aside>
      <div className="mp-main">
        <header className="mp-topbar">
          <a href="/music-workspace">
            <Icon name="folder" size="sm" /> Projects
          </a>
          <Icon name="chevron-right" size="sm" />
          <span>On My Mind</span>
          <div className="mp-top-actions">
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark(!dark)}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              onClick={exportProject}
            >
              Export project
            </Button>
          </div>
        </header>
        <main className="mp-content">
          <div className="mp-heading">
            <a href="/music-workspace" aria-label="Back to projects">
              <Icon name="chevron-left" />
            </a>
            <h1>On My Mind</h1>
            <span>128 BPM · A minor</span>
            <button
              className="mp-favorite"
              type="button"
              aria-label="Favorite project"
              aria-pressed={favorite}
              onClick={() => setFavorite(!favorite)}
            >
              {favorite ? "★" : "☆"}
            </button>
            <Button
              type="secondary"
              tapScale={1}
              className="mp-replace"
              disabled={uploading}
              onClick={() => file.current?.click()}
            >
              {uploading ? "Reading audio…" : "Replace track"}
            </Button>
            <input
              ref={file}
              type="file"
              accept="audio/*,.wav,.mp3,.m4a,.ogg,.flac"
              aria-label="Replace track file"
              hidden
              onChange={(e) => void replaceTrack(e.target.files?.[0])}
            />
          </div>
          <section className="mp-player" aria-label="Project audio player">
            <audio
              key={`${selected}-${testError}`}
              ref={audio}
              src={
                testError
                  ? "/examples/music-project-unavailable.wav"
                  : version.src
              }
              preload="metadata"
              onLoadedMetadata={() => {
                const d = audio.current?.duration;
                if (d && Number.isFinite(d)) {
                  setVersions((s) =>
                    s.map((v) =>
                      v.id === selected ? { ...v, duration: d } : v,
                    ),
                  );
                  const t = clampTime(pendingSeek.current, d);
                  audio.current!.currentTime = t;
                  setPosition(t);
                  setAnchor((a) => clampTime(a, d));
                  setReady(true);
                  setFailed(false);
                }
              }}
              onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onError={() => {
                setFailed(true);
                setReady(false);
                setPlaying(false);
              }}
            />
            <div className="mp-player-heading">
              <IconButton
                className="mp-play"
                tapScale={1}
                aria-label={`${playing ? "Pause" : "Play"} ${version.title}`}
                disabled={!ready || failed}
                onClick={() => void togglePlay()}
                icon={<span aria-hidden>{playing ? "Ⅱ" : "▶"}</span>}
              />
              <div>
                <h2>{version.title}</h2>
                <p>
                  Uploaded by {version.author} · {version.date}
                </p>
              </div>
              <span>
                {trackTime(position)} / {trackTime(version.duration)}
              </span>
            </div>
            {failed ? (
              <AgentWorkspaceState
                error
                title="Audio unavailable"
                description="Your notes are safe. Retry the source or replace the track."
                actionLabel="Retry audio"
                onAction={retry}
              />
            ) : (
              <>
                <AnnotatedWaveform
                  samples={MIX_SAMPLES}
                  position={position}
                  duration={version.duration}
                  comments={activeComments}
                  selectedId={selectedComment}
                  onSeek={ready ? seek : undefined}
                  onComment={(id) => {
                    const c = activeComments.find((c) => c.id === id)!;
                    seek(c.seconds);
                    setSelectedComment(c.id);
                    setTab("comments");
                  }}
                />
                {!ready && (
                  <p role="status" className="mp-audio-status">
                    Reading audio metadata…
                  </p>
                )}
              </>
            )}
            <form
              className="mp-comment-composer"
              onSubmit={(e) => {
                e.preventDefault();
                sendComment();
              }}
            >
              <textarea
                ref={composer}
                aria-label="Comment on this mix"
                placeholder="Leave a comment…"
                maxLength={2000}
                rows={2}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setCommentError("");
                }}
              />
              <div>
                <button
                  type="button"
                  className="mp-anchor"
                  onClick={() => {
                    setAnchor(Math.floor(position));
                    composer.current?.focus();
                  }}
                  aria-label="Use current playback time for comment"
                >
                  Comment at <strong>{trackTime(anchor)}</strong>
                </button>
                <Button
                  tapScale={1}
                  disabled={!draft.trim()}
                  onClick={sendComment}
                >
                  Send
                </Button>
              </div>
              {commentError && <p role="alert">{commentError}</p>}
            </form>
          </section>
          <p className="mp-demo-note">
            {version.src.startsWith("blob:")
              ? "Local audio file"
              : "Synthesized demo audio · all sample versions share one recording"}{" "}
            · illustrative waveform.
          </p>
          <Tabs.Root
            value={tab}
            onValueChange={(v) => setTab(String(v))}
            className="mp-tabs"
          >
            <Tabs.List aria-label="Project sections" className="mp-tab-list">
              {[
                ["tasks", "Tasks", tasks.length],
                ["comments", "Comments", activeComments.length],
                ["versions", "Versions", versions.length],
                ["files", "Files", versions.length],
              ].map(([id, label, count]) => (
                <Tabs.Tab key={id} value={id}>
                  {label}
                  <span>{count}</span>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Tabs.Panel value="tasks">
              <div className="mp-panel-toolbar">
                <span>
                  {completed} of {tasks.length} tasks complete
                </span>
                {undo && (
                  <Button
                    size="sm"
                    type="tertiary"
                    tapScale={1}
                    onClick={() => {
                      setTasks(undo);
                      setUndo(null);
                      setFeedback("Last task change undone.");
                    }}
                  >
                    Undo task change
                  </Button>
                )}
              </div>
              <div className="mp-task-card">
                <ProductionTaskList
                  tasks={tasks}
                  onToggle={(id, done) => {
                    setUndo(tasks);
                    setTasks(toggleTask(tasks, id, done));
                  }}
                  onSeek={(at, id) => {
                    choose(id ?? selected, at);
                    setFeedback(`Track positioned at ${trackTime(at)}.`);
                  }}
                />
              </div>
              <form
                className="mp-add-task"
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask();
                }}
              >
                <input
                  aria-label="New production task"
                  maxLength={200}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Add a production task…"
                />
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  disabled={!taskTitle.trim()}
                  onClick={addTask}
                >
                  Add task
                </Button>
              </form>
            </Tabs.Panel>
            <Tabs.Panel value="comments">
              <div className="mp-panel-toolbar">
                <span>
                  {version.title} ·{" "}
                  {activeComments.filter((c) => !c.resolved).length} open
                  comments
                </span>
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={() => composer.current?.focus()}
                >
                  Write a comment
                </Button>
              </div>
              {activeComments.length ? (
                <div className="mp-comments">
                  {activeComments.map((c) => (
                    <article
                      key={c.id}
                      className="mp-comment"
                      data-selected={selectedComment === c.id}
                    >
                      <Avatar name={c.author} size="sm" color="blue" />
                      <div>
                        <header>
                          <strong>{c.author}</strong>
                          <button
                            className="mp-time-link"
                            onClick={() => {
                              seek(c.seconds);
                              setSelectedComment(c.id);
                            }}
                          >
                            {trackTime(c.seconds)}
                          </button>
                          {c.resolved && <span>Resolved</span>}
                        </header>
                        <p>{c.text}</p>
                        <Button
                          type="tertiary"
                          size="sm"
                          tapScale={1}
                          onClick={() =>
                            setComments((s) =>
                              s.map((x) =>
                                x.id === c.id
                                  ? { ...x, resolved: !x.resolved }
                                  : x,
                              ),
                            )
                          }
                        >
                          {c.resolved ? "Reopen comment" : "Resolve comment"}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <AgentWorkspaceState
                  title="No comments on this mix"
                  description="Choose a moment in the track and leave the first note."
                  actionLabel="Write a comment"
                  onAction={() => composer.current?.focus()}
                />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="versions">
              <div className="mp-panel-toolbar">
                <span>Choose a mix to review its own comments.</span>
              </div>
              <MixVersionList
                versions={versions}
                value={selected}
                onChange={(id) => choose(id)}
              />
            </Tabs.Panel>
            <Tabs.Panel value="files">
              <div className="mp-panel-toolbar">
                <span>Audio available in this local session</span>
              </div>
              <div className="mp-files">
                {versions.map((v) => (
                  <div key={v.id}>
                    <Icon name="paperclip" />
                    <span>
                      <strong>{v.title}</strong>
                      <small>
                        {v.src.startsWith("blob:")
                          ? v.note
                          : "Synthesized demo · WAV"}
                      </small>
                    </span>
                    <a
                      href={v.src}
                      download={`${v.title.toLowerCase().replaceAll(" ", "-")}${v.src.startsWith("blob:") ? "" : ".wav"}`}
                    >
                      Download ↗
                    </a>
                  </div>
                ))}
              </div>
            </Tabs.Panel>
          </Tabs.Root>
          <p className="mp-feedback" role="status">
            {feedback}
          </p>
          <footer className="mp-footer">
            <a
              href="https://x.com/designflyio/status/2110867727741341732"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Brad / Designfly ↗
            </a>
            <button
              onClick={() => {
                audio.current?.pause();
                setTestError(true);
                setFailed(false);
                setReady(false);
              }}
            >
              Test audio recovery
            </button>
            <span>Local only · no upload or messages sent.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
