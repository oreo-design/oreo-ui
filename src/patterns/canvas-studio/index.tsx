import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import {
  CanvasToolbar,
  CanvasBlock,
  clampZoom,
  type CanvasBlockData,
  type CanvasBlockKind,
  type CanvasMode,
} from "@/components/canvas-toolbar";
import { AgentWorkspaceState } from "@/components/automation";
import "./canvas-studio.css";
const SAMPLE: CanvasBlockData[] = [
  {
    id: "idea",
    kind: "note",
    title: "A calmer kind of launch",
    body: "One useful idea. A clear story. A little room to explore.",
    x: 50,
    y: 70,
  },
  {
    id: "story",
    kind: "task",
    title: "Find the story",
    body: "Write the one sentence you want people to remember.",
    x: 370,
    y: 40,
  },
  {
    id: "reference",
    kind: "link",
    title: "A place for inspiration",
    body: "https://example.com",
    x: 690,
    y: 100,
  },
  {
    id: "details",
    kind: "note",
    title: "Make the details count",
    body: "Thoughtful interactions turn something useful into something loved.",
    x: 210,
    y: 320,
  },
  {
    id: "review",
    kind: "task",
    title: "Share a first draft",
    body: "Bring the team in early. Leave space for a better idea.",
    x: 550,
    y: 350,
  },
];
/** Find an unoccupied grid cell without moving the existing board. */
function nextPosition(blocks: CanvasBlockData[]) {
  for (let cell = 0; ; cell++) {
    const x = 50 + (cell % 3) * 320;
    const y = 50 + Math.floor(cell / 3) * 240;
    if (
      !blocks.some(
        (block) =>
          x < block.x + 272 &&
          x + 272 > block.x &&
          y < block.y + 208 &&
          y + 208 > block.y,
      )
    )
      return { x, y };
  }
}
type View = { x: number; y: number; zoom: number };
type Editor = {
  kind: CanvasBlockKind;
  id?: string;
  title: string;
  body: string;
  done: boolean;
};
export function CanvasStudio({
  dark,
  onToggleTheme,
}: {
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const [blocks, setBlocks] = useState<CanvasBlockData[]>(SAMPLE),
    [past, setPast] = useState<CanvasBlockData[][]>([]),
    [mode, setMode] = useState<CanvasMode>("select"),
    [selected, setSelected] = useState<string | null>(null),
    [view, setView] = useState<View>({ x: 80, y: 15, zoom: 95 }),
    [notice, setNotice] = useState(""),
    [panel, setPanel] = useState<"edit" | "ask" | "info" | null>(null),
    [editor, setEditor] = useState<Editor>({
      kind: "note",
      title: "",
      body: "",
      done: false,
    }),
    [error, setError] = useState("");
  const viewport = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    previousFocus = useRef<HTMLElement | null>(null),
    drag = useRef<{ id: number; x: number; y: number; start: View } | null>(
      null,
    ),
    currentBlocks = useRef(blocks);
  currentBlocks.current = blocks;
  const commit = (next: CanvasBlockData[]) => {
    setPast((items) => [...items, blocks].slice(-40));
    setBlocks(next);
    setNotice("");
  };
  const fit = (items = blocks) => {
    const el = viewport.current;
    if (!el) return;
    const left = Math.min(0, ...items.map((b) => b.x)),
      top = Math.min(0, ...items.map((b) => b.y)),
      right = Math.max(320, ...items.map((b) => b.x + 256)),
      bottom = Math.max(240, ...items.map((b) => b.y + 192));
    const zoom = clampZoom(
      Math.min(
        (el.clientWidth - 48) / (right - left),
        (el.clientHeight - 48) / (bottom - top),
        0.95,
      ) * 100,
    );
    setView({
      zoom,
      x:
        (el.clientWidth - ((right - left) * zoom) / 100) / 2 -
        (left * zoom) / 100,
      y:
        (el.clientHeight - ((bottom - top) * zoom) / 100) / 2 -
        (top * zoom) / 100,
    });
  };
  useEffect(() => {
    if (!viewport.current) return;
    const observer = new ResizeObserver(() => fit(currentBlocks.current));
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (panel && !dialog.current?.open) dialog.current?.showModal();
  }, [panel]);
  const zoomTo = (next: number) => {
    const el = viewport.current;
    if (!el) return;
    setView((old) => {
      const zoom = clampZoom(next),
        ratio = zoom / old.zoom;
      return {
        zoom,
        x: el.clientWidth / 2 - (el.clientWidth / 2 - old.x) * ratio,
        y: el.clientHeight / 2 - (el.clientHeight / 2 - old.y) * ratio,
      };
    });
  };
  const launch = (next: "edit" | "ask" | "info") => {
    previousFocus.current = document.activeElement as HTMLElement;
    setError("");
    setPanel(next);
  };
  const close = () => {
    dialog.current?.close();
    setPanel(null);
    requestAnimationFrame(() => {
      const old = previousFocus.current;
      if (old?.isConnected && !old.hasAttribute("disabled")) old.focus();
      else viewport.current?.focus();
    });
  };
  const add = (kind: CanvasBlockKind) => {
    setEditor({ kind, title: "", body: "", done: false });
    launch("edit");
  };
  const edit = (block: CanvasBlockData) => {
    setSelected(block.id);
    setEditor({
      kind: block.kind,
      id: block.id,
      title: block.title,
      body: block.body,
      done: !!block.done,
    });
    launch("edit");
  };
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editor.title.trim()) {
      setError("Give this block a title.");
      return;
    }
    if (editor.kind === "link") {
      try {
        const url = new URL(editor.body.trim());
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        setError("Enter a complete http:// or https:// link.");
        return;
      }
    }
    const next = editor.id
      ? blocks.map((b) =>
          b.id === editor.id
            ? {
                ...b,
                title: editor.title.trim(),
                body: editor.body.trim(),
                done: editor.done,
              }
            : b,
        )
      : [
          ...blocks,
          {
            id: crypto.randomUUID(),
            kind: editor.kind,
            title: editor.title.trim(),
            body: editor.body.trim(),
            done: editor.done,
            ...nextPosition(blocks),
          },
        ];
    commit(next);
    fit(next);
    setNotice(editor.id ? "Block updated." : "Block added.");
    close();
  };
  const organize = () => {
    const next = blocks.map((block, i) => ({
      ...block,
      x: 50 + (i % 3) * 320,
      y: 50 + Math.floor(i / 3) * 240,
    }));
    commit(next);
    fit(next);
    setNotice("Blocks arranged into a grid. Undo is available.");
  };
  const undo = () => {
    const next = past.at(-1);
    if (!next) return;
    setBlocks(next);
    setPast((items) => items.slice(0, -1));
    setSelected(null);
    fit(next);
    setNotice("Change undone.");
  };
  const startPan = (event: PointerEvent<HTMLDivElement>) => {
    if (
      mode !== "pan" ||
      event.button !== 0 ||
      drag.current ||
      (event.target instanceof Element &&
        event.target.closest("button,a,input,textarea"))
    )
      return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      start: view,
    };
  };
  const movePan = (event: PointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (!active || active.id !== event.pointerId) return;
    setView({
      ...active.start,
      x: active.start.x + event.clientX - active.x,
      y: active.start.y + event.clientY - active.y,
    });
  };
  const endPan = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === event.pointerId) drag.current = null;
  };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [40, 0],
      ArrowRight: [-40, 0],
      ArrowUp: [0, 40],
      ArrowDown: [0, -40],
    };
    if (deltas[event.key]) {
      event.preventDefault();
      const [x, y] = deltas[event.key];
      setView((old) => ({ ...old, x: old.x + x, y: old.y + y }));
    } else if (event.key === "Home") {
      event.preventDefault();
      fit();
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomTo(view.zoom + 10);
    } else if (event.key === "-") {
      event.preventDefault();
      zoomTo(view.zoom - 10);
    } else if (event.key.toLowerCase() === "h") setMode("pan");
    else if (event.key.toLowerCase() === "v") setMode("select");
  };
  const suggestion = () => {
    const next = [
      ...blocks,
      {
        id: crypto.randomUUID(),
        kind: "task" as const,
        title: "Make the next step small",
        body: "Choose one idea on this board and turn it into a 20-minute experiment.",
        ...nextPosition(blocks),
      },
    ];
    commit(next);
    fit(next);
    setNotice("Local suggestion added as a task.");
    close();
  };
  return (
    <div className="canvas-studio min-h-dvh bg-bg-elevated text-text-primary">
      <header className="canvas-studio-header">
        <a
          href="/canvas-toolbar?view=docs"
          className="flex items-center gap-3 font-semibold"
        >
          <span className="grid size-9 place-items-center rounded-control bg-bg-inverse text-text-on-inverse">
            <Icon name="columns" />
          </span>
          Oreo / Canvas Studio
        </a>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-text-tertiary sm:block">
            A local space for your ideas
          </span>
          <IconButton
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            type="tertiary"
            tapScale={1}
            onClick={onToggleTheme}
          />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-text-tertiary">
              THE EXPLORATION BOARD
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Good ideas need a little space.
            </h1>
            <p className="mt-3 text-sm text-text-secondary">
              Collect a thought. Connect the details. Find your next move.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="tertiary"
              tapScale={1}
              disabled={!past.length}
              onClick={undo}
              leadingIcon={<Icon name="reset" size="sm" />}
            >
              Undo
            </Button>
            <Button
              type="secondary"
              tapScale={1}
              onClick={() => {
                commit(SAMPLE);
                fit(SAMPLE);
                setSelected(null);
                setNotice("Sample restored. Undo is available.");
              }}
            >
              Reset sample
            </Button>
          </div>
        </div>
        <section aria-label="Idea board" className="canvas-board">
          <div className="canvas-board-bar">
            <span className="text-xs text-text-tertiary">
              LAUNCH NOTES / 001
            </span>
            <span className="text-xs text-text-secondary">
              {blocks.length} blocks
            </span>
          </div>
          <div className="canvas-tool-dock">
            <CanvasToolbar
              zoom={view.zoom}
              onZoomChange={zoomTo}
              mode={mode}
              onModeChange={(next) => {
                setMode(next);
                drag.current = null;
              }}
              onFit={() => fit()}
              onOrganize={blocks.length ? organize : undefined}
              onAsk={() => launch("ask")}
              onAdd={blocks.length < 12 ? add : undefined}
              onInfo={() => launch("info")}
            />
          </div>
          <div
            ref={viewport}
            role="region"
            aria-label="Canvas workspace"
            aria-describedby="canvas-help"
            tabIndex={0}
            className="canvas-viewport"
            data-mode={mode}
            onPointerDown={startPan}
            onPointerMove={movePan}
            onPointerUp={endPan}
            onPointerCancel={endPan}
            onLostPointerCapture={() => {
              drag.current = null;
            }}
            onKeyDown={keyboard}
          >
            {blocks.length ? (
              <div
                className="canvas-world"
                style={{
                  transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom / 100})`,
                }}
              >
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    style={{
                      position: "absolute",
                      left: block.x,
                      top: block.y,
                    }}
                  >
                    <CanvasBlock
                      block={block}
                      selected={selected === block.id}
                      disabled={mode === "pan"}
                      onSelect={() => edit(block)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <AgentWorkspaceState
                title="A little space for your next idea"
                description="Add a note, task or link to begin. Your previous changes are still available in Undo."
                actionLabel="Add a note"
                onAction={() => add("note")}
              />
            )}
          </div>
          <footer className="canvas-board-footer">
            <p id="canvas-help">
              {mode === "pan"
                ? "Drag the board to look around."
                : "Select a block to edit its details."}{" "}
              Focus the canvas for arrow keys, + / − and Home.
            </p>
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              onClick={() => fit()}
            >
              Fit all blocks
            </Button>
          </footer>
        </section>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 text-xs leading-5 text-text-secondary">
          <p role="status">
            {notice ||
              "Changes stay in this tab. Refresh starts a fresh board."}
          </p>
          <span>
            {blocks.length >= 12
              ? "Board limit reached (12 blocks). Remove a block to add another."
              : "Up to 12 blocks · Local sample"}
          </span>
        </div>
        <section aria-label="Board contents" className="mt-8">
          <h2 className="mb-3 text-sm font-medium">On this board</h2>
          <p className="mb-4 text-xs text-text-secondary">
            Every block is also available here, at every zoom level.
          </p>
          <div className="flex flex-wrap gap-2">
            {blocks.map((block) => (
              <Button
                key={block.id}
                className="canvas-content-link"
                type="secondary"
                tapScale={1}
                onClick={() => edit(block)}
              >
                {block.title}
              </Button>
            ))}
          </div>
        </section>
      </main>
      {panel && (
        <dialog
          ref={dialog}
          className="canvas-dialog"
          aria-labelledby="canvas-dialog-title"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <header className="mb-6 flex items-center justify-between gap-4">
            <h2 id="canvas-dialog-title" className="text-xl font-semibold">
              {panel === "edit"
                ? editor.id
                  ? "Edit block"
                  : `Add a ${editor.kind}`
                : panel === "ask"
                  ? "A little help with your board"
                  : "Your canvas, at a glance"}
            </h2>
            <IconButton
              aria-label="Close dialog"
              type="tertiary"
              tapScale={1}
              icon={<Icon name="x" />}
              onClick={close}
            />
          </header>
          {panel === "edit" ? (
            <form onSubmit={save} noValidate>
              <label className="canvas-field">
                Title
                <input
                  autoFocus
                  value={editor.title}
                  maxLength={80}
                  onChange={(event) =>
                    setEditor({ ...editor, title: event.target.value })
                  }
                />
              </label>
              <label className="canvas-field mt-4">
                {editor.kind === "link" ? "Destination URL" : "Details"}
                <textarea
                  rows={4}
                  value={editor.body}
                  maxLength={800}
                  onChange={(event) =>
                    setEditor({ ...editor, body: event.target.value })
                  }
                />
              </label>
              {editor.kind === "task" && (
                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editor.done}
                    onChange={(event) =>
                      setEditor({ ...editor, done: event.target.checked })
                    }
                  />
                  Mark complete
                </label>
              )}
              {editor.kind === "link" &&
                editor.id &&
                /^https?:\/\//i.test(editor.body) && (
                  <a
                    className="mt-3 inline-block text-sm underline"
                    href={editor.body}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open link ↗
                  </a>
                )}
              {error && (
                <p role="alert" className="mt-4 text-sm text-status-error">
                  {error}
                </p>
              )}
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                {editor.id && (
                  <Button
                    danger
                    type="tertiary"
                    tapScale={1}
                    onClick={() => {
                      const next = blocks.filter((b) => b.id !== editor.id);
                      commit(next);
                      setSelected(null);
                      fit(next);
                      setNotice("Block removed. Undo is available.");
                      close();
                    }}
                  >
                    Remove block
                  </Button>
                )}
                <Button type="secondary" tapScale={1} onClick={close}>
                  Cancel
                </Button>
                <Button tapScale={1} render={<button type="submit" />}>
                  Save block
                </Button>
              </div>
            </form>
          ) : panel === "ask" ? (
            <>
              <p className="mb-5 text-sm leading-6 text-text-secondary">
                A local suggestion for your next step. This demo does not
                connect to an AI service or send your board anywhere.
              </p>
              <div className="rounded-card-medium border border-border-subtle bg-bg-elevated p-5">
                <Icon name="sparkle" className="mb-4 text-palette-mint-text" />
                <h3 className="font-medium">Make the next step small</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Choose one idea on this board and turn it into a 20-minute
                  experiment.
                </p>
              </div>
              <Button
                className="mt-6"
                tapScale={1}
                disabled={blocks.length >= 12}
                onClick={suggestion}
              >
                Add suggestion as task
              </Button>
              {blocks.length >= 12 && (
                <p className="mt-3 text-sm text-text-secondary">
                  Remove a block first; this board holds up to 12.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-sm leading-6 text-text-secondary">
                Use Drag mode to pan, Cursor mode to edit, and Organize blocks
                to tidy the board. Zoom keeps the center in view. Fit all blocks
                brings everything back.
              </p>
              <dl className="my-6 grid grid-cols-2 gap-3 text-sm">
                <dt>Pan</dt>
                <dd>Arrow keys</dd>
                <dt>Zoom</dt>
                <dd>+ / −</dd>
                <dt>Fit</dt>
                <dd>Home</dd>
                <dt>Drag / Cursor mode</dt>
                <dd>H / V</dd>
              </dl>
              <p className="text-xs leading-6 text-text-secondary">
                Shortcuts work while the canvas itself is focused. Edits are
                local to this tab. Undo restores additions, edits, removals and
                layout changes. No automatic save, collaboration or AI execution
                is included.
              </p>
            </>
          )}
        </dialog>
      )}
    </div>
  );
}
