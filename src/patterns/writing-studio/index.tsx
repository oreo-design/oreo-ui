import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import {
  TextToolbar,
  DEFAULT_TEXT_FORMAT,
  textFormatStyle,
  type TextFormat,
  type TextTransform,
} from "@/components/text-toolbar";
import { cn } from "@/lib/cn";
import "./writing-studio.css";
type Block = {
  id: string;
  label: string;
  text: string;
  format: TextFormat;
  href: string;
};
const INITIAL_BLOCKS: Block[] = [
  {
    id: "opening",
    label: "Opening",
    text: "There is a moment in every good idea when the noise falls away. The page is still open, the coffee is getting cold, and one sentence finally sounds like you.",
    format: { ...DEFAULT_TEXT_FORMAT, font: "sans", size: 20, align: "left" },
    href: "",
  },
  {
    id: "quote",
    label: "Pull quote",
    text: "Make a little room for a big idea.",
    format: { ...DEFAULT_TEXT_FORMAT },
    href: "",
  },
  {
    id: "closing",
    label: "Closing",
    text: "Keep the words that matter. Give them a little space. The rest can wait until tomorrow.",
    format: { ...DEFAULT_TEXT_FORMAT, font: "sans", size: 20, align: "left" },
    href: "",
  },
];
export function WritingStudio({
  dark,
  onToggleTheme,
}: {
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [selected, setSelected] = useState("quote");
  const [past, setPast] = useState<Block[][]>([]);
  const [future, setFuture] = useState<Block[][]>([]);
  const [notice, setNotice] = useState("");
  const [dialog, setDialog] = useState<"link" | "mention" | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const block = blocks.find((item) => item.id === selected)!;
  const commit = (next: Block[]) => {
    setPast((items) => [...items, blocks].slice(-60));
    setBlocks(next);
    setFuture([]);
    setNotice("");
  };
  const update = (patch: Partial<Block>) =>
    commit(
      blocks.map((item) =>
        item.id === selected ? { ...item, ...patch } : item,
      ),
    );
  const undo = () => {
    const previous = past.at(-1);
    if (!previous) return;
    setFuture((items) => [blocks, ...items]);
    setBlocks(previous);
    setPast((items) => items.slice(0, -1));
    setNotice("Change undone.");
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setPast((items) => [...items, blocks]);
    setBlocks(next);
    setFuture((items) => items.slice(1));
    setNotice("Change restored.");
  };
  const launch = (kind: "link" | "mention") => {
    previousFocus.current = document.activeElement as HTMLElement;
    setUrl(block.href);
    setError("");
    setDialog(kind);
  };
  const close = () => {
    modal.current?.close();
    setDialog(null);
    requestAnimationFrame(() => {
      if (previousFocus.current?.isConnected) previousFocus.current.focus();
      else panel.current?.focus();
    });
  };
  useEffect(() => {
    if (dialog && !modal.current?.open) modal.current?.showModal();
  }, [dialog]);
  const saveLink = (event: FormEvent) => {
    event.preventDefault();
    try {
      const parsed = new URL(url.trim());
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error();
      update({ href: parsed.href });
      setNotice("Link added to this text block.");
      close();
    } catch {
      setError("Enter a complete http:// or https:// link.");
    }
  };
  const transform = (action: TextTransform) => {
    const text =
      action === "uppercase"
        ? block.text.toLocaleUpperCase()
        : action === "sentence"
          ? block.text
              .trim()
              .toLocaleLowerCase()
              .replace(/^\p{L}/u, (char) => char.toLocaleUpperCase())
          : block.text.replace(/\s+/g, " ").trim();
    if (text.length > 2000) {
      setNotice(
        "This change would exceed 2000 characters. Shorten the block first.",
      );
      return;
    }
    update({ text });
    setNotice(
      action === "sentence"
        ? "Sentence case applied."
        : action === "uppercase"
          ? "Text converted to uppercase."
          : "Extra spaces removed.",
    );
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        blocks.map((item) => item.text).join("\n\n"),
      );
      setNotice("Document text copied.");
    } catch {
      setNotice(
        "Copy is unavailable. Select and copy the text in the editor below.",
      );
    }
  };
  return (
    <div className="writing-studio min-h-dvh bg-bg-elevated text-text-primary">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-border-subtle px-5 py-5">
        <a
          href="/text-toolbar?view=docs"
          className="flex items-center gap-3 text-sm font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-control bg-bg-inverse text-text-on-inverse">
            <Icon name="pencil" size="sm" />
          </span>
          Oreo / Writing Studio
        </a>
        <div className="flex items-center gap-2">
          <IconButton
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title="Change theme"
            type="tertiary"
            tapScale={1}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={onToggleTheme}
          />
          <Button
            type="secondary"
            tapScale={1}
            leadingIcon={<Icon name="copy" size="sm" />}
            onClick={copy}
          >
            Copy text
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-text-tertiary">
              A quieter place to create
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              A little room for ideas
            </h1>
            <p className="mt-3 text-sm text-text-secondary">
              Choose a text block. Make every word feel like yours.
            </p>
          </div>
          <div className="flex items-center gap-2">
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
              type="tertiary"
              tapScale={1}
              disabled={!future.length}
              onClick={redo}
            >
              Redo
            </Button>
            <Button
              type="secondary"
              tapScale={1}
              onClick={() => {
                commit(INITIAL_BLOCKS);
                setSelected("quote");
                setNotice("Sample restored. You can undo this.");
              }}
            >
              Reset sample
            </Button>
          </div>
        </div>
        <div className="writing-layout">
          <section className="writing-paper" aria-label="Document canvas">
            <div className="mb-7 flex items-center justify-between text-xs text-text-tertiary">
              <span>FIELD NOTES / 001</span>
              <span>
                {
                  blocks
                    .map((item) => item.text)
                    .join(" ")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length
                }{" "}
                words
              </span>
            </div>
            <div ref={panel} tabIndex={-1} className="writing-toolbar-host">
              <TextToolbar
                value={block.format}
                onValueChange={(format) => update({ format })}
                linked={!!block.href}
                onLink={() => launch("link")}
                onMention={() => launch("mention")}
                onTransform={transform}
              />
              <p className="mt-4 text-center text-xs text-text-tertiary">
                Formatting: {block.label.toLowerCase()}
              </p>
            </div>
            <div className="mt-8 space-y-5">
              {blocks.map((item) => (
                <div key={item.id}>
                  <button
                    type="button"
                    className={cn(
                      "writing-block",
                      selected === item.id && "is-selected",
                    )}
                    aria-label={`Select ${item.label.toLowerCase()} text`}
                    aria-pressed={selected === item.id}
                    onClick={() => {
                      setSelected(item.id);
                      setNotice("");
                    }}
                  >
                    <span
                      className="writing-block-text"
                      style={textFormatStyle(item.format)}
                    >
                      {item.text || (
                        <span className="text-text-tertiary">
                          Start writing…
                        </span>
                      )}
                    </span>
                    {selected === item.id && (
                      <>
                        <span
                          className="selection-handle selection-handle-start"
                          aria-hidden
                        />
                        <span
                          className="selection-handle selection-handle-end"
                          aria-hidden
                        />
                      </>
                    )}
                  </button>
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-text-secondary underline underline-offset-4"
                    >
                      Open {item.label.toLowerCase()} link
                      <Icon name="arrow-up-right" size="sm" />
                    </a>
                  )}
                </div>
              ))}
            </div>
            <footer className="mt-12 border-t border-border-subtle pt-5 text-xs text-text-tertiary">
              A work in progress, and that’s a good thing.
            </footer>
          </section>
          <aside className="writing-inspector" aria-label="Text block editor">
            <p className="mb-5 text-xs font-medium uppercase tracking-widest text-text-tertiary">
              Make it yours
            </p>
            <div
              className="mb-6 flex flex-wrap gap-2"
              role="group"
              aria-label="Choose text block"
            >
              {blocks.map((item) => (
                <Button
                  key={item.id}
                  type={selected === item.id ? "primary" : "secondary"}
                  tapScale={1}
                  size="sm"
                  aria-pressed={selected === item.id}
                  onClick={() => {
                    setSelected(item.id);
                    setNotice("");
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <label className="block text-sm font-medium" htmlFor="writing-text">
              Edit {block.label.toLowerCase()}
            </label>
            <textarea
              id="writing-text"
              className="writing-textarea mt-3"
              value={block.text}
              maxLength={2000}
              rows={7}
              onChange={(event) => update({ text: event.target.value })}
            />
            <div className="mt-2 flex justify-between text-xs text-text-tertiary">
              <span>Plain text</span>
              <span>{block.text.length} / 2000</span>
            </div>
            <p
              role="status"
              className="mt-5 min-h-10 text-sm leading-6 text-text-secondary"
            >
              {notice ||
                "Changes stay in this tab. Refresh starts a fresh draft."}
            </p>
            <div className="mt-6 border-t border-border-subtle pt-5">
              <p className="text-sm font-medium">One block, one style</p>
              <p className="mt-2 text-xs leading-6 text-text-secondary">
                Controls format the whole selected block. Use the editor above
                to change its words. Mentions are plain text; text actions run
                locally.
              </p>
            </div>
            <a
              href="/text-toolbar?view=docs"
              className="mt-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:underline"
            >
              Explore the components
              <Icon name="arrow-up-right" size="sm" />
            </a>
          </aside>
        </div>
      </main>
      {dialog && (
        <dialog
          ref={modal}
          className="writing-dialog"
          aria-labelledby="writing-dialog-title"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <header className="mb-5 flex items-center justify-between gap-4">
            <h2 id="writing-dialog-title" className="text-lg font-semibold">
              {dialog === "link" ? "Link this text block" : "Insert a mention"}
            </h2>
            <IconButton
              aria-label="Close dialog"
              type="tertiary"
              tapScale={1}
              icon={<Icon name="x" />}
              onClick={close}
            />
          </header>
          {dialog === "link" ? (
            <form onSubmit={saveLink} noValidate>
              <label className="text-sm">
                Destination URL
                <input
                  autoFocus
                  className="writing-input mt-2"
                  type="url"
                  value={url}
                  placeholder="https://example.com"
                  onChange={(event) => setUrl(event.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="mt-3 text-sm text-status-error">
                  {error}
                </p>
              )}
              <p className="mt-3 text-xs leading-5 text-text-secondary">
                Only http and https links are accepted. Links open separately
                from the canvas.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                {block.href && (
                  <Button
                    danger
                    type="tertiary"
                    tapScale={1}
                    onClick={() => {
                      update({ href: "" });
                      setNotice("Link removed.");
                      close();
                    }}
                  >
                    Remove link
                  </Button>
                )}
                <Button type="secondary" tapScale={1} onClick={close}>
                  Cancel
                </Button>
                <Button tapScale={1} render={<button type="submit" />}>
                  Save link
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p className="mb-5 text-sm leading-6 text-text-secondary">
                Add a name to the end of this block. No notification is sent.
              </p>
              {error && (
                <p role="alert" className="mb-4 text-sm text-status-error">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                {["Mina", "Alex", "Jordan"].map((name) => (
                  <Button
                    key={name}
                    type="secondary"
                    tapScale={1}
                    className="w-full justify-start"
                    leadingIcon={<Icon name="at" size="sm" />}
                    onClick={() => {
                      const text =
                        `${block.text.trimEnd()} @${name}`.trimStart();
                      if (text.length > 2000) {
                        setError(
                          "Make room for this mention: each block can contain up to 2000 characters.",
                        );
                        return;
                      }
                      update({ text });
                      setNotice(`@${name} inserted as plain text.`);
                      close();
                    }}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </>
          )}
        </dialog>
      )}
    </div>
  );
}
