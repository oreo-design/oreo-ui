import { useRef, useState } from "react";
import { LayoutGroup, useReducedMotion } from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import {
  FilmCoverUpload,
  FilmReveal,
  MediaTray,
  type FilmAsset,
} from "@/components/film-cover";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import { SAMPLE_PHOTOS, useLocalCover } from "./use-local-cover";
import "./studio.css";
export function FilmCoverDemo({
  disabled = false,
  emptyLibrary = false,
}: {
  disabled?: boolean;
  emptyLibrary?: boolean;
}) {
  const cover = useLocalCover();
  return (
    <div className="film-demo">
      <FilmCoverUpload
        {...cover}
        disabled={disabled}
        onFiles={cover.files}
        onRemove={cover.remove}
        onRetry={cover.canRetry ? cover.retry : undefined}
        onCancel={cover.remove}
        onAssetDrop={(id) => {
          const asset = SAMPLE_PHOTOS.find((a) => a.id === id);
          if (asset) void cover.select(asset);
        }}
      />
      <MediaTray
        assets={emptyLibrary ? [] : SAMPLE_PHOTOS}
        selectedId={cover.value?.id}
        onSelect={cover.select}
        disabled={disabled}
      />
    </div>
  );
}
export function FilmCoverStudio() {
  const [dark, setDark] = useThemeMode(false);
  const cover = useLocalCover(),
    reduce = useReducedMotion();
  const [title, setTitle] = useState("Places, on film"),
    [preview, setPreview] = useState(false),
    [keyboard, setKeyboard] = useState(false);
  const saved = useRef<{ title: string; asset: FilmAsset | null }>({
    title: "Places, on film",
    asset: null,
  });
  const titleInput = useRef<HTMLInputElement>(null),
    edit = useRef<HTMLDivElement>(null);
  const select = (asset: FilmAsset, key = false) => {
    if (preview) toggle(false, key);
    void cover.select(asset, key);
  };
  const cancel = () => {
    cover.restore(saved.current.asset);
    setTitle(saved.current.title);
  };
  const toggle = (next: boolean, key: boolean) => {
    setKeyboard(key);
    setPreview(next);
    requestAnimationFrame(() =>
      next
        ? edit.current?.querySelector("button")?.focus()
        : titleInput.current?.focus(),
    );
  };
  const shared = !(reduce || keyboard);
  return (
    <main className="film-studio">
      <header className="film-site-header">
        <a href="/film-cover-upload">
          Oreo UI <span>/ Film Cover Studio</span>
        </a>
        <IconButton
          type="secondary"
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          icon={<Icon name={dark ? "sun" : "moon"} />}
          onClick={() => setDark(!dark)}
        />
      </header>
      <div className="film-stage">
        <LayoutGroup>
          <section
            className="film-editor oreo-squircle"
            aria-label="Project cover editor"
          >
            <header className="film-editor-header">
              <div>
                <span>Projects / </span>
                <strong>{title.trim() || "Untitled project"}</strong>
              </div>
              <div ref={edit} className="film-header-actions">
                {preview && (
                  <Button
                    size="sm"
                    type="tertiary"
                    onClick={(e) => toggle(false, e.detail === 0)}
                  >
                    Edit
                  </Button>
                )}
                <span className="film-badge" data-ready={preview || undefined}>
                  {preview ? "Preview" : "Draft"}
                </span>
              </div>
            </header>
            <div className="film-editor-body">
              <MediaTray
                assets={SAMPLE_PHOTOS}
                selectedId={cover.value?.id}
                onSelect={select}
                title="Places collection"
              />
              <div className="film-editor-main">
                {preview && cover.value ? (
                  <article
                    className="film-published"
                    aria-label="Project preview"
                  >
                    <div className="film-published-cover">
                      <FilmReveal
                        src={cover.value.src}
                        alt={cover.value.alt}
                        layoutId={shared ? "project-cover" : undefined}
                      />
                      <span className="film-preview-label">Local preview</span>
                    </div>
                    <div className="film-story">
                      <p className="film-eyebrow">
                        FIELD NOTES · PLACES · 2026
                      </p>
                      <h1>{title}</h1>
                      <p>
                        Places to return to. A quiet street, an open door, and
                        the light that makes an ordinary afternoon worth
                        remembering.
                      </p>
                      <p className="film-story-note">
                        Saved for this session. Nothing has been published.
                      </p>
                    </div>
                  </article>
                ) : (
                  <form
                    className="film-editor-form"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <label className="film-title">
                      Title
                      <input
                        ref={titleInput}
                        className="oreo-focus-field"
                        value={title}
                        maxLength={100}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your project a title"
                      />
                    </label>
                    <FilmCoverUpload
                      {...cover}
                      layoutId={shared ? "project-cover" : undefined}
                      onFiles={cover.files}
                      onRemove={cover.remove}
                      onRetry={cover.canRetry ? cover.retry : undefined}
                      onAssetDrop={(id) => {
                        const asset = SAMPLE_PHOTOS.find((a) => a.id === id);
                        if (asset) select(asset);
                      }}
                    />
                    <footer className="film-editor-footer">
                      <Button type="secondary" onClick={cancel}>
                        Cancel
                      </Button>
                      <Button
                        disabled={cover.status !== "ready" || !title.trim()}
                        onClick={(e) => {
                          saved.current = {
                            title: title.trim(),
                            asset: cover.value,
                          };
                          setTitle(title.trim());
                          toggle(true, e.detail === 0);
                        }}
                      >
                        Save preview
                      </Button>
                    </footer>
                  </form>
                )}
              </div>
            </div>
          </section>
        </LayoutGroup>
        <p className="film-stage-note">
          Choose a photo or drag it into the cover. Files stay in your browser.
        </p>
      </div>
      <footer className="film-site-footer">
        <a href="/film-cover-upload">
          Explore the components <Icon name="arrow-up-right" size="sm" />
        </a>
        <span>
          Inspired by{" "}
          <a
            href="https://x.com/dev_ya/status/2118030724955852945"
            target="_blank"
            rel="noreferrer"
          >
            Yanis Lebzar
          </a>
        </span>
      </footer>
    </main>
  );
}
