import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Response } from "@/components/response";
import {
  ToggleComposer,
  EMPTY_COMPOSER,
  type ComposerMode,
  type ComposerValue,
} from "@/components/toggle-composer";
import "./composer-studio.css";
type Draft = {
  id: number;
  mode: ComposerMode;
  value: ComposerValue;
  image: string | null;
};
const sample: ComposerValue = {
  quick:
    "Good ideas need a little room to grow.\n\nMake something small. Make it thoughtful.",
  headline: "A little room to think",
  intro: "Notes on making space for the ideas that matter.",
  body: "## Start with a small observation\n\nThe best details often begin with a question: **how could this feel better?**\n\n- Leave room to explore\n- Make every action clear\n- Keep the useful things close",
};
export function ComposerStudio({
  dark,
  onToggleTheme,
}: {
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const [mode, setMode] = useState<ComposerMode>("quick"),
    [value, setValue] = useState(sample),
    [frosted, setFrosted] = useState(true);
  const [image, setImage] = useState<string | null>(null),
    [drafts, setDrafts] = useState<Draft[]>([]),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const file = useRef<HTMLInputElement>(null),
    urls = useRef<string[]>([]),
    nextId = useRef(1);
  useEffect(
    () => () => {
      urls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );
  const update = (next: ComposerValue) => {
    setValue(next);
    setError("");
    setNotice("");
  };
  const selectMode = (next: ComposerMode) => {
    setMode(next);
    setError("");
    setNotice("");
  };
  function save() {
    if (
      !(mode === "quick"
        ? value.quick.trim()
        : value.headline.trim() && value.body.trim())
    ) {
      setError(
        mode === "quick"
          ? "Write a message before saving."
          : "Add a headline and body before saving.",
      );
      return;
    }
    const id = nextId.current++;
    setDrafts((current) => [
      { id, mode, value: { ...value }, image },
      ...current,
    ]);
    setError("");
    setNotice("Draft saved for this session.");
  }
  return (
    <main className="composer-studio">
      <header className="composer-studio-header">
        <a href="/toggle-composer" className="font-semibold">
          Oreo UI{" "}
          <span className="ml-2 font-normal text-text-tertiary">
            / Composer Studio
          </span>
        </a>
        <IconButton
          type="secondary"
          tapScale={1}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          icon={<Icon name={dark ? "sun" : "moon"} />}
          onClick={onToggleTheme}
        />
      </header>
      <section className="composer-studio-heading">
        <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
          A place for your next thought
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Small thought. Long story.
        </h1>
        <p className="mt-4 text-text-secondary">
          Two ways to write, one quiet space to make it yours.
        </p>
      </section>
      <div className="composer-studio-grid">
        <section aria-labelledby="compose-title" className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="compose-title" className="font-medium">
              Compose
            </h2>
            <div className="flex gap-2">
              <Button
                type="tertiary"
                tapScale={1}
                aria-pressed={!frosted}
                onClick={() => setFrosted(false)}
              >
                Solid
              </Button>
              <Button
                type="tertiary"
                tapScale={1}
                aria-pressed={frosted}
                onClick={() => setFrosted(true)}
              >
                Frosted
              </Button>
            </div>
          </div>
          <div className="composer-stage" data-frosted={frosted}>
            <ToggleComposer
              mode={mode}
              onModeChange={selectMode}
              value={value}
              onValueChange={update}
              surface={frosted ? "frosted" : "solid"}
              onSubmit={save}
              onAttach={() => file.current?.click()}
              error={error}
              attachment={
                image && (
                  <div className="relative m-3">
                    <img
                      src={image}
                      alt="Attached draft image"
                      className="max-h-40 w-full rounded-control object-cover"
                    />
                    <IconButton
                      type="secondary"
                      tapScale={1}
                      className="absolute right-2 top-2"
                      aria-label="Remove image"
                      icon={<Icon name="x" />}
                      onClick={() => {
                        setImage(null);
                        setNotice("");
                      }}
                    />
                  </div>
                )
              }
            />
          </div>
          <input
            ref={file}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            aria-label="Choose draft image"
            tabIndex={-1}
            onChange={(e) => {
              const selected = e.target.files?.[0];
              e.target.value = "";
              if (!selected) return;
              if (
                !["image/png", "image/jpeg", "image/webp"].includes(
                  selected.type,
                ) ||
                selected.size > 5 * 1024 * 1024
              ) {
                setError("Choose a PNG, JPEG or WebP image under 5 MB.");
                return;
              }
              const url = URL.createObjectURL(selected);
              urls.current.push(url);
              setImage(url);
              setError("");
              setNotice("");
            }}
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-text-tertiary">
              Markdown supported · drafts stay in this session
            </p>
            <Button
              type="tertiary"
              tapScale={1}
              onClick={() => {
                setValue({ ...EMPTY_COMPOSER });
                setImage(null);
                setError("");
                setNotice("New draft ready. Saved drafts are below.");
              }}
            >
              New draft
            </Button>
          </div>
          <p role="status" className="mt-2 min-h-6 text-sm text-text-secondary">
            {notice}
          </p>
        </section>
        <section aria-labelledby="preview-title" className="min-w-0">
          <h2 id="preview-title" className="mb-4 py-2 font-medium">
            Live preview
          </h2>
          <article className="composer-preview">
            <div className="mb-8 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-bg-elevated font-semibold">
                Y
              </span>
              <div>
                <p className="text-sm font-medium">Your draft</p>
                <p className="text-xs text-text-tertiary">
                  {mode === "quick" ? "Quick post" : "Long post"} · Only you
                </p>
              </div>
            </div>
            {mode === "long" && (
              <>
                <h3 className="mb-3 text-3xl font-semibold tracking-tight break-words">
                  {value.headline || "Untitled story"}
                </h3>
                {value.intro && (
                  <p className="mb-6 text-text-secondary whitespace-pre-wrap break-words">
                    {value.intro}
                  </p>
                )}
              </>
            )}
            {(mode === "quick" ? value.quick : value.body).trim() ? (
              <Response>{mode === "quick" ? value.quick : value.body}</Response>
            ) : (
              <p className="py-12 text-sm text-text-tertiary">
                Your words will appear here as you write.
              </p>
            )}
            {image && (
              <img
                src={image}
                alt="Draft attachment preview"
                className="mt-6 max-h-80 w-full rounded-control object-cover"
              />
            )}
            <div className="mt-8 border-t border-border-subtle pt-4 text-xs text-text-tertiary">
              Preview · Nothing has been published
            </div>
          </article>
        </section>
      </div>
      <section aria-labelledby="drafts-title" className="composer-drafts">
        <div className="flex items-center justify-between">
          <h2 id="drafts-title" className="font-medium">
            Session drafts
          </h2>
          <span className="text-sm text-text-tertiary">
            {drafts.length} saved
          </span>
        </div>
        {!drafts.length ? (
          <p className="mt-4 rounded-card-medium border border-dashed border-border-default px-6 py-8 text-sm text-text-secondary">
            A thought worth keeping? Save it above to revisit it here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border-subtle">
            {drafts.map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {d.mode === "quick" ? d.value.quick : d.value.headline}
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {d.mode === "quick" ? "Quick post" : "Long post"} · Draft{" "}
                    {d.id}
                  </p>
                </div>
                <Button
                  type="secondary"
                  tapScale={1}
                  aria-label={`Open draft ${d.id}`}
                  onClick={() => {
                    setMode(d.mode);
                    setValue({ ...d.value });
                    setImage(d.image);
                    setError("");
                    setNotice(`Draft ${d.id} opened.`);
                  }}
                >
                  Open
                </Button>
                <IconButton
                  type="tertiary"
                  tapScale={1}
                  aria-label={`Delete draft ${d.id}`}
                  icon={<Icon name="trash" />}
                  onClick={() => {
                    setDrafts((current) =>
                      current.filter((item) => item.id !== d.id),
                    );
                    setNotice(
                      `Draft ${d.id} deleted. The editor is unchanged.`,
                    );
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer className="composer-footer">
        Inspired by{" "}
        <a
          className="underline"
          href="https://x.com/gregmwashington/status/2110188748994675112"
          target="_blank"
          rel="noreferrer"
        >
          Greg Washington’s toggle composers
        </a>
        <span>Made with Oreo UI</span>
      </footer>
    </main>
  );
}
